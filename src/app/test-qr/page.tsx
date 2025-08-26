'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function TestQRPage() {
  const [testUrl, setTestUrl] = useState('https://google.com');
  const [qrValue, setQrValue] = useState('https://google.com');

  const handleTest = () => {
    setQrValue(testUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">QR Code Test</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test URL
            </label>
            <input
              type="url"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://google.com"
            />
          </div>
          
          <button
            onClick={handleTest}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Generate Test QR Code
          </button>
          
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">QR Code Preview</h2>
            <div className="flex justify-center">
              <div className="bg-gray-50 p-4 rounded-lg">
                <QRCodeSVG
                  value={qrValue}
                  size={200}
                  fgColor="#000000"
                  bgColor="#FFFFFF"
                  level="M"
                />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Scan this QR code with your phone to test
            </p>
            <p className="text-xs text-gray-500 mt-1 text-center">
              URL: {qrValue}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
