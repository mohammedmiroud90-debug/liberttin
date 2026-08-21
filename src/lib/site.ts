/**
 * Canonical origin for the blog. Everything SEO-facing (metadataBase, canonical
 * URLs, hreflang, sitemap, robots, JSON-LD) reads from here so the domain is
 * changed in exactly one place.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://billiant.blog'
).replace(/\/+$/, '');

export const SITE_NAME = 'Billiant';

export const SITE_DESCRIPTION =
  'Research-backed health and wellness reporting — clear, fact-checked guidance you can act on.';

/** Default document title used across metadata and Open Graph. */
export const SITE_TITLE = 'Billiant — Health, Wellness and Research Reporting';

/** Title template suffix: `Article | Billiant`. */
export const SITE_TITLE_TEMPLATE = '%s | Billiant';

/**
 * Sign-in drawer side. Change to `'left'` or `'right'`, or set
 * `NEXT_PUBLIC_SIGN_IN_PANEL_SIDE=left|right` in `.env.local`.
 */
export type SignInPanelSide = 'left' | 'right';

function resolveSignInPanelSide(): SignInPanelSide {
  const fromEnv = process.env.NEXT_PUBLIC_SIGN_IN_PANEL_SIDE?.trim().toLowerCase();
  if (fromEnv === 'left' || fromEnv === 'right') return fromEnv;
  return 'right';
}

export const SIGN_IN_PANEL_SIDE: SignInPanelSide = resolveSignInPanelSide();

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
