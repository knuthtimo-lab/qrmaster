import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const userId = cookies().get('userId')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's QR codes
    const qrCodes = await db.qRCode.findMany({
      where: { userId },
      include: {
        scans: true,
      },
    });

    // Calculate stats
    const totalScans = qrCodes.reduce((sum, qr) => sum + qr.scans.length, 0);
    const uniqueScans = qrCodes.reduce((sum, qr) => 
      sum + qr.scans.filter(s => s.isUnique).length, 0
    );
    
    // Calculate average scans per QR code
    const avgScansPerQR = qrCodes.length > 0 ? Math.round(totalScans / qrCodes.length) : 0;
    
    // Device stats
    const deviceStats = qrCodes.flatMap(qr => qr.scans)
      .reduce((acc, scan) => {
        const device = scan.device || 'unknown';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
    const mobileScans = (deviceStats.mobile || 0) + (deviceStats.tablet || 0);
    const mobilePercentage = totalScans > 0 
      ? Math.round((mobileScans / totalScans) * 100) 
      : 0;
    
    // Country stats
    const countryStats = qrCodes.flatMap(qr => qr.scans)
      .reduce((acc, scan) => {
        const country = scan.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    
    const topCountry = Object.entries(countryStats)
      .sort(([,a], [,b]) => b - a)[0];
    
    // Time-based stats (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentScans = qrCodes.flatMap(qr => qr.scans)
      .filter(scan => new Date(scan.ts) > thirtyDaysAgo);
    
    // Daily scan counts for chart
    const dailyScans = recentScans.reduce((acc, scan) => {
      const date = new Date(scan.ts).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // QR performance
    const qrPerformance = qrCodes.map(qr => ({
      id: qr.id,
      title: qr.title,
      type: qr.type,
      totalScans: qr.scans.length,
      uniqueScans: qr.scans.filter(s => s.isUnique).length,
      conversion: qr.scans.length > 0 
        ? Math.round((qr.scans.filter(s => s.isUnique).length / qr.scans.length) * 100)
        : 0,
    })).sort((a, b) => b.totalScans - a.totalScans);

    return NextResponse.json({
      summary: {
        totalScans,
        uniqueScans,
        avgScansPerQR: qrCodes.length > 0 
          ? Math.round(totalScans / qrCodes.length) 
          : 0,
        mobilePercentage,
        topCountry: topCountry ? topCountry[0] : 'N/A',
        topCountryPercentage: topCountry && totalScans > 0
          ? Math.round((topCountry[1] / totalScans) * 100)
          : 0,
      },
      deviceStats,
      countryStats: Object.entries(countryStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([country, count]) => ({
          country,
          count,
          percentage: totalScans > 0 
            ? Math.round((count / totalScans) * 100) 
            : 0,
        })),
      dailyScans,
      qrPerformance: qrPerformance.slice(0, 10),
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}