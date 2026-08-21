'use client';

import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Newsletter } from '@/components/sections/Newsletter';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { CoverageCtaSection } from '@/components/sections/CoverageCtaSection';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { ContentHub, ContentPage, RelatedItem } from '@/lib/content-pages';
import { relatedFromHub } from '@/lib/content-pages';

const LOGIN_HREF = '/login';

type MenuCopy = Record<string, string>;
type MenusCopy = Record<string, MenuCopy>;
type PageCopy = {
  title?: string;
  subtitle?: string;
  overview: string;
  topics: string[];
  highlights: { title: string; text: string }[];
};

function HeroWaves() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute -top-8 left-0 w-[120%] h-[70%] opacity-40" viewBox="0 0 1440 600" preserveAspectRatio="none" aria-hidden="true">
        <path
          fill="var(--hero-bg-light)"
          d="M0,320 C240,180 480,420 720,300 C960,180 1200,380 1440,260 L1440,0 L0,0 Z"
        />
      </svg>
      <svg className="absolute bottom-0 right-0 w-[90%] h-[55%] opacity-30" viewBox="0 0 1440 500" preserveAspectRatio="none" aria-hidden="true">
        <path
          fill="var(--hero-bg-light)"
          d="M0,400 C360,280 720,460 1080,340 C1260,280 1380,320 1440,300 L1440,500 L0,500 Z"
        />
      </svg>
    </div>
  );
}

function useMenuCopy() {
  const tHeader = useTranslations('Header');
  const tContent = useTranslations('ContentPages');
  const menus = tHeader.raw('menus') as MenusCopy;
  const pages = tContent.raw('pages') as Record<string, PageCopy>;
  const andMore = tHeader('menus.andMore');

  const labelFor = (menu: ContentPage['menu'], item: string, slug?: string) => {
    if (menu === 'resources') {
      return pages[slug || item]?.title || item;
    }
    return menus[menu]?.[item] || item;
  };

  const subtitleFor = (page: ContentPage) => {
    if (page.menu === 'resources') {
      return pages[page.slug]?.subtitle || '';
    }
    return menus[page.menu]?.[`${page.item}Desc`] || '';
  };

  const eyebrowFor = (page: ContentPage) => {
    if (page.menu === 'resources') return andMore;
    return menus[page.menu]?.title || '';
  };

  const hubTitle = (hub: ContentHub) => menus[hub.menu]?.title || '';
  const hubSubtitle = (hub: ContentHub) => menus[hub.menu]?.blurb || '';

  return { tContent, menus, pages, andMore, labelFor, subtitleFor, eyebrowFor, hubTitle, hubSubtitle };
}

