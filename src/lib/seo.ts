import { Metadata } from 'next';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from '@/lib/site';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  locale?: string;
}

const defaultMetadata = {
  siteName: SITE_NAME,
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: '/og-image.jpg',
  keywords: [
    'health blog',
    'wellness articles',
    'medically reviewed',
    'health research',
    'nutrition',
    'mental health',
    'evidence-based health',
    'wellbeing',
  ],
};

export function generateMetadata({
  title,
  description = defaultMetadata.description,
  keywords = defaultMetadata.keywords,
  image = defaultMetadata.image,
  url = defaultMetadata.url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  locale = 'en_US',
}: SEOProps = {}): Metadata {
  const fullTitle = title
    ? `${title} | ${defaultMetadata.siteName}`
    : defaultMetadata.title;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
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
    openGraph: {
      type,
      siteName: defaultMetadata.siteName,
      title: fullTitle,
      description,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@billiant',
      site: '@billiant',
    },
    alternates: {
      canonical: url,
      languages: {
        'en-US': `${url}/en`,
        'fr-FR': `${url}/fr`,
        'ar-SA': `${url}/ar`,
        'es-ES': `${url}/es`,
      },
    },
    verification: {
      google: 'your-google-verification-code',
      // Add other verification codes as needed
    },
  };

  return metadata;
}

/**
 * Site-level graph: the publisher, the site itself (with the sitelinks search
 * box), and the blog. Emitted once from the root layout.
 */
export function generateSiteSchema(
  locale: string = 'en',
  overrides?: { name?: string; description?: string }
) {
  const name = overrides?.name || SITE_NAME;
  const description = overrides?.description || SITE_DESCRIPTION;

  const publisher = {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/BRAND.png`,
    },
    sameAs: [
      'https://www.facebook.com/billiant',
      'https://twitter.com/billiant',
      'https://www.linkedin.com/company/billiant',
      'https://www.instagram.com/billiant',
    ],
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      publisher,
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name,
        description,
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: locale,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/${locale}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Blog',
        '@id': `${SITE_URL}/#blog`,
        url: `${SITE_URL}/${locale}`,
        name,
        description,
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: locale,
      },
    ],
  };
}

/** Article graph for a single post page. */
export function generateArticleSchema(post: {
  title: string;
  description: string;
  slug: string;
  locale: string;
  image?: string;
  author: string;
  publishedAt?: string;
  updatedAt?: string;
  reviewedBy?: string;
  /** Site-wide OG fallback when the post has no cover. */
  fallbackImage?: string;
}) {
  const url = `${SITE_URL}/${post.locale}/blog/${post.slug}`;
  const fallbackImage = post.fallbackImage || `${SITE_URL}/og-image.jpg`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: post.title.slice(0, 110),
    description: post.description,
    url,
    image: post.image ? [post.image] : [fallbackImage],
    author: { '@type': 'Person', name: post.author },
    publisher: { '@id': `${SITE_URL}/#organization` },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    inLanguage: post.locale,
    isAccessibleForFree: true,
    ...(post.reviewedBy && {
      reviewedBy: { '@type': 'Person', name: post.reviewedBy },
    }),
  };
}

export function generateDoctorSchema(doctor: {
  id: string;
  name: string;
  specialization: string[];
  image?: string;
  rating?: number;
  reviewCount?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: doctor.name,
    image: doctor.image || '/default-doctor.jpg',
    medicalSpecialty: doctor.specialization,
    ...(doctor.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: doctor.rating,
        reviewCount: doctor.reviewCount || 0,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
