'use client';

import { useState } from 'react';
import { Link, useRouter } from '@/i18n/routing';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SubscribeModal } from '@/components/modals/SubscribeModal';
import {
  CleanMenuPanel,
  type MenuPanelItem,
  type MenuPanelSection,
} from '@/components/ui/CleanMenuPanel';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { AccountControl } from '@/components/auth/AccountControl';
import { categoryPath } from '@/lib/blog/config';

const FOUND_URL = 'https://found.billiant.blog';

/** Canonical category labels shown in the Categories dropdown. */
export const HEADER_CATEGORIES = [
  'Architecture',
  'Artificial Intelligence',
  'Business',
  'Design',
  'Process',
  'Technology',
] as const;

type MenuKey = 'categories' | 'more';

type NavEntry =
  | {
      kind: 'dropdown';
      key: MenuKey;
      labelKey: string; // Translation key instead of hardcoded label
      href: string;
    }
  | {
      kind: 'external';
      key: string;
      labelKey: string; // Translation key instead of hardcoded label
      href: string;
    };

// Navigation entries with translation keys
const NAV: NavEntry[] = [
  { kind: 'dropdown', key: 'categories', labelKey: 'categories', href: '/' },
  { kind: 'external', key: 'project', labelKey: 'project', href: FOUND_URL },
  { kind: 'external', key: 'founder', labelKey: 'founder', href: `${FOUND_URL}/founder` },
  { kind: 'dropdown', key: 'more', labelKey: 'more', href: '/resources' },
];

function DropdownPanel({
  title,
  titleHref,
  titleExternal,
  items,
  sections,
  footer,
  onNavigate,
}: {
  title: string;
  titleHref?: string;
  titleExternal?: boolean;
  items?: MenuPanelItem[];
  sections?: MenuPanelSection[];
  footer?: { name: string; href?: string; external?: boolean; onClick?: () => void };
  onNavigate?: () => void;
}) {
  return (
    <CleanMenuPanel
      className={sections?.length ? 'lg:w-72 md:p-6' : 'lg:w-64 md:p-6'}
      title={title}
      titleHref={titleHref}
      titleExternal={titleExternal}
      items={items}
      sections={sections}
      footer={footer}
      onNavigate={onNavigate}
    />
  );
}

