/** Same language set as APPISIL2026 LanguageSwitcher. */
export const LANGUAGES = [
	{ code: "en", name: "English", label: "EN" },
	{ code: "fr", name: "Français", label: "FR" },
	{ code: "es", name: "Español", label: "ES" },
	{ code: "de", name: "Deutsch", label: "DE" },
	{ code: "ru", name: "Русский", label: "RU" },
	{ code: "zh", name: "中文", label: "ZH" },
	{ code: "ja", name: "日本語", label: "JA" },
	{ code: "ar", name: "العربية", label: "AR" },
	{ code: "hi", name: "हिन्दी", label: "HI" },
	{ code: "pt", name: "Português", label: "PT" },
] as const;

export type Locale = (typeof LANGUAGES)[number]["code"];

export const LOCALES = LANGUAGES.map((l) => l.code) as Locale[];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_PATTERN = /^\/(en|fr|es|de|ru|zh|ja|ar|hi|pt)(\/.*)?$/;

export function isLocale(value: string | undefined | null): value is Locale {
	return !!value && (LOCALES as string[]).includes(value);
}

export function getLocaleFromPath(pathname: string): Locale {
	const match = pathname.match(LOCALE_PATTERN);
	return match && isLocale(match[1]) ? match[1] : DEFAULT_LOCALE;
}

/** Path without locale prefix, always starts with `/`. */
export function stripLocale(pathname: string): string {
	const match = pathname.match(LOCALE_PATTERN);
	if (!match) return pathname || "/";
	const rest = match[2] ?? "";
	return rest || "/";
}

/** Build a locale-prefixed path. Default locale has no prefix. */
export function localizedPath(locale: Locale, path = "/"): string {
	const clean = path.startsWith("/") ? path : `/${path}`;
	if (locale === DEFAULT_LOCALE) return clean === "" ? "/" : clean;
	if (clean === "/") return `/${locale}/`;
	return `/${locale}${clean.endsWith("/") ? clean : `${clean}/`}`.replace(/\/{2,}/g, "/");
}

export function languageByCode(code: string) {
	return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}
