# Cloudflare Pages Build Configuration

## Build Settings

### Framework preset
**Astro**

### Build command
```bash
npm run build
```

### Build output directory
```
dist
```

### Root directory (advanced)
```
/
```

### Environment variables
None required for basic build. Add if needed:
- `NODE_VERSION=20`

## Node.js Version

The project requires Node.js 20 or higher. Cloudflare Pages should automatically detect this from:
- `.node-version` file (contains `20`)
- `package.json` engines field (`"node": ">=20"`)

## Package Manager

The project uses **npm** as indicated by the presence of `package-lock.json`.

Cloudflare will automatically detect and use npm for installing dependencies.

## Build Process

1. **Install dependencies**: `npm ci` (or `npm install` if no lockfile)
2. **Run build**: `npm run build`
3. **Output**: Generated files in `dist/` directory

## Astro + Cloudflare Configuration

The project uses:
- **@astrojs/cloudflare** adapter (version 12.6.12)
- **wrangler.json** for Cloudflare Workers configuration
- **SSR mode** with Cloudflare Workers runtime

## Build Output Structure

After successful build, the `dist/` directory contains:
- `_worker.js/` - Cloudflare Worker entry point
- Static assets (HTML, CSS, JS, images)
- Client-side JavaScript bundles

## Troubleshooting

### If build fails with "entry-point not found"

Make sure the build command includes the Astro build:
```bash
npm run build
```

NOT just:
```bash
wrangler deploy
```

### If wrong package manager is used

Cloudflare detects package manager by lockfile:
- `package-lock.json` → npm
- `yarn.lock` → yarn  
- `pnpm-lock.yaml` → pnpm
- `bun.lockb` → bun

Make sure only ONE lockfile exists.

### Node version issues

Ensure `.node-version` file exists with `20` and `package.json` has:
```json
"engines": {
  "node": ">=20"
}
```

## Deployment

### Via Cloudflare Pages Dashboard

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set build output: `dist`
4. Deploy

### Via Wrangler CLI

```bash
npm run deploy
```

This runs `astro build && wrangler deploy`

## Local Testing

### Development server
```bash
npm run dev
```

### Build locally
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

This runs the Wrangler dev server with the built output.
