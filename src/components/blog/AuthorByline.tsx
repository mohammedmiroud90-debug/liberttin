'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { AvatarWithFallback } from '@/components/ui/avatar-with-fallback';

type AuthorBylineProps = {
  author: string;
  avatar?: string;
  publishedLabel: string;
  updatedLabel?: string | null;
  factChecker?: string;
};

export function AuthorByline({
  author,
  avatar,
  publishedLabel,
  updatedLabel,
  factChecker,
}: AuthorBylineProps) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 180);
  };

  const openCard = () => {
    cancelClose();
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => () => cancelClose(), []);

  const underline = 'underline decoration-gray-500 underline-offset-2';
  const dateLabel = updatedLabel ? `Updated on ${updatedLabel}` : `Published on ${publishedLabel}`;

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openCard}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className="flex w-full items-start gap-3 text-left"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
      >
        <AvatarWithFallback src={avatar ?? null} alt={author} size={44} className="flex-shrink-0" />
        <p className="text-[13px] leading-[1.45] text-gray-800">
          {factChecker && (
            <>
              Medically reviewed by <span className={underline}>{factChecker}</span>
              {' — '}
            </>
          )}
          Written by <span className={underline}>{author}</span>
          {' — '}
          <span className={underline}>{dateLabel}</span>
        </p>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Editorial team"
          className="absolute left-0 top-[calc(100%+10px)] z-40 w-[min(100vw-2rem,22rem)] rounded-md border border-gray-800 bg-white px-6 pb-6 pt-5 shadow-[0_8px_28px_rgba(0,0,0,0.18)]"
          onMouseEnter={openCard}
          onMouseLeave={scheduleClose}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-3 top-3 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>

          <div className="border-b border-gray-200 px-1 pb-5 text-center">
            <h3 className="font-serif text-[1.35rem] font-bold leading-tight text-[#2b1d14]">
              Our Review Process
            </h3>
            <p className="mx-auto mt-3 max-w-[17rem] text-[13px] leading-relaxed text-gray-700">
              BILLIANT&apos;s content is created, fact-checked, and reviewed by qualified writers,
              editors, clinicians, and other contributors.
            </p>
            <Link
              href="/about"
              className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-teal-700 hover:text-teal-800"
              onClick={() => setOpen(false)}
            >
              Read more
              <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="pt-5 text-center">
            <h3 className="font-serif text-[1.35rem] font-bold leading-tight text-[#2b1d14]">
              Our Editorial Team
            </h3>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[13px] font-medium leading-snug text-gray-900">{author}</p>
                <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-teal-700">
                  Author
                </p>
              </div>

              <div>
                <p className="text-[13px] font-medium leading-snug text-gray-900">
                  {factChecker || 'BILLIANT Medical Review Board'}
                </p>
                <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-teal-700">
                  Medical advisor
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
