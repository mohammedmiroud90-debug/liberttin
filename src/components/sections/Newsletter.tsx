'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { MessageCircle, Share2, Camera, PlayCircle, Briefcase, Mail } from 'lucide-react';

export function Newsletter() {
  const t = useTranslations('Newsletter');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
  };

  const socialLinks = [
    { icon: MessageCircle, href: 'https://twitter.com/billiant', label: 'Twitter' },
    { icon: Share2, href: 'https://facebook.com/billiant', label: 'Facebook' },
    { icon: Camera, href: 'https://instagram.com/billiant', label: 'Instagram' },
    { icon: PlayCircle, href: 'https://youtube.com/@billiant', label: 'YouTube' },
    { icon: Briefcase, href: 'https://linkedin.com/company/billiant', label: 'LinkedIn' },
  ];

  return (
    <section style={{ backgroundColor: '#FDF6ED' }} className="py-8 md:py-12 border-t">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Left Section - Logo & Newsletter */}
          <div>
            {/* Logo */}
            <div className="mb-6">
              <Link href="/">
                <Image
                  src="/BRAND.png"
                  alt="BILLIANT Logo"
                  width={200}
                  height={60}
                  className="h-10 w-auto cursor-pointer brightness-0"
                  priority
                />
              </Link>
            </div>

            {/* Social Links with Icons */}
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:text-teal-600 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>

            {/* Newsletter Form */}
            <div>
              <h3 className="text-lg md:text-xl font-bold text-black mb-2 md:mb-3">
                {t('title')}
              </h3>
              <p className="text-xs md:text-sm text-gray-700 mb-4 md:mb-5 max-w-md leading-relaxed">
                {t('description')}
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  className="flex-1 px-3 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent text-xs md:text-sm bg-white w-full"
                  required
                />
                <button
                  type="submit"
                  className="px-6 md:px-8 py-2 md:py-2.5 bg-teal-600 text-white font-bold rounded hover:bg-teal-700 transition-colors text-xs md:text-sm uppercase tracking-wide whitespace-nowrap"
                >
                  {t('signUp')}
                </button>
              </form>

              <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                Your{' '}
                <Link href="/privacy" className="underline hover:text-teal-600">
                  {t('privacyNotice').toLowerCase()}
                </Link>{' '}
                is important to us
              </p>
            </div>
          </div>

          {/* Right Section - Links */}
          <div className="grid grid-cols-2 gap-6 md:gap-8">
            {/* Column 1 */}
            <div>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-xs md:text-sm text-gray-800 hover:text-teal-600 transition-colors font-medium">
                    {t('aboutUs')}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-xs md:text-sm text-gray-800 hover:text-teal-600 transition-colors font-medium">
                    {t('contactUs')}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-xs md:text-sm text-gray-800 hover:text-teal-600 transition-colors font-medium">
                    {t('privacyNotice')}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-settings" className="text-xs md:text-sm text-gray-800 hover:text-teal-600 transition-colors font-medium">
                    {t('privacySettings')}
                  </Link>
                </li>
                <li>
                  <Link href="/advertising" className="text-xs md:text-sm text-gray-800 hover:text-teal-600 transition-colors font-medium">
                    {t('advertisingPolicy')}
                  </Link>
                </li>
                <li>
                  <Link href="/health-topics" className="text-xs md:text-sm text-gray-800 hover:text-teal-600 transition-colors font-medium">
                    {t('healthTopics')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <ul className="space-y-3">
                <li>
                  <Link href="/sitemap" className="text-xs md:text-sm text-gray-800 hover:text-teal-600 transition-colors font-medium">
                    {t('sitemap')}
                  </Link>
                </li>
                <li>
                  <Link href="/medical-affairs" className="text-xs md:text-sm text-gray-800 hover:text-teal-600 transition-colors font-medium">
                    {t('medicalAffairs')}
                  </Link>
                </li>
                <li>
                  <Link href="/content-integrity" className="text-xs md:text-sm text-gray-800 hover:text-teal-600 transition-colors font-medium">
                    {t('contentIntegrity')}
                  </Link>
                </li>
                <li>
                  <Link href="/newsletters" className="text-xs md:text-sm text-gray-800 hover:text-teal-600 transition-colors font-medium">
                    {t('newsletters')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="mt-8 md:mt-10 pt-4 md:pt-6 border-t border-gray-300">
          <p className="text-[10px] md:text-xs text-gray-600 leading-relaxed max-w-4xl">
            {t('copyright')}{' '}
            <Link href="/medical-disclaimer" className="underline hover:text-teal-600">
              {t('additionalInfo')}
            </Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
