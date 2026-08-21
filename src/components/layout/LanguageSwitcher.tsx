'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
];

export function LanguageSwitcher({
  variant = 'dark',
}: {
  /** dark = for black headers; light = for white dashboard headers */
  variant?: 'dark' | 'light';
}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  const triggerClass =
    variant === 'light'
      ? 'flex items-center gap-1.5 text-gray-800 hover:text-[#0066cc] transition-colors p-2'
      : 'flex items-center gap-1.5 text-white hover:text-teal-300 transition-colors p-2';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={triggerClass}
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <Globe className="h-5 w-5" strokeWidth={1.75} />
        <span className="text-xs sm:text-sm font-semibold uppercase tracking-wide">
          {currentLanguage.code}
        </span>
      </button>

      {isOpen && (
        <div
          className={`absolute mt-1 z-50 w-52 bg-[#f2f2f2] text-black p-4 text-left shadow-md border border-gray-200 ${
            variant === 'dark' ? 'right-0' : 'right-0'
          }`}
        >
          <h3 className="text-base font-bold text-[#0066cc] mb-3 leading-tight">Language</h3>
          <ul className="space-y-2 text-sm text-gray-900 leading-snug">
            {languages
              .filter((lang) => ['en', 'ar', 'fr', 'es'].includes(lang.code))
              .map((lang) => (
              <li key={lang.code}>
                <button
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left underline underline-offset-2 decoration-gray-900 hover:text-[#0066cc] hover:decoration-[#0066cc] transition-colors py-0.5 ${
                    locale === lang.code ? 'text-[#0066cc] decoration-[#0066cc] font-semibold' : ''
                  }`}
                  dir={lang.code === 'ar' ? 'rtl' : 'ltr'}
                >
                  {lang.nativeName}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
