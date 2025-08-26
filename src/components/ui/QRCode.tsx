'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
  imageSettings?: {
    src: string;
    height: number;
    width: number;
    excavate: boolean;
  };
}

export const QRCode: React.FC<QRCodeProps> = ({
  value,
  size = 128,
  fgColor = '#000000',
  bgColor = '#FFFFFF',
  level = 'M',
  includeMargin = false,
  imageSettings,
}) => {
  if (!value) {
    return (
      <div 
        className="bg-gray-200 flex items-center justify-center text-gray-500"
        style={{ width: size, height: size }}
      >
        No data
      </div>
    );
  }

  return (
    <QRCodeSVG
      value={value}
      size={size}
      fgColor={fgColor}
      bgColor={bgColor}
      level={level}
      includeMargin={includeMargin}
      imageSettings={imageSettings}
    />
  );
};

export default QRCode;