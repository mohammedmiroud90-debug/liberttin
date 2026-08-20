import { createBlogComment, getBlogComments, getCommentCount } from "../../../lib/parse/comments";

// Dynamic API routes need to be served on-demand.
export const prerender = false;

export async function GET({ params }: { params: { postId: string } }) {
	const postId = params.postId;
	if (!postId) {
		return new Response(JSON.stringify({ error: "Missing postId" }), { status: 400 });
	}

	const [comments, count] = await Promise.all([getBlogComments(postId), getCommentCount(postId)]);
	return new Response(JSON.stringify({ comments, count }), { headers: { "Content-Type": "application/json" } });
}

export async function POST({ params, request }: { params: { postId: string }; request: Request }) {
	const postId = params.postId;
	if (!postId) {
		return new Response(JSON.stringify({ error: "Missing postId" }), { status: 400 });
	}

	let body: any = null;
	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
	}

	const content = String(body?.content ?? "").trim();
	const author = String(body?.author ?? "Guest").trim() || "Guest";
	const parentId = body?.parentId ? String(body.parentId) : null;

	const created = await createBlogComment({
		postId,
		content,
		author,
		parentId,
		authorProfilePicture: typeof body?.authorProfilePicture === "string" ? body.authorProfilePicture : undefined,
	});

	return new Response(JSON.stringify({ created }), { headers: { "Content-Type": "application/json" } });
}

