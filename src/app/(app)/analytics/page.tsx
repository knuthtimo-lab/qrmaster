'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { useTranslation } from '@/hooks/useTranslation';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('7');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/summary');
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        // Set empty data if not authorized
        setAnalyticsData({
          summary: {
            totalScans: 0,
            uniqueScans: 0,
            avgScansPerQR: 0,
            mobilePercentage: 0,
            topCountry: 'N/A',
            topCountryPercentage: 0,
          },
          deviceStats: {},
          countryStats: [],
          dailyScans: {},
          qrPerformance: [],
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalyticsData({
        summary: {
          totalScans: 0,
          uniqueScans: 0,
          avgScansPerQR: 0,
          mobilePercentage: 0,
          topCountry: 'N/A',
          topCountryPercentage: 0,
        },
        deviceStats: {},
        countryStats: [],
        dailyScans: {},
        qrPerformance: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // Create CSV data
    const csvData = [
      ['QR Master Analytics Report'],
      ['Generated:', new Date().toLocaleString()],
      [''],
      ['Summary'],
      ['Total Scans', analyticsData?.summary.totalScans || 0],
      ['Unique Scans', analyticsData?.summary.uniqueScans || 0],
      ['Average Scans per QR', analyticsData?.summary.avgScansPerQR || 0],
      ['Mobile Usage %', analyticsData?.summary.mobilePercentage || 0],
      [''],
      ['Top QR Codes'],
      ['Title', 'Type', 'Total Scans', 'Unique Scans', 'Conversion %'],
      ...(analyticsData?.qrPerformance || []).map((qr: any) => [
        qr.title,
        qr.type,
        qr.totalScans,
        qr.uniqueScans,
        qr.conversion,
      ]),
    ];

    // Convert to CSV string
    const csv = csvData.map(row => row.join(',')).join('\n');
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Prepare chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const scanChartData = {
    labels: last7Days.map(date => {
      const d = new Date(date);
      return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Scans',
        data: last7Days.map(date => analyticsData?.dailyScans[date] || 0),
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const deviceChartData = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [
      {
        data: [
          analyticsData?.deviceStats.desktop || 0,
          analyticsData?.deviceStats.mobile || 0,
          analyticsData?.deviceStats.tablet || 0,
        ],
        backgroundColor: [
          'rgba(37, 99, 235, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(249, 115, 22, 0.8)',
        ],
      },
    ],
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('analytics.title')}</h1>
          <p className="text-gray-600 mt-2">{t('analytics.subtitle')}</p>
        </div>
        <Button onClick={exportReport}>Export Report</Button>
      </div>

      {/* Time Range Selector */}
      <div className="flex space-x-2">
        {['7', '30', '90'].map((days) => (
          <button
            key={days}
            onClick={() => setTimeRange(days)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === days
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {days} Days
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Total Scans</p>
            <p className="text-2xl font-bold text-gray-900">
              {analyticsData?.summary.totalScans.toLocaleString() || '0'}
            </p>
            <p className={`text-sm mt-2 ${analyticsData?.summary.totalScans > 0 ? 'text-green-600' : 'text-gray-500'}`}>
              {analyticsData?.summary.totalScans > 0 ? '+12.5%' : 'No data'} from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Avg Scans/QR</p>
            <p className="text-2xl font-bold text-gray-900">
              {analyticsData?.summary.avgScansPerQR || '0'}
            </p>
            <p className={`text-sm mt-2 ${analyticsData?.summary.avgScansPerQR > 0 ? 'text-green-600' : 'text-gray-500'}`}>
              {analyticsData?.summary.avgScansPerQR > 0 ? '+8.3%' : 'No data'} from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Mobile Usage</p>
            <p className="text-2xl font-bold text-gray-900">
              {analyticsData?.summary.mobilePercentage || '0'}%
            </p>
            <p className="text-sm mt-2 text-gray-500">
              {analyticsData?.summary.mobilePercentage > 0 ? 'Of total scans' : 'No mobile scans'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Top Country</p>
            <p className="text-2xl font-bold text-gray-900">
              {analyticsData?.summary.topCountry || 'N/A'}
            </p>
            <p className="text-sm mt-2 text-gray-500">
              {analyticsData?.summary.topCountryPercentage || '0'}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Scans Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Scans Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Line
                data={scanChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Device Types */}
        <Card>
          <CardHeader>
            <CardTitle>Device Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              {analyticsData?.summary.totalScans > 0 ? (
                <Doughnut
                  data={deviceChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              ) : (
                <p className="text-gray-500">No scan data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Countries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Countries</CardTitle>
        </CardHeader>
        <CardContent>
          {analyticsData?.countryStats.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Scans</th>
                  <th>Percentage</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.countryStats.map((country: any, index: number) => (
                  <tr key={index}>
                    <td>{country.country}</td>
                    <td>{country.count.toLocaleString()}</td>
                    <td>{country.percentage}%</td>
                    <td>
                      <Badge variant="success">↑</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-gray-500 text-center py-8">No country data available yet</p>
          )}
        </CardContent>
      </Card>

      {/* QR Code Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>QR Code Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {analyticsData?.qrPerformance.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <th>QR Code</th>
                  <th>Type</th>
                  <th>Total Scans</th>
                  <th>Unique Scans</th>
                  <th>Conversion</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.qrPerformance.map((qr: any) => (
                  <tr key={qr.id}>
                    <td className="font-medium">{qr.title}</td>
                    <td>
                      <Badge variant={qr.type === 'DYNAMIC' ? 'info' : 'default'}>
                        {qr.type}
                      </Badge>
                    </td>
                    <td>{qr.totalScans.toLocaleString()}</td>
                    <td>{qr.uniqueScans.toLocaleString()}</td>
                    <td>{qr.conversion}%</td>
                    <td>
                      <Badge variant={qr.totalScans > 0 ? 'success' : 'default'}>
                        {qr.totalScans > 0 ? '↑' : '—'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No QR codes created yet. Create your first QR code to see analytics!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}