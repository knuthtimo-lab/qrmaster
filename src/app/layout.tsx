import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QR Master - Create Custom QR Codes in Seconds',
  description: 'Generate static and dynamic QR codes with advanced tracking, professional templates, and seamless integrations.',
  keywords: 'QR code, QR generator, dynamic QR, QR tracking, QR analytics',
  openGraph: {
    title: 'QR Master - Create Custom QR Codes in Seconds',
    description: 'Generate static and dynamic QR codes with advanced tracking, professional templates, and seamless integrations.',
    url: 'https://qrmaster.com',
    siteName: 'QR Master',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}