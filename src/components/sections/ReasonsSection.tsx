'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import {
  ArrowRight,
  User,
  Users,
  Building2,
  Stethoscope,
  Brain,
  Shield,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1920&q=80';

const audienceConfig = [
  { key: 'individuals' as const, icon: User, href: '/eclipse-llm' },
  { key: 'groups' as const, icon: Users, href: '/pro-suite' },
  { key: 'enterprises' as const, icon: Building2, href: '/enterprise-suite' },
];

const highlightConfig = [
  { key: 'evidence' as const, icon: Stethoscope },
  { key: 'ai' as const, icon: Brain },
  { key: 'security' as const, icon: Shield },
  { key: 'scale' as const, icon: Sparkles },
];

export function ReasonsSection() {
  const t = useTranslations('ReasonsSection');

  return (
    <section className="overflow-hidden bg-white">
      {/* Hero — lifestyle image + white overlay card (reference layout) */}
      <div className="relative min-h-[480px] md:min-h-[540px] lg:min-h-[580px]">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/10 to-transparent" />

        <div className="container relative mx-auto px-4 h-full min-h-[480px] md:min-h-[540px] lg:min-h-[580px] flex items-center justify-center md:justify-end py-10 md:py-14">
          <div className="w-full max-w-lg bg-white rounded-lg p-7 md:p-9 lg:p-10 shadow-[0_16px_50px_rgba(0,0,0,0.22)] border border-white/80">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-700 mb-3">
              {t('eyebrow')}
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-[2rem] font-bold text-gray-900 leading-tight mb-4">
              {t('heroTitle')}
            </h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-6">
              {t('heroDescription')}
            </p>

            <div className="space-y-2 text-sm text-gray-800 mb-7">
              <p>
                <span className="font-bold">{t('forLabel')}</span>{' '}
                {t('forValue')}
              </p>
              <p>
                <span className="font-bold">{t('reviewedByLabel')}</span>{' '}
                <Link href="/medical-affairs" className="text-[#0066cc] underline underline-offset-2 hover:text-[#0052a3]">
                  {t('reviewedByName')}
                </Link>
              </p>
            </div>

            <Link
              href="/eclipse-llm"
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 bg-[#0066cc] hover:bg-[#0052a3] text-white text-sm md:text-base font-semibold rounded-full transition-colors shadow-md"
            >
              {t('heroCta')}
            </Link>
          </div>
        </div>
      </div>

      {/* Audience suites + highlights — matches care-services template */}
      <div className="bg-white py-10 md:py-14">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="max-w-3xl mb-8 md:mb-10">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
              {t('title')}
            </h3>
            <p className="text-sm md:text-base text-gray-800 font-light leading-relaxed">
              {t('descriptionIntro')}{' '}
              <strong className="text-gray-900 font-medium">{t('brandBilliant')}</strong>,{' '}
              <strong className="text-gray-900 font-medium">{t('brandLexidrug')}</strong>,{' '}
              <strong className="text-gray-900 font-medium">{t('brandEngagement')}</strong>, {t('descriptionAnd')}{' '}
              <strong className="text-gray-900 font-medium">{t('brandArchitect')}</strong>{' '}
              {t('descriptionOutro')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-8 md:mb-10">
            {audienceConfig.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className="group flex flex-col rounded-xl bg-[#f2f2f2] p-5 md:p-6 min-h-[260px] transition-colors"
                >
                  <div className="inline-flex w-11 h-11 items-center justify-center rounded-lg bg-white text-[#0066cc] mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-teal-800 mb-2">
                    {t(`audiences.${item.key}.label`)}
                  </span>
                  <h4 className="text-xl md:text-2xl font-bold text-[#0066cc] mb-3 leading-tight group-hover:text-[#0052a3] transition-colors">
                    {t(`audiences.${item.key}.title`)}
                  </h4>
                  <p className="text-sm text-gray-900 leading-snug flex-1 mb-5">
                    {t(`audiences.${item.key}.description`)}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 underline underline-offset-2 group-hover:text-[#0066cc] transition-colors">
                    {t('learnMore')}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="rounded-xl bg-[#f2f2f2] p-5 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-[#0066cc] mb-6 md:mb-8">
              {t('whyChoose')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {highlightConfig.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.key} className="group">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white flex items-center justify-center text-[#0066cc]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1.5 text-sm md:text-base">
                          {t(`highlights.${item.key}.title`)}
                        </h4>
                        <p className="text-xs md:text-sm text-gray-800 leading-snug">
                          {t(`highlights.${item.key}.text`)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-800">
                <CheckCircle2 className="w-4 h-4 text-[#0066cc] flex-shrink-0" />
                {t('trusted')}
              </div>
              <Link
                href="/eclipse-llm"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0066cc] hover:bg-[#0052a3] text-white text-sm font-semibold rounded-full transition-colors"
              >
                {t('cta')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
