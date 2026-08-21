import {
	createElement,
	type AnchorHTMLAttributes,
	type MouseEvent,
	type ReactNode,
} from "react";

function currentLocale(): string {
	if (typeof window === "undefined") return "en";
	const parts = window.location.pathname.split("/").filter(Boolean);
	return parts[0] && /^[a-z]{2}$/.test(parts[0]) ? parts[0] : "en";
}

/** Prefix locale and trailing slash to match Astro routing. */
export function localizeHref(href: string): string {
	if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) {
		return href;
	}

	const [rawPath, query = ""] = href.split("?");
	let path = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;

	if (!/^\/[a-z]{2}(\/|$)/.test(path)) {
		path = `/${currentLocale()}${path === "/" ? "/" : path}`;
	}

	if (!path.endsWith("/")) path += "/";
	return query ? `${path}?${query}` : path;
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
	href: string;
	children?: ReactNode;
};

export function Link({ href, children, onClick, ...rest }: LinkProps) {
	return createElement(
		"a",
		{
			...rest,
			href: localizeHref(href),
			onClick: (event: MouseEvent<HTMLAnchorElement>) => {
				onClick?.(event);
			},
		},
		children
	);
}

export function useRouter() {
	return {
		push(href: string) {
			window.location.href = localizeHref(href);
		},
		replace(href: string) {
			window.location.replace(localizeHref(href));
		},
		back() {
			window.history.back();
		},
		prefetch() {},
	};
}

export function usePathname() {
	return typeof window !== "undefined" ? window.location.pathname : "";
}

export function redirect(href: string) {
	if (typeof window !== "undefined") {
		window.location.href = localizeHref(href);
	}
}

export function getPathname(href: string) {
	return localizeHref(href);
}

export const routing = {
	locales: ["en", "ar", "fr", "es"],
	defaultLocale: "en",
	localePrefix: "always" as const,
};
