'use client';

import { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';

const STORAGE_KEY = 'billiant:bookmarks';

function readBookmarks(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function BookmarkButton({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(readBookmarks().includes(slug));
  }, [slug]);

  const toggle = () => {
    const next = saved
      ? readBookmarks().filter((item) => item !== slug)
      : [...readBookmarks(), slug];

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Private-mode storage failures shouldn't break the toggle.
    }
    setSaved(!saved);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      title={saved ? 'Saved' : 'Save this article'}
      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#eaf3fb] text-[#0066cc] transition-colors hover:bg-[#d8e9f8]"
    >
      <Bookmark
        className="h-[18px] w-[18px]"
        strokeWidth={1.75}
        fill={saved ? 'currentColor' : 'none'}
      />
      <span className="sr-only">{saved ? 'Remove bookmark' : 'Save this article'}</span>
    </button>
  );
}
