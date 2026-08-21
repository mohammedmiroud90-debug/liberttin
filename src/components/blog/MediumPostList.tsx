'use client';

import { useTranslations } from 'next-intl';
import { MessageSquare } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { categoryPath } from '@/lib/blog/config';
import { formatPostDate, type BlogPost } from '@/lib/blog/parse';

/**
 * Medium-inspired feed: plain white rows, black titles, hairline rules.
 * No grey cards — just title, meta, excerpt, and an optional thumbnail.
 */
export function MediumPostCard({ post, locale }: { post: BlogPost; locale: string }) {
  const t = useTranslations('Blog');

  return (
    <article className="border-b border-gray-200 py-8 first:pt-2 last:border-b-0">
      <div className="flex items-start gap-6 md:gap-10">
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-[13px] text-gray-500">
            <Link
              href={categoryPath(post.category)}
              className="font-medium text-gray-700 hover:text-black hover:underline"
            >
              {post.category}
            </Link>
            <span className="mx-1.5 text-gray-300">·</span>
            <span>{post.author}</span>
          </p>

          <h2 className="text-[1.35rem] font-bold leading-snug tracking-tight text-gray-900 md:text-[1.65rem]">
            <Link href={`/blog/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </h2>

          {post.excerpt && (
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-gray-600 line-clamp-2 md:line-clamp-3">
              {post.excerpt}
            </p>
          )}

          <p className="mt-4 text-[13px] text-gray-500">
            {formatPostDate(post.publishedAt, locale)}
            <span className="mx-1.5 text-gray-300">·</span>
            {t('minRead', { count: post.readingTime })}
            <span className="mx-1.5 text-gray-300">·</span>
            <Link
              href={`/blog/${post.slug}#comments`}
              className="inline-flex items-center gap-1 transition-colors hover:text-gray-700"
            >
              <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span>{post.commentsCount}</span>
            </Link>
          </p>
        </div>

        {post.imageUrl && (
          <Link
            href={`/blog/${post.slug}`}
            className="relative hidden h-[72px] w-[100px] flex-shrink-0 overflow-hidden bg-gray-100 sm:block md:h-[100px] md:w-[140px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.imageUrl}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </Link>
        )}
      </div>
    </article>
  );
}

export function MediumPostList({
  posts,
  locale,
  emptyMessage,
}: {
  posts: BlogPost[];
  locale: string;
  emptyMessage?: string;
}) {
  const t = useTranslations('Blog');

  if (posts.length === 0) {
    return (
      <div className="border-y border-gray-200 py-12 text-center">
        <p className="text-sm text-gray-600">{emptyMessage ?? t('emptyArticles')}</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <MediumPostCard key={post.id} post={post} locale={locale} />
      ))}
    </div>
  );
}
