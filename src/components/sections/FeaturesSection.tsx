'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  Video,
  Calendar,
  FileText,
  FlaskConical,
  Pill,
  HeartPulse,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  {
    key: 'consultation' as const,
    icon: Video,
    href: '/patient/consultation/new',
  },
  {
    key: 'appointments' as const,
    icon: Calendar,
    href: '/patient/appointments',
  },
  {
    key: 'records' as const,
    icon: FileText,
    href: '/patient/medical-records',
  },
  {
    key: 'laboratory' as const,
    icon: FlaskConical,
    href: '/patient/lab-results',
  },
  {
    key: 'pharmacy' as const,
    icon: Pill,
    href: '/patient/prescriptions',
  },
  {
    key: 'emergency' as const,
    icon: HeartPulse,
    href: '/eclipse-llm',
  },
];

export function FeaturesSection() {
  const t = useTranslations('features');
  const tCommon = useTranslations('common');
  const tHome = useTranslations('HomePage');

  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="text-center mb-8 md:mb-10 max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-800 mb-3">
            {t('eyebrow')}
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-3">
            {t('title')}
          </h2>
          <p className="text-sm md:text-base text-gray-800 font-light leading-relaxed mb-2">
            {t('subtitle')}
          </p>
          <p className="text-sm md:text-base text-gray-800">
            {t('connectedCare')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-8 md:mb-10">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.key}
                className="flex flex-col rounded-xl bg-[#f2f2f2] p-5 md:p-6 min-h-[220px]"
              >
                <div className="inline-flex w-11 h-11 items-center justify-center rounded-lg bg-white text-[#0066cc] mb-4">
                  <Icon className="w-5 h-5" strokeWidth={2.2} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[#0066cc] mb-3 leading-tight">
                  {t(`${service.key}.title`)}
                </h3>
                <p className="text-sm text-gray-900 leading-snug flex-1 mb-5">
                  {t(`${service.key}.description`)}
                </p>
                <Link
                  href={service.href}
                  className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 underline underline-offset-2 hover:text-[#0066cc] transition-colors"
                >
                  {tCommon('learnMore')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </article>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
          <Link href="/patient/consultation/new">
            <Button
              size="lg"
              className="bg-[#0066cc] hover:bg-[#0052a3] text-white px-7 py-3 rounded-full font-semibold"
            >
              {t('explore')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="lg"
              variant="outline"
              className="border-gray-400 text-gray-900 hover:bg-[#f2f2f2] px-7 py-3 rounded-full font-semibold"
            >
              {tHome('banner.getStarted')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
