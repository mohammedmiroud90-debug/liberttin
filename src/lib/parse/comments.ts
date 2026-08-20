import { COMMENT_CLASSES, PARSE_SERVER_URL, parseHeaders } from "./config";

export type BlogComment = {
	id: string;
	/** Parse class the record lives in, needed to update or delete it. */
	className: string;
	content: string;
	author: string;
	authorProfilePicture?: string;
	createdAt: string;
	parentId?: string | null;
	isActive: boolean;
	replies: BlogComment[];
};

/**
 * Comments are stored as plain text — every tag is stripped so nothing can be
 * injected. Line breaks and indentation survive because comments may contain
 * markdown-style code fences.
 */
export function sanitizeComment(input: string): string {
	return input
		.replace(/<[^>]+>/g, "")
		.replace(/\r\n/g, "\n")
		.replace(/[ \t]+$/gm, "")
		.replace(/\n{4,}/g, "\n\n\n")
		.trim()
		.slice(0, 6000);
}

function commentWhere(postId: string, includeHidden = false) {
	const where: Record<string, unknown> = {
		$or: [
			{ post: { __type: "Pointer", className: "Article", objectId: postId } },
			{ postId },
		],
	};

	if (!includeHidden) where.isActive = { $ne: false };

	return JSON.stringify(where);
}

function pictureUrl(value: unknown): string | undefined {
	if (!value) return undefined;
	if (typeof value === "string") return value;
	if (typeof value === "object" && value !== null && "url" in value) {
		const url = (value as { url?: unknown }).url;
		return typeof url === "string" ? url : undefined;
	}
	return undefined;
}

function toComment(record: any, className: string): BlogComment {
	return {
		id: record.objectId,
		className,
		content: String(record.content ?? record.comment ?? record.body ?? ""),
		author: typeof record.author === "string" ? record.author : record.author?.username || "Guest",
		authorProfilePicture: pictureUrl(record.authorProfilePicture),
		createdAt: record.createdAt ?? new Date().toISOString(),
		parentId: record.parentComment?.objectId ?? record.parentId ?? null,
		isActive: record.isActive !== false,
		replies: [],
	};
}

/**
 * Returns top-level comments with their replies nested underneath.
 * Replies are stored via `parentId` / `parentComment` relations.
 */
export async function getBlogComments(
	postId: string,
	{ includeHidden = false }: { includeHidden?: boolean } = {},
): Promise<BlogComment[]> {
	const flat: BlogComment[] = [];

	for (const className of COMMENT_CLASSES) {
		const url = new URL(`${PARSE_SERVER_URL}/classes/${className}`);
		url.searchParams.set("where", commentWhere(postId, includeHidden));
		url.searchParams.set("order", "-createdAt");
		url.searchParams.set("limit", "200");

		try {
			const response = await fetch(url.toString(), {
				headers: parseHeaders(),
				cache: "no-store",
			});
			if (!response.ok) continue;

			const records = (await response.json())?.results ?? [];
			for (const record of records) flat.push(toComment(record, className));
		} catch {
			// Try the next class name.
		}
	}

	const byId = new Map(flat.map((comment) => [comment.id, comment]));
	const roots: BlogComment[] = [];

	for (const comment of flat) {
		const parent = comment.parentId ? byId.get(comment.parentId) : undefined;
		if (parent) parent.replies.push(comment);
		else roots.push(comment);
	}

	const oldestFirst = (a: BlogComment, b: BlogComment) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
	roots.sort((a, b) => -oldestFirst(a, b));
	for (const root of roots) root.replies.sort(oldestFirst);

	return roots;
}

export async function getCommentCount(postId: string): Promise<number> {
	let total = 0;

	for (const className of COMMENT_CLASSES) {
		const url = new URL(`${PARSE_SERVER_URL}/classes/${className}`);
		url.searchParams.set("where", commentWhere(postId));
		url.searchParams.set("count", "1");
		url.searchParams.set("limit", "0");

		try {
			const response = await fetch(url.toString(), { headers: parseHeaders() });
			if (!response.ok) continue;
			total += (await response.json())?.count ?? 0;
		} catch {
			// Ignore and try the next class.
		}
	}

	return total;
}

export async function createBlogComment(input: {
	postId: string;
	content: string;
	author: string;
	authorProfilePicture?: string;
	parentId?: string | null;
	// Keeping optional because future auth can pass a session token.
	sessionToken?: string;
}): Promise<boolean> {
	const content = sanitizeComment(input.content);
	if (!content) return false;

	const payload: Record<string, unknown> = {
		content,
		author: input.author || "Guest",
		postId: input.postId,
		isActive: true,
		post: { __type: "Pointer", className: "Article", objectId: input.postId },
	};

	if (input.authorProfilePicture) payload.authorProfilePicture = input.authorProfilePicture;

	if (input.parentId) {
		payload.parentId = input.parentId;
		payload.parentComment = {
			__type: "Pointer",
			className: "Comment",
			objectId: input.parentId,
		};
	}

	for (const className of COMMENT_CLASSES) {
		try {
			const response = await fetch(`${PARSE_SERVER_URL}/classes/${className}`, {
				method: "POST",
				headers: parseHeaders(input.sessionToken),
				body: JSON.stringify(payload),
			});
			if (response.ok) return true;
		} catch {
			// Try the next class name.
		}
	}

	return false;
}

