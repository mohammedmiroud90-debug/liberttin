import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from "./locales";

/** Static paths for `/[locale]/...` (non-default locales only). */
export function localeStaticPaths() {
	return LOCALES.filter((code) => code !== DEFAULT_LOCALE).map((locale) => ({
		params: { locale },
		props: { locale },
	}));
}

export function resolveLocaleParam(value: string | undefined): Locale {
	return isLocale(value) ? value : DEFAULT_LOCALE;
}
