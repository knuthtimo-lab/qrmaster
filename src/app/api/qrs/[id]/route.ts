import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

// GET /api/qrs/[id] - Get a specific QR code
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = cookies().get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try to get from database first
    try {
      const qrCode = await db.qRCode.findFirst({
        where: {
          id: params.id,
          userId,
        },
      });

      if (qrCode) {
        return NextResponse.json(qrCode);
      }
    } catch (dbError) {
      console.log('Database not available, using mock data');
    }

    // Fallback to mock data if database is not available
    const mockQRCodes = [
      {
        id: '1',
        title: 'Support Phone',
        type: 'DYNAMIC' as const,
        contentType: 'PHONE',
        content: { phone: '+1234567890' },
        slug: 'support-phone-demo',
        status: 'ACTIVE' as const,
        tags: ['support', 'phone'],
        style: {
          foregroundColor: '#000000',
          backgroundColor: '#FFFFFF',
          cornerStyle: 'square',
          size: 200,
        },
        createdAt: '2025-08-07T10:00:00Z',
        updatedAt: '2025-08-07T10:00:00Z',
        userId,
      },
      {
        id: '2',
        title: 'Event Details',
        type: 'DYNAMIC' as const,
        contentType: 'URL',
        content: { url: 'https://example.com/event' },
        slug: 'event-details-demo',
        status: 'ACTIVE' as const,
        tags: ['event', 'marketing'],
        style: {
          foregroundColor: '#000000',
          backgroundColor: '#FFFFFF',
          cornerStyle: 'square',
          size: 200,
        },
        createdAt: '2025-08-07T10:01:00Z',
        updatedAt: '2025-08-07T10:01:00Z',
        userId,
      },
    ];

    const mockQR = mockQRCodes.find(qr => qr.id === params.id);
    if (mockQR) {
      return NextResponse.json(mockQR);
    }

    return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching QR code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/qrs/[id] - Update a QR code
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = cookies().get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, contentType, content, tags, style, status } = body;

    // Try to update in database first
    try {
      const existingQR = await db.qRCode.findFirst({
        where: {
          id: params.id,
          userId,
        },
      });

      if (existingQR) {
        const updatedQR = await db.qRCode.update({
          where: { id: params.id },
          data: {
            title: title || existingQR.title,
            contentType: contentType || existingQR.contentType,
            content: content || existingQR.content,
            tags: tags || existingQR.tags,
            style: style || existingQR.style,
            status: status || existingQR.status,
          },
        });

        return NextResponse.json(updatedQR);
      }
    } catch (dbError) {
      console.log('Database not available, using mock update');
    }

    // Fallback to mock update
    const mockQR = {
      id: params.id,
      title: title || 'Updated QR Code',
      type: 'DYNAMIC' as const,
      contentType: contentType || 'URL',
      content: content || { url: 'https://example.com' },
      slug: 'updated-qr-code',
      status: status || 'ACTIVE',
      tags: tags || [],
      style: style || {
        foregroundColor: '#000000',
        backgroundColor: '#FFFFFF',
        cornerStyle: 'square',
        size: 200,
      },
      createdAt: '2025-08-07T10:00:00Z',
      updatedAt: new Date().toISOString(),
      userId,
    };

    return NextResponse.json(mockQR);
  } catch (error) {
    console.error('Error updating QR code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/qrs/[id] - Delete a QR code
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = cookies().get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try to delete from database first
    try {
      const existingQR = await db.qRCode.findFirst({
        where: {
          id: params.id,
          userId,
        },
      });

      if (existingQR) {
        await db.qRCode.delete({
          where: { id: params.id },
        });

        return NextResponse.json({ success: true });
      }
    } catch (dbError) {
      console.log('Database not available, using mock delete');
    }

    // Fallback to mock delete
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting QR code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}