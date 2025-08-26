'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface StaticVsDynamicProps {
  t: any; // i18n translation function
}

export const StaticVsDynamic: React.FC<StaticVsDynamicProps> = ({ t }) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Static QR Codes */}
          <Card className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{t('static_vs_dynamic.static.title')}</CardTitle>
                <Badge variant="success">{t('static_vs_dynamic.static.subtitle')}</Badge>
              </div>
              <p className="text-gray-600">{t('static_vs_dynamic.static.description')}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {t('static_vs_dynamic.static.features', { returnObjects: true }).map((feature: string, index: number) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {/* Dynamic QR Codes */}
          <Card className="relative border-primary-200 bg-primary-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{t('static_vs_dynamic.dynamic.title')}</CardTitle>
                <Badge variant="info">{t('static_vs_dynamic.dynamic.subtitle')}</Badge>
              </div>
              <p className="text-gray-600">{t('static_vs_dynamic.dynamic.description')}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {t('static_vs_dynamic.dynamic.features', { returnObjects: true }).map((feature: string, index: number) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};