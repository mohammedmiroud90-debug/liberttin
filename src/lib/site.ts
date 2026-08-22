/**
 * Canonical origin for the blog. Everything SEO-facing (metadataBase, canonical
 * URLs, hreflang, sitemap, robots, JSON-LD) reads from here so the domain is
 * changed in exactly one place.
 *
 * Safe in both Node and the browser (Astro/Vite client islands) — never touch
 * bare `process.env` at module top-level.
 */
function readEnv(name: string): string | undefined {
  try {
    const meta = import.meta.env as Record<string, string | undefined> | undefined;
    if (meta?.[name]) return meta[name];
    if (meta?.[`PUBLIC_${name}`]) return meta[`PUBLIC_${name}`];
    if (meta?.[`NEXT_PUBLIC_${name}`]) return meta[`NEXT_PUBLIC_${name}`];
  } catch {
    /* import.meta.env may be unavailable in some runtimes */
  }
  if (typeof process !== 'undefined' && process.env) {
    return (
      process.env[`NEXT_PUBLIC_${name}`] ||
      process.env[`PUBLIC_${name}`] ||
      process.env[name]
    );
  }
  return undefined;
}

export const SITE_URL = (
  readEnv('SITE_URL') || 'https://libertta.blog'
).replace(/\/+$/, '');

export const SITE_NAME = 'Libertta';

export const SITE_DESCRIPTION =
  'Stories, ideas, and practical writing from Libertta.';

/** Default document title used across metadata and Open Graph. */
export const SITE_TITLE = 'Libertta';

/** Title template suffix: `Article | Libertta`. */
export const SITE_TITLE_TEMPLATE = '%s | Libertta';

/**
 * Sign-in drawer side. Change to `'left'` or `'right'`, or set
 * `NEXT_PUBLIC_SIGN_IN_PANEL_SIDE=left|right` / `PUBLIC_SIGN_IN_PANEL_SIDE`.
 */
export type SignInPanelSide = 'left' | 'right';

function resolveSignInPanelSide(): SignInPanelSide {
  const fromEnv = readEnv('SIGN_IN_PANEL_SIDE')?.trim().toLowerCase();
  if (fromEnv === 'left' || fromEnv === 'right') return fromEnv;
  return 'right';
}

export const SIGN_IN_PANEL_SIDE: SignInPanelSide = resolveSignInPanelSide();

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
