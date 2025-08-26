'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';

export default function TestDBPage() {
  const [qrCodes, setQrCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQRCodes() {
      try {
        const response = await fetch('/api/qrs');
        const data = await response.json();
        setQrCodes(data.qrCodes || []);
      } catch (error) {
        console.error('Error fetching QR codes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchQRCodes();
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">QR Codes Database Test</h1>
      
      {qrCodes.map((qr) => (
        <Card key={qr.id} className="p-4">
          <h3 className="font-bold">{qr.title}</h3>
          <p>Type: {qr.type}</p>
          <p>Content Type: {qr.contentType}</p>
          <p>Slug: {qr.slug}</p>
          <p>Status: {qr.status}</p>
          <details className="mt-2">
            <summary className="cursor-pointer">Content (JSON)</summary>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(qr.content, null, 2)}
            </pre>
          </details>
          <div className="mt-2">
            <a 
              href={`/r/${qr.slug}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Test Redirect: /r/{qr.slug}
            </a>
          </div>
        </Card>
      ))}
    </div>
  );
}
