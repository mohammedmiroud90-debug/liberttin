// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { LOCALES, DEFAULT_LOCALE } from "./src/i18n/locales";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
	site: "https://libertta.blog",
	trailingSlash: "always",
	integrations: [
		react(),
		mdx(),
		sitemap({
			i18n: {
				defaultLocale: DEFAULT_LOCALE,
				locales: Object.fromEntries(LOCALES.map((code) => [code, code])),
			},
			filter: (page) =>
				!page.includes("/api/") &&
				!page.includes("/404") &&
				!page.includes("/login") &&
				!page.includes("/admin") &&
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
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				"@": path.resolve(rootDir, "src"),
				"next/image": path.resolve(rootDir, "src/shims/next-image.tsx"),
				"next/navigation": path.resolve(rootDir, "src/shims/next-navigation.ts"),
			},
		},
		// Client islands (admin React) must not crash on bare `process.env` reads.
		define: {
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "development"),
		},
	},
	server: {
		port: 3000,
		host: true,
		strictPort: true,
	},
});
