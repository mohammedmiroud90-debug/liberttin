'use client';

import { useTranslations } from 'next-intl';
import { MessageSquare } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { categoryPath } from '@/lib/blog/config';
import { formatPostDate, type BlogPost } from '@/lib/blog/parse';

/**
 * Post list styled after the header dropdown panels: light grey card, brand-blue
 * headline, underlined body links.
 */
export function PostCard({ post, locale }: { post: BlogPost; locale: string }) {
  const t = useTranslations('Blog');

  return (
    <article className="bg-[#f2f2f2] text-black p-5 md:p-6">
      <div className="flex gap-5">
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-gray-600">
            <Link href={categoryPath(post.category)} className="hover:text-teal-700 hover:underline">
              {post.category}
            </Link>
          </p>

          <h2 className="mb-2 text-xl md:text-2xl font-bold leading-tight text-[#0066cc]">
            <Link href={`/blog/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </h2>

          {post.excerpt && (
            <p className="mb-3 text-sm leading-snug text-gray-900 line-clamp-3">{post.excerpt}</p>
          )}

          <p className="mb-3 text-xs text-gray-600">
            {post.author} · {formatPostDate(post.publishedAt, locale)} ·{' '}
            {t('minRead', { count: post.readingTime })}
          </p>

          <div className="flex items-center gap-4">
            <Link
              href={`/blog/${post.slug}`}
              className="text-sm text-gray-900 underline underline-offset-2 decoration-gray-900 transition-colors hover:text-[#0066cc] hover:decoration-[#0066cc]"
            >
              {t('readArticle')}
            </Link>
            <Link
              href={`/blog/${post.slug}#comments`}
              className="inline-flex items-center gap-1.5 text-xs text-gray-600 transition-colors hover:text-[#0066cc]"
            >
              <MessageSquare className="h-4 w-4" strokeWidth={1.75} />
              <span>{post.commentsCount}</span>
            </Link>
          </div>
        </div>

        {post.imageUrl && (
          <Link
            href={`/blog/${post.slug}`}
            className="relative hidden h-24 w-32 flex-shrink-0 overflow-hidden bg-gray-200 sm:block md:h-28 md:w-44"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.imageUrl}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </Link>
        )}
      </div>
    </article>
  );
}

export function PostList({
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
      <div className="bg-[#f2f2f2] p-8 text-center">
        <p className="text-sm text-gray-700">{emptyMessage ?? t('emptyArticles')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} locale={locale} />
      ))}
    </div>
  );
}
