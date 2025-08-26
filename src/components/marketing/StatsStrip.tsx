'use client';

import React from 'react';

interface StatsStripProps {
  t: any; // i18n translation function
}

export const StatsStrip: React.FC<StatsStripProps> = ({ t }) => {
  const stats = [
    { key: 'users', value: '10,000+', label: t('trust.users') },
    { key: 'codes', value: '500,000+', label: t('trust.codes') },
    { key: 'scans', value: '50M+', label: t('trust.scans') },
    { key: 'countries', value: '120+', label: t('trust.countries') },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={stat.key} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};