export function Header(_props?: { categories?: string[]; tags?: string[] }) {
  const t = useTranslations('Header');
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<MenuKey | null>(null);

  const categoryItems: MenuPanelItem[] = HEADER_CATEGORIES.map((label) => ({
    name: label,
    href: categoryPath(label),
  }));

  const moreSections: MenuPanelSection[] = [
    {
      title: t('menus.explore'),
      items: [
        { name: t('menus.allArticles'), href: '/' },
        { name: t('menus.search'), href: '/search' },
        { name: t('menus.resources'), href: '/resources' },
      ],
    },
    {
      title: t('menus.company'),
      items: [
        { name: t('menus.about'), href: '/about' },
        { name: t('menus.contact'), href: '/contact' },
        { name: t('nav.project'), href: FOUND_URL, external: true },
        { name: t('nav.founder'), href: `${FOUND_URL}/founder`, external: true },
      ],
    },
    {
      title: t('menus.topics'),
      items: HEADER_CATEGORIES.slice(0, 4).map((label) => ({
        name: label,
        href: categoryPath(label),
      })),
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const renderDropdown = (key: MenuKey, onNavigate?: () => void) => {
    if (key === 'categories') {
      return (
        <DropdownPanel
          title={t('nav.categories')}
          titleHref="/"
          items={categoryItems}
          footer={{ name: t('menus.andMore'), href: '/' }}
          onNavigate={onNavigate}
        />
      );
    }

    return (
      <DropdownPanel
        title={t('nav.more')}
        titleHref="/resources"
        sections={moreSections}
        footer={{ name: 'found.billiant.blog', href: FOUND_URL, external: true }}
        onNavigate={onNavigate}
      />
    );
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-black text-white">
        <div className="border-b border-white/10">
          <div className="container mx-auto px-4">
            <nav className="flex h-14 lg:h-16 items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  type="button"
                  className="relative z-50 lg:hidden p-1.5 -ml-1 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileMenuOpen((v) => {
                      if (v) setActiveDropdown(null);
                      return !v;
                    });
                  }}
                  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" strokeWidth={1.75} />
                  ) : (
                    <Menu className="h-6 w-6" strokeWidth={1.75} />
                  )}
                </button>
                <BrandLogo href="/" variant="dark" priority />
              </div>

              <div className="hidden lg:flex items-center space-x-7 flex-1 ml-8">
                {NAV.map((item) => {
                  if (item.kind === 'external') {
                    return (
                      <a
                        key={item.key}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[15px] font-normal hover:text-gray-300 transition-colors py-5"
                      >
                        {t(`nav.${item.labelKey}`)}
                      </a>
                    );
                  }

                  return (
                    <div
                      key={item.key}
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(item.key)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-1 text-[15px] font-normal hover:text-gray-300 transition-colors py-5"
                      >
                        {t(`nav.${item.labelKey}`)}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            activeDropdown === item.key ? 'rotate-180' : ''
                          }`}
                        />
                      </Link>

                      {activeDropdown === item.key && (
                        <div className="absolute top-full left-0 z-50">
                          {renderDropdown(item.key)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="hidden lg:flex items-center space-x-3">
                <LanguageSwitcher />
                
                {/* Inline Search Input - Shows when searchOpen is true */}
                {searchOpen ? (
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('searchPlaceholder')}
                      className="w-64 px-4 py-2 pr-10 bg-white text-gray-900 border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none placeholder-gray-500 text-sm"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
                      aria-label="Close search"
                    >
                      <X className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="hover:text-gray-300 transition-colors p-2"
                    aria-label={t('searchButton')}
                  >
                    <Search className="h-5 w-5" strokeWidth={1.75} />
                  </button>
                )}

                <button
                  onClick={() => setSubscribeModalOpen(true)}
                  className="px-4 py-1.5 text-sm font-medium tracking-wide rounded-full border border-white text-white hover:bg-white hover:text-black transition-colors"
                >
                  {t('subscribe')}
                </button>
                <AccountControl />
              </div>

              <div className="flex lg:hidden items-center gap-1.5">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 text-white"
                  aria-label={t('searchButton')}
                >
                  <Search className="h-5 w-5" strokeWidth={1.75} />
                </button>
                <button
                  onClick={() => setSubscribeModalOpen(true)}
                  className="px-3 py-1 text-[13px] font-medium rounded-full border border-white text-white"
                >
                  {t('subscribe')}
                </button>
                <AccountControl compact />
              </div>
            </nav>
          </div>
        </div>

        {/* Mobile Search Panel - Only shown on mobile when search icon is clicked */}
        {searchOpen && (
          <div className="lg:hidden bg-white border-b border-gray-100">
            <div className="container mx-auto px-4 py-3">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full px-4 py-2.5 pr-10 bg-white text-gray-900 border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none placeholder-gray-500 text-sm"
                    autoFocus
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="p-2 text-gray-500 hover:text-gray-900"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-black">
            <div className="container px-4 py-4 space-y-1">
              {NAV.map((item) => {
                if (item.kind === 'external') {
                  return (
                    <a
                      key={item.key}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-base font-normal py-3"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t(`nav.${item.labelKey}`)}
                    </a>
                  );
                }

                return (
                  <div key={item.key}>
                    <button
                      className="flex items-center justify-between w-full text-base font-normal py-3"
                      onClick={() =>
                        setActiveDropdown(activeDropdown === item.key ? null : item.key)
                      }
                    >
                      <span>{t(`nav.${item.labelKey}`)}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          activeDropdown === item.key ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {activeDropdown === item.key && (
                      <div className="mb-3">
                        {renderDropdown(item.key, () => setMobileMenuOpen(false))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="pt-3 border-t border-white/10">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </header>

      <SubscribeModal isOpen={subscribeModalOpen} onClose={() => setSubscribeModalOpen(false)} />
    </>
  );
}