function RelatedCards({
  items,
  labelFor,
}: {
  items: RelatedItem[];
  labelFor: (menu: ContentPage['menu'], item: string, slug?: string) => string;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 max-w-6xl mx-auto mb-6 px-2">
      {items.slice(0, 5).map((item, index) => (
        <Link key={item.href} href={item.href} className="group">
          <div
            className={`rounded-lg p-3 sm:p-4 md:p-6 text-center transition-all duration-300 h-full flex flex-col items-center justify-center min-h-[90px] sm:min-h-[100px] md:min-h-[120px] ${
              index === 0
                ? 'bg-black border border-teal-600/30 shadow-[0_10px_24px_rgba(0,0,0,0.22)]'
                : 'bg-white shadow-[0_8px_22px_rgba(15,23,42,0.10)] hover:shadow-[0_12px_28px_rgba(15,23,42,0.14)]'
            }`}
          >
            <h3
              className={`font-bold text-xs sm:text-sm ${index === 0 ? 'text-teal-400' : 'text-black'}`}
              style={{ fontFamily: 'GeogrotesqueCyr, sans-serif' }}
            >
              {labelFor(item.menu, item.item)}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function ContentLandingPage({
  page,
  hub,
  related,
}: {
  page: ContentPage;
  hub?: ContentHub;
  related: RelatedItem[];
}) {
  const { tContent, pages, andMore, labelFor, subtitleFor, eyebrowFor, hubTitle } = useMenuCopy();
  const copy = pages[page.slug];
  const title = labelFor(page.menu, page.item, page.slug);

  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="relative py-12 md:py-16 overflow-hidden" style={{ backgroundColor: 'var(--hero-bg)' }}>
          <HeroWaves />
          <div className="container px-4 mx-auto max-w-7xl relative z-10">
            <div className="text-center mb-8 md:mb-12 px-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-800 mb-3">
                {eyebrowFor(page)}
              </p>
              <h1 className="font-hero-heading font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-black/90 mb-4 md:mb-5 leading-[1.2] max-w-5xl mx-auto">
                {title}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-800 font-light max-w-3xl mx-auto leading-relaxed px-4">
                {subtitleFor(page)}
              </p>
              <div className="mt-6">
                <Link href={LOGIN_HREF}>
                  <Button className="bg-black hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold">
                    {tContent('ui.signInContinue')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <RelatedCards items={related} labelFor={labelFor} />

            <div className="text-left max-w-6xl mx-auto px-2">
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 font-bold text-sm uppercase tracking-wide hover:opacity-80"
                style={{ color: 'var(--hero-link)' }}
              >
                {tContent('ui.viewAll')}
                <span className="text-xl">+</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-white">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-7">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{tContent('ui.overview')}</h2>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8">{copy?.overview}</p>
                <Link href={LOGIN_HREF}>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg">
                    {tContent('ui.signInRequest')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="lg:col-span-5">
                <article className="bg-[#f2f2f2] p-6 md:p-7">
                  <h3 className="text-xl font-bold text-[#0066cc] mb-4">{title}</h3>
                  <ul className="space-y-2.5 text-sm text-gray-900">
                    {(copy?.topics || []).map((topic) => (
                      <li key={topic}>
                        <Link
                          href={LOGIN_HREF}
                          className="underline underline-offset-2 decoration-gray-900 hover:text-[#0066cc] hover:decoration-[#0066cc]"
                        >
                          {topic}
                        </Link>
                      </li>
                    ))}
                    <li className="pt-1 text-gray-900">{andMore}</li>
                  </ul>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16" style={{ backgroundColor: '#eef4f5' }}>
          <div className="container px-4 mx-auto max-w-7xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">{tContent('ui.expect')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(copy?.highlights || []).map((item, index) => (
                <div
                  key={item.title}
                  className={`rounded-lg p-6 md:p-8 ${
                    index === 0
                      ? 'bg-black text-white border border-teal-600/30 shadow-[0_12px_32px_rgba(0,0,0,0.28)]'
                      : 'bg-white shadow-[0_10px_28px_rgba(15,23,42,0.10)]'
                  }`}
                >
                  <h3 className={`text-lg font-bold mb-2 ${index === 0 ? 'text-teal-400' : 'text-gray-900'}`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${index === 0 ? 'text-gray-300' : 'text-gray-600'}`}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
            {hub ? (
              <p className="mt-8 text-sm text-gray-600">
                {tContent('ui.partOf')}{' '}
                <Link href={hub.path} className="underline text-[#0066cc]">
                  {hubTitle(hub)}
                </Link>
              </p>
            ) : null}
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

export function ContentHubPage({ hub }: { hub: ContentHub }) {
  const { tContent, pages, andMore, labelFor, hubTitle, hubSubtitle } = useMenuCopy();
  const related = relatedFromHub(hub);

  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="relative py-12 md:py-16 overflow-hidden" style={{ backgroundColor: 'var(--hero-bg)' }}>
          <HeroWaves />
          <div className="container px-4 mx-auto max-w-7xl relative z-10">
            <div className="text-center mb-8 md:mb-12 px-2">
              <h1 className="font-hero-heading font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-black/90 mb-4 md:mb-5 leading-[1.2] max-w-5xl mx-auto">
                {hubTitle(hub)}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-800 font-light max-w-3xl mx-auto leading-relaxed px-4">
                {hubSubtitle(hub)}
              </p>
              <div className="mt-6">
                <Link href={LOGIN_HREF}>
                  <Button className="bg-black hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold">
                    {tContent('ui.signInContinue')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <RelatedCards items={related} labelFor={labelFor} />
            <div className="text-left max-w-6xl mx-auto px-2">
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 font-bold text-sm uppercase tracking-wide"
                style={{ color: 'var(--hero-link)' }}
              >
                {tContent('ui.viewAll')}
                <span className="text-xl">+</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {hub.pages.map((page) => {
                const title = labelFor(page.menu, page.item, page.slug);
                const copy = pages[page.slug];
                return (
                  <article key={page.slug} className="bg-[#f2f2f2] p-6 min-h-[280px] flex flex-col">
                    <h3 className="text-xl font-bold text-[#0066cc] mb-4">{title}</h3>
                    <ul className="flex-1 space-y-2.5 text-sm">
                      {(copy?.topics || []).slice(0, 6).map((topic) => (
                        <li key={topic}>
                          <Link href={LOGIN_HREF} className="underline underline-offset-2 hover:text-[#0066cc]">
                            {topic}
                          </Link>
                        </li>
                      ))}
                      <li className="pt-1">{andMore}</li>
                    </ul>
                    <Link href={`${hub.path}/${page.slug}`} className="mt-5 text-sm font-bold underline hover:text-[#0066cc]">
                      {tContent('ui.viewPage', { title })}
                    </Link>
                  </article>
                );
              })}
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
