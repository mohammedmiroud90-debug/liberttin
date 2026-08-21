import { PARSE_SERVER_URL, parseHeaders } from './config';

/** Canonical class used by the admin Subscribers page. */
export const NEWSLETTER_CLASS = 'NewsletterSubscription';

/** Older / alternate spellings kept as a write fallback only. */
const NEWSLETTER_WRITE_FALLBACKS = ['NewsletterSubscriptions'] as const;

export type NewsletterSubscription = {
  id: string;
  email: string;
  createdAt: string;
  source?: string;
};

async function findExisting(email: string): Promise<NewsletterSubscription | null> {
  const url = new URL(`${PARSE_SERVER_URL}/classes/${NEWSLETTER_CLASS}`);
  url.searchParams.set('where', JSON.stringify({ email }));
  url.searchParams.set('limit', '1');

  const response = await fetch(url.toString(), {
    headers: parseHeaders(),
    cache: 'no-store',
  });
  if (!response.ok) return null;

  const record = (await response.json())?.results?.[0];
  if (!record) return null;

  return {
    id: record.objectId,
    email: record.email,
    createdAt: record.createdAt,
    source: record.source,
  };
}

/**
 * Writes a row into the NewsletterSubscription Parse table (same table the
 * admin Subscribers page reads). Duplicate emails are treated as success so
 * the visitor still sees a confirmation.
 */
export async function addNewsletterSubscription(
  email: string,
  source = 'blog'
): Promise<boolean> {
  const trimmed = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    throw new Error('Enter a valid email address.');
  }

  const existing = await findExisting(trimmed);
  if (existing) return true;

  const payload = {
    email: trimmed,
    source,
    subscribedAt: { __type: 'Date', iso: new Date().toISOString() },
  };

  const classes = [NEWSLETTER_CLASS, ...NEWSLETTER_WRITE_FALLBACKS] as const;

  for (const className of classes) {
    try {
      const response = await fetch(`${PARSE_SERVER_URL}/classes/${className}`, {
        method: 'POST',
        headers: parseHeaders(),
        body: JSON.stringify(payload),
      });
      if (response.ok) return true;

      // Unique-index collision still means the email is on the list.
      if (response.status === 400) {
        const body = await response.json().catch(() => null);
        if (body?.code === 137 || /unique|already exists/i.test(String(body?.error ?? ''))) {
          return true;
        }
      }
    } catch {
      // Try the next class name.
    }
  }

  throw new Error('Subscription failed. Please try again.');
}

export async function getAllNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
  const url = new URL(`${PARSE_SERVER_URL}/classes/${NEWSLETTER_CLASS}`);
  url.searchParams.set('order', '-createdAt');
  url.searchParams.set('limit', '1000');

  try {
    const response = await fetch(url.toString(), {
      headers: parseHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) return [];

    const records = (await response.json())?.results ?? [];
    return records.map((record: any) => ({
      id: record.objectId,
      email: String(record.email ?? ''),
      createdAt: record.createdAt,
      source: record.source,
    }));
  } catch {
    return [];
  }
}
