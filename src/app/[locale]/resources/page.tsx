'use client';

import { useTranslations } from 'next-intl';
import { HUBS } from '@/lib/content-pages';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Footer } from '@/components/layout/Footer';
import { Newsletter } from '@/components/sections/Newsletter';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { CoverageCtaSection } from '@/components/sections/CoverageCtaSection';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function ResourcesPage() {
  const tHeader = useTranslations('Header');
  const tContent = useTranslations('ContentPages');
  const menus = tHeader.raw('menus') as Record<string, Record<string, string>>;
  const andMore = tHeader('menus.andMore');

  return (
    <>
      <SiteHeader />
      <main className="bg-white">
        <section className="relative py-12 md:py-16 overflow-hidden" style={{ backgroundColor: 'var(--hero-bg)' }}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg className="absolute -top-8 left-0 w-[120%] h-[70%] opacity-40" viewBox="0 0 1440 600" preserveAspectRatio="none" aria-hidden="true">
              <path fill="var(--hero-bg-light)" d="M0,320 C240,180 480,420 720,300 C960,180 1200,380 1440,260 L1440,0 L0,0 Z" />
            </svg>
          </div>
          <div className="container px-4 mx-auto max-w-7xl relative z-10">
            <div className="text-center mb-8 md:mb-12">
              <h1 className="font-hero-heading font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-black/90 mb-4 leading-[1.2]">
                {andMore}
              </h1>
              <p className="text-base md:text-lg text-gray-800 font-light max-w-3xl mx-auto">
                {tContent('ui.resourcesSubtitle')}
              </p>
              <div className="mt-6">
                <Link href="/">
                  <Button className="bg-black hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold">
                    Browse articles
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-5xl mx-auto mb-6">
              {HUBS.map((hub, index) => (
                <Link key={hub.path} href={hub.path}>
                  <div
                    className={`rounded-lg p-6 text-center min-h-[100px] flex items-center justify-center ${
                      index === 0 ? 'bg-black text-teal-400 border border-teal-600/30' : 'bg-white shadow-[0_8px_22px_rgba(15,23,42,0.10)] text-black'
                    }`}
                  >
                    <span className="font-bold text-sm" style={{ fontFamily: 'GeogrotesqueCyr, sans-serif' }}>
                      {menus[hub.menu]?.title}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {HUBS.map((hub) => (
                <article key={hub.path} className="bg-[#f2f2f2] p-6">
                  <h3 className="text-xl font-bold text-[#0066cc] mb-4">
                    <Link href={hub.path} className="hover:underline">
                      {menus[hub.menu]?.title}
                    </Link>
                  </h3>
                  <ul className="space-y-2.5 text-sm">
                    {hub.pages.map((page) => (
                      <li key={page.slug}>
                        <Link href={`${hub.path}/${page.slug}`} className="underline underline-offset-2 hover:text-[#0066cc]">
                          {menus[page.menu]?.[page.item]}
                        </Link>
                      </li>
                    ))}
                    <li className="pt-1">{andMore}</li>
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
        <CoverageCtaSection />
      </main>
      <Newsletter />
      <Footer />
      <CookieBanner />
    </>
  );
}
