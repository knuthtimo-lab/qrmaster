'use client';

import React from 'react';
import { Hero } from '@/components/marketing/Hero';
import { StatsStrip } from '@/components/marketing/StatsStrip';
import { TemplateCards } from '@/components/marketing/TemplateCards';
import { InstantGenerator } from '@/components/marketing/InstantGenerator';
import { StaticVsDynamic } from '@/components/marketing/StaticVsDynamic';
import { Features } from '@/components/marketing/Features';
import { Pricing } from '@/components/marketing/Pricing';
import { FAQ } from '@/components/marketing/FAQ';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/hooks/useTranslation';

export default function HomePage() {
  const { t } = useTranslation();

  const industries = [
    'Restaurant Chain',
    'Tech Startup',
    'Real Estate',
    'Event Agency',
    'Retail Store',
    'Healthcare',
  ];

  return (
    <>
      <Hero t={t} />
      <StatsStrip t={t} />
      
      {/* Industry Buttons */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {industries.map((industry) => (
              <Button key={industry} variant="outline" size="sm">
                {industry}
              </Button>
            ))}
          </div>
        </div>
      </section>
      
      <TemplateCards t={t} />
      <InstantGenerator t={t} />
      <StaticVsDynamic t={t} />
      <Features t={t} />
      
      {/* Pricing Teaser */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Choose the perfect plan for your needs
          </p>
          <Button size="lg">View Pricing Plans</Button>
        </div>
      </section>
      
      {/* FAQ Teaser */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Have questions?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Check out our frequently asked questions
          </p>
          <Button variant="outline" size="lg">View FAQ</Button>
        </div>
      </section>
    </>
  );
}