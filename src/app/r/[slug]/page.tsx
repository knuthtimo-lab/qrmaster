import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { headers } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const headersList = headers();
    
    // Get QR code by slug
    const qrCode = await db.qRCode.findUnique({
      where: { slug },
      include: { user: true },
    });

    if (!qrCode) {
      return NextResponse.redirect(new URL('/404', request.url));
    }

    // Check if QR code is active
    if (qrCode.status !== 'ACTIVE') {
      return NextResponse.redirect(new URL('/qr-inactive', request.url));
    }

    // Get device and location info
    const userAgent = headersList.get('user-agent') || '';
    const referer = headersList.get('referer') || '';
    const acceptLanguage = headersList.get('accept-language') || '';
    
    // Detect device type
    let device = 'desktop';
    if (/mobile/i.test(userAgent)) device = 'mobile';
    else if (/tablet/i.test(userAgent)) device = 'tablet';

    // Get IP and location (basic implementation)
    const forwarded = headersList.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    
    // Create scan record
    const scanData = {
      qRCodeId: qrCode.id,
      ip: ip,
      userAgent,
      device,
      referer,
      country: 'Unknown', // Would integrate with GeoIP service
      city: 'Unknown',
      isUnique: true, // Basic implementation - would check against recent scans
      ts: new Date(),
    };

    // Track the scan
    try {
      await db.scan.create({
        data: scanData,
      });
    } catch (error) {
      console.error('Failed to track scan:', error);
      // Continue with redirect even if tracking fails
    }

    // Debug: Log the QR code content
    console.log('QR Code redirect - Type:', qrCode.type);
    console.log('QR Code redirect - Content:', JSON.stringify(qrCode.content, null, 2));
    
    // Determine redirect URL based on QR code type and content
    let redirectUrl = '';
    
    if (qrCode.type === 'STATIC') {
      // For static QR codes, use the qrContent field that contains the actual redirect URL
      if (qrCode.content.qrContent) {
        redirectUrl = qrCode.content.qrContent;
      } else {
        // Fallback to the original logic if qrContent is not available
        if (qrCode.contentType === 'URL') {
          redirectUrl = qrCode.content.url;
        } else if (qrCode.contentType === 'PHONE') {
          redirectUrl = `tel:${qrCode.content.phone}`;
        } else if (qrCode.contentType === 'EMAIL') {
          redirectUrl = `mailto:${qrCode.content.email}${qrCode.content.subject ? `?subject=${encodeURIComponent(qrCode.content.subject)}` : ''}`;
        } else if (qrCode.contentType === 'SMS') {
          redirectUrl = `sms:${qrCode.content.phone}${qrCode.content.message ? `?body=${encodeURIComponent(qrCode.content.message)}` : ''}`;
        } else if (qrCode.contentType === 'WIFI') {
          redirectUrl = `WIFI:T:${qrCode.content.security || 'WPA'};S:${qrCode.content.ssid};P:${qrCode.content.password || ''};H:false;;`;
        } else if (qrCode.contentType === 'WHATSAPP') {
          redirectUrl = `https://wa.me/${qrCode.content.phone}${qrCode.content.message ? `?text=${encodeURIComponent(qrCode.content.message)}` : ''}`;
        } else {
          redirectUrl = qrCode.content.url || 'https://example.com';
        }
      }
    } else {
      // For dynamic QR codes, redirect to the dynamic URL
      redirectUrl = qrCode.content.url || 'https://example.com';
    }

    // Validate URL
    try {
      new URL(redirectUrl);
    } catch {
      redirectUrl = 'https://example.com';
    }

    // Redirect to the target URL
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('QR redirect error:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}
