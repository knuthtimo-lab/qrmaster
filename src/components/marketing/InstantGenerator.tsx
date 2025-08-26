'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { calculateContrast } from '@/lib/utils';

interface InstantGeneratorProps {
  t: any; // i18n translation function
}

export const InstantGenerator: React.FC<InstantGeneratorProps> = ({ t }) => {
  const [url, setUrl] = useState('https://example.com');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [cornerStyle, setCornerStyle] = useState('square');
  const [size, setSize] = useState(200);

  const contrast = calculateContrast(foregroundColor, backgroundColor);
  const hasGoodContrast = contrast >= 4.5;

  const downloadQR = (format: 'svg' | 'png') => {
    const svg = document.querySelector('#instant-qr-preview svg');
    if (!svg || !url) return;

    if (format === 'svg') {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'qrcode.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } else {
      // Convert SVG to PNG using Canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      img.onload = () => {
        canvas.width = size;
        canvas.height = size;
        if (ctx) {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, size, size);
          ctx.drawImage(img, 0, 0, size, size);
        }
        canvas.toBlob((blob) => {
          if (blob) {
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = 'qrcode.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);
          }
        });
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {t('generator.title')}
          </h2>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Form */}
          <Card className="space-y-6">
            <Input
              label="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t('generator.url_placeholder')}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('generator.foreground')}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('generator.background')}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-12 h-10 rounded border border-gray-300"
                  />
                  <Input
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('generator.corners')}
                </label>
                <select
                  value={cornerStyle}
                  onChange={(e) => setCornerStyle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="square">Square</option>
                  <option value="rounded">Rounded</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('generator.size')}
                </label>
                <input
                  type="range"
                  min="100"
                  max="400"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 text-center mt-1">{size}px</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Badge variant={hasGoodContrast ? 'success' : 'warning'}>
                {hasGoodContrast ? t('generator.contrast_good') : 'Low contrast'}
              </Badge>
              <div className="text-sm text-gray-500">
                Contrast: {contrast.toFixed(1)}:1
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1" onClick={() => downloadQR('svg')}>
                {t('generator.download_svg')}
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => downloadQR('png')}>
                {t('generator.download_png')}
              </Button>
            </div>
            
            <Button className="w-full">
              {t('generator.save_track')}
            </Button>
          </Card>
          
          {/* Right Preview */}
          <div className="flex flex-col items-center justify-center">
            <Card className="text-center p-8">
              <h3 className="text-lg font-semibold mb-4">{t('generator.live_preview')}</h3>
              <div id="instant-qr-preview" className="flex justify-center mb-4">
                {url ? (
                  <div className={`${cornerStyle === 'rounded' ? 'rounded-lg overflow-hidden' : ''}`}>
                    <QRCodeSVG
                      value={url}
                      size={Math.min(size, 200)}
                      fgColor={foregroundColor}
                      bgColor={backgroundColor}
                      level="M"
                    />
                  </div>
                ) : (
                  <div 
                    className="bg-gray-200 flex items-center justify-center text-gray-500"
                    style={{ width: 200, height: 200 }}
                  >
                    Enter URL
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-600 mb-2">URL</div>
              <div className="text-xs text-gray-500">{t('generator.demo_note')}</div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};