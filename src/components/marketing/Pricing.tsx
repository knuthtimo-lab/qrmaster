'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface PricingProps {
  t: any; // i18n translation function
}

export const Pricing: React.FC<PricingProps> = ({ t }) => {
  const plans = [
    {
      key: 'free',
      popular: false,
    },
    {
      key: 'pro',
      popular: true,
    },
    {
      key: 'business',
      popular: false,
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {t('pricing.title')}
          </h2>
          <p className="text-xl text-gray-600">
            {t('pricing.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.key} 
              className={plan.popular ? 'border-primary-500 shadow-xl relative' : ''}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge variant="info" className="px-3 py-1">
                    {t(`pricing.${plan.key}.badge`)}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-4">
                  {t(`pricing.${plan.key}.title`)}
                </CardTitle>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold">
                    {t(`pricing.${plan.key}.price`)}
                  </span>
                  <span className="text-gray-600 ml-2">
                    {t(`pricing.${plan.key}.period`)}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {t(`pricing.${plan.key}.features`, { returnObjects: true }).map((feature: string, index: number) => (
                    <li key={index} className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.popular ? 'primary' : 'outline'} 
                  className="w-full"
                  size="lg"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};