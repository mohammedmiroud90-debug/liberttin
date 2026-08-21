/**
 * Parse Server connection shared by server and client code.
 *
 * The JS key is a public client credential (Parse gates writes with class-level
 * permissions), so the NEXT_PUBLIC_ / PUBLIC_ variants are safe to expose in the browser.
 */
function env(name: string): string | undefined {
  try {
    const meta = import.meta.env as Record<string, string | undefined>;
    if (meta?.[name]) return meta[name];
    if (meta?.[`PUBLIC_${name}`]) return meta[`PUBLIC_${name}`];
  } catch {
    /* SSR / Node may not expose import.meta.env the same way */
  }
  if (typeof process !== "undefined" && process.env) {
    return (
      process.env[`NEXT_PUBLIC_${name}`] ||
      process.env[`PUBLIC_${name}`] ||
      process.env[name]
    );
  }
  return undefined;
}

export const PARSE_SERVER_URL =
  env("PARSE_SERVER_URL") || "https://backendweb.eollinea.com/parse";

export const PARSE_APP_ID =
  env("PARSE_APP_ID") || "f86207c4cf7bdc08ff889e9d8519bbf3";

export const PARSE_JAVASCRIPT_KEY =
  env("PARSE_JAVASCRIPT_KEY") ||
  "5828916ef66b1aba0ab4efdb2724c00f27a6560ba126509ca1bbccff3a13e56c";

/** Post records were written under both class names over time. */
export const POST_CLASSES = ['Article', 'BlogPost'] as const;
export const COMMENT_CLASSES = ['Comment', 'BlogComment'] as const;

export function parseHeaders(sessionToken?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'X-Parse-Application-Id': PARSE_APP_ID,
    'X-Parse-Javascript-Key': PARSE_JAVASCRIPT_KEY,
    'Content-Type': 'application/json',
  };
  if (sessionToken) headers['X-Parse-Session-Token'] = sessionToken;
  return headers;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Public archive URL for a post category label. */
export function categoryPath(category: string): string {
  return `/category/${slugify(category)}`;
}

/** Public archive URL for a post tag label. */
export function tagPath(tag: string): string {
  return `/tag/${slugify(tag)}`;
}
