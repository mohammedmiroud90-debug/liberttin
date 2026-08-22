import { PARSE_SERVER_URL, parseHeaders } from './config';
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_TITLE_TEMPLATE,
  SITE_URL,
} from '@/lib/site';

/**
 * Site-wide SEO / brand assets edited from the admin settings page.
 * Stored in Parse `SiteSettings` under key `site-seo` so every visitor
 * picks up the same favicon, title, and Open Graph image.
 */

export const SEO_SETTINGS_CLASS = 'SiteSettings';
export const SEO_SETTINGS_KEY = 'site-seo';
export const SEO_SETTINGS_CACHE_KEY = 'billiant.seoSettings';
export const SEO_SETTINGS_EVENT = 'seoSettingsUpdated';

export type HomeLayoutId = 'classic' | 'medium';

export type LogoType = 'image' | 'text';

export type LogoFontFamily = 
  | 'Libertinage'
  | 'Libertinage-a'
  | 'Libertinage-b'
  | 'Libertinage-c'
  | 'Libertinage-d'
  | 'Libertinage-e'
  | 'Libertinage-f'
  | 'Libertinage-g'
  | 'Libertinage-h'
  | 'Libertinage-i'
  | 'Libertinage-j'
  | 'Libertinage-k'
  | 'Libertinage-l'
  | 'Libertinage-m'
  | 'Libertinage-n'
  | 'Libertinage-o'
  | 'Libertinage-p'
  | 'Libertinage-q'
  | 'Libertinage-r'
  | 'Libertinage-s'
  | 'Libertinage-t'
  | 'Libertinage-u'
  | 'Libertinage-v'
  | 'Libertinage-w'
  | 'Libertinage-x'
  | 'Libertinage-y'
  | 'Libertinage-z'
  | 'AdoraMICRO-45'
  | 'AdoraMICRO-46'
  | 'AdoraMICRO-55'
  | 'AdoraMICRO-56'
  | 'AdoraMICRO-65'
  | 'AdoraMICRO-66'
  | 'AdoraMICRO-75'
  | 'AdoraMICRO-76'
  | 'AdoraMICRO-85'
  | 'AdoraMICRO-86'
  | 'AdoraMICRO-95'
  | 'AdoraMICRO-96'
  | 'Charter-Regular'
  | 'Charter-Bold'
  | 'Charter-Italic'
  | 'Charter-BoldItalic'
  | 'GeogrotesqueCyr'
  | 'ProximaNova';

export type LogoSettings = {
  type: LogoType;
  imageUrl: string;
  text: string;
  fontFamily: LogoFontFamily;
  fontSize: number;
  fontWeight: number;
  color: string;
  colorDark: string;
  /** Scale multiplier for logo size (0.5 = 50%, 1.5 = 150%, 2 = 200%) */
  scale: number;
};

export type SeoSettings = {
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  titleTemplate: string;
  keywords: string;
  faviconUrl: string;
  appleTouchIconUrl: string;
  ogImageUrl: string;
  twitterHandle: string;
  themeColor: string;
  /** Which homepage list style powers `/`. */
  homeLayout: HomeLayoutId;
  /** Logo configuration */
  logo: LogoSettings;
};

export const HOME_LAYOUT_OPTIONS: {
  id: HomeLayoutId;
  label: string;
  description: string;
  previewPath: string;
}[] = [
  {
    id: 'classic',
    label: 'Classic cards',
    description: 'Grey card rows with blue headlines (original home).',
    previewPath: '/',
  },
  {
    id: 'medium',
    label: 'Medium feed',
    description: 'Simple title / meta / excerpt rows with hairline dividers.',
    previewPath: '/home2',
  },
];

