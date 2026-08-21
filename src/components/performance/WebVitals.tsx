'use client';

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';
import { reportWebVitals as reportMetric } from '@/lib/performance';

export function WebVitals() {
  useReportWebVitals((metric) => {
    reportMetric({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    });
  });

  return null;
}
