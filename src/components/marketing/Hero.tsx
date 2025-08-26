'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface HeroProps {
  t: any; // i18n translation function
}

export const Hero: React.FC<HeroProps> = ({ t }) => {
  const templateCards = [
    { title: 'Restaurant Menu', color: 'bg-pink-100', icon: '🍽️' },
    { title: 'Business Card', color: 'bg-blue-100', icon: '💼' },
    { title: 'Event Tickets', color: 'bg-green-100', icon: '🎫' },
    { title: 'WiFi Access', color: 'bg-purple-100', icon: '📶' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <Badge variant="info" className="inline-flex items-center space-x-2">
              <span>{t('hero.badge')}</span>
            </Badge>
            
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {t('hero.title')}
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                {t('hero.subtitle')}
              </p>
              
              <div className="space-y-3">
                {t('hero.features', { returnObjects: true }).map((feature: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-success-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8 py-4">
                  {t('hero.cta_primary')}
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  {t('hero.cta_secondary')}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Right Preview Widget */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {templateCards.map((card, index) => (
                <Card key={index} className={`${card.color} border-0 p-6 text-center hover:scale-105 transition-transform`}>
                  <div className="text-3xl mb-2">{card.icon}</div>
                  <h3 className="font-semibold text-gray-800">{card.title}</h3>
                </Card>
              ))}
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 bg-success-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              {t('hero.engagement_badge')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};