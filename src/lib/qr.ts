import { z } from 'zod';
import QRCode from 'qrcode';
import { db } from './db';
import { generateSlug, hashIP } from './hash';
import { getCountryFromHeaders, parseUserAgent } from './geo';
import { ContentType, QRType, QRStatus } from '@prisma/client';
import Redis from 'ioredis';
import { env } from './env';

// Redis client (optional)
let redis: Redis | null = null;
if (env.REDIS_URL) {
  try {
    redis = new Redis(env.REDIS_URL);
  } catch (error) {
    console.warn('Redis connection failed, falling back to direct DB writes');
  }
}

// Validation schemas
const qrContentSchema = z.object({
  url: z.string().url().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  subject: z.string().optional(),
  message: z.string().optional(),
  text: z.string().optional(),
  ssid: z.string().optional(),
  password: z.string().optional(),
  security: z.enum(['WPA', 'WEP', 'nopass']).optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  organization: z.string().optional(),
});

const qrStyleSchema = z.object({
  foregroundColor: z.string().default('#000000'),
  backgroundColor: z.string().default('#FFFFFF'),
  cornerStyle: z.enum(['square', 'rounded']).default('square'),
  size: z.number().min(100).max(1000).default(200),
});

const createQRSchema = z.object({
  title: z.string().min(1).max(100),
  type: z.nativeEnum(QRType).default(QRType.DYNAMIC),
  contentType: z.nativeEnum(ContentType).default(ContentType.URL),
  content: qrContentSchema,
  tags: z.array(z.string()).default([]),
  style: qrStyleSchema.default({}),
});

export async function createQR(userId: string, data: z.infer<typeof createQRSchema>) {
  const validated = createQRSchema.parse(data);
  
  const slug = generateSlug(validated.title);
  
  const qrCode = await db.qRCode.create({
    data: {
      userId,
      title: validated.title,
      type: validated.type,
      contentType: validated.contentType,
      content: validated.content,
      tags: validated.tags,
      style: validated.style,
      slug,
      status: QRStatus.ACTIVE,
    },
  });

  return qrCode;
}

export async function updateQR(id: string, userId: string, data: Partial<z.infer<typeof createQRSchema>>) {
  const qrCode = await db.qRCode.findFirst({
    where: { id, userId },
  });

  if (!qrCode) {
    throw new Error('QR Code not found');
  }

  const updateData: any = {};
  
  if (data.title) updateData.title = data.title;
  if (data.content) updateData.content = data.content;
  if (data.tags) updateData.tags = data.tags;
  if (data.style) updateData.style = data.style;

  return db.qRCode.update({
    where: { id },
    data: updateData,
  });
}

export async function generateQRCodeSVG(content: string, style: any = {}): Promise<string> {
  const options = {
    type: 'svg' as const,
    width: style.size || 200,
    color: {
      dark: style.foregroundColor || '#000000',
      light: style.backgroundColor || '#FFFFFF',
    },
    margin: 2,
  };

  return QRCode.toString(content, options);
}

export async function generateQRCodePNG(content: string, style: any = {}): Promise<Buffer> {
  const options = {
    width: style.size || 200,
    color: {
      dark: style.foregroundColor || '#000000',
      light: style.backgroundColor || '#FFFFFF',
    },
    margin: 2,
  };

  return QRCode.toBuffer(content, options);
}

export function getQRContent(qr: any): string {
  const { contentType, content } = qr;

  switch (contentType) {
    case 'URL':
      return content.url || '';
    case 'PHONE':
      return `tel:${content.phone || ''}`;
    case 'EMAIL':
      const subject = content.subject ? `?subject=${encodeURIComponent(content.subject)}` : '';
      return `mailto:${content.email || ''}${subject}`;
    case 'SMS':
      const message = content.message ? `?body=${encodeURIComponent(content.message)}` : '';
      return `sms:${content.phone || ''}${message}`;
    case 'WHATSAPP':
      const whatsappMessage = content.message ? `?text=${encodeURIComponent(content.message)}` : '';
      return `https://wa.me/${content.phone || ''}${whatsappMessage}`;
    case 'WIFI':
      return `WIFI:T:${content.security || 'WPA'};S:${content.ssid || ''};P:${content.password || ''};;`;
    case 'VCARD':
      return `BEGIN:VCARD
VERSION:3.0
FN:${content.firstName || ''} ${content.lastName || ''}
ORG:${content.organization || ''}
EMAIL:${content.email || ''}
TEL:${content.phone || ''}
END:VCARD`;
    case 'TEXT':
      return content.text || '';
    default:
      return content.url || '';
  }
}

export async function trackScan(qrId: string, request: Request) {
  const headers = request.headers;
  const ip = headers.get('x-forwarded-for') || headers.get('x-real-ip') || '127.0.0.1';
  const userAgent = headers.get('user-agent');
  const referrer = headers.get('referer');
  const dnt = headers.get('dnt');

  // Respect Do Not Track
  if (dnt === '1') {
    // Only increment aggregate counter, skip detailed tracking
    return;
  }

  const ipHash = hashIP(ip);
  const country = getCountryFromHeaders(headers);
  const { device, os } = parseUserAgent(userAgent);

  // Parse UTM parameters from referrer
  let utmSource: string | null = null;
  let utmMedium: string | null = null;
  let utmCampaign: string | null = null;

  if (referrer) {
    try {
      const url = new URL(referrer);
      utmSource = url.searchParams.get('utm_source');
      utmMedium = url.searchParams.get('utm_medium');
      utmCampaign = url.searchParams.get('utm_campaign');
    } catch (e) {
      // Invalid referrer URL
    }
  }

  // Check if this is a unique scan (same IP hash within 24 hours)
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const existingScan = await db.qRScan.findFirst({
    where: {
      qrId,
      ipHash,
      ts: { gte: dayAgo },
    },
  });

  const isUnique = !existingScan;

  const scanData = {
    qrId,
    ipHash,
    userAgent,
    device,
    os,
    country,
    referrer,
    utmSource,
    utmMedium,
    utmCampaign,
    isUnique,
  };

  // Fire-and-forget tracking
  if (redis) {
    // Queue to Redis for background processing
    redis.lpush('qr_scans', JSON.stringify(scanData)).catch(console.error);
  } else {
    // Direct database write
    db.qRScan.create({ data: scanData }).catch(console.error);
  }
}