# Liberttin Blog - Deployment Guide

## Project Overview

Liberttin is a modern, multilingual blog platform built with Astro and designed for deployment on Cloudflare Pages. It features a clean design, comment system, cookie consent, and multiple language support.

## Features

- ✅ **Multilingual Support**: English, French, Spanish, German, Portuguese, Russian, Chinese, Japanese, Arabic, and Hindi
- ✅ **Comment System**: Nested comments with identicon avatars
- ✅ **Cookie Banner**: EU-compliant cookie consent with customizable settings
- ✅ **Contact Page**: Professional contact form with validation
- ✅ **Policies Page**: Comprehensive privacy policy, terms of service, and content guidelines
- ✅ **Search Functionality**: Full-text search across all blog posts
- ✅ **Reading Progress Bar**: Visual indicator of article reading progress
- ✅ **Social Sharing**: Share articles on Twitter, Facebook, LinkedIn, or copy link
- ✅ **Author Profiles**: Dedicated author section with bio and avatar
- ✅ **Responsive Design**: Mobile-first approach with clean UI
- ✅ **Dark Header**: Professional navigation with search and language switcher
- ✅ **RSS Feed**: Automatic RSS feed generation

## Tech Stack

- **Framework**: Astro 5.x
- **Styling**: Custom CSS with CSS Variables
- **Fonts**: Atkinson (UI), Source Serif Pro (Content), Libertinage (Logo)
- **Deployment**: Cloudflare Pages
- **Database**: Cloudflare D1 (for comments)
- **Package Manager**: npm/yarn

## Prerequisites

Before deploying, ensure you have:

1. Node.js 18+ installed
2. A Cloudflare account
3. Wrangler CLI installed: `npm install -g wrangler`
4. Git installed

## Local Development

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Set Up Environment Variables

Create a `.dev.vars` file in the root directory:

```env
# Add your environment variables here
# Example:
# API_KEY=your_api_key
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
```

The site will be available at `http://localhost:4321`

### 4. Build for Production

```bash
npm run build
# or
yarn build
```

## Deployment to Cloudflare Pages

### Option 1: Deploy via Wrangler CLI

1. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

2. **Deploy**:
   ```bash
   npm run deploy
   # or
   wrangler pages deploy dist
   ```

### Option 2: Deploy via GitHub + Cloudflare Dashboard

1. **Push to GitHub** (see Git commands below)

2. **Connect to Cloudflare Pages**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to Pages
   - Click "Create a project"
   - Connect your GitHub repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
     - **Node version**: `18` or higher

3. **Set Environment Variables** (if needed):
   - In Cloudflare Pages dashboard
   - Go to Settings > Environment Variables
   - Add your production variables

### Set Up Cloudflare D1 Database (for Comments)

1. **Create D1 Database**:
   ```bash
   wrangler d1 create liberttin-comments
   ```

2. **Update wrangler.json** with the database ID from the output

3. **Create Tables**:
   ```bash
   wrangler d1 execute liberttin-comments --file=./schema.sql
   ```

4. **Bind Database to Pages**:
   - In Cloudflare Pages dashboard
   - Go to Settings > Functions
   - Add D1 binding named `DB` to your database

## Configuration

### Customization Points

1. **Site Information** (`src/consts.ts`):
   ```typescript
   export const SITE_TITLE = 'Liberttin';
   export const SITE_DESCRIPTION = 'Your site description';
   ```

2. **Author Profile** (`src/layouts/BlogPost.astro`):
   - Update author avatar URL
   - Update author bio text

3. **Social Links** (`src/components/Footer.astro`):
   - Update social media URLs

4. **Contact Form** (`src/views/ContactPage.astro`):
   - Configure form submission endpoint

## Git Commands for GitHub

### Initial Setup

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Liberttin Blog with multilingual support, comments, and policies"

# Create GitHub repository (via GitHub website or CLI)
# Then add remote
git remote add origin https://github.com/YOUR_USERNAME/liberttin-blog.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Future Updates

```bash
# Check status
git status

# Add modified files
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push
```

## Troubleshooting

### Build Errors

1. **Clear cache**:
   ```bash
   rm -rf node_modules .astro dist
   npm install
   npm run build
   ```

2. **Check Node version**:
   ```bash
   node --version  # Should be 18+
   ```

### Comment System Not Working

1. Verify D1 database is created and bound
2. Check database tables exist
3. Verify API routes are accessible

### Search Not Working

1. Ensure all blog posts have valid frontmatter
2. Check search index generation in build output
3. Verify JavaScript is not blocked

## Performance Optimization

- **Images**: Use WebP format for blog post images
- **Fonts**: Fonts are preloaded for optimal performance
- **Caching**: Cloudflare Pages automatically caches static assets
- **Compression**: Enable Brotli compression in Cloudflare dashboard

## Security

- Cookie banner implements consent management
- All forms have CSRF protection
- Content Security Policy headers recommended
- Regular dependency updates via `npm audit`

## Support

For issues or questions:
- Email: contact@liberttin.blog
- GitHub Issues: [Create an issue](https://github.com/YOUR_USERNAME/liberttin-blog/issues)

## License

All rights reserved © 2026 Liberttin

---

**Last Updated**: August 20, 2026
