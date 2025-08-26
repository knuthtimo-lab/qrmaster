'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Badge } from '@/components/ui/Badge';
import { calculateContrast } from '@/lib/utils';

interface QRPreviewProps {
  content: string;
  style: {
    foregroundColor: string;
    backgroundColor: string;
    cornerStyle: 'square' | 'rounded';
    size: number;
  };
}

export const QRPreview: React.FC<QRPreviewProps> = ({ content, style }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  const contrast = calculateContrast(style.foregroundColor, style.backgroundColor);
  const hasGoodContrast = contrast >= 4.5;

  useEffect(() => {
    const generateQR = async () => {
      try {
        if (!content) {
          setQrDataUrl('');
          return;
        }

        const options = {
          width: style.size,
          margin: 2,
          color: {
            dark: style.foregroundColor,
            light: style.backgroundColor,
          },
          errorCorrectionLevel: 'M' as const,
        };

        const dataUrl = await QRCode.toDataURL(content, options);
        setQrDataUrl(dataUrl);
        setError('');
      } catch (err) {
        console.error('Error generating QR code:', err);
        setError('Failed to generate QR code');
      }
    };

    generateQR();
  }, [content, style]);

  const downloadQR = async (format: 'svg' | 'png') => {
    if (!content) return;

    try {
      if (format === 'svg') {
        const svg = await QRCode.toString(content, {
          type: 'svg',
          width: style.size,
          margin: 2,
          color: {
            dark: style.foregroundColor,
            light: style.backgroundColor,
          },
        });
        
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'qrcode.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // For PNG, use the canvas
        const canvas = document.createElement('canvas');
        await QRCode.toCanvas(canvas, content, {
          width: style.size,
          margin: 2,
          color: {
            dark: style.foregroundColor,
            light: style.backgroundColor,
          },
        });
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'qrcode.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        });
      }
    } catch (err) {
      console.error('Error downloading QR code:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        {error ? (
          <div className="w-[200px] h-[200px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            {error}
          </div>
        ) : qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="QR Code Preview"
            className={`border-2 border-gray-200 ${style.cornerStyle === 'rounded' ? 'rounded-lg' : ''}`}
            style={{ width: Math.min(style.size, 300), height: Math.min(style.size, 300) }}
          />
        ) : (
          <div className="w-[200px] h-[200px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            Enter content to generate QR code
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Badge variant={hasGoodContrast ? 'success' : 'warning'}>
          {hasGoodContrast ? 'Good contrast' : 'Low contrast'}
        </Badge>
        <span className="text-sm text-gray-500">
          Contrast: {contrast.toFixed(1)}:1
        </span>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => downloadQR('svg')}
          disabled={!content || !qrDataUrl}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Download SVG
        </button>
        <button
          onClick={() => downloadQR('png')}
          disabled={!content || !qrDataUrl}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Download PNG
        </button>
      </div>
    </div>
  );
};