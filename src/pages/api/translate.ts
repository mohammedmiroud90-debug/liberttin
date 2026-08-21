import { DEFAULT_LOCALE, LOCALES, type Locale } from "../../i18n/locales";

export const prerender = false;

const MAX_CHARS = 4500;

/** Map our locale codes to MyMemory language pairs. */
const MYMEMORY_LANG: Record<Locale, string> = {
	en: "en",
	fr: "fr",
	es: "es",
	de: "de",
	pt: "pt",
	ru: "ru",
	zh: "zh-CN",
	ja: "ja",
	ar: "ar",
	hi: "hi",
};

function isLocale(value: unknown): value is Locale {
	return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export async function POST({ request }: { request: Request }) {
	let body: { text?: unknown; target?: unknown; source?: unknown } = {};
	try {
		body = await request.json();
	} catch {
		return json({ error: "Invalid JSON" }, 400);
	}

	const text = String(body.text ?? "").trim();
	if (!text) return json({ error: "Missing text" }, 400);
	if (text.length > MAX_CHARS) return json({ error: "Text too long" }, 400);

	const target = isLocale(body.target) ? body.target : DEFAULT_LOCALE;
	const source = isLocale(body.source) ? body.source : DEFAULT_LOCALE;

	if (target === source) {
		return json({ translated: text, target, source });
	}

	const langpair = `${MYMEMORY_LANG[source]}|${MYMEMORY_LANG[target]}`;
	const url = new URL("https://api.mymemory.translated.net/get");
	url.searchParams.set("q", text);
	url.searchParams.set("langpair", langpair);

	try {
		const res = await fetch(url.toString(), {
			headers: { Accept: "application/json" },
			signal: AbortSignal.timeout(12000),
		});
		if (!res.ok) return json({ error: "Translation service unavailable" }, 502);

		const data = (await res.json()) as {
			responseData?: { translatedText?: string };
			responseStatus?: number;
		};

		const translated = data?.responseData?.translatedText;
		if (!translated || data.responseStatus !== 200) {
			return json({ error: "Translation failed" }, 502);
		}

		return json({ translated, target, source });
	} catch {
		return json({ error: "Translation request failed" }, 502);
	}
}

function json(payload: Record<string, unknown>, status = 200) {
	return new Response(JSON.stringify(payload), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}
