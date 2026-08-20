type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
	interface Locals extends Runtime {}
}

interface ImportMetaEnv {
	readonly PARSE_SERVER_URL?: string;
	readonly PARSE_APP_ID?: string;
	readonly PARSE_JAVASCRIPT_KEY?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
