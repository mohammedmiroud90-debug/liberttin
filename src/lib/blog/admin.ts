import { PARSE_SERVER_URL, POST_CLASSES, parseHeaders, slugify } from './config';

export { slugify };

export type AdminPost = {
  id: string;
  className: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  imageUrl: string;
  imageCaption: string;
  adScript: string;
  relatedPosts: string[];
  status: string;
  publishedAt: string;
  updatedAt: string;
};

export type PostInput = {
  title: string;
  content: string;
  category: string;
  excerpt: string;
  slug: string;
  author?: string;
  authorProfilePicture?: string;
  imageUrl?: string;
  imageCaption?: string;
  adScript?: string;
  relatedPosts?: string[];
};

function fileUrl(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.url || '';
}

function toAdminPost(record: any, className: string): AdminPost {
  return {
    id: record.objectId,
    className,
    title: record.title ?? record.name ?? record.headline ?? 'Untitled',
    slug: record.slug ?? '',
    category: record.category ?? record.type ?? record.tag ?? '',
    excerpt: record.excerpt ?? record.summary ?? record.description ?? '',
    content: record.content ?? record.body ?? record.details ?? '',
    author: typeof record.author === 'string' ? record.author : record.author?.username ?? '',
    imageUrl: fileUrl(record.imageUrl ?? record.coverImage ?? record.image ?? record.thumbnail),
    imageCaption: record.imageCaption ?? '',
    adScript: record.adScript ?? '',
    relatedPosts: Array.isArray(record.relatedPosts) ? record.relatedPosts : [],
    status: record.status ?? 'published',
    publishedAt: record.publishedAt?.iso ?? record.publishedAt ?? record.createdAt ?? '',
    updatedAt: record.updatedAt?.iso ?? record.updatedAt ?? '',
  };
}

export async function getAllAdminPosts(): Promise<AdminPost[]> {
  const posts: AdminPost[] = [];
  const seen = new Set<string>();

  for (const className of POST_CLASSES) {
    const url = new URL(`${PARSE_SERVER_URL}/classes/${className}`);
    url.searchParams.set('order', '-publishedAt,-createdAt');
    url.searchParams.set('limit', '500');

    try {
      const response = await fetch(url.toString(), {
        headers: parseHeaders(),
        cache: 'no-store',
      });
      if (!response.ok) continue;

      for (const record of (await response.json())?.results ?? []) {
        if (seen.has(record.objectId)) continue;
        seen.add(record.objectId);
        posts.push(toAdminPost(record, className));
      }
    } catch {
      // Try the next class name.
    }
  }

  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getAdminPostById(id: string): Promise<AdminPost | null> {
  for (const className of POST_CLASSES) {
    try {
      const response = await fetch(`${PARSE_SERVER_URL}/classes/${className}/${id}`, {
        headers: parseHeaders(),
        cache: 'no-store',
      });
      if (response.ok) return toAdminPost(await response.json(), className);
    } catch {
      // Try the next class name.
    }
  }
  return null;
}

function writePayload(data: PostInput): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    title: data.title,
    content: data.content,
    category: data.category || 'General',
    excerpt: data.excerpt || data.title,
    slug: data.slug,
  };

  if (data.author) payload.author = data.author;
  if (data.authorProfilePicture) payload.authorProfilePicture = data.authorProfilePicture;
  if (data.imageUrl) payload.imageUrl = data.imageUrl;
  if (data.imageCaption !== undefined) payload.imageCaption = data.imageCaption;
  if (data.adScript !== undefined) payload.adScript = data.adScript;
  if (data.relatedPosts) payload.relatedPosts = data.relatedPosts;

  return payload;
}

export async function createBlogPost(
  data: PostInput,
  sessionToken?: string
): Promise<string> {
  const payload = {
    ...writePayload(data),
    status: 'published',
    publishedAt: { __type: 'Date', iso: new Date().toISOString() },
  };

  let lastError = 'Could not publish the post.';

  for (const className of POST_CLASSES) {
    try {
      const response = await fetch(`${PARSE_SERVER_URL}/classes/${className}`, {
        method: 'POST',
        headers: parseHeaders(sessionToken),
        body: JSON.stringify(payload),
      });
      if (response.ok) return (await response.json()).objectId;
      lastError = (await response.json().catch(() => null))?.error || lastError;
    } catch (error) {
      lastError = error instanceof Error ? error.message : lastError;
    }
  }

  throw new Error(lastError);
}

export async function updateBlogPost(
  id: string,
  data: PostInput,
  options: { className?: string; sessionToken?: string } = {}
): Promise<void> {
  const payload = {
    ...writePayload(data),
    updatedAt: { __type: 'Date', iso: new Date().toISOString() },
  };

  const classNames = options.className ? [options.className] : [...POST_CLASSES];
  let lastError = 'Could not save the post.';

  for (const className of classNames) {
    try {
      const response = await fetch(`${PARSE_SERVER_URL}/classes/${className}/${id}`, {
        method: 'PUT',
        headers: parseHeaders(options.sessionToken),
        body: JSON.stringify(payload),
      });
      if (response.ok) return;
      lastError = (await response.json().catch(() => null))?.error || lastError;
    } catch (error) {
      lastError = error instanceof Error ? error.message : lastError;
    }
  }

  throw new Error(lastError);
}

export async function deleteBlogPost(
  id: string,
  options: { className?: string; sessionToken?: string } = {}
): Promise<void> {
  const classNames = options.className ? [options.className] : [...POST_CLASSES];
  let lastError = 'Could not delete the post.';

  for (const className of classNames) {
    try {
      const response = await fetch(`${PARSE_SERVER_URL}/classes/${className}/${id}`, {
        method: 'DELETE',
        headers: parseHeaders(options.sessionToken),
      });
      if (response.ok) return;
      lastError = (await response.json().catch(() => null))?.error || lastError;
    } catch (error) {
      lastError = error instanceof Error ? error.message : lastError;
    }
  }

  throw new Error(lastError);
}
