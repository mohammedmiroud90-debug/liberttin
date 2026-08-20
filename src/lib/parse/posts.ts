/**
 * Blog data layer backed by the Parse Server instance shared with Billientt.blog.
 */
import { PARSE_SERVER_URL, POST_CLASSES, parseHeaders } from "./config";

export type BlogPost = {
	id: string;
	slug: string;
	title: string;
	excerpt: string;
	content: string;
	category: string;
	author: string;
	publishedAt: string;
	updatedAt?: string;
	imageUrl: string;
	tags: string[];
	readingTime: number;
};

export type BlogPostsResponse = {
	items: BlogPost[];
	total: number;
	page: number;
	perPage: number;
	totalPages: number;
};

const DEFAULT_AUTHOR = "belhachemi_admin";

const LIST_KEYS = [
	"title",
	"slug",
	"excerpt",
	"summary",
	"description",
	"category",
	"type",
	"tag",
	"publishedAt",
	"originalCreatedAt",
	"createdAt",
	"updatedAt",
	"author",
	"coverImage",
	"image",
	"thumbnail",
	"photo",
	"banner",
	"imageUrl",
	"readingTime",
	"tags",
	"content",
	"body",
	"details",
	"status",
].join(",");

async function parseQuery(
	className: string,
	params: Record<string, string>,
): Promise<{ results: any[]; count?: number } | null> {
	const url = new URL(`${PARSE_SERVER_URL}/classes/${className}`);
	Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

	try {
		let response = await fetch(url.toString(), {
			method: "GET",
			headers: parseHeaders(),
			signal: AbortSignal.timeout(8000),
		});

		if (!response.ok && params.keys) {
			url.searchParams.delete("keys");
			response = await fetch(url.toString(), {
				method: "GET",
				headers: parseHeaders(),
				signal: AbortSignal.timeout(8000),
			});
		}

		if (!response.ok) return null;
		return await response.json();
	} catch (error) {
		console.error(`Parse query failed for ${className}:`, error);
		return null;
	}
}

function pickString(record: any, keys: string[], fallback = ""): string {
	for (const key of keys) {
		const value = record?.[key];
		if (typeof value === "string" && value.trim() !== "") return value.trim();
	}
	return fallback;
}

function pickDate(record: any, keys: string[]): string | undefined {
	for (const key of keys) {
		const value = record?.[key];
		if (typeof value === "string" && value.trim() !== "") return value.trim();
		if (value && typeof value === "object" && typeof value.iso === "string") return value.iso;
	}
	return undefined;
}

function pickFileUrl(value: any): string {
	if (!value) return "";
	if (typeof value === "string") return value.trim();
	if (typeof value === "object" && typeof value.url === "string") return value.url;
	return "";
}

function firstImageFromHtml(html: string): string {
	if (!html) return "";
	const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
	return match?.[1]?.trim() || "";
}

function pickImage(record: any, content = ""): string {
	const keys = ["coverImage", "image", "thumbnail", "photo", "banner", "imageUrl"];
	for (const key of keys) {
		const url = pickFileUrl(record?.[key]);
		if (url) return url;
	}
	return firstImageFromHtml(content);
}

