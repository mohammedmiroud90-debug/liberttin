'use client';
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import {
  type LogoSettings,
  LOGO_FONT_OPTIONS,
  readCachedSeoSettings,
  SEO_SETTINGS_EVENT,
} from '@/lib/blog/seo-settings';

type DynamicLogoProps = {
  href?: string;
  /** dark = logo for black backgrounds; light = logo for white backgrounds */
  variant?: 'dark' | 'light';
  className?: string;
  priority?: boolean;
  /** Override logo settings (for preview/admin) */
  logoOverride?: LogoSettings;
};

/**
 * Dynamic logo component that supports both image and text logos with custom fonts.
 * Reads configuration from SEO settings and updates in real-time.
 */
export function DynamicLogo({
  href = '/',
  variant = 'dark',
  className = '',
  priority = false,
  logoOverride,
}: DynamicLogoProps) {
  const [logo, setLogo] = useState<LogoSettings | null>(null);
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    // Initial load
    const settings = readCachedSeoSettings();
    setLogo(logoOverride || settings.logo);

    // Listen for updates
    const handleUpdate = (event: CustomEvent) => {
      if (!logoOverride) {
        setLogo(event.detail.logo);
      }
    };

    window.addEventListener(SEO_SETTINGS_EVENT as any, handleUpdate);
    return () => window.removeEventListener(SEO_SETTINGS_EVENT as any, handleUpdate);
  }, [logoOverride]);

  // Load custom font if text logo is used
  useEffect(() => {
    if (!logo || logo.type !== 'text') {
      setFontLoaded(true);
      return;
    }

    const fontOption = LOGO_FONT_OPTIONS.find((f) => f.id === logo.fontFamily);
    if (!fontOption) {
      setFontLoaded(true);
      return;
    }

    // Create a font face
    const fontFace = new FontFace(
      fontOption.id,
      `url(${fontOption.path})`,
      { weight: `${logo.fontWeight}` }
    );

    fontFace
      .load()
      .then((loadedFace) => {
        document.fonts.add(loadedFace);
        setFontLoaded(true);
      })
      .catch((error) => {
        console.warn('Failed to load font:', error);
        setFontLoaded(true);
      });
  }, [logo]);

  if (!logo) {
    // Loading state
    return (
      <Link href={href} className={`inline-flex items-center min-w-0 ${className}`}>
        <div className="h-7 sm:h-8 w-24 animate-pulse bg-gray-300 rounded" />
      </Link>
    );
  }

  const content =
    logo.type === 'image' ? (
      <Image
        src={logo.imageUrl}
        alt={logo.text || 'Logo'}
        width={120}
        height={40}
        priority={priority}
        className={`h-7 sm:h-8 w-auto transition-transform ${variant === 'light' ? 'brightness-0' : ''}`}
        style={{ 
          width: 'auto',
          transform: `scale(${logo.scale})`,
          transformOrigin: 'left center',
        }}
      />
    ) : (
      <span
        className={`font-bold tracking-tight transition-opacity ${
          fontLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          fontFamily: `"${logo.fontFamily}", sans-serif`,
          fontSize: `${logo.fontSize * logo.scale}px`,
          fontWeight: logo.fontWeight,
          color: variant === 'dark' ? logo.colorDark : logo.color,
          lineHeight: 1,
          display: 'inline-block',
          transform: `scale(${logo.scale})`,
          transformOrigin: 'left center',
        }}
      >
        {logo.text}
      </span>
    );

  return (
    <Link href={href} className={`inline-flex items-center min-w-0 ${className}`}>
      {content}
    </Link>
  );
}
