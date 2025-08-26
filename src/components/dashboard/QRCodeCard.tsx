'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import { formatDate } from '@/lib/utils';

interface QRCodeCardProps {
  qr: {
    id: string;
    title: string;
    type: 'STATIC' | 'DYNAMIC';
    contentType: string;
    content?: any;
    slug: string;
    status: 'ACTIVE' | 'PAUSED';
    createdAt: string;
    scans?: number;
  };
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onPause: (id: string) => void;
  onDelete: (id: string) => void;
}

export const QRCodeCard: React.FC<QRCodeCardProps> = ({
  qr,
  onEdit,
  onDuplicate,
  onPause,
  onDelete,
}) => {
  // Use a public URL that works on mobile devices
  const baseUrl = typeof window !== 'undefined' 
    ? (window.location.hostname === 'localhost' ? 'https://timos-projects-125cbf0d.vercel.app' : window.location.origin)
    : 'https://timos-projects-125cbf0d.vercel.app';

  let qrUrl = '';

  const downloadQR = (format: 'png' | 'svg') => {
    const svg = document.querySelector(`#qr-${qr.id} svg`);
    if (!svg) return;

    if (format === 'svg') {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${qr.title.replace(/\s+/g, '-').toLowerCase()}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Convert SVG to PNG
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      img.onload = () => {
        canvas.width = 300;
        canvas.height = 300;
        ctx?.drawImage(img, 0, 0, 300, 300);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${qr.title.replace(/\s+/g, '-').toLowerCase()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        });
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  if (qr.type === 'STATIC') {
    if (qr.contentType === 'URL' && qr.content?.url) {
      qrUrl = qr.content.url;
    } else if (qr.content?.qrContent) {
      qrUrl = qr.content.qrContent;
    } else {
      qrUrl = `${baseUrl}/r/${qr.slug}`;
    }
  } else {
    qrUrl = `${baseUrl}/r/${qr.slug}`;
  }

  return (
    <Card hover>
      <CardContent className='p-4'>
        <div className='flex items-start justify-between mb-3'>
          <div className='flex-1'>
            <h3 className='font-semibold text-gray-900 mb-1'>{qr.title}</h3>
            <div className='flex items-center space-x-2'>
              <Badge variant={qr.type === 'DYNAMIC' ? 'info' : 'default'}>{qr.type}</Badge>
              <Badge variant={qr.status === 'ACTIVE' ? 'success' : 'warning'}>{qr.status}</Badge>
            </div>
          </div>
          
          <Dropdown
            align='right'
            trigger={
              <button className='p-1 hover:bg-gray-100 rounded'>
                <svg className='w-5 h-5 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z' />
                </svg>
              </button>
            }
          >
            <DropdownItem onClick={() => downloadQR('png')}>Download PNG</DropdownItem>
            <DropdownItem onClick={() => downloadQR('svg')}>Download SVG</DropdownItem>
            <DropdownItem onClick={() => onEdit(qr.id)}>Edit</DropdownItem>
            <DropdownItem onClick={() => onDuplicate(qr.id)}>Duplicate</DropdownItem>
            <DropdownItem onClick={() => onPause(qr.id)}>
              {qr.status === 'ACTIVE' ? 'Pause' : 'Resume'}
            </DropdownItem>
            <DropdownItem onClick={() => onDelete(qr.id)} className='text-red-600'>
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
        <div id={`qr-${qr.id}`} className='flex items-center justify-center bg-gray-50 rounded-lg p-4 mb-3'>
          <QRCodeSVG value={qrUrl} size={96} fgColor='#000000' bgColor='#FFFFFF' level='M' />
        </div>
        <div className='space-y-2 text-sm'>
          <div className='flex items-center justify-between'>
            <span className='text-gray-500'>Type:</span>
            <span className='text-gray-900'>{qr.contentType}</span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-gray-500'>Scans:</span>
            <span className='text-gray-900'>{qr.scans || 0}</span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-gray-500'>Created:</span>
            <span className='text-gray-900'>{formatDate(qr.createdAt)}</span>
          </div>
          {qr.type === 'DYNAMIC' && (
            <div className='pt-2 border-t'>
              <p className='text-xs text-gray-500'>
                📊 Dynamic QR: Tracks scans via {baseUrl}/r/{qr.slug}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
