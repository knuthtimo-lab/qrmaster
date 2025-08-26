'use client';

import React from 'react';
import { FAQ } from '@/components/marketing/FAQ';
import { useTranslation } from '@/hooks/useTranslation';

export default function FAQPage() {
  const { t } = useTranslation();

  return (
    <div className="py-20">
      <FAQ t={t} />
    </div>
  );
}