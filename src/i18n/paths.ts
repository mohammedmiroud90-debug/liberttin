import { LOCALES, isLocale, type Locale } from "./locales";

/** Static paths for `/[locale]/...` — every locale including English (`en`). */
export function localeStaticPaths() {
	return LOCALES.map((locale) => ({
		params: { locale },
		props: { locale },
	}));
}

export function resolveLocaleParam(value: string | undefined): Locale {
	return isLocale(value) ? value : "en";
}
