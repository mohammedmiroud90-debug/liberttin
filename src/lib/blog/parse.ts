/**
 * Blog data layer backed by the Parse Server instance shared with brintiel.blog.
 *
 * Posts live in the `Article` class, with `BlogPost` kept as a fallback because
 * older records were written under that name. Every read tries both.
 */

import { slugify } from './config';

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorUsername?: string;
  authorProfilePicture?: string;
  authorBio?: string;
  publishedAt: string;
  updatedAt?: string;
  /** Empty when the post has no cover image; callers should render a text-only card. */
  imageUrl: string;
  imageCaption?: string;
  /** Promo slot set per post in the admin: either an image URL or raw HTML. */
  adScript?: string;
  tags: string[];
  readingTime: number;
  commentsCount: number;
  keyTakeaways: string[];
  factChecker?: string;
};

export type BlogPostsResponse = {
  items: BlogPost[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

export type AuthorProfile = {
  username: string;
  displayName: string;
  bio?: string;
  profilePicture?: string;
};

const PARSE_APP_ID = process.env.PARSE_APP_ID || 'f86207c4cf7bdc08ff889e9d8519bbf3';
const PARSE_JAVASCRIPT_KEY =
  process.env.PARSE_JAVASCRIPT_KEY ||
  '5828916ef66b1aba0ab4efdb2724c00f27a6560ba126509ca1bbccff3a13e56c';
const PARSE_SERVER_URL = process.env.PARSE_SERVER_URL || 'https://backendweb.eollinea.com/parse';

const POST_CLASSES = ['Article', 'BlogPost'] as const;
const DEFAULT_AUTHOR = 'belhachemi_admin';

const LIST_KEYS = [
  'title',
  'slug',
  'excerpt',
  'summary',
  'description',
  'category',
  'type',
  'tag',
  'publishedAt',
  'originalCreatedAt',
  'createdAt',
  'updatedAt',
  'author',
  'authorProfilePicture',
  'coverImage',
  'image',
  'thumbnail',
  'photo',
  'banner',
  'imageUrl',
  'imageCaption',
  'adScript',
  'readingTime',
  'commentsCount',
  'tags',
  'content',
  'body',
  'details',
  'status',
].join(',');

function headers(): Record<string, string> {
  return {
    'X-Parse-Application-Id': PARSE_APP_ID,
    'X-Parse-Javascript-Key': PARSE_JAVASCRIPT_KEY,
    'Content-Type': 'application/json',
  };
}

async function parseQuery(
  className: string,
  params: Record<string, string>,
  revalidate = 60
): Promise<{ results: any[]; count?: number } | null> {
  const url = new URL(`${PARSE_SERVER_URL}/classes/${className}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

  try {
    let response = await fetch(url.toString(), {
      method: 'GET',
      headers: headers(),
      next: { revalidate },
    });

    // A bad `keys` projection is the most common cause of a 4xx here; retry without it.
    if (!response.ok && params.keys) {
      url.searchParams.delete('keys');
      response = await fetch(url.toString(), {
        method: 'GET',
        headers: headers(),
        next: { revalidate },
      });
    }

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Parse query failed for ${className}:`, error);
    return null;
  }
}

function pickString(record: any, keys: string[], fallback = ''): string {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === 'string' && value.trim() !== '') return value.trim();
  }
  return fallback;
}

function pickDate(record: any, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record?.[key];
    if (typeof value === 'string' && value.trim() !== '') return value.trim();
    if (value && typeof value === 'object' && typeof value.iso === 'string') return value.iso;
  }
  return undefined;
}

function pickFileUrl(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'object' && typeof value.url === 'string') return value.url;
  return '';
}

function firstImageFromHtml(html: string): string {
  if (!html) return '';
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1]?.trim() || '';
}

