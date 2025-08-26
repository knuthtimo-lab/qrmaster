'use client';

import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';

export default function DisplayPage() {
  const searchParams = useSearchParams();
  const text = searchParams.get('text') || 'No text content found';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            QR Code Content
          </h1>
          <div className="bg-gray-100 rounded-lg p-4 text-left">
            <p className="text-gray-800 whitespace-pre-wrap break-words">
              {text}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
