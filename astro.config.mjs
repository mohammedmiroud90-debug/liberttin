// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import { LOCALES, DEFAULT_LOCALE } from "./src/i18n/locales";

// https://astro.build/config
export default defineConfig({
	site: "https://libertta.blog",
	trailingSlash: "always",
	integrations: [
		mdx(),
		sitemap({
			i18n: {
				defaultLocale: DEFAULT_LOCALE,
				locales: Object.fromEntries(LOCALES.map((code) => [code, code])),
			},
			filter: (page) =>
				!page.includes("/api/") &&
				!page.includes("/404") &&
				!page.endsWith("/search/") &&
				!page.includes("/search/?"),
			changefreq: "weekly",
			priority: 0.7,
			lastmod: new Date(),
		}),
	],
	adapter: cloudflare({
		platformProxy: {
			// Local wrangler proxy often hangs on Windows; deploy still works.
			enabled: false,
		},
	}),
	server: {
		port: 3000,
		host: true,
		strictPort: true,
	},
});
