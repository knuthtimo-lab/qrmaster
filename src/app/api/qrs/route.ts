import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { generateSlug } from '@/lib/hash';
import { getMockQRCodes, addMockQRCode } from '@/lib/mockData';
import bcrypt from 'bcryptjs';

// GET /api/qrs - List user's QR codes
export async function GET(request: NextRequest) {
  try {
    const userId = cookies().get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const qrCodes = await db.qRCode.findMany({
        where: { userId },
        include: {
          _count: {
            select: { scans: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Transform the data
      const transformed = qrCodes.map(qr => ({
        ...qr,
        scans: qr._count?.scans || 0,
        _count: undefined,
      }));

      return NextResponse.json(transformed);
    } catch (dbError) {
      console.log('Database not available, using mock data');
      const mockQRCodes = getMockQRCodes().filter(qr => qr.userId === userId);
      return NextResponse.json(mockQRCodes);
    }
  } catch (error) {
    console.error('Error fetching QR codes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/qrs - Create a new QR code
export async function POST(request: NextRequest) {
  try {
    const userId = cookies().get('userId')?.value;
    console.log('POST /api/qrs - userId from cookie:', userId);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized - no userId cookie' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Request body:', body);
    
    // Check if this is a static QR request
    const isStatic = body.isStatic === true;
    
    let enrichedContent = body.content;
    
    // For STATIC QR codes, calculate what the QR should contain
    if (isStatic) {
      let qrContent = '';
      switch (body.contentType) {
        case 'URL':
          qrContent = body.content.url;
          break;
        case 'PHONE':
          qrContent = `tel:${body.content.phone}`;
          break;
        case 'EMAIL':
          qrContent = `mailto:${body.content.email}${body.content.subject ? `?subject=${encodeURIComponent(body.content.subject)}` : ''}`;
          break;
        case 'SMS':
          qrContent = `sms:${body.content.phone}${body.content.message ? `?body=${encodeURIComponent(body.content.message)}` : ''}`;
          break;
        case 'TEXT':
          qrContent = body.content.text;
          break;
        case 'WIFI':
          qrContent = `WIFI:T:${body.content.security || 'WPA'};S:${body.content.ssid};P:${body.content.password || ''};H:false;;`;
          break;
        case 'WHATSAPP':
          qrContent = `https://wa.me/${body.content.phone}${body.content.message ? `?text=${encodeURIComponent(body.content.message)}` : ''}`;
          break;
        default:
          qrContent = body.content.url || 'https://example.com';
      }
      
      // Add qrContent to the content object
      enrichedContent = {
        ...body.content,
        qrContent // This is what the QR code should actually contain
      };
    }

    // Generate slug for the QR code
    const slug = generateSlug(body.title);

    try {
      // Check if user exists
      const userExists = await db.user.findUnique({
        where: { id: userId }
      });
      
      console.log('User exists:', !!userExists);
      
      if (!userExists) {
        // For demo user, try to create it
        if (userId === 'demo-user-id') {
          try {
            const hashedPassword = await bcrypt.hash('demo123', 12);
            await db.user.create({
              data: {
                id: 'demo-user-id',
                email: 'demo@qrmaster.com',
                name: 'Demo User',
                password: hashedPassword,
              },
            });
            console.log('Created demo user');
          } catch (createError) {
            console.error('Failed to create demo user:', createError);
            return NextResponse.json({ error: 'Demo user creation failed' }, { status: 500 });
          }
        } else {
          return NextResponse.json({ error: `User not found: ${userId}` }, { status: 404 });
        }
      }

      // Create QR code
      const qrCode = await db.qRCode.create({
        data: {
          userId,
          title: body.title,
          type: isStatic ? 'STATIC' : 'DYNAMIC',
          contentType: body.contentType,
          content: enrichedContent,
          tags: body.tags || [],
          style: body.style || {
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
    } catch (dbError) {
      console.log('Database not available, using mock creation');
      // Create mock QR code
      const mockQRCode = {
        id: Math.random().toString(36).substring(2, 15),
        userId,
        title: body.title,
        type: isStatic ? 'STATIC' : 'DYNAMIC',
        contentType: body.contentType,
        content: enrichedContent,
        tags: body.tags || [],
        style: body.style || {
          foregroundColor: '#000000',
          backgroundColor: '#FFFFFF',
          cornerStyle: 'square',
          size: 200,
        },
        slug,
        status: 'ACTIVE',
        scans: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addMockQRCode(mockQRCode);
      return NextResponse.json(mockQRCode);
    }
  } catch (error) {
    console.error('Error creating QR code:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}