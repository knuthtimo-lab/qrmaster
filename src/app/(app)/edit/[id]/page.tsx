'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { calculateContrast } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

interface QRCodeData {
  id: string;
  title: string;
  type: 'STATIC' | 'DYNAMIC';
  contentType: string;
  content: any;
  slug: string;
  status: 'ACTIVE' | 'PAUSED';
  tags: string[];
  style: {
    foregroundColor: string;
    backgroundColor: string;
    cornerStyle: string;
    size: number;
  };
}

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [qrData, setQrData] = useState<QRCodeData | null>(null);
  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState('URL');
  const [content, setContent] = useState<any>({ url: '' });
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'PAUSED'>('ACTIVE');
  
  // Style state
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [cornerStyle, setCornerStyle] = useState('square');
  const [size, setSize] = useState(200);

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

  // Load QR code data
  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await fetch(`/api/qrs/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setQrData(data);
          
          // Populate form fields
          setTitle(data.title);
          setContentType(data.contentType);
          setContent(data.content || {});
          setTags(data.tags?.join(', ') || '');
          setStatus(data.status);
          
          // Populate style fields
          if (data.style) {
            setForegroundColor(data.style.foregroundColor || '#000000');
            setBackgroundColor(data.style.backgroundColor || '#FFFFFF');
            setCornerStyle(data.style.cornerStyle || 'square');
            setSize(data.style.size || 200);
          }
        } else {
          setError('QR code not found');
        }
      } catch (error) {
        setError('Failed to load QR code');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchQRCode();
    }
  }, [params.id]);

  const contrast = calculateContrast(foregroundColor, backgroundColor);
  const hasGoodContrast = contrast >= 4.5;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const updateData = {
        title,
        contentType,
        content,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        status,
        style: {
          foregroundColor,
          backgroundColor,
          cornerStyle,
          size,
        },
      };
      
      const response = await fetch(`/api/qrs/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update QR code');
      }
    } catch (error) {
      setError('Failed to update QR code');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!qrData) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">QR Code Not Found</h1>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit QR Code</h1>
        <p className="text-gray-600 mt-2">Update your QR code settings and content</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Content Section */}
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
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

                <Select
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'PAUSED')}
                  options={[
                    { value: 'ACTIVE', label: 'Active' },
                    { value: 'PAUSED', label: 'Paused' },
                  ]}
                />
              </CardContent>
            </Card>

            {/* Style Section */}
            <Card>
              <CardHeader>
                <CardTitle>Style</CardTitle>
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
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex justify-center mb-4">
                  {qrContent ? (
                    <div className={cornerStyle === 'rounded' ? 'rounded-lg overflow-hidden' : ''}>
                      <QRCodeSVG
                        value={qrContent}
                        size={200}
                        fgColor={foregroundColor}
                        bgColor={backgroundColor}
                        level="M"
                      />
                    </div>
                  ) : (
                    <div className="w-[200px] h-[200px] bg-gray-100 rounded flex items-center justify-center text-gray-500">
                      Enter content
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <Button type="submit" className="w-full" loading={saving}>
                    Update QR Code
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    type="button"
                    onClick={() => router.push('/dashboard')}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
