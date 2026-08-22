'use client';

import { useEffect, useRef, useState } from 'react';
import { Link } from '@/i18n/routing';
import { AuthorAvatarHoverCard } from '@/components/blog/AuthorAvatarHoverCard';

type AuthorBylineProps = {
  author: string;
  avatar?: string;
  bio?: string;
  publishedLabel: string;
  updatedLabel?: string | null;
  factChecker?: string;
};

export function AuthorByline({
  author,
  avatar,
  bio,
  publishedLabel,
  updatedLabel,
  factChecker,
}: AuthorBylineProps) {
  const underline = 'underline decoration-gray-500 underline-offset-2';
  const dateLabel = updatedLabel ? `Updated on ${updatedLabel}` : `Published on ${publishedLabel}`;

  return (
    <div className="flex w-full items-start gap-3 text-left">
      <AuthorAvatarHoverCard author={author} avatar={avatar} bio={bio} size={44} />
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
    </div>
  );
}
