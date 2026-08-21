'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Footer } from '@/components/layout/Footer';
import { Home, Search, ArrowRight } from 'lucide-react';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <SiteHeader />
      <main className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-950/40 via-black to-black" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="container relative z-10 mx-auto max-w-4xl px-4 py-20 md:py-28 text-center">
          <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-950/60 border border-teal-800/50 text-teal-400 text-sm mb-8">
            404
          </p>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{t('title')}</h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg transition-colors"
            >
              <Home className="h-5 w-5" />
              {t('goHome')}
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-950 border border-gray-700 hover:border-teal-600 text-white font-semibold rounded-lg transition-colors"
            >
              <Search className="h-5 w-5" />
              {t('searchArticles')}
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {[
              { href: '/', labelKey: 'articles' as const },
              { href: '/about', labelKey: 'about' as const },
              { href: '/resources', labelKey: 'resources' as const },
              { href: '/contact', labelKey: 'contact' as const },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center justify-center gap-1 p-4 rounded-lg bg-gray-950 border border-gray-800 hover:border-teal-700 text-sm font-semibold text-gray-200"
              >
                {t(item.labelKey)}
                <ArrowRight className="h-3.5 w-3.5 text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
