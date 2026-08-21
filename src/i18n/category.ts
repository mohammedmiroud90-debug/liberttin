import { t } from "./ui";
import type { Locale } from "./locales";

/** Localize known default category labels; leave custom CMS categories as-is. */
export function localizeCategory(locale: Locale | string | undefined, category: string | undefined): string {
	if (!category) return "";
	const normalized = category.trim().toLowerCase();
	if (normalized === "general" || normalized === "général" || normalized === "allgemein") {
		return t(locale, "content.general");
	}
	return category;
}
