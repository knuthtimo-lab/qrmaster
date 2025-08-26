'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { calculateContrast } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import QRCodePreview from '@/components/QRCodePreview';

export default function CreatePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState('URL');
  const [content, setContent] = useState<any>({ url: '' });
  const [isDynamic, setIsDynamic] = useState(true);
  const [tags, setTags] = useState('');
  
  // Style state
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [cornerStyle, setCornerStyle] = useState('square');
  const [size, setSize] = useState(200);
  
  // QR preview
  const [qrDataUrl, setQrDataUrl] = useState('');
  
  const contrast = calculateContrast(foregroundColor, backgroundColor);
  const hasGoodContrast = contrast >= 4.5;

  const contentTypes = [
    { value: 'URL', label: 'URL / Website' },
    { value: 'WIFI', label: 'WiFi Network' },
    { value: 'VCARD', label: 'Contact Card' },
    { value: 'PHONE', label: 'Phone Number' },
    { value: 'EMAIL', label: 'Email' },
    { value: 'SMS', label: 'SMS' },
    { value: 'TEXT', label: 'Plain Text' },
    { value: 'WHATSAPP', label: 'WhatsApp' },
  ];

  // Get QR content based on content type
  const getQRContent = () => {
    switch (contentType) {
      case 'URL':
        return content.url || 'https://example.com';
      case 'PHONE':
        return `tel:${content.phone || '+1234567890'}`;
      case 'EMAIL':
        return `mailto:${content.email || 'email@example.com'}${content.subject ? `?subject=${encodeURIComponent(content.subject)}` : ''}`;
      case 'SMS':
        return `sms:${content.phone || '+1234567890'}${content.message ? `?body=${encodeURIComponent(content.message)}` : ''}`;
      case 'WIFI':
        return `WIFI:T:${content.security || 'WPA'};S:${content.ssid || 'NetworkName'};P:${content.password || ''};H:false;;`;
      case 'TEXT':
        return content.text || 'Sample text';
      case 'WHATSAPP':
        return `https://wa.me/${content.phone || '+1234567890'}${content.message ? `?text=${encodeURIComponent(content.message)}` : ''}`;
      default:
        return 'https://example.com';
    }
  };

  const qrContent = getQRContent();

  const downloadQR = async (format: 'svg' | 'png') => {
    try {
      // Get the content based on content type
      let qrContent = '';
      switch (contentType) {
        case 'URL':
          qrContent = content.url || '';
          break;
        case 'PHONE':
          qrContent = `tel:${content.phone || ''}`;
          break;
        case 'EMAIL':
          qrContent = `mailto:${content.email || ''}${content.subject ? `?subject=${encodeURIComponent(content.subject)}` : ''}`;
          break;
        case 'TEXT':
          qrContent = content.text || '';
          break;
        default:
          qrContent = content.url || '';
      }

      if (!qrContent) return;

      const QRCode = (await import('qrcode')).default;

      if (format === 'svg') {
        const svg = await QRCode.toString(qrContent, {
          type: 'svg',
          width: size,
          margin: 2,
          color: {
            dark: foregroundColor,
            light: backgroundColor,
          },
        });
        
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qrcode-${title || 'download'}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        const a = document.createElement('a');
        a.href = qrDataUrl;
        a.download = `qrcode-${title || 'download'}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Error downloading QR code:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const qrData = {
        title,
        contentType,
        content,
        isStatic: !isDynamic, // Add this flag
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        style: {
          foregroundColor,
          backgroundColor,
          cornerStyle,
          size,
        },
      };
      
      console.log('SENDING QR DATA:', qrData);
      
      const response = await fetch('/api/qrs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(qrData),
      });

      const responseData = await response.json();
      console.log('RESPONSE DATA:', responseData);

      if (response.ok) {
        // Show success message
        window.dispatchEvent(new CustomEvent('toast', {
          detail: {
            type: 'success',
            title: 'QR Code Saved!',
            message: `"${responseData.title}" has been created successfully.`,
            duration: 3000,
          }
        }));
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        console.error('Error creating QR code:', responseData);
        window.dispatchEvent(new CustomEvent('toast', {
          detail: {
            type: 'error',
            title: 'Error',
            message: responseData.error || 'Failed to create QR code',
            duration: 5000,
          }
        }));
      }
    } catch (error) {
      console.error('Error creating QR code:', error);
      window.dispatchEvent(new CustomEvent('toast', {
        detail: {
          type: 'error',
          title: 'Error',
          message: 'Failed to create QR code. Please try again.',
          duration: 5000,
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const renderContentFields = () => {
    switch (contentType) {
      case 'URL':
        return (
          <Input
            label="URL"
            value={content.url || ''}
            onChange={(e) => setContent({ url: e.target.value })}
            placeholder="https://example.com"
            required
          />
        );
      case 'PHONE':
        return (
          <Input
            label="Phone Number"
            value={content.phone || ''}
            onChange={(e) => setContent({ phone: e.target.value })}
            placeholder="+1234567890"
            required
          />
        );
      case 'EMAIL':
        return (
          <>
            <Input
              label="Email Address"
              type="email"
              value={content.email || ''}
              onChange={(e) => setContent({ ...content, email: e.target.value })}
              placeholder="contact@example.com"
              required
            />
            <Input
              label="Subject (optional)"
              value={content.subject || ''}
              onChange={(e) => setContent({ ...content, subject: e.target.value })}
              placeholder="Email subject"
            />
          </>
        );
      case 'WIFI':
        return (
          <>
            <Input
              label="Network Name (SSID)"
              value={content.ssid || ''}
              onChange={(e) => setContent({ ...content, ssid: e.target.value })}
              required
            />
            <Input
              label="Password"
              type="password"
              value={content.password || ''}
              onChange={(e) => setContent({ ...content, password: e.target.value })}
            />
            <Select
              label="Security"
              value={content.security || 'WPA'}
              onChange={(e) => setContent({ ...content, security: e.target.value })}
              options={[
                { value: 'WPA', label: 'WPA/WPA2' },
                { value: 'WEP', label: 'WEP' },
                { value: 'nopass', label: 'No Password' },
              ]}
            />
          </>
        );
      case 'TEXT':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
            <textarea
              value={content.text || ''}
              onChange={(e) => setContent({ text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={4}
              placeholder="Enter your text here..."
              required
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('create.title')}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Content Section */}
            <Card>
              <CardHeader>
                <CardTitle>{t('create.content')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My QR Code"
                  required
                />
                
                <Select
                  label="Content Type"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  options={contentTypes}
                />
                
                {renderContentFields()}
                
                <Input
                  label="Tags (comma-separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="marketing, campaign, 2024"
                />
              </CardContent>
            </Card>

            {/* QR Type Section */}
            <Card>
              <CardHeader>
                <CardTitle>{t('create.type')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={isDynamic}
                      onChange={() => setIsDynamic(true)}
                      className="mr-2"
                    />
                    <span className="font-medium">Dynamic</span>
                    <Badge variant="info" className="ml-2">Recommended</Badge>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={!isDynamic}
                      onChange={() => setIsDynamic(false)}
                      className="mr-2"
                    />
                    <span className="font-medium">Static (Direct URL)</span>
                  </label>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {isDynamic 
                    ? '✅ Dynamic: Track scans, edit URL later, view analytics. QR contains tracking link.'
                    : '⚡ Static: Direct to URL, no tracking, cannot edit. QR contains actual URL.'}
                </p>
                {isDynamic && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>Note:</strong> Dynamic QR codes route through your server for tracking. 
                      In production, deploy your app to get a public URL instead of localhost.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Style Section */}
            <Card>
              <CardHeader>
                <CardTitle>{t('create.style')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Foreground Color
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
                      Background Color
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
                  <Select
                    label="Corner Style"
                    value={cornerStyle}
                    onChange={(e) => setCornerStyle(e.target.value)}
                    options={[
                      { value: 'square', label: 'Square' },
                      { value: 'rounded', label: 'Rounded' },
                    ]}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size: {size}px
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="400"
                      value={size}
                      onChange={(e) => setSize(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant={hasGoodContrast ? 'success' : 'warning'}>
                    {hasGoodContrast ? 'Good contrast' : 'Low contrast'}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Contrast ratio: {contrast.toFixed(1)}:1
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              {qrContent ? (
                <QRCodePreview
                  value={qrContent}
                  title={title || 'QR Code'}
                  style={{
                    foregroundColor,
                    backgroundColor,
                    cornerStyle: cornerStyle as 'square' | 'rounded' | 'dot',
                    size: 200,
                  }}
                />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>QR Code Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="w-[200px] h-[200px] bg-gray-100 rounded flex items-center justify-center text-gray-500 mx-auto">
                      Enter content to see preview
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="mt-4">
                <Button type="submit" className="w-full" loading={loading}>
                  Save QR Code
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}