import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { PostList } from '@/components/blog/PostList';
import { MediumPostList } from '@/components/blog/MediumPostList';
import { NewsletterCard } from '@/components/blog/NewsletterCard';
import { getBlogPosts } from '@/lib/blog/parse';
import type { HomeLayoutId } from '@/lib/blog/seo-settings';

const PER_PAGE = 10;

/**
 * Shared homepage shell. `classic` = grey card list; `medium` = Medium-style rows.
 */
export async function HomeFeed({
  locale,
  page,
  layout,
  basePath = '/',
  source = 'home',
}: {
  locale: string;
  page: number;
  layout: HomeLayoutId;
  /** Path used for pagination links (e.g. `/` or `/home2`). */
  basePath?: string;
  source?: string;
}) {
  const t = await getTranslations('Blog');
  const { items, total, totalPages } = await getBlogPosts(page, PER_PAGE);
  const isMedium = layout === 'medium';

  const hrefFor = (target: number) => {
    if (target <= 1) return basePath;
    return `${basePath}?page=${target}`;
  };

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-white">
        <div
          className={
            isMedium
              ? 'container mx-auto max-w-[680px] px-4 py-10 md:py-14'
              : 'container mx-auto max-w-4xl px-4 py-8 md:py-12'
          }
        >
          <header className={isMedium ? 'mb-2' : 'mb-6 border-b border-gray-200 pb-4'}>
            <h1
              className={
                isMedium
                  ? 'text-3xl font-bold tracking-tight text-gray-900 md:text-4xl'
                  : 'text-2xl md:text-3xl font-bold leading-tight text-black'
              }
            >
              {t('latestArticles')}
            </h1>
            <p className={`mt-1 text-sm ${isMedium ? 'text-gray-500' : 'text-gray-600'}`}>
              {total > 0 ? t('publishedCount', { count: total }) : t('freshWriting')}
            </p>
          </header>

          {isMedium ? (
            <MediumPostList posts={items} locale={locale} />
          ) : (
            <PostList posts={items} locale={locale} />
          )}

          {totalPages > 1 && (
            <nav
              className={`mt-8 flex items-center justify-between pt-5 text-sm ${
                isMedium ? 'border-t border-gray-200' : 'border-t border-gray-200'
              }`}
              aria-label="Pagination"
            >
              {page > 1 ? (
                <Link
                  href={hrefFor(page - 1)}
                  className="text-gray-900 underline underline-offset-2 decoration-gray-900 transition-colors hover:text-[#0066cc] hover:decoration-[#0066cc]"
                >
                  {t('newer')}
                </Link>
              ) : (
                <span />
              )}

              <span className="text-xs text-gray-500">
                {t('pageOf', { page, total: totalPages })}
              </span>

              {page < totalPages ? (
                <Link
                  href={hrefFor(page + 1)}
                  className="text-gray-900 underline underline-offset-2 decoration-gray-900 transition-colors hover:text-[#0066cc] hover:decoration-[#0066cc]"
                >
                  {t('older')}
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </div>

        <section className="border-t border-gray-200 bg-white">
          <div
            className={
              isMedium
                ? 'container mx-auto max-w-[680px] px-4 py-10 md:py-14'
                : 'container mx-auto max-w-4xl px-4 py-10 md:py-14'
            }
          >
            <NewsletterCard source={source} />
          </div>
        </section>
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
