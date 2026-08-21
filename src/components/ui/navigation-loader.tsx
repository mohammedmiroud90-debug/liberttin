'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Loader } from '@/components/ui/loader';

/**
 * Shows the brand Loader during client-side route changes.
 * Next.js `loading.tsx` alone often never appears for client pages
 * that do not suspend, so this covers soft navigations.
 */
export function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const isFirstRender = useRef(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setVisible(true);

    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setVisible(false), 450);

    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [pathname, searchParams]);

  if (!visible) return null;
  return <Loader />;
}
