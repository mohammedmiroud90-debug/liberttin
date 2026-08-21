'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

const ROTATING_WORDS: Record<string, string[]> = {
  en: ['at home', 'on the go', 'worldwide', 'anywhere', 'in minutes'],
  fr: ['à domicile', 'en déplacement', 'partout', 'dans le monde', 'en minutes'],
  ar: ['في المنزل', 'أثناء التنقل', 'حول العالم', 'في أي مكان', 'في دقائق'],
  es: ['en casa', 'en movimiento', 'en todo el mundo', 'en cualquier lugar', 'en minutos'],
};

export function HeroHeading() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const words = ROTATING_WORDS[locale] || ROTATING_WORDS.en;
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % words.length);
        setVisible(true);
      }, 280);
    }, 2800);

    return () => clearInterval(interval);
  }, [words.length]);

  const word = words[index] ?? words[0];

  return (
    <h1 className="font-hero-heading font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-black/90 mb-4 md:mb-5 leading-[1.25] max-w-5xl mx-auto">
      <span>{t('title')}</span>
      {' '}
      <span className="relative inline-flex flex-col items-start align-baseline">
        <span
          className={`whitespace-nowrap inline-block pb-1 transition-all duration-300 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          {word}
        </span>
        <svg
          className="block w-full h-2.5 md:h-3 -mt-0.5 pointer-events-none hero-wave-underline"
          viewBox="0 0 200 12"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M2 8 C 36 2, 64 11, 100 6 S 164 2, 198 8"
            fill="none"
            stroke="var(--hero-link)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </h1>
  );
}
