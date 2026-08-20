import rss from "@astrojs/rss";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";
import { getBlogPosts } from "../lib/parse/posts";
import { DEFAULT_LOCALE, localizedPath } from "../i18n/locales";

export async function GET(context) {
	const { items: posts } = await getBlogPosts(1, 50);
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			title: post.title,
			description: post.excerpt,
			pubDate: new Date(post.publishedAt),
			link: localizedPath(DEFAULT_LOCALE, `/blog/${post.slug}/`),
		})),
	});
}
