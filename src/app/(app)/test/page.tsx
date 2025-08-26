'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function TestPage() {
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    const results: any = {};

    try {
      // Step 1: Create a STATIC QR code
      console.log('Creating STATIC QR code...');
      const createResponse = await fetch('/api/qrs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Static QR',
          contentType: 'URL',
          content: { url: 'https://google.com' },
          isStatic: true,
          tags: [],
          style: {
            foregroundColor: '#000000',
            backgroundColor: '#FFFFFF',
            cornerStyle: 'square',
            size: 200,
          },
        }),
      });

      const createdQR = await createResponse.json();
      results.created = createdQR;
      console.log('Created QR:', createdQR);

      // Step 2: Fetch all QR codes
      console.log('Fetching QR codes...');
      const fetchResponse = await fetch('/api/qrs');
      const allQRs = await fetchResponse.json();
      results.fetched = allQRs;
      console.log('Fetched QRs:', allQRs);

      // Step 3: Check debug endpoint
      console.log('Checking debug endpoint...');
      const debugResponse = await fetch('/api/debug');
      const debugData = await debugResponse.json();
      results.debug = debugData;
      console.log('Debug data:', debugData);

    } catch (error) {
      results.error = String(error);
      console.error('Test error:', error);
    }

    setTestResults(results);
    setLoading(false);
  };

  const getQRValue = (qr: any) => {
    // Check for qrContent field
    if (qr?.content?.qrContent) {
      return qr.content.qrContent;
    }
    // Check for direct URL
    if (qr?.content?.url) {
      return qr.content.url;
    }
    // Fallback to redirect
    return `http://localhost:3001/r/${qr?.slug || 'unknown'}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">QR Code Test Page</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Static QR Code Creation</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={runTest} loading={loading}>
            Run Test
          </Button>
          
          {testResults.created && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Created QR Code:</h3>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                {JSON.stringify(testResults.created, null, 2)}
              </pre>
              
              <div className="mt-4">
                <h4 className="font-semibold mb-2">QR Code Preview:</h4>
                <div className="bg-gray-50 p-4 rounded">
                  <QRCodeSVG
                    value={getQRValue(testResults.created)}
                    size={200}
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    QR Value: {getQRValue(testResults.created)}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {testResults.fetched && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">All QR Codes:</h3>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-64">
                {JSON.stringify(testResults.fetched, null, 2)}
              </pre>
            </div>
          )}
          
          {testResults.debug && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Debug Data:</h3>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-64">
                {JSON.stringify(testResults.debug, null, 2)}
              </pre>
            </div>
          )}
          
          {testResults.error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded">
              Error: {testResults.error}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Manual QR Tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Direct URL QR (Should go to Google):</h3>
            <QRCodeSVG value="https://google.com" size={150} />
            <p className="text-sm text-gray-600 mt-1">Value: https://google.com</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Redirect QR (Goes through localhost):</h3>
            <QRCodeSVG value="http://localhost:3001/r/test-slug" size={150} />
            <p className="text-sm text-gray-600 mt-1">Value: http://localhost:3001/r/test-slug</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}