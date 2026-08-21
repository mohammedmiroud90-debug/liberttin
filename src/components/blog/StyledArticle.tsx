'use client';

import { useEffect, useState } from 'react';
import { ArticleBody } from './ArticleBody';
import {
  SETTINGS_EVENT,
  cacheContentSettings,
  fetchContentSettings,
  fontFamilyFor,
  type ContentSettings,
} from '@/lib/blog/content-settings';

/**
 * Applies the admin's typography choice to the post body. The server passes the
 * current settings so the first paint is already correct; the listeners only
 * matter for an admin changing the setting in another tab.
 */
export function StyledArticle({
  html,
  settings,
}: {
  html: string;
  settings: ContentSettings;
}) {
  const [active, setActive] = useState<ContentSettings>(settings);

  useEffect(() => {
    setActive(settings);
    cacheContentSettings(settings);
  }, [settings]);

  useEffect(() => {
    const onUpdate = (event: Event) => {
      const detail = (event as CustomEvent<ContentSettings>).detail;
      if (detail) setActive(detail);
      else fetchContentSettings().then(setActive);
    };

    window.addEventListener(SETTINGS_EVENT, onUpdate);
    return () => window.removeEventListener(SETTINGS_EVENT, onUpdate);
  }, []);

  return (
    <div
      className={`${active.fontSize} ${active.lineHeight}`}
      style={{ fontFamily: fontFamilyFor(active.fontId) }}
    >
      <ArticleBody html={html} inheritTypography />
    </div>
  );
}
