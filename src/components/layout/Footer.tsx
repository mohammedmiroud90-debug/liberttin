'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { BrandLogo } from '@/components/ui/BrandLogo';

export function Footer() {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="container px-4 py-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
          {/* Using variant="dark" for dark footer background - logo will use colorDark setting */}
          <BrandLogo href="/" variant="dark" />

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-400">
            <Link href="/about" className="hover:text-white transition-colors">
              {t('aboutUs')}
            </Link>
            <Link href="/resources" className="hover:text-white transition-colors">
              {t('resources')}
            </Link>
            <Link href="/sitemap-page" className="hover:text-white transition-colors">
              {t('sitemap')}
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              {t('contactUs')}
            </Link>
          </div>

          <p className="text-xs text-gray-500 whitespace-nowrap">
            © {currentYear} BILLIANT
          </p>
        </div>
      </div>
    </footer>
  );
}
