'use client';

import React from 'react';
import { Pricing } from '@/components/marketing/Pricing';
import { useTranslation } from '@/hooks/useTranslation';

export default function PricingPage() {
  const { t } = useTranslation();

  return (
    <div className="py-20">
      <Pricing t={t} />
    </div>
  );
}