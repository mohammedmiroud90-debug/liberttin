import localFont from 'next/font/local';
import { Open_Sans, Piazzolla } from 'next/font/google';

/**
 * Selectable body fonts for blog content. Every font here must stay imported by
 * the root layout so its @font-face is always in the bundle — the admin can
 * pick any of them at runtime and readers must get the real face, not a
 * fallback.
 */

export const walby = localFont({
  src: './Walby-Regular.ttf',
  variable: '--font-walby',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

export const schraft = localFont({
  src: './schraft.condensed.ttf',
  variable: '--font-schraft',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

export const cabinetGrotesk = localFont({
  src: './CabinetGrotesk-Variable.ttf',
  variable: '--font-cabinet-grotesk',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

export const satoshi = localFont({
  src: [{ path: './Satoshi-Variable.woff2', style: 'normal' }],
  variable: '--font-satoshi',
  weight: '300 900',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

export const faktSoft = localFont({
  src: './fakt-soft-nor.ttf',
  variable: '--font-fakt-soft',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

export const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
});

export const piazzolla = Piazzolla({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-piazzolla',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

/** Applied to <html> so every --font-* variable resolves site-wide. */
export const fontVariables = [
  walby.variable,
  schraft.variable,
  cabinetGrotesk.variable,
  satoshi.variable,
  faktSoft.variable,
  openSans.variable,
  piazzolla.variable,
].join(' ');
