import type { APIRoute } from "astro";
import { SITE_URL } from "../consts";

export const prerender = true;

export const GET: APIRoute = () => {
	const body = `User-agent: *
Allow: /

# API endpoints
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap-index.xml
`;

	return new Response(body, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
