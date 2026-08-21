import { useMemo, useSyncExternalStore } from "react";
import { usePathname as useAstroPathname, useRouter as useAstroRouter } from "../i18n/routing";

function getSearch(): string {
	return typeof window !== "undefined" ? window.location.search : "";
}

function subscribe(onStoreChange: () => void) {
	window.addEventListener("popstate", onStoreChange);
	return () => window.removeEventListener("popstate", onStoreChange);
}

/** Minimal next/navigation stand-in for Astro + React admin islands. */
export function useSearchParams() {
	const search = useSyncExternalStore(subscribe, getSearch, () => "");
	return useMemo(() => new URLSearchParams(search.startsWith("?") ? search.slice(1) : search), [search]);
}

export function usePathname() {
	return useAstroPathname();
}

export function useRouter() {
	return useAstroRouter();
}

export function notFound(): never {
	throw new Error("notFound()");
}

export function redirect(url: string): never {
	if (typeof window !== "undefined") {
		window.location.href = url;
	}
	throw new Error(`redirect(${url})`);
}
