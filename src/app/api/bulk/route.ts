import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { generateSlug } from '@/lib/hash';
import { z } from 'zod';

const bulkCreateSchema = z.object({
  qrCodes: z.array(z.object({
    title: z.string(),
    contentType: z.string(),
    content: z.string(),
    tags: z.string().optional(),
    type: z.enum(['STATIC', 'DYNAMIC']).optional(),
  })),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { qrCodes } = bulkCreateSchema.parse(body);

    // Limit bulk creation to 1000 items
    if (qrCodes.length > 1000) {
      return NextResponse.json(
        { error: 'Maximum 1000 QR codes per bulk upload' },
        { status: 400 }
      );
    }

    // Transform and create QR codes
    const createData = qrCodes.map(qr => {
      // Parse content based on type
      let content: any = { url: qr.content };
      
      if (qr.contentType === 'URL') {
        content = { url: qr.content };
      } else if (qr.contentType === 'PHONE') {
        content = { phone: qr.content };
      } else if (qr.contentType === 'EMAIL') {
        const [email, subject] = qr.content.split('?subject=');
        content = { email, subject };
      } else if (qr.contentType === 'TEXT') {
        content = { text: qr.content };
      } else if (qr.contentType === 'WIFI') {
        // Parse format: "NetworkName:password"
        const [ssid, password] = qr.content.split(':');
        content = { ssid, password, security: 'WPA' };
      }

      return {
        userId: session.user.id!,
        title: qr.title,
        type: qr.type || 'DYNAMIC',
        contentType: qr.contentType as any,
        content,
        tags: qr.tags ? qr.tags.split(',').map(t => t.trim()) : [],
        slug: generateSlug(qr.title),
        status: 'ACTIVE' as const,
        style: {
          foregroundColor: '#000000',
          backgroundColor: '#FFFFFF',
          cornerStyle: 'square',
          size: 200,
        },
      };
    });

    // Batch create
    const created = await Promise.all(
      createData.map(data => db.qRCode.create({ data }))
    );

    return NextResponse.json({
      success: true,
      count: created.length,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Bulk upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}