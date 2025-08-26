import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { generateSlug } from '@/lib/hash';

// POST /api/qrs/static - Create a STATIC QR code that contains the direct URL
export async function POST(request: NextRequest) {
  try {
    const userId = cookies().get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, contentType, content, tags, style } = body;

    // Generate the actual QR content based on type
    let qrContent = '';
    switch (contentType) {
      case 'URL':
        qrContent = content.url;
        break;
      case 'PHONE':
        qrContent = `tel:${content.phone}`;
        break;
      case 'EMAIL':
        qrContent = `mailto:${content.email}${content.subject ? `?subject=${encodeURIComponent(content.subject)}` : ''}`;
        break;
      case 'SMS':
        qrContent = `sms:${content.phone}${content.message ? `?body=${encodeURIComponent(content.message)}` : ''}`;
        break;
      case 'TEXT':
        qrContent = content.text;
        break;
      case 'WIFI':
        qrContent = `WIFI:T:${content.security || 'WPA'};S:${content.ssid};P:${content.password || ''};H:false;;`;
        break;
      case 'WHATSAPP':
        qrContent = `https://wa.me/${content.phone}${content.message ? `?text=${encodeURIComponent(content.message)}` : ''}`;
        break;
      default:
        qrContent = content.url || 'https://example.com';
    }

    // Store the QR content in a special field
    const enrichedContent = {
      ...content,
      qrContent // This is what the QR code should actually contain
    };

    // Generate slug
    const slug = generateSlug(title);

    // Create QR code
    const qrCode = await db.qRCode.create({
      data: {
        userId,
        title,
        type: 'STATIC',
        contentType,
        content: enrichedContent,
        tags: tags || [],
        style: style || {
          foregroundColor: '#000000',
          backgroundColor: '#FFFFFF',
          cornerStyle: 'square',
          size: 200,
        },
        slug,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json(qrCode);
  } catch (error) {
    console.error('Error creating static QR code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}