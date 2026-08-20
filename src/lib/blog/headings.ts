export type ArticleHeading = {
	id: string;
	text: string;
	level: number;
};

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 60);
}

function decode(text: string): string {
	return text
		.replace(/<[^>]+>/g, '')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * Assigns stable anchor ids to article headings and returns them for the
 * jump-link nav. Both outputs come from one pass so the TOC ids always match
 * the ids rendered in the body.
 */
export function processHeadings(html: string): { html: string; headings: ArticleHeading[] } {
	const headings: ArticleHeading[] = [];
	const used = new Set<string>();

	const output = html.replace(
		/<(h[1-4])([^>]*)>([\s\S]*?)<\/\1>/gi,
		(match, tag: string, attrs: string, inner: string) => {
			const text = decode(inner);
			if (!text) return match;

			const existingId = /\sid\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1];
			let id = existingId || slugify(text) || `section-${headings.length + 1}`;

			if (used.has(id)) {
				let suffix = 2;
				while (used.has(`${id}-${suffix}`)) suffix += 1;
				id = `${id}-${suffix}`;
			}
			used.add(id);

			headings.push({ id, text, level: Number(tag[1]) });

			const nextAttrs = existingId
				? attrs.replace(/\sid\s*=\s*["'][^"']+["']/i, ` id="${id}"`)
				: `${attrs} id="${id}"`;

			return `<${tag}${nextAttrs}>${inner}</${tag}>`;
		},
	);

	return { html: output, headings };
}

