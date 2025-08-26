'use client';

import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface QRCodePreviewProps {
  value: string;
  title: string;
  style?: {
    foregroundColor: string;
    backgroundColor: string;
    cornerStyle: 'square' | 'rounded' | 'dot';
    size: number;
  };
  onDownload?: (format: 'png' | 'svg') => void;
}

export default function QRCodePreview({ 
  value, 
  title, 
  style = {
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    cornerStyle: 'square',
    size: 200,
  },
  onDownload 
}: QRCodePreviewProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadAsPNG = async () => {
    if (!qrRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const svg = qrRef.current.querySelector('svg');
      
      if (!svg || !ctx) return;
      
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      
      img.onload = () => {
        canvas.width = style.size;
        canvas.height = style.size;
        ctx.fillStyle = style.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        const link = document.createElement('a');
        link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        setIsDownloading(false);
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } catch (error) {
      console.error('Download error:', error);
      setIsDownloading(false);
    }
  };

  const downloadAsSVG = () => {
    if (!qrRef.current) return;
    
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.svg`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      // Show success toast
      window.dispatchEvent(new CustomEvent('toast', {
        detail: {
          type: 'success',
          title: 'Copied!',
          message: 'QR code URL copied to clipboard',
          duration: 2000,
        }
      }));
    } catch (error) {
      console.error('Copy error:', error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">QR Code Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <div 
            ref={qrRef}
            className="p-4 rounded-lg"
            style={{ backgroundColor: style.backgroundColor }}
          >
            <QRCodeSVG
              value={value}
              size={style.size}
              fgColor={style.foregroundColor}
              bgColor={style.backgroundColor}
              level="M"
              includeMargin={true}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-600 break-all">{value}</p>
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Copy URL
            </Button>
            
            <Button
              onClick={downloadAsPNG}
              disabled={isDownloading}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              {isDownloading ? 'Downloading...' : 'Download PNG'}
            </Button>
            
            <Button
              onClick={downloadAsSVG}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Download SVG
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
