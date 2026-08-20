import { defineMiddleware } from "astro:middleware";
import {
	DEFAULT_LOCALE,
	LOCALE_PATTERN,
	isLocale,
	isLocaleExemptPath,
	localizedPath,
	stripLocale,
} from "./i18n/locales";

/**
 * Ensure every content URL is locale-prefixed.
 * `/` and legacy unprefixed paths → `/en/...`
 */
export const onRequest = defineMiddleware(async (context, next) => {
	const { pathname } = context.url;

	if (isLocaleExemptPath(pathname)) {
		return next();
	}

	const match = pathname.match(LOCALE_PATTERN);
	if (match && isLocale(match[1])) {
		return next();
	}

	const rest = stripLocale(pathname);
	const target = localizedPath(DEFAULT_LOCALE, rest);
	return context.redirect(target, 301);
});