export const LOGO_FONT_OPTIONS: {
  id: LogoFontFamily;
  label: string;
  path: string;
  format: string;
}[] = [
  // Libertinage Fonts (Fontlogo folder)
  { id: 'Libertinage', label: 'Libertinage', path: '/Fontlogo/Libertinage.ttf', format: 'truetype' },
  { id: 'Libertinage-a', label: 'Libertinage A', path: '/Fontlogo/Libertinage-a.ttf', format: 'truetype' },
  { id: 'Libertinage-b', label: 'Libertinage B', path: '/Fontlogo/Libertinage-b.ttf', format: 'truetype' },
  { id: 'Libertinage-c', label: 'Libertinage C', path: '/Fontlogo/Libertinage-c.ttf', format: 'truetype' },
  { id: 'Libertinage-d', label: 'Libertinage D', path: '/Fontlogo/Libertinage-d.ttf', format: 'truetype' },
  { id: 'Libertinage-e', label: 'Libertinage E', path: '/Fontlogo/Libertinage-e.ttf', format: 'truetype' },
  { id: 'Libertinage-f', label: 'Libertinage F', path: '/Fontlogo/Libertinage-f.ttf', format: 'truetype' },
  { id: 'Libertinage-g', label: 'Libertinage G', path: '/Fontlogo/Libertinage-g.ttf', format: 'truetype' },
  { id: 'Libertinage-h', label: 'Libertinage H', path: '/Fontlogo/Libertinage-h.ttf', format: 'truetype' },
  { id: 'Libertinage-i', label: 'Libertinage I', path: '/Fontlogo/Libertinage-i.ttf', format: 'truetype' },
  { id: 'Libertinage-j', label: 'Libertinage J', path: '/Fontlogo/Libertinage-j.ttf', format: 'truetype' },
  { id: 'Libertinage-k', label: 'Libertinage K', path: '/Fontlogo/Libertinage-k.ttf', format: 'truetype' },
  { id: 'Libertinage-l', label: 'Libertinage L', path: '/Fontlogo/Libertinage-l.ttf', format: 'truetype' },
  { id: 'Libertinage-m', label: 'Libertinage M', path: '/Fontlogo/Libertinage-m.ttf', format: 'truetype' },
  { id: 'Libertinage-n', label: 'Libertinage N', path: '/Fontlogo/Libertinage-n.ttf', format: 'truetype' },
  { id: 'Libertinage-o', label: 'Libertinage O', path: '/Fontlogo/Libertinage-o.ttf', format: 'truetype' },
  { id: 'Libertinage-p', label: 'Libertinage P', path: '/Fontlogo/Libertinage-p.ttf', format: 'truetype' },
  { id: 'Libertinage-q', label: 'Libertinage Q', path: '/Fontlogo/Libertinage-q.ttf', format: 'truetype' },
  { id: 'Libertinage-r', label: 'Libertinage R', path: '/Fontlogo/Libertinage-r.ttf', format: 'truetype' },
  { id: 'Libertinage-s', label: 'Libertinage S', path: '/Fontlogo/Libertinage-s.ttf', format: 'truetype' },
  { id: 'Libertinage-t', label: 'Libertinage T', path: '/Fontlogo/Libertinage-t.ttf', format: 'truetype' },
  { id: 'Libertinage-u', label: 'Libertinage U', path: '/Fontlogo/Libertinage-u.ttf', format: 'truetype' },
  { id: 'Libertinage-v', label: 'Libertinage V', path: '/Fontlogo/Libertinage-v.ttf', format: 'truetype' },
  { id: 'Libertinage-w', label: 'Libertinage W', path: '/Fontlogo/Libertinage-w.ttf', format: 'truetype' },
  { id: 'Libertinage-x', label: 'Libertinage X', path: '/Fontlogo/Libertinage-x.ttf', format: 'truetype' },
  { id: 'Libertinage-y', label: 'Libertinage Y', path: '/Fontlogo/Libertinage-y.ttf', format: 'truetype' },
  { id: 'Libertinage-z', label: 'Libertinage Z', path: '/Fontlogo/Libertinage-z.ttf', format: 'truetype' },
  // AdoraMICRO Fonts (NEWFONT folder)
  { id: 'AdoraMICRO-45', label: 'Adora MICRO 45', path: '/NEWFONT/AdoraMICRO-45.otf', format: 'opentype' },
  { id: 'AdoraMICRO-46', label: 'Adora MICRO 46', path: '/NEWFONT/AdoraMICRO-46.otf', format: 'opentype' },
  { id: 'AdoraMICRO-55', label: 'Adora MICRO 55', path: '/NEWFONT/AdoraMICRO-55.otf', format: 'opentype' },
  { id: 'AdoraMICRO-56', label: 'Adora MICRO 56', path: '/NEWFONT/AdoraMICRO-56.otf', format: 'opentype' },
  { id: 'AdoraMICRO-65', label: 'Adora MICRO 65', path: '/NEWFONT/AdoraMICRO-65.otf', format: 'opentype' },
  { id: 'AdoraMICRO-66', label: 'Adora MICRO 66', path: '/NEWFONT/AdoraMICRO-66.otf', format: 'opentype' },
  { id: 'AdoraMICRO-75', label: 'Adora MICRO 75', path: '/NEWFONT/AdoraMICRO-75.otf', format: 'opentype' },
  { id: 'AdoraMICRO-76', label: 'Adora MICRO 76', path: '/NEWFONT/AdoraMICRO-76.otf', format: 'opentype' },
  { id: 'AdoraMICRO-85', label: 'Adora MICRO 85', path: '/NEWFONT/AdoraMICRO-85.otf', format: 'opentype' },
  { id: 'AdoraMICRO-86', label: 'Adora MICRO 86', path: '/NEWFONT/AdoraMICRO-86.otf', format: 'opentype' },
  { id: 'AdoraMICRO-95', label: 'Adora MICRO 95', path: '/NEWFONT/AdoraMICRO-95.otf', format: 'opentype' },
  { id: 'AdoraMICRO-96', label: 'Adora MICRO 96', path: '/NEWFONT/AdoraMICRO-96.otf', format: 'opentype' },
  // Charter Fonts
  { id: 'Charter-Regular', label: 'Charter Regular', path: '/Charter Regular.otf', format: 'opentype' },
  { id: 'Charter-Bold', label: 'Charter Bold', path: '/Charter Bold.otf', format: 'opentype' },
  { id: 'Charter-Italic', label: 'Charter Italic', path: '/Charter Italic.otf', format: 'opentype' },
  { id: 'Charter-BoldItalic', label: 'Charter Bold Italic', path: '/Charter Bold Italic.otf', format: 'opentype' },
  // Other Fonts
  { id: 'GeogrotesqueCyr', label: 'Geogrotesque Cyr', path: '/GeogrotesqueCyr-Regular.ttf', format: 'truetype' },
  { id: 'ProximaNova', label: 'Proxima Nova', path: '/ProximaNovaRegular.ttf', format: 'truetype' },
];

