import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { StructuredData } from '@/components/seo/StructuredData';
import { generateSiteSchema } from '@/lib/seo';
import { ScrollButtons } from '@/components/ui/scroll-buttons';
import { NavigationLoaderHost } from '@/components/ui/navigation-loader-host';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { SignInModal } from '@/components/auth/SignInModal';
import { SITE_URL } from '@/lib/site';
import {
  absoluteAssetUrl,
  fetchSeoSettings,
} from '@/lib/blog/seo-settings';
import { fontVariables } from '../fonts';
import '../globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await fetchSeoSettings();
  const ogImage = absoluteAssetUrl(seo.ogImageUrl);
  const favicon = absoluteAssetUrl(seo.faviconUrl);
  const apple = absoluteAssetUrl(seo.appleTouchIconUrl);
  const keywords = seo.keywords
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: seo.siteTitle,
      template: seo.titleTemplate.includes('%s')
        ? seo.titleTemplate
        : `%s | ${seo.siteName}`,
    },
    description: seo.siteDescription,
    keywords,
    authors: [{ name: seo.siteName, url: SITE_URL }],
    creator: seo.siteName,
    publisher: seo.siteName,
    formatDetection: {
      telephone: true,
      email: true,
      address: true,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: SITE_URL,
      title: seo.siteTitle,
      description: seo.siteDescription,
      siteName: seo.siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: seo.siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.siteTitle,
      description: seo.siteDescription,
      creator: seo.twitterHandle,
      site: seo.twitterHandle,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [{ url: favicon }],
      apple: [{ url: apple, sizes: '180x180' }],
      shortcut: favicon,
    },
    manifest: '/manifest.json',
    alternates: {
      canonical: SITE_URL,
      languages: {
        'en-US': `${SITE_URL}/en`,
        'fr-FR': `${SITE_URL}/fr`,
        'ar-SA': `${SITE_URL}/ar`,
        'es-ES': `${SITE_URL}/es`,
        'x-default': `${SITE_URL}/en`,
      },
    },
    category: 'health',
    other: {
      'theme-color': seo.themeColor,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const [messages, seo] = await Promise.all([getMessages(), fetchSeoSettings()]);
  const favicon = absoluteAssetUrl(seo.faviconUrl);
  const apple = absoluteAssetUrl(seo.appleTouchIconUrl);

  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href={favicon} sizes="any" />
        <link rel="shortcut icon" href={favicon} />
        <link rel="apple-touch-icon" href={apple} />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content={seo.themeColor} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://db.onlinewebfonts.com" crossOrigin="anonymous" />
        <link
          href="https://db.onlinewebfonts.com/c/2e5f1a557bc108771d2c29f534ea9152?family=Slow+Tempo+W01+XBold"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Piazzolla:ital,opsz,wght@0,8..30,100..900;1,8..30,100..900&display=swap"
          rel="stylesheet"
        />

        <StructuredData
          id="schema-site"
          data={generateSiteSchema(locale, {
            name: seo.siteName,
            description: seo.siteDescription,
          })}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <NavigationLoaderHost />
            {children}
            <ScrollButtons />
            <SignInModal side="right" />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
