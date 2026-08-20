import { PARSE_SERVER_URL, parseHeaders } from "./parse/config";

export type LogoType = "image" | "text";

export type LogoSettings = {
	type: LogoType;
	imageUrl: string;
	text: string;
	fontFamily: string;
	fontSize: number;
	fontWeight: number;
	color: string;
	colorDark: string;
	scale: number;
};

const SEO_SETTINGS_CLASS = "SiteSettings";
const SEO_SETTINGS_KEY = "site-seo";

export const DEFAULT_LOGO_SETTINGS: LogoSettings = {
	type: "image",
	imageUrl: "/LOGO.png",
	text: "Libertta",
	fontFamily: "Libertinage",
	fontSize: 28,
	fontWeight: 700,
	color: "#000000",
	colorDark: "#ffffff",
	scale: 1,
};

function normalizeLogo(raw: Partial<LogoSettings> | null | undefined): LogoSettings {
	const merged = { ...DEFAULT_LOGO_SETTINGS, ...(raw ?? {}) };
	const type: LogoType = merged.type === "text" || merged.type === "image" ? merged.type : "image";
	const scale =
		typeof merged.scale === "number" && merged.scale > 0 ? merged.scale : DEFAULT_LOGO_SETTINGS.scale;

	return {
		type,
		imageUrl:
			typeof merged.imageUrl === "string" && merged.imageUrl.trim()
				? merged.imageUrl.trim()
				: DEFAULT_LOGO_SETTINGS.imageUrl,
		text:
			typeof merged.text === "string" && merged.text.trim()
				? merged.text.trim()
				: DEFAULT_LOGO_SETTINGS.text,
		fontFamily: merged.fontFamily || DEFAULT_LOGO_SETTINGS.fontFamily,
		fontSize:
			typeof merged.fontSize === "number" && merged.fontSize > 0
				? merged.fontSize
				: DEFAULT_LOGO_SETTINGS.fontSize,
		fontWeight:
			typeof merged.fontWeight === "number"
				? merged.fontWeight
				: DEFAULT_LOGO_SETTINGS.fontWeight,
		color:
			typeof merged.color === "string" && merged.color.trim()
				? merged.color.trim()
				: DEFAULT_LOGO_SETTINGS.color,
		colorDark:
			typeof merged.colorDark === "string" && merged.colorDark.trim()
				? merged.colorDark.trim()
				: DEFAULT_LOGO_SETTINGS.colorDark,
		scale,
	};
}

export async function fetchLogoSettings(): Promise<LogoSettings> {
	const url = new URL(`${PARSE_SERVER_URL}/classes/${SEO_SETTINGS_CLASS}`);
	url.searchParams.set("where", JSON.stringify({ key: SEO_SETTINGS_KEY }));
	url.searchParams.set("limit", "1");

	try {
		const response = await fetch(url.toString(), {
			method: "GET",
			headers: parseHeaders(),
		});

		if (!response.ok) return DEFAULT_LOGO_SETTINGS;

		const data = await response.json();
		const record = data?.results?.[0];
		if (!record?.logo) return DEFAULT_LOGO_SETTINGS;

		return normalizeLogo(record.logo);
	} catch {
		return DEFAULT_LOGO_SETTINGS;
	}
}
