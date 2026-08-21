import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Tag, Home } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { PostList } from '@/components/blog/PostList';
import { NewsletterCard } from '@/components/blog/NewsletterCard';
import { slugify, tagPath } from '@/lib/blog/config';
import { getAllTags, getBlogPostsByTag, resolveTagFromSlug } from '@/lib/blog/parse';
import { SITE_URL } from '@/lib/site';

const PER_PAGE = 10;

export const revalidate = 60;

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ slug: slugify(tag) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const tag = await resolveTagFromSlug(slug);
  if (!tag) return { title: 'Tag not found', robots: { index: false, follow: true } };

  const path = tagPath(tag);
  return {
    title: tag,
    description: `Articles tagged ${tag} from Billiant.`,
    alternates: { canonical: `${SITE_URL}/en${path}` },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/${locale}${path}`,
      title: tag,
    },
  };
}

export default async function TagPage({ params, searchParams }: PageProps) {
  const { locale, slug } = await params;
  const { page: pageParam } = await searchParams;
  const t = await getTranslations('Blog');

  const tag = await resolveTagFromSlug(slug);
  if (!tag) notFound();

  const page = Math.max(1, Number(pageParam) || 1);
  const { items, total, totalPages } = await getBlogPostsByTag(tag, page, PER_PAGE);
  const basePath = tagPath(tag);

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-white">
        {/* Medium-style tag header */}
        <div className="border-b border-gray-200 bg-white">
          <div className="container mx-auto max-w-[1192px] px-6 py-16 md:py-20">
            <div className="flex items-start gap-8">
              {/* Tag icon */}
              <div className="hidden md:block">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-900">
                  <Tag className="h-10 w-10" strokeWidth={1.5} />
                </div>
              </div>

              {/* Description */}
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-600" strokeWidth={2} />
                  <span className="text-[13px] text-gray-600">Topic</span>
                </div>

                <h1 className="mb-4 text-[2.5rem] font-bold leading-[1.15] tracking-tight text-gray-900 md:text-[3.2rem]">
                  {tag}
                </h1>

                <p className="mb-6 max-w-2xl text-[1.1rem] leading-[1.5] text-gray-600 md:text-[1.25rem]">
                  Articles and insights tagged with "{tag}". Explore curated content on this topic.
                </p>

                <button
                  type="button"
                  className="rounded-full border border-gray-900 bg-white px-5 py-2 text-[14px] font-medium text-gray-900 transition-colors hover:bg-gray-50"
                >
                  Follow topic
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Articles section */}
        <div className="container mx-auto max-w-[1192px] px-6 py-12 md:py-16">
          {/* Navigation breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900 hover:underline">
              Home
            </Link>
            <span>→</span>
            <span className="text-gray-900">{tag}</span>
          </div>

          {/* Article count */}
          <p className="mb-6 text-sm text-gray-600">
            {total > 0
              ? `${total} ${total === 1 ? 'article' : 'articles'}`
              : 'No articles yet'}
          </p>

          {/* Articles grid */}
          {total > 0 ? (
            <PostList posts={items} locale={locale} />
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
              <p className="text-gray-600">No articles tagged with "{tag}" yet.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6 text-sm"
              aria-label="Pagination"
            >
              {page > 1 ? (
                <Link
                  href={page - 1 === 1 ? basePath : `${basePath}?page=${page - 1}`}
                  className="text-gray-900 underline underline-offset-2 decoration-gray-900 transition-colors hover:text-gray-600"
                >
                  ← Newer articles
                </Link>
              ) : (
                <span />
              )}

              <span className="text-xs text-gray-500">
                Page {page} of {totalPages}
              </span>

              {page < totalPages ? (
                <Link
                  href={`${basePath}?page=${page + 1}`}
                  className="text-gray-900 underline underline-offset-2 decoration-gray-900 transition-colors hover:text-gray-600"
                >
                  Older articles →
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </div>

        {/* Newsletter section */}
        <section className="border-t border-gray-200 bg-gray-50">
          <div className="container mx-auto max-w-[1192px] px-6 py-14 md:py-16">
            <NewsletterCard source="tag" />
          </div>
        </section>
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
