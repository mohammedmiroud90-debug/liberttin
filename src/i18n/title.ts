import { SITE_TITLE } from "../consts";
import { t, type UiKey } from "./ui";
import type { Locale } from "./locales";

/** Localized document/OG title: "Section · Libertta" or brand-only for home hero. */
export function pageTitle(locale: Locale | string | undefined, sectionKey?: UiKey): string {
	if (!sectionKey) return SITE_TITLE;
	return `${t(locale, sectionKey)} · ${SITE_TITLE}`;
}

/** Article title with site brand for SEO tabs. */
export function articleTitle(locale: Locale | string | undefined, title: string): string {
	const clean = (title || t(locale, "content.untitled")).trim();
	return `${clean} · ${SITE_TITLE}`;
}