function stripHtml(html: string): string {
	return html
		.replace(/<[^>]+>/g, " ")
		.replace(/&nbsp;/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function summarize(source: string, maxLength = 180): string {
	const plain = stripHtml(source);
	if (plain.length <= maxLength) return plain;
	return `${plain.slice(0, maxLength - 3).trimEnd()}...`;
}

function displayNameOf(user: any, fallback: string): string {
	if (!user) return fallback;
	if (typeof user === "string") return user.trim() || fallback;

	const fullName = [user.firstName, user.lastName]
		.filter((part) => typeof part === "string" && part.trim())
		.join(" ")
		.trim();
	if (fullName) return fullName;

	for (const key of ["displayName", "name", "username"]) {
		if (typeof user[key] === "string" && user[key].trim()) return user[key].trim();
	}
	return fallback;
}

function mapPost(record: any, includeContent: boolean): BlogPost {
	const rawContent = pickString(record, ["content", "body", "details"]);
	const content = includeContent ? rawContent : "";
	const excerpt = pickString(record, ["excerpt", "summary", "description", "shortDescription"]);

	const authorField = record.author ?? record.authorId ?? record.createdBy ?? record.user;
	let authorUsername = DEFAULT_AUTHOR;
	if (typeof authorField === "string" && authorField.trim()) {
		authorUsername = authorField.trim();
	} else if (authorField && typeof authorField === "object" && authorField.username) {
		authorUsername = authorField.username;
	}

	const authorName = displayNameOf(authorField, authorUsername);
	const storedReadingTime = Number(record.readingTime) || 0;
	const wordCount = stripHtml(rawContent || excerpt).split(/\s+/).filter(Boolean).length;
	const readingTime =
		storedReadingTime > 0 ? storedReadingTime : Math.max(1, Math.ceil((wordCount || 200) / 200));

	return {
		id: record.objectId,
		slug: pickString(record, ["slug"], record.objectId),
		title: pickString(record, ["title", "name", "headline"], "Untitled article"),
		excerpt: excerpt || summarize(rawContent),
		content,
		category: pickString(record, ["category", "type", "tag"], "General"),
		author: authorName,
		publishedAt:
			pickDate(record, ["publishedAt", "originalCreatedAt", "createdAt", "date"]) ??
			new Date().toISOString(),
		updatedAt: pickDate(record, ["updatedAt", "modifiedAt"]),
		imageUrl: pickImage(record, rawContent),
		tags: Array.isArray(record.tags)
			? record.tags.map((tag: unknown) => String(tag)).filter(Boolean)
			: [],
		readingTime,
	};
}

export async function getBlogPosts(page = 1, perPage = 12): Promise<BlogPostsResponse> {
	const empty: BlogPostsResponse = { items: [], total: 0, page, perPage, totalPages: 0 };

	for (const className of POST_CLASSES) {
		const data = await parseQuery(className, {
			where: JSON.stringify({ status: "published" }),
			order: "-publishedAt",
			limit: String(perPage),
			skip: String((page - 1) * perPage),
			keys: LIST_KEYS,
			count: "1",
		});

		const records = data?.results ?? [];
		if (records.length === 0) continue;

		const total = typeof data?.count === "number" ? data.count : records.length;
		const items = records.map((record) => mapPost(record, false));

		return { items, total, page, perPage, totalPages: Math.ceil(total / perPage) };
	}

	return empty;
}

export async function getAllPostSlugs(): Promise<string[]> {
	const slugs = new Set<string>();

	for (const className of POST_CLASSES) {
		const data = await parseQuery(className, {
			where: JSON.stringify({ status: "published" }),
			limit: "1000",
			keys: "slug",
		});
		for (const record of data?.results ?? []) {
			if (record.slug) slugs.add(record.slug);
		}
	}

	return [...slugs];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
	for (const className of POST_CLASSES) {
		const data = await parseQuery(className, {
			where: JSON.stringify({ slug, status: "published" }),
			limit: "1",
			include: "author,authorId,createdBy,user",
		});

		const record = data?.results?.[0];
		if (record) return mapPost(record, true);
	}

	return null;
}

export async function searchBlogPosts(query: string, limit = 20): Promise<BlogPost[]> {
	const term = query.trim();
	if (!term) return [];

	for (const className of POST_CLASSES) {
		const data = await parseQuery(className, {
			where: JSON.stringify({
				status: "published",
				$or: [
					{ title: { $regex: term, $options: "i" } },
					{ excerpt: { $regex: term, $options: "i" } },
					{ category: { $regex: term, $options: "i" } },
				],
			}),
			order: "-publishedAt",
			limit: String(limit),
			keys: LIST_KEYS,
		});

		const records = data?.results ?? [];
		if (records.length === 0) continue;

		return records.map((record) => mapPost(record, false));
	}

	return [];
}
