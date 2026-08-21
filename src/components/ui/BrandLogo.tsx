'use client';

import { DynamicLogo } from './DynamicLogo';
import type { LogoSettings } from '@/lib/blog/seo-settings';

type BrandLogoProps = {
  href?: string;
  /** dark = white mark for black headers; light = black mark for white headers */
  variant?: 'dark' | 'light';
  className?: string;
  priority?: boolean;
  /** Override logo settings (for preview/admin) */
  logoOverride?: LogoSettings;
};

/**
 * Brand logo that dynamically switches between image and text based on admin settings.
 * Uses DynamicLogo component which reads from SEO settings and supports real-time updates.
 * 
 * @deprecated Direct usage of BrandLogo is maintained for backward compatibility.
 * Consider using DynamicLogo directly for more control.
 */
export function BrandLogo({
  href = '/',
  variant = 'dark',
  className = '',
  priority = false,
  logoOverride,
}: BrandLogoProps) {
  return (
    <DynamicLogo
      href={href}
      variant={variant}
      className={className}
      priority={priority}
      logoOverride={logoOverride}
    />
  );
}
