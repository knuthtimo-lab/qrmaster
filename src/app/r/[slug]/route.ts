import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashIP } from '@/lib/hash';
import { headers } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // Fetch QR code by slug - now including type field
    const qrCode = await db.qRCode.findUnique({
      where: { slug },
      select: {
        id: true,
        status: true,
        type: true,
        content: true,
        contentType: true,
      },
    });

    if (!qrCode) {
      console.log('QR Code not found for slug:', slug);
      return new NextResponse('QR Code not found', { status: 404 });
    }

    if (qrCode.status === 'PAUSED') {
      console.log('QR Code is paused for slug:', slug);
      return new NextResponse('QR Code is paused', { status: 404 });
    }

    // Track scan (fire and forget)
    trackScan(qrCode.id, request).catch(console.error);

    // Determine destination URL based on QR code type
    let destination = '';
    const content = qrCode.content as any;
    
    console.log('QR Code Debug:', {
      slug,
      type: qrCode.type,
      contentType: qrCode.contentType,
      content: content,
      hasQrContent: !!content.qrContent,
      origin: request.nextUrl.origin,
      url: request.nextUrl.toString()
    });
    
    if (qrCode.type === 'STATIC') {
      // For static QR codes, use the qrContent field directly
      if (content.qrContent) {
        destination = content.qrContent;
      } else {
        // Fallback: generate qrContent from content
        switch (qrCode.contentType) {
          case 'URL':
            destination = content.url || 'https://example.com';
            break;
          case 'PHONE':
            destination = `tel:${content.phone}`;
            break;
          case 'EMAIL':
            destination = `mailto:${content.email}${content.subject ? `?subject=${encodeURIComponent(content.subject)}` : ''}`;
            break;
          case 'SMS':
            destination = `sms:${content.phone}${content.message ? `?body=${encodeURIComponent(content.message)}` : ''}`;
            break;
          case 'WHATSAPP':
            destination = `https://wa.me/${content.phone}${content.message ? `?text=${encodeURIComponent(content.message)}` : ''}`;
            break;
          case 'TEXT':
            destination = content.text || '';
            break;
          case 'WIFI':
            destination = `WIFI:T:${content.security || 'WPA'};S:${content.ssid};P:${content.password || ''};H:false;;`;
            break;
          default:
            destination = content.url || 'https://example.com';
        }
      }
    } else {
      // For dynamic QR codes, use the content directly based on contentType
      const baseUrl = request.nextUrl.origin;
      
      console.log('Dynamic QR processing:', {
        contentType: qrCode.contentType,
        content: content,
        baseUrl: baseUrl
      });
      
      switch (qrCode.contentType) {
        case 'URL':
          destination = content.url || 'https://example.com';
          break;
        case 'PHONE':
          destination = `tel:${content.phone}`;
          break;
        case 'EMAIL':
          destination = `mailto:${content.email}${content.subject ? `?subject=${encodeURIComponent(content.subject)}` : ''}`;
          break;
        case 'SMS':
          destination = `sms:${content.phone}${content.message ? `?body=${encodeURIComponent(content.message)}` : ''}`;
          break;
        case 'WHATSAPP':
          destination = `https://wa.me/${content.phone}${content.message ? `?text=${encodeURIComponent(content.message)}` : ''}`;
          break;
        case 'TEXT':
          // For plain text, redirect to a display page with absolute URL
          destination = `${baseUrl}/display?text=${encodeURIComponent(content.text || '')}`;
          break;
        case 'WIFI':
          // For WiFi, show a connection page with absolute URL
          destination = `${baseUrl}/wifi?ssid=${encodeURIComponent(content.ssid || '')}&security=${content.security || 'WPA'}`;
          break;
        default:
          destination = 'https://example.com';
      }
      
      console.log('Dynamic QR destination calculated:', destination);
      

    }

    // Preserve UTM parameters
    const searchParams = request.nextUrl.searchParams;
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    const preservedParams = new URLSearchParams();
    
    utmParams.forEach(param => {
      const value = searchParams.get(param);
      if (value) {
        preservedParams.set(param, value);
      }
    });

    // Add preserved params to destination
    if (preservedParams.toString() && destination.startsWith('http')) {
      const separator = destination.includes('?') ? '&' : '?';
      destination = `${destination}${separator}${preservedParams.toString()}`;
    }

    console.log('Final destination:', destination);
    
    // Return 307 redirect (temporary redirect that preserves method)
    return NextResponse.redirect(destination, { status: 307 });
  } catch (error) {
    console.error('QR redirect error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

async function trackScan(qrId: string, request: NextRequest) {
  try {
    const headersList = headers();
    const userAgent = headersList.get('user-agent') || '';
    const referer = headersList.get('referer') || '';
    const ip = headersList.get('x-forwarded-for') || 
               headersList.get('x-real-ip') || 
               'unknown';
    
    // Check DNT header
    const dnt = headersList.get('dnt');
    if (dnt === '1') {
      // Respect Do Not Track - only increment counter
      await db.qRScan.create({
        data: {
          qrId,
          ipHash: 'dnt',
          isUnique: false,
        },
      });
      return;
    }

    // Hash IP for privacy
    const ipHash = hashIP(ip);
    
    // Parse user agent for device info
    const isMobile = /mobile|android|iphone/i.test(userAgent);
    const isTablet = /tablet|ipad/i.test(userAgent);
    const device = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';
    
    // Detect OS
    let os = 'unknown';
    if (/windows/i.test(userAgent)) os = 'Windows';
    else if (/mac/i.test(userAgent)) os = 'macOS';
    else if (/linux/i.test(userAgent)) os = 'Linux';
    else if (/android/i.test(userAgent)) os = 'Android';
    else if (/ios|iphone|ipad/i.test(userAgent)) os = 'iOS';
    
    // Get country from header (Vercel/Cloudflare provide this)
    const country = headersList.get('x-vercel-ip-country') || 
                   headersList.get('cf-ipcountry') || 
                   'unknown';
    
    // Extract UTM parameters
    const searchParams = request.nextUrl.searchParams;
    const utmSource = searchParams.get('utm_source');
    const utmMedium = searchParams.get('utm_medium');
    const utmCampaign = searchParams.get('utm_campaign');
    
    // Check if this is a unique scan (first scan from this IP today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingScan = await db.qRScan.findFirst({
      where: {
        qrId,
        ipHash,
        ts: {
          gte: today,
        },
      },
    });
    
    const isUnique = !existingScan;
    
    // Create scan record
    await db.qRScan.create({
      data: {
        qrId,
        ipHash,
        userAgent: userAgent.substring(0, 255),
        device,
        os,
        country,
        referrer: referer.substring(0, 255),
        utmSource,
        utmMedium,
        utmCampaign,
        isUnique,
      },
    });
  } catch (error) {
    console.error('Error tracking scan:', error);
    // Don't throw - this is fire and forget
  }
}