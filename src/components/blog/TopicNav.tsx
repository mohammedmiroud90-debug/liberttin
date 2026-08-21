import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ChevronRight } from 'lucide-react';
import { categoryPath } from '@/lib/blog/config';
import type { BlogPost } from '@/lib/blog/parse';

/**
 * Sticky "MORE IN <category>" strip under the site header, linking sibling
 * articles from the same category.
 */
export async function TopicNav({
  category,
  posts,
}: {
  category: string;
  posts: BlogPost[];
}) {
  if (posts.length === 0) return null;

  const t = await getTranslations('Blog');
  const href = categoryPath(category);

  return (
    <div className="sticky top-14 z-40 border-b border-gray-200 bg-white lg:top-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center gap-4 overflow-x-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            href={href}
            className="whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.08em] text-[#1a1a1a] hover:underline"
          >
            {t('moreIn', { category })}
          </Link>

          <div className="flex items-center gap-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                title={post.title}
                className="max-w-[190px] truncate whitespace-nowrap text-[13px] text-gray-700 hover:text-teal-700 hover:underline"
              >
                {post.title}
              </Link>
            ))}
          </div>

          <Link
            href={href}
            className="ml-auto flex-shrink-0 text-gray-500 hover:text-teal-700"
            aria-label={t('seeAllIn', { category })}
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  );
}
