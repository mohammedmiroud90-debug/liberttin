import { PARSE_SERVER_URL, parseHeaders } from './config';

export type ParseUser = {
  objectId: string;
  username: string;
  email: string;
  sessionToken: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  profilePicture?: string | { url?: string };
  [key: string]: unknown;
};

const ADMIN_EMAILS = ['belhachemiamohammed@inbox.eu'];
const ADMIN_USERNAMES = ['belhachemiamohammed', 'belhachemi_admin'];

export function isAdminUser(user: { email?: string; username?: string } | null): boolean {
  if (!user) return false;
  if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) return true;
  if (user.username && ADMIN_USERNAMES.includes(user.username.toLowerCase())) return true;
  return false;
}

export function userDisplayName(user: ParseUser | null): string {
  if (!user) return 'Guest';
  const full = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  return full || user.displayName || user.username || 'Guest';
}

export function profilePictureUrl(user: ParseUser | null): string | undefined {
  const picture = user?.profilePicture;
  if (!picture) return undefined;
  if (typeof picture === 'string') return picture;
  return picture.url;
}

/** Parse only logs in by username, so an email attempt resolves the username first. */
export async function loginUser(emailOrUsername: string, password: string): Promise<ParseUser> {
  const attempt = async (username: string) => {
    const url = new URL(`${PARSE_SERVER_URL}/login`);
    url.searchParams.set('username', username);
    url.searchParams.set('password', password);
    return fetch(url.toString(), { method: 'GET', headers: parseHeaders() });
  };

  let response = await attempt(emailOrUsername);

  if (!response.ok && emailOrUsername.includes('@')) {
    const lookup = new URL(`${PARSE_SERVER_URL}/users`);
    lookup.searchParams.set('where', JSON.stringify({ email: emailOrUsername }));
    lookup.searchParams.set('limit', '1');

    const found = await fetch(lookup.toString(), { headers: parseHeaders() });
    const username = found.ok ? (await found.json())?.results?.[0]?.username : null;
    if (username) response = await attempt(username);
  }

  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.error || 'Invalid email or password.');
  }

  return response.json();
}

export async function signupUser(
  username: string,
  password: string,
  email: string
): Promise<ParseUser> {
  const response = await fetch(`${PARSE_SERVER_URL}/users`, {
    method: 'POST',
    headers: parseHeaders(),
    body: JSON.stringify({ username, password, email }),
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.error || 'Could not create that account.');
  }

  const created = await response.json();
  return { username, email, ...created };
}

export async function fetchCurrentUser(sessionToken: string): Promise<ParseUser | null> {
  try {
    const response = await fetch(`${PARSE_SERVER_URL}/users/me`, {
      headers: parseHeaders(sessionToken),
      cache: 'no-store',
    });
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
}
