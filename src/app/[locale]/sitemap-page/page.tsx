'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Home, Users, Heart, Phone, LogIn, Activity, TestTube } from 'lucide-react';
import { HUBS } from '@/lib/content-pages';

export default function SitemapPage() {
  const tHeader = useTranslations('Header');
  const tContent = useTranslations('ContentPages');
  const menus = tHeader.raw('menus') as Record<string, Record<string, string>>;
  const andMore = tHeader('menus.andMore');

  const sitemapSections = [
    {
      title: 'Billiant',
      icon: Home,
      links: [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
        { href: '/doctors', label: 'Find a Doctor' },
        { href: '/resources', label: andMore },
      ],
    },
    {
      title: menus.healthConditions?.title,
      icon: Heart,
      links: [
        { href: '/conditions', label: menus.healthConditions?.title },
        ...HUBS[0].pages.map((page) => ({
          href: `/conditions/${page.slug}`,
          label: menus.healthConditions?.[page.item],
        })),
      ],
    },
    {
      title: menus.wellness?.title,
      icon: Activity,
      links: [
        { href: '/wellness', label: menus.wellness?.title },
        ...HUBS[1].pages.map((page) => ({
          href: `/wellness/${page.slug}`,
          label: menus.wellness?.[page.item],
        })),
      ],
    },
    {
      title: menus.tools?.title,
      icon: TestTube,
      links: [
        { href: '/tools', label: menus.tools?.title },
        ...HUBS[2].pages.map((page) => ({
          href: `/tools/${page.slug}`,
          label: menus.tools?.[page.item],
        })),
        { href: '/eclipse-llm', label: menus.tools?.remoteDiagnostics },
      ],
    },
    {
      title: menus.featured?.title,
      icon: Users,
      links: [
        { href: '/featured', label: menus.featured?.title },
        ...HUBS[3].pages.map((page) => ({
          href: `/featured/${page.slug}`,
          label: menus.featured?.[page.item],
        })),
      ],
    },
    {
      title: tHeader('signIn'),
      icon: LogIn,
      links: [
        { href: '/login', label: tHeader('signIn') },
        { href: '/register', label: tHeader('signUp') },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Sitemap</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {tContent('ui.resourcesSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {sitemapSections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.title}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Icon className="h-6 w-6 text-teal-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                </div>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-700 hover:text-teal-600 hover:translate-x-1 transition-all flex items-center gap-2 py-1.5 group"
                      >
                        <span className="w-1.5 h-1.5 bg-teal-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center bg-teal-600 text-white rounded-2xl p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-3">{tHeader('signIn')}</h3>
          <p className="text-teal-100 mb-6">{menus.healthConditions?.blurb}</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
          >
            <Phone className="h-5 w-5" />
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}

