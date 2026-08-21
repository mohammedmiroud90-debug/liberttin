import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/**
 * Must live at the app root: crawlers only ever request /robots.txt, never a
 * locale-prefixed copy.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin', '/admin/', '/*?q=', '/search'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