function pickImage(record: any, content = ''): string {
  const keys = ['coverImage', 'image', 'thumbnail', 'photo', 'banner', 'imageUrl'];
  for (const key of keys) {
    const url = pickFileUrl(record?.[key]);
    if (url) return url;
  }
  // Many posts store the hero only inside the HTML body.
  return firstImageFromHtml(content);
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function summarize(source: string, maxLength = 180): string {
  const plain = stripHtml(source);
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength - 3).trimEnd()}...`;
}

function displayNameOf(user: any, fallback: string): string {
  if (!user) return fallback;
  if (typeof user === 'string') return user.trim() || fallback;

  const fullName = [user.firstName, user.lastName]
    .filter((part) => typeof part === 'string' && part.trim())
    .join(' ')
    .trim();
  if (fullName) return fullName;

  for (const key of ['displayName', 'name', 'username']) {
    if (typeof user[key] === 'string' && user[key].trim()) return user[key].trim();
  }
  return fallback;
}

/**
 * Key takeaways render as the bulleted summary box above the article body.
 * Authors can store them explicitly; otherwise we lift the first list in the content.
 */
function extractKeyTakeaways(record: any, content: string): string[] {
  const stored = record?.keyTakeaways ?? record?.keyPoints ?? record?.takeaways;
  if (Array.isArray(stored)) {
    return stored.map((item) => stripHtml(String(item))).filter(Boolean).slice(0, 5);
  }
  if (typeof stored === 'string' && stored.trim()) {
    return stored
      .split(/\r?\n|•/)
      .map((line) => stripHtml(line))
      .filter(Boolean)
      .slice(0, 5);
  }

  const firstList = content.match(/<ul[^>]*>([\s\S]*?)<\/ul>/i);
  if (!firstList) return [];
  const items = firstList[1].match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
  return items.map((item) => stripHtml(item)).filter(Boolean).slice(0, 5);
}

const authorCache = new Map<string, AuthorProfile | null>();

export async function getAuthorProfile(username: string): Promise<AuthorProfile | null> {
  const key = (username || DEFAULT_AUTHOR).trim();
  if (authorCache.has(key)) return authorCache.get(key) ?? null;

  const data = await parseQuery(
    'AuthorProfile',
    { where: JSON.stringify({ username: key }), limit: '1' },
    300
  );
  const record = data?.results?.[0];

  const profile: AuthorProfile | null = record
    ? {
        username: record.username || key,
        displayName: displayNameOf(record, key),
        bio: typeof record.bio === 'string' ? record.bio : undefined,
        profilePicture: pickFileUrl(record.profilePicture) || undefined,
      }
    : null;

  authorCache.set(key, profile);
  return profile;
}

async function mapPost(record: any, includeContent: boolean): Promise<BlogPost> {
  // Always read content for cover fallback; strip it from the returned object on list views.
  const rawContent = pickString(record, ['content', 'body', 'details']);
  const content = includeContent ? rawContent : '';
  const excerpt = pickString(record, ['excerpt', 'summary', 'description', 'shortDescription']);

  const authorField = record.author ?? record.authorId ?? record.createdBy ?? record.user;
  let authorUsername = DEFAULT_AUTHOR;
  if (typeof authorField === 'string' && authorField.trim()) {
    authorUsername = authorField.trim();
  } else if (authorField && typeof authorField === 'object' && authorField.username) {
    authorUsername = authorField.username;
  }

  const profile = await getAuthorProfile(authorUsername);
  const authorName =
    profile?.displayName ?? displayNameOf(authorField, authorUsername);

  const storedReadingTime = Number(record.readingTime) || 0;
  const wordCount = stripHtml(rawContent || excerpt).split(/\s+/).filter(Boolean).length;
  const readingTime =
    storedReadingTime > 0 ? storedReadingTime : Math.max(1, Math.ceil((wordCount || 200) / 200));

  // Dynamically fetch actual comment count instead of relying on stored value
  const { getCommentCount } = await import('./comments');
  const commentsCount = await getCommentCount(record.objectId);

  return {
    id: record.objectId,
    slug: pickString(record, ['slug'], record.objectId),
    title: pickString(record, ['title', 'name', 'headline'], 'Untitled article'),
    excerpt: excerpt || summarize(rawContent),
    content,
    category: pickString(record, ['category', 'type', 'tag'], 'General'),
    author: authorName,
    authorUsername,
    authorProfilePicture:
      pickFileUrl(record.authorProfilePicture) || profile?.profilePicture || undefined,
    authorBio: profile?.bio,
    publishedAt:
      pickDate(record, ['publishedAt', 'originalCreatedAt', 'createdAt', 'date']) ??
      new Date().toISOString(),
    updatedAt: pickDate(record, ['updatedAt', 'modifiedAt']),
    imageUrl: pickImage(record, rawContent),
    imageCaption: pickString(record, ['imageCaption']) || undefined,
    adScript: pickString(record, ['adScript']) || undefined,
    tags: Array.isArray(record.tags)
      ? record.tags.map((tag: unknown) => String(tag)).filter(Boolean)
      : [],
    readingTime,
    commentsCount,
    keyTakeaways: includeContent ? extractKeyTakeaways(record, content) : [],
    factChecker: pickString(record, ['factChecker', 'reviewedBy', 'medicalReviewer']) || undefined,
  };
}

export async function getBlogPosts(page = 1, perPage = 12): Promise<BlogPostsResponse> {
  const empty: BlogPostsResponse = { items: [], total: 0, page, perPage, totalPages: 0 };

  for (const className of POST_CLASSES) {
    const data = await parseQuery(className, {
      where: JSON.stringify({ status: 'published' }),
      order: '-publishedAt',
      limit: String(perPage),
      skip: String((page - 1) * perPage),
      keys: LIST_KEYS,
      count: '1',
    });

    const records = data?.results ?? [];
    if (records.length === 0) continue;

    const total = typeof data?.count === 'number' ? data.count : records.length;
    const items = await Promise.all(records.map((record) => mapPost(record, false)));

    return { items, total, page, perPage, totalPages: Math.ceil(total / perPage) };
  }

  return empty;
}

/** Slug-only listing used by `generateStaticParams`. */
export async function getAllPostSlugs(): Promise<string[]> {
  const slugs = new Set<string>();

  for (const className of POST_CLASSES) {
    const data = await parseQuery(className, {
      where: JSON.stringify({ status: 'published' }),
      limit: '1000',
      keys: 'slug',
    });
    for (const record of data?.results ?? []) {
      if (record.slug) slugs.add(record.slug);
    }
  }

  return [...slugs];
}

/** Slug + timestamps only, used to build sitemap entries. */
export async function getSitemapPosts(): Promise<
  { slug: string; lastModified: Date }[]
> {
  const bySlug = new Map<string, Date>();

  for (const className of POST_CLASSES) {
    const data = await parseQuery(className, {
      where: JSON.stringify({ status: 'published' }),
      limit: '1000',
      order: '-publishedAt',
      keys: 'slug,publishedAt,updatedAt',
    });

    for (const record of data?.results ?? []) {
      if (!record.slug || bySlug.has(record.slug)) continue;

      const stamp =
        record.updatedAt?.iso ?? record.updatedAt ?? record.publishedAt?.iso ?? record.publishedAt;
      const parsed = stamp ? new Date(stamp) : new Date();

      bySlug.set(record.slug, Number.isNaN(parsed.getTime()) ? new Date() : parsed);
    }
  }

  return [...bySlug].map(([slug, lastModified]) => ({ slug, lastModified }));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  for (const className of POST_CLASSES) {
    const data = await parseQuery(className, {
      where: JSON.stringify({ slug, status: 'published' }),
      limit: '1',
      include: 'author,authorId,createdBy,user',
    });

    const record = data?.results?.[0];
    if (record) return mapPost(record, true);
  }

  return null;
}

/** Match category whether it was stored as category, type, or tag. */
function categoryWhere(category: string) {
  return {
    status: 'published',
    $or: [{ category }, { type: category }, { tag: category }],
  };
}

export async function getRelatedPosts(post: BlogPost, limit = 3): Promise<BlogPost[]> {
  for (const className of POST_CLASSES) {
    const data = await parseQuery(className, {
      where: JSON.stringify(categoryWhere(post.category)),
      order: '-publishedAt',
      limit: String(limit + 1),
      keys: LIST_KEYS,
    });

    const records = (data?.results ?? []).filter((record: any) => record.objectId !== post.id);
    if (records.length === 0) continue;

    return Promise.all(records.slice(0, limit).map((record: any) => mapPost(record, false)));
  }

  return [];
}

export async function getBlogPostsByCategory(
  category: string,
  page = 1,
  perPage = 12
): Promise<BlogPostsResponse> {
  const empty: BlogPostsResponse = { items: [], total: 0, page, perPage, totalPages: 0 };
  if (!category.trim()) return empty;

  for (const className of POST_CLASSES) {
    const data = await parseQuery(className, {
      where: JSON.stringify(categoryWhere(category)),
      order: '-publishedAt',
      limit: String(perPage),
      skip: String((page - 1) * perPage),
      keys: LIST_KEYS,
      count: '1',
    });

    const records = data?.results ?? [];
    if (records.length === 0 && !data?.count) continue;

    const total = typeof data?.count === 'number' ? data.count : records.length;
    const items = await Promise.all(records.map((record) => mapPost(record, false)));

    return { items, total, page, perPage, totalPages: Math.ceil(total / perPage) || 0 };
  }

  return empty;
}

export async function getBlogPostsByTag(
  tag: string,
  page = 1,
  perPage = 12
): Promise<BlogPostsResponse> {
  const empty: BlogPostsResponse = { items: [], total: 0, page, perPage, totalPages: 0 };
  if (!tag.trim()) return empty;

  for (const className of POST_CLASSES) {
    const data = await parseQuery(className, {
      where: JSON.stringify({ status: 'published', tags: tag }),
      order: '-publishedAt',
      limit: String(perPage),
      skip: String((page - 1) * perPage),
      keys: LIST_KEYS,
      count: '1',
    });

    const records = data?.results ?? [];
    if (records.length === 0 && !data?.count) continue;

    const total = typeof data?.count === 'number' ? data.count : records.length;
    const items = await Promise.all(records.map((record) => mapPost(record, false)));

    return { items, total, page, perPage, totalPages: Math.ceil(total / perPage) || 0 };
  }

  return empty;
}

async function collectTaxonomy(): Promise<{ categories: string[]; tags: string[] }> {
  const categories = new Map<string, string>();
  const tags = new Map<string, string>();

  for (const className of POST_CLASSES) {
    const data = await parseQuery(className, {
      where: JSON.stringify({ status: 'published' }),
      limit: '1000',
      keys: 'category,type,tag,tags',
    });

    for (const record of data?.results ?? []) {
      const label = pickString(record, ['category', 'type', 'tag'], '');
      if (label) {
        const key = slugify(label);
        if (key && !categories.has(key)) categories.set(key, label);
      }

      if (Array.isArray(record.tags)) {
        for (const raw of record.tags) {
          const tag = String(raw).trim();
          if (!tag) continue;
          const key = slugify(tag);
          if (key && !tags.has(key)) tags.set(key, tag);
        }
      }
    }

    if ((data?.results?.length ?? 0) > 0) break;
  }

  return {
    categories: [...categories.values()].sort((a, b) => a.localeCompare(b)),
    tags: [...tags.values()].sort((a, b) => a.localeCompare(b)),
  };
}

export async function getAllCategories(): Promise<string[]> {
  return (await collectTaxonomy()).categories;
}

export async function getAllTags(): Promise<string[]> {
  return (await collectTaxonomy()).tags;
}

/** Resolve a URL slug back to the canonical category label stored on posts. */
export async function resolveCategoryFromSlug(slug: string): Promise<string | null> {
  const key = slugify(slug);
  if (!key) return null;
  const categories = await getAllCategories();
  return categories.find((label) => slugify(label) === key) ?? null;
}

/** Resolve a URL slug back to the canonical tag label stored on posts. */
export async function resolveTagFromSlug(slug: string): Promise<string | null> {
  const key = slugify(slug);
  if (!key) return null;
  const tags = await getAllTags();
  return tags.find((label) => slugify(label) === key) ?? null;
}

export async function searchBlogPosts(query: string, limit = 20): Promise<BlogPost[]> {
  const term = query.trim();
  if (!term) return [];

  for (const className of POST_CLASSES) {
    const data = await parseQuery(
      className,
      {
        where: JSON.stringify({
          status: 'published',
          $or: [
            { title: { $regex: term, $options: 'i' } },
            { excerpt: { $regex: term, $options: 'i' } },
            { category: { $regex: term, $options: 'i' } },
          ],
        }),
        order: '-publishedAt',
        limit: String(limit),
        keys: LIST_KEYS,
      },
      0
    );

    const records = data?.results ?? [];
    if (records.length === 0) continue;

    return Promise.all(records.map((record: any) => mapPost(record, false)));
  }

  return [];
}

export function formatPostDate(iso: string, locale = 'en'): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  // Route segments are not guaranteed to be valid BCP-47 tags, and an unknown
  // one throws rather than falling back.
  try {
    return date.toLocaleDateString(locale, options);
  } catch {
    return date.toLocaleDateString('en', options);
  }
}
