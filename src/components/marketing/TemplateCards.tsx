'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface TemplateCardsProps {
  t: any; // i18n translation function
}

export const TemplateCards: React.FC<TemplateCardsProps> = ({ t }) => {
  const templates = [
    {
      key: 'restaurant',
      title: t('templates.restaurant'),
      icon: '🍽️',
      color: 'bg-red-50 border-red-200',
      iconBg: 'bg-red-100',
    },
    {
      key: 'business',
      title: t('templates.business'),
      icon: '💼',
      color: 'bg-blue-50 border-blue-200',
      iconBg: 'bg-blue-100',
    },
    {
      key: 'wifi',
      title: t('templates.wifi'),
      icon: '📶',
      color: 'bg-purple-50 border-purple-200',
      iconBg: 'bg-purple-100',
    },
    {
      key: 'event',
      title: t('templates.event'),
      icon: '🎫',
      color: 'bg-green-50 border-green-200',
      iconBg: 'bg-green-100',
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {t('templates.title')}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template) => (
            <Card key={template.key} className={`${template.color} text-center hover:scale-105 transition-transform cursor-pointer`}>
              <div className={`w-16 h-16 ${template.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-2xl">{template.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {template.title}
              </h3>
              <Button variant="outline" size="sm" className="w-full">
                {t('templates.use_template')}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};