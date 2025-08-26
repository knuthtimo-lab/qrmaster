'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';

interface FAQProps {
  t: any; // i18n translation function
}

export const FAQ: React.FC<FAQProps> = ({ t }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const questions = [
    'account',
    'static_vs_dynamic',
    'forever',
    'file_type',
    'password',
    'analytics',
    'privacy',
    'bulk',
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {t('faq.title')}
          </h2>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {questions.map((key, index) => (
            <Card key={key} className="cursor-pointer" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t(`faq.questions.${key}.question`)}
                  </h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                {openIndex === index && (
                  <div className="mt-4 text-gray-600">
                    {t(`faq.questions.${key}.answer`)}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};