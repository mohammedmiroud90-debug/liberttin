'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const categoryKeys = ['urgentCare', 'therapy', 'psychiatry', 'primaryCare'] as const;

type CategoryKey = (typeof categoryKeys)[number];

const categoryItems: Record<CategoryKey, string[]> = {
  urgentCare: [
    'Cold & flu',
    'COVID',
    'Sinus infections',
    'Ear infections',
    'UTIs',
    'Yeast infections',
    'STD treatment',
    'BV treatment',
    'Strep throat',
    'Pink eye',
  ],
  therapy: [
    'Anxiety',
    'Depression',
    'Stress',
    'Grief & loss',
    'Postpartum',
    'PTSD',
    'Couples therapy',
    'EMDR',
    'CBT',
    'Youth mental health',
  ],
  psychiatry: [
    'Mood disorders',
    'Psychiatric evaluations',
    'Initial diagnosis',
    'Medication management',
    'Bipolar disorder',
    'ADHD',
    'PTSD',
    'Online prescriptions',
  ],
  primaryCare: [
    'Chronic disease management',
    'Mental Health',
    'Annual checkups',
    'High blood pressure',
    'Cold, flu, and infections',
    'Prescription refills',
    'Preventive care',
  ],
};

const categoryHrefs: Record<CategoryKey, string> = {
  urgentCare: '/doctors?specialty=urgent',
  therapy: '/doctors?specialty=therapy',
  psychiatry: '/doctors?specialty=psychiatry',
  primaryCare: '/doctors?specialty=primary',
};

export function CareServicesSection() {
  const t = useTranslations();

  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="container px-4 mx-auto max-w-7xl">
        <p className="text-center text-sm md:text-base text-gray-800 font-light leading-relaxed mb-8 md:mb-10 max-w-2xl mx-auto">
          {t('HomePage.careServices.insuranceNote')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
          {categoryKeys.map((key) => {
            const showAndMore = key === 'urgentCare' || key === 'psychiatry';

            return (
              <article
                key={key}
                className="flex flex-col rounded-xl bg-[#f2f2f2] p-5 md:p-6 min-h-[420px]"
              >
                <h3 className="text-xl md:text-2xl font-bold text-[#0066cc] mb-4 leading-tight">
                  {t(`HomePage.careServices.categories.${key}.title`)}
                </h3>

                <ul className="flex-1 space-y-2 text-sm text-gray-900 leading-snug">
                  {categoryItems[key].map((item) => (
                    <li key={item}>
                      <Link
                        href={`/doctors?search=${encodeURIComponent(item)}`}
                        className="underline underline-offset-2 decoration-gray-900 hover:text-[#0066cc] hover:decoration-[#0066cc] transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                  {showAndMore && (
                    <li className="text-gray-900 pt-1">{t('HomePage.careServices.andMore')}</li>
                  )}
                </ul>

                <Link
                  href={categoryHrefs[key]}
                  className="mt-5 text-sm font-bold text-gray-900 underline underline-offset-2 hover:text-[#0066cc] transition-colors"
                >
                  {t(`HomePage.careServices.categories.${key}.viewLink`)}
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
