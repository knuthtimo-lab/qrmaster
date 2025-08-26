'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { QRCodeCard } from '@/components/dashboard/QRCodeCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useTranslation } from '@/hooks/useTranslation';

interface QRCodeData {
  id: string;
  title: string;
  type: 'STATIC' | 'DYNAMIC';
  contentType: string;
  content?: any;
  slug: string;
  status: 'ACTIVE' | 'PAUSED';
  createdAt: string;
  scans: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalScans: 0,
    activeQRCodes: 0,
    conversionRate: 0,
  });

  // Fallback mock data if API fails
  const fallbackQRCodes = [
    {
      id: '1',
      title: 'Support Phone',
      type: 'DYNAMIC' as const,
      contentType: 'PHONE',
      slug: 'support-phone-demo',
      status: 'ACTIVE' as const,
      createdAt: '2025-08-07T10:00:00Z',
      scans: 42,
    },
    {
      id: '2',
      title: 'Event Details',
      type: 'DYNAMIC' as const,
      contentType: 'URL',
      slug: 'event-details-demo',
      status: 'ACTIVE' as const,
      createdAt: '2025-08-07T10:01:00Z',
      scans: 18,
    },
  ];

  const blogPosts = [
    {
      title: 'QR-Codes im Restaurant: Die digitale Revolution der Speisekarte',
      excerpt: 'Erfahren Sie, wie QR-Codes die Gastronomie revolutionieren...',
      readTime: '5 Min',
      slug: 'qr-codes-im-restaurant',
    },
    {
      title: 'Dynamische vs. Statische QR-Codes: Was ist der Unterschied?',
      excerpt: 'Ein umfassender Vergleich zwischen dynamischen und statischen QR-Codes...',
      readTime: '3 Min',
      slug: 'dynamische-vs-statische-qr-codes',
    },
    {
      title: 'QR-Code Marketing-Strategien für 2024',
      excerpt: 'Die besten Marketing-Strategien mit QR-Codes für Ihr Unternehmen...',
      readTime: '7 Min',
      slug: 'qr-code-marketing-strategien',
    },
  ];

  useEffect(() => {
    // Load real QR codes from API
    const fetchData = async () => {
      try {
        const response = await fetch('/api/qrs');
        if (response.ok) {
          const data = await response.json();
          setQrCodes(data);
          
          // Calculate real stats
          const totalScans = data.reduce((sum: number, qr: QRCodeData) => sum + (qr.scans || 0), 0);
          const activeQRCodes = data.filter((qr: QRCodeData) => qr.status === 'ACTIVE').length;
          const conversionRate = activeQRCodes > 0 ? Math.round((totalScans / (activeQRCodes * 100)) * 100) : 0;
          
          setStats({
            totalScans,
            activeQRCodes,
            conversionRate: Math.min(conversionRate, 100), // Cap at 100%
          });
        } else {
          // If not logged in, show zeros
          setQrCodes([]);
          setStats({
            totalScans: 0,
            activeQRCodes: 0,
            conversionRate: 0,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setQrCodes([]);
        setStats({
          totalScans: 0,
          activeQRCodes: 0,
          conversionRate: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/edit/${id}`);
  };

  const handleDuplicate = async (id: string) => {
    try {
      // Get the QR code to duplicate
      const response = await fetch(`/api/qrs/${id}`);
      if (response.ok) {
        const qrCode = await response.json();
        
        // Create a new QR code with the same data but new title
        const duplicateData = {
          title: `${qrCode.title} (Copy)`,
          contentType: qrCode.contentType,
          content: qrCode.content,
          isStatic: qrCode.type === 'STATIC',
          tags: qrCode.tags || [],
          style: qrCode.style || {
            foregroundColor: '#000000',
            backgroundColor: '#FFFFFF',
            cornerStyle: 'square',
            size: 200,
          },
        };
        
        const createResponse = await fetch('/api/qrs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(duplicateData),
        });
        
        if (createResponse.ok) {
          router.refresh();
        }
      }
    } catch (error) {
      console.error('Error duplicating QR code:', error);
    }
  };

  const handlePause = async (id: string) => {
    try {
      // Get current QR code to toggle status
      const response = await fetch(`/api/qrs/${id}`);
      if (response.ok) {
        const qrCode = await response.json();
        const newStatus = qrCode.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        
        const updateResponse = await fetch(`/api/qrs/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
        
        if (updateResponse.ok) {
          router.refresh();
        }
      }
    } catch (error) {
      console.error('Error updating QR code status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this QR code? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/qrs/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          router.refresh();
        }
      } catch (error) {
        console.error('Error deleting QR code:', error);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
        <p className="text-gray-600 mt-2">{t('dashboard.subtitle')}</p>
      </div>

      {/* Stats Grid */}
      <StatsGrid stats={stats} />

      {/* Recent QR Codes */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.recent_codes')}</h2>
          <Link href="/create">
            <Button>Create New QR Code</Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-24 bg-gray-200 rounded mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qrCodes.map((qr) => (
              <QRCodeCard
                key={qr.id}
                qr={qr}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onPause={handlePause}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Blog & Resources */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">{t('dashboard.blog_resources')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.slug} hover>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="info">{post.readTime}</Badge>
                </div>
                <CardTitle className="text-lg">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-3 inline-block"
                >
                  Read more →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}