'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { formatNumber } from '@/lib/utils';

interface StatsGridProps {
  stats: {
    totalScans: number;
    activeQRCodes: number;
    conversionRate: number;
  };
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  // Only show growth if there are actual scans
  const showGrowth = stats.totalScans > 0;
  
  const cards = [
    {
      title: 'Total Scans',
      value: formatNumber(stats.totalScans),
      change: showGrowth ? '+12%' : 'No data yet',
      changeType: showGrowth ? 'positive' : 'neutral' as 'positive' | 'negative' | 'neutral',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      title: 'Active QR Codes',
      value: stats.activeQRCodes.toString(),
      change: stats.activeQRCodes > 0 ? `${stats.activeQRCodes} active` : 'Create your first',
      changeType: stats.activeQRCodes > 0 ? 'positive' : 'neutral' as 'positive' | 'negative' | 'neutral',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      ),
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      change: stats.totalScans > 0 ? `${stats.conversionRate}% rate` : 'No scans yet',
      changeType: stats.conversionRate > 0 ? 'positive' : 'neutral' as 'positive' | 'negative' | 'neutral',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className={`text-sm mt-2 ${
                  card.changeType === 'positive' ? 'text-success-600' : 
                  card.changeType === 'negative' ? 'text-red-600' : 
                  'text-gray-500'
                }`}>
                  {card.changeType === 'neutral' ? card.change : `${card.change} from last month`}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                {card.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};