export const DEFAULT_LOGO_SETTINGS: LogoSettings = {
  type: 'text',
  imageUrl: '/BRAND.png',
  text: 'Libertta',
  fontFamily: 'Libertinage',
  fontSize: 36,
  fontWeight: 700,
  color: '#000000',
  colorDark: '#ffffff',
  scale: 1,
};

export const DEFAULT_SEO_SETTINGS: SeoSettings = {
  siteName: SITE_NAME,
  siteTitle: SITE_TITLE,
  siteDescription: SITE_DESCRIPTION,
  titleTemplate: SITE_TITLE_TEMPLATE,
  keywords:
    'health blog, wellness articles, medically reviewed, health research, nutrition, mental health, fitness, evidence-based health, wellbeing',
  faviconUrl: '/favicon.ico',
  appleTouchIconUrl: '/apple-touch-icon.png',
  ogImageUrl: '/og-image.jpg',
  twitterHandle: '@billiant',
  themeColor: '#0D9488',
  homeLayout: 'classic',
  logo: DEFAULT_LOGO_SETTINGS,
};

function cleanString(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function normalizeLogo(raw: Partial<LogoSettings> | null | undefined): LogoSettings {
  const merged = { ...DEFAULT_LOGO_SETTINGS, ...(raw ?? {}) };
  const type: LogoType = merged.type === 'text' || merged.type === 'image' ? merged.type : 'image';
  const scale = typeof merged.scale === 'number' && merged.scale > 0 ? merged.scale : DEFAULT_LOGO_SETTINGS.scale;
  
  return {
    type,
    imageUrl: cleanString(merged.imageUrl, DEFAULT_LOGO_SETTINGS.imageUrl),
    text: cleanString(merged.text, DEFAULT_LOGO_SETTINGS.text),
    fontFamily: merged.fontFamily || DEFAULT_LOGO_SETTINGS.fontFamily,
    fontSize: typeof merged.fontSize === 'number' && merged.fontSize > 0 ? merged.fontSize : DEFAULT_LOGO_SETTINGS.fontSize,
    fontWeight: typeof merged.fontWeight === 'number' ? merged.fontWeight : DEFAULT_LOGO_SETTINGS.fontWeight,
    color: cleanString(merged.color, DEFAULT_LOGO_SETTINGS.color),
    colorDark: cleanString(merged.colorDark, DEFAULT_LOGO_SETTINGS.colorDark),
    scale,
  };
}

function normalize(raw: Partial<SeoSettings> | null | undefined): SeoSettings {
  const merged = { ...DEFAULT_SEO_SETTINGS, ...(raw ?? {}) };
  const homeLayout: HomeLayoutId =
    merged.homeLayout === 'medium' || merged.homeLayout === 'classic'
      ? merged.homeLayout
      : DEFAULT_SEO_SETTINGS.homeLayout;

  return {
    siteName: cleanString(merged.siteName, DEFAULT_SEO_SETTINGS.siteName),
    siteTitle: cleanString(merged.siteTitle, DEFAULT_SEO_SETTINGS.siteTitle),
    siteDescription: cleanString(merged.siteDescription, DEFAULT_SEO_SETTINGS.siteDescription),
    titleTemplate: cleanString(merged.titleTemplate, DEFAULT_SEO_SETTINGS.titleTemplate),
    keywords: cleanString(merged.keywords, DEFAULT_SEO_SETTINGS.keywords),
    faviconUrl: cleanString(merged.faviconUrl, DEFAULT_SEO_SETTINGS.faviconUrl),
    appleTouchIconUrl: cleanString(
      merged.appleTouchIconUrl,
      DEFAULT_SEO_SETTINGS.appleTouchIconUrl
    ),
    ogImageUrl: cleanString(merged.ogImageUrl, DEFAULT_SEO_SETTINGS.ogImageUrl),
    twitterHandle: cleanString(merged.twitterHandle, DEFAULT_SEO_SETTINGS.twitterHandle),
    themeColor: cleanString(merged.themeColor, DEFAULT_SEO_SETTINGS.themeColor),
    homeLayout,
    logo: normalizeLogo(merged.logo),
  };
}

/** Turn a site-relative path into an absolute URL for metadata tags. */
export function absoluteAssetUrl(pathOrUrl: string): string {
  const value = pathOrUrl.trim();
  if (!value) return SITE_URL;
  if (/^https?:\/\//i.test(value) || value.startsWith('data:')) return value;
  return `${SITE_URL}${value.startsWith('/') ? value : `/${value}`}`;
}

export async function fetchSeoSettings(): Promise<SeoSettings> {
  const url = new URL(`${PARSE_SERVER_URL}/classes/${SEO_SETTINGS_CLASS}`);
  url.searchParams.set('where', JSON.stringify({ key: SEO_SETTINGS_KEY }));
  url.searchParams.set('limit', '1');

  try {
    const response = await fetch(url.toString(), {
      headers: parseHeaders(),
      next: { revalidate: 60 },
    } as RequestInit);

    if (!response.ok) return { ...DEFAULT_SEO_SETTINGS };

    const record = (await response.json())?.results?.[0];
    return normalize(record?.value);
  } catch {
    return { ...DEFAULT_SEO_SETTINGS };
  }
}

export async function saveSeoSettings(
  settings: SeoSettings,
  sessionToken?: string
): Promise<void> {
  const value = normalize(settings);

  const lookup = new URL(`${PARSE_SERVER_URL}/classes/${SEO_SETTINGS_CLASS}`);
  lookup.searchParams.set('where', JSON.stringify({ key: SEO_SETTINGS_KEY }));
  lookup.searchParams.set('limit', '1');

  const existing = await fetch(lookup.toString(), {
    headers: parseHeaders(sessionToken),
    cache: 'no-store',
  });
  const record = existing.ok ? (await existing.json())?.results?.[0] : null;

  const response = record
    ? await fetch(`${PARSE_SERVER_URL}/classes/${SEO_SETTINGS_CLASS}/${record.objectId}`, {
        method: 'PUT',
        headers: parseHeaders(sessionToken),
        body: JSON.stringify({ value }),
      })
    : await fetch(`${PARSE_SERVER_URL}/classes/${SEO_SETTINGS_CLASS}`, {
        method: 'POST',
        headers: parseHeaders(sessionToken),
        body: JSON.stringify({ key: SEO_SETTINGS_KEY, value }),
      });

  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.error || 'Could not save SEO settings.');
  }

  cacheSeoSettings(value);
}

export function readCachedSeoSettings(): SeoSettings {
  if (typeof window === 'undefined') return { ...DEFAULT_SEO_SETTINGS };

  try {
    const raw = window.localStorage.getItem(SEO_SETTINGS_CACHE_KEY);
    return normalize(raw ? JSON.parse(raw) : null);
  } catch {
    return { ...DEFAULT_SEO_SETTINGS };
  }
}

export function cacheSeoSettings(settings: SeoSettings): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SEO_SETTINGS_CACHE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent(SEO_SETTINGS_EVENT, { detail: settings }));
}
