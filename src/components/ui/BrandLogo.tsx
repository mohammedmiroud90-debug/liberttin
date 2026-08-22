'use client';

import { Link } from '@/i18n/routing';

type BrandLogoProps = {
  href?: string;
  /** dark = white mark for black headers; light = black mark for white headers */
  variant?: 'dark' | 'light';
  className?: string;
  priority?: boolean;
  text?: string;
  fontSize?: number;
  fontWeight?: number;
  scale?: number;
  /** Show iconlogo.png to the right of the wordmark (default true). */
  showIcon?: boolean;
  /** Kept for call-site compatibility; site chrome uses the fixed Libertta wordmark. */
  logoOverride?: unknown;
};

/**
 * Site brand mark — Libertta wordmark + iconlogo.png on the right (home & admin).
 */
export function BrandLogo({
  href = '/',
  variant = 'dark',
  className = '',
  text = 'Libertta',
  fontSize = 36,
  fontWeight = 700,
  scale = 1,
  showIcon = true,
}: BrandLogoProps) {
  const color = variant === 'dark' ? '#ffffff' : '#000000';
  const computedSize = fontSize * scale;
  const iconSize = Math.max(22, Math.round(computedSize * 0.85));

  return (
    <Link
      href={href}
      className={`brand-logo inline-flex items-center gap-[0.45rem] min-w-0 shrink-0 no-underline ${className}`.trim()}
      aria-label={text}
    >
      <span
        className="brand-logo__text"
        style={{
          fontFamily: '"Libertinage", serif',
          fontSize: `${computedSize}px`,
          fontWeight,
          color,
          lineHeight: 1,
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </span>
      {showIcon ? (
        <img
          className={`brand-logo__icon block shrink-0 object-contain rounded-[0.2rem] ${
            variant === 'light' ? 'brand-logo__icon--on-light' : ''
          }`}
          src="/iconlogo.png"
          alt=""
          width={iconSize}
          height={iconSize}
          style={{
            width: iconSize,
            height: iconSize,
            filter: variant === 'light' ? 'brightness(0)' : 'brightness(0) invert(1)',
          }}
          decoding="async"
        />
      ) : null}
    </Link>
  );
}
