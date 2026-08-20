# Libertta Blog

Astro blog for **Libertta**, deployed on Cloudflare Workers. Posts come from the shared Parse backend; the header uses a Libertinage text logo and post bodies use Source Serif Pro.

## Setup

```bash
yarn install
cp .env.example .env
# optional for Wrangler local vars:
cp .dev.vars.example .dev.vars
yarn dev
```

Open [http://localhost:4321/](http://localhost:4321/).

## Scripts

| Command        | Description                          |
|----------------|--------------------------------------|
| `yarn dev`     | Start local Astro dev server         |
| `yarn build`   | Production build                     |
| `yarn preview` | Build + Wrangler preview             |
| `yarn deploy`  | Deploy to Cloudflare Workers         |

## Stack

- Astro 5 + `@astrojs/cloudflare`
- Parse Server posts (`Article` / `BlogPost`)
- Yarn as the package manager (`yarn.lock`)

## Env vars

See `.env.example` / `.dev.vars.example`:

- `PARSE_SERVER_URL`
- `PARSE_APP_ID`
- `PARSE_JAVASCRIPT_KEY`
