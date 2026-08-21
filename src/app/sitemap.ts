import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { HUBS } from '@/lib/content-pages';
import { categoryPath, slugify, tagPath } from '@/lib/blog/config';
import { getAllCategories, getAllTags, getSitemapPosts } from '@/lib/blog/parse';
import { SITE_URL } from '@/lib/site';

export const revalidate = 3600;

const LOCALES = routing.locales;
const DEFAULT_LOCALE = routing.defaultLocale;

/** Marketing/evergreen routes that exist under every locale. */
const STATIC_PATHS = [
  '',
  '/about',
  '/contact',
  '/resources',
  '/conditions',
  '/wellness',
  '/tools',
  '/featured',
  '/living-well',
  '/mental-wellbeing',
  '/sitemap-page',
  ...HUBS.flatMap((hub) => [hub.path, ...hub.pages.map((page) => `${hub.path}/${page.slug}`)]),
];

function localeAlternates(path: string) {
  return {
    languages: Object.fromEntries(
      LOCALES.map((locale) => [locale, `${SITE_URL}/${locale}${path}`])
    ),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const path of new Set(STATIC_PATHS)) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1 : path.split('/').length <= 2 ? 0.8 : 0.6,
        alternates: localeAlternates(path),
      });
    }
  }

  // Posts are authored once in English and served under every locale prefix, so
  // only the default-locale URL is submitted to avoid duplicate content.
  let posts: { slug: string; lastModified: Date }[] = [];
  let categories: string[] = [];
  let tags: string[] = [];
  try {
    [posts, categories, tags] = await Promise.all([
      getSitemapPosts(),
      getAllCategories(),
      getAllTags(),
    ]);
  } catch {
    // A backend hiccup should still yield a valid sitemap of static routes.
  }

  for (const post of posts) {
    entries.push({
      url: `${SITE_URL}/${DEFAULT_LOCALE}/blog/${post.slug}`,
      lastModified: post.lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    });
  }

  for (const category of categories) {
    const path = categoryPath(category);
    if (!slugify(category)) continue;
    entries.push({
      url: `${SITE_URL}/${DEFAULT_LOCALE}${path}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  for (const tag of tags) {
    const path = tagPath(tag);
    if (!slugify(tag)) continue;
    entries.push({
      url: `${SITE_URL}/${DEFAULT_LOCALE}${path}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }

  return entries;
}
