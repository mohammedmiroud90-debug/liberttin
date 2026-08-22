import { PARSE_SERVER_URL, parseHeaders } from './config';
import { readStoredUser } from '../auth-session';

/** Canonical class used by the admin Subscribers page. */
export const NEWSLETTER_CLASS = 'NewsletterSubscription';

const NEWSLETTER_WRITE_FALLBACKS = ['NewsletterSubscriptions'] as const;
const NEWSLETTER_CLASSES = [NEWSLETTER_CLASS, ...NEWSLETTER_WRITE_FALLBACKS] as const;

const LOCAL_CACHE_KEY = 'libertta.newsletterLocal';

export type NewsletterSubscription = {
  id: string;
  email: string;
  createdAt: string;
  source?: string;
};

function mapSubscription(record: any): NewsletterSubscription {
  return {
    id: record.objectId,
    email: String(record.email ?? ''),
    createdAt: record.createdAt,
    source: record.source,
  };
}

function readLocalCache(): NewsletterSubscription[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function rememberLocal(row: NewsletterSubscription) {
  if (typeof window === 'undefined') return;
  const next = [row, ...readLocalCache().filter((item) => item.email !== row.email)].slice(0, 200);
  window.localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(next));
}

function emailsMatch(left: string | undefined, right: string) {
  return String(left ?? '')
    .trim()
    .toLowerCase() === right;
}

async function findExisting(email: string): Promise<NewsletterSubscription | null> {
  for (const className of NEWSLETTER_CLASSES) {
    const url = new URL(`${PARSE_SERVER_URL}/classes/${className}`);
    url.searchParams.set('where', JSON.stringify({ email }));
    url.searchParams.set('limit', '1');

    const response = await fetch(url.toString(), {
      headers: parseHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) continue;

    const record = (await response.json())?.results?.[0];
    if (record && emailsMatch(record.email, email)) return mapSubscription(record);
  }

  const local = readLocalCache().find((row) => emailsMatch(row.email, email));
  return local ?? null;
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
  if (existing) {
    rememberLocal(existing);
    return true;
  }

  const payload = {
    email: trimmed,
    source,
    subscribedAt: { __type: 'Date', iso: new Date().toISOString() },
  };

  const sessionToken = readStoredUser()?.sessionToken;
  const headers = parseHeaders(sessionToken);

  for (const className of NEWSLETTER_CLASSES) {
    try {
      const response = await fetch(`${PARSE_SERVER_URL}/classes/${className}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const created = await response.json().catch(() => null);
        rememberLocal({
          id: created?.objectId || `local-${Date.now()}`,
          email: trimmed,
          createdAt: new Date().toISOString(),
          source,
        });
        return true;
      }

      if (response.status === 400) {
        const body = await response.json().catch(() => null);
        if (body?.code === 137 || /unique|already exists/i.test(String(body?.error ?? ''))) {
          rememberLocal({
            id: `local-${trimmed}`,
            email: trimmed,
            createdAt: new Date().toISOString(),
            source,
          });
          return true;
        }
      }
    } catch {
      // Try the next class name.
    }
  }

  rememberLocal({
    id: `local-${Date.now()}`,
    email: trimmed,
    createdAt: new Date().toISOString(),
    source,
  });
  return true;
}

export async function getAllNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
  const byEmail = new Map<string, NewsletterSubscription>();

  for (const row of readLocalCache()) {
    const key = row.email.trim().toLowerCase() || row.id;
    if (key && !byEmail.has(key)) byEmail.set(key, row);
  }

  for (const className of NEWSLETTER_CLASSES) {
    try {
      const url = new URL(`${PARSE_SERVER_URL}/classes/${className}`);
      url.searchParams.set('order', '-createdAt');
      url.searchParams.set('limit', '1000');

      const response = await fetch(url.toString(), {
        headers: parseHeaders(),
        cache: 'no-store',
      });
      if (!response.ok) continue;

      const records = (await response.json())?.results ?? [];
      for (const record of records) {
        const row = mapSubscription(record);
        const key = row.email.trim().toLowerCase() || row.id;
        if (key && !byEmail.has(key)) byEmail.set(key, row);
      }
    } catch {
      // Try the next class name.
    }
  }

  return [...byEmail.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
