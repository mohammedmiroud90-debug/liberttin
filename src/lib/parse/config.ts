/**
 * Parse Server connection shared with Billientt.blog / brintiel.blog backend.
 */
export const PARSE_SERVER_URL =
	import.meta.env.PARSE_SERVER_URL || "https://backendweb.eollinea.com/parse";

export const PARSE_APP_ID =
	import.meta.env.PARSE_APP_ID || "f86207c4cf7bdc08ff889e9d8519bbf3";

export const PARSE_JAVASCRIPT_KEY =
	import.meta.env.PARSE_JAVASCRIPT_KEY ||
	"5828916ef66b1aba0ab4efdb2724c00f27a6560ba126509ca1bbccff3a13e56c";

export const POST_CLASSES = ["Article", "BlogPost"] as const;

// Comment threads are stored under these class names (legacy + current).
export const COMMENT_CLASSES = ["Comment", "BlogComment"] as const;

export function parseHeaders(sessionToken?: string): Record<string, string> {
	return {
		"X-Parse-Application-Id": PARSE_APP_ID,
		"X-Parse-Javascript-Key": PARSE_JAVASCRIPT_KEY,
		"Content-Type": "application/json",
		...(sessionToken ? { "X-Parse-Session-Token": sessionToken } : {}),
	};
}

export function slugify(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}
