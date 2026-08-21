import { PARSE_SERVER_URL, parseHeaders } from './config';

/**
 * Reader-facing typography for blog post bodies, chosen by an admin.
 *
 * Stored in Parse rather than localStorage so the choice applies to every
 * visitor — a localStorage-only setting would only ever change the admin's own
 * browser. localStorage is still used as a client cache for instant paint.
 */

export const SETTINGS_CLASS = 'SiteSettings';
export const SETTINGS_KEY = 'blog-content';
export const SETTINGS_CACHE_KEY = 'billiant.contentSettings';
export const SETTINGS_EVENT = 'contentSettingsUpdated';

/** Stable ids — next/font class names are build-hashed and unsafe to persist. */
export type FontId =
  | 'proxima'
  | 'walby'
  | 'schraft'
  | 'cabinet'
  | 'satoshi'
  | 'faktSoft'
  | 'openSans'
  | 'system'
  | 'georgia'
  | 'sourceSerif'
  | 'adoraMicro'
  | 'charter';

export type ContentSettings = {
  fontId: FontId;
  fontSize: string;
  lineHeight: string;
};

export const DEFAULT_CONTENT_SETTINGS: ContentSettings = {
  fontId: 'sourceSerif',
  fontSize: 'text-[21px]',
  lineHeight: 'leading-[1.58]',
};

export const FONT_OPTIONS: {
  id: FontId;
  label: string;
  /** CSS value applied inline; the matching next/font class is added too. */
  fontFamily: string;
}[] = [
  { id: 'sourceSerif', label: 'Source Serif Pro (Medium style)', fontFamily: "'Source Serif Pro', Georgia, serif" },
  { id: 'adoraMicro', label: 'Adora MICRO', fontFamily: "'Adora MICRO', Georgia, serif" },
  { id: 'charter', label: 'Charter (classic)', fontFamily: "charter, Georgia, serif" },
  { id: 'georgia', label: 'Georgia (serif)', fontFamily: 'Georgia, serif' },
  { id: 'proxima', label: 'Proxima Nova (sans)', fontFamily: "'Proxima Nova', system-ui, sans-serif" },
  { id: 'walby', label: 'Walby', fontFamily: 'var(--font-walby), system-ui, sans-serif' },
  { id: 'schraft', label: 'Schraft Condensed', fontFamily: 'var(--font-schraft), system-ui, sans-serif' },
  { id: 'cabinet', label: 'Cabinet Grotesk', fontFamily: 'var(--font-cabinet-grotesk), system-ui, sans-serif' },
  { id: 'satoshi', label: 'Satoshi', fontFamily: 'var(--font-satoshi), system-ui, sans-serif' },
  { id: 'faktSoft', label: 'Fakt Soft', fontFamily: 'var(--font-fakt-soft), system-ui, sans-serif' },
  { id: 'openSans', label: 'Open Sans', fontFamily: 'var(--font-open-sans), system-ui, sans-serif' },
  { id: 'system', label: 'System Sans', fontFamily: 'system-ui, sans-serif' },
];

export const FONT_SIZE_OPTIONS = [
  { label: 'Small', value: 'text-[15px]' },
  { label: 'Medium', value: 'text-base' },
  { label: 'Large', value: 'text-lg' },
  { label: 'Medium (21px)', value: 'text-[21px]' },
  { label: 'Extra large', value: 'text-xl' },
];

export const LINE_HEIGHT_OPTIONS = [
  { label: 'Compact', value: 'leading-snug' },
  { label: 'Normal', value: 'leading-[1.75]' },
  { label: 'Medium (1.58)', value: 'leading-[1.58]' },
  { label: 'Loose', value: 'leading-loose' },
];

export function fontFamilyFor(fontId: FontId): string {
  return (
    FONT_OPTIONS.find((option) => option.id === fontId)?.fontFamily ??
    FONT_OPTIONS[0].fontFamily
  );
}

function normalize(raw: Partial<ContentSettings> | null | undefined): ContentSettings {
  const merged = { ...DEFAULT_CONTENT_SETTINGS, ...(raw ?? {}) };

  return {
    fontId: FONT_OPTIONS.some((option) => option.id === merged.fontId)
      ? merged.fontId
      : DEFAULT_CONTENT_SETTINGS.fontId,
    fontSize: FONT_SIZE_OPTIONS.some((option) => option.value === merged.fontSize)
      ? merged.fontSize
      : DEFAULT_CONTENT_SETTINGS.fontSize,
    lineHeight: LINE_HEIGHT_OPTIONS.some((option) => option.value === merged.lineHeight)
      ? merged.lineHeight
      : DEFAULT_CONTENT_SETTINGS.lineHeight,
  };
}

/** Reads the shared settings record. Safe on both server and client. */
export async function fetchContentSettings(): Promise<ContentSettings> {
  const url = new URL(`${PARSE_SERVER_URL}/classes/${SETTINGS_CLASS}`);
  url.searchParams.set('where', JSON.stringify({ key: SETTINGS_KEY }));
  url.searchParams.set('limit', '1');

  try {
    const response = await fetch(url.toString(), {
      headers: parseHeaders(),
      next: { revalidate: 60 },
    } as RequestInit);

    if (!response.ok) return { ...DEFAULT_CONTENT_SETTINGS };

    const record = (await response.json())?.results?.[0];
    return normalize(record?.value);
  } catch {
    return { ...DEFAULT_CONTENT_SETTINGS };
  }
}

export async function saveContentSettings(
  settings: ContentSettings,
  sessionToken?: string
): Promise<void> {
  const value = normalize(settings);

  const lookup = new URL(`${PARSE_SERVER_URL}/classes/${SETTINGS_CLASS}`);
  lookup.searchParams.set('where', JSON.stringify({ key: SETTINGS_KEY }));
  lookup.searchParams.set('limit', '1');

  const existing = await fetch(lookup.toString(), {
    headers: parseHeaders(sessionToken),
    cache: 'no-store',
  });
  const record = existing.ok ? (await existing.json())?.results?.[0] : null;

  const response = record
    ? await fetch(`${PARSE_SERVER_URL}/classes/${SETTINGS_CLASS}/${record.objectId}`, {
        method: 'PUT',
        headers: parseHeaders(sessionToken),
        body: JSON.stringify({ value }),
      })
    : await fetch(`${PARSE_SERVER_URL}/classes/${SETTINGS_CLASS}`, {
        method: 'POST',
        headers: parseHeaders(sessionToken),
        body: JSON.stringify({ key: SETTINGS_KEY, value }),
      });

  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    throw new Error(detail?.error || 'Could not save settings.');
  }

  cacheContentSettings(value);
}

export function readCachedContentSettings(): ContentSettings {
  if (typeof window === 'undefined') return { ...DEFAULT_CONTENT_SETTINGS };

  try {
    const raw = window.localStorage.getItem(SETTINGS_CACHE_KEY);
    return normalize(raw ? JSON.parse(raw) : null);
  } catch {
    return { ...DEFAULT_CONTENT_SETTINGS };
  }
}

export function cacheContentSettings(settings: ContentSettings): void {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: settings }));
}
