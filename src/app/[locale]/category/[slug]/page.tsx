import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Home } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { PostList } from '@/components/blog/PostList';
import { NewsletterCard } from '@/components/blog/NewsletterCard';
import { categoryPath, slugify } from '@/lib/blog/config';
import {
  getAllCategories,
  getBlogPostsByCategory,
  resolveCategoryFromSlug,
} from '@/lib/blog/parse';
import { getCategoryDescription } from '@/lib/blog/category-descriptions';
import { SITE_URL } from '@/lib/site';

const PER_PAGE = 10;

export const revalidate = 60;

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({ slug: slugify(category) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = await resolveCategoryFromSlug(slug);
  if (!category) return { title: 'Category not found', robots: { index: false, follow: true } };

  const categoryDesc = getCategoryDescription(category);
  const path = categoryPath(category);
  
  return {
    title: categoryDesc.title,
    description: categoryDesc.description,
    alternates: { canonical: `${SITE_URL}/en${path}` },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/${locale}${path}`,
      title: categoryDesc.title,
      description: categoryDesc.description,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { locale, slug } = await params;
  const { page: pageParam } = await searchParams;
  const t = await getTranslations('Blog');

  const category = await resolveCategoryFromSlug(slug);
  if (!category) notFound();

  const categoryDesc = getCategoryDescription(category);
  const page = Math.max(1, Number(pageParam) || 1);
  const { items, total, totalPages } = await getBlogPostsByCategory(category, page, PER_PAGE);
  const basePath = categoryPath(category);

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-white">
        {/* Medium-style category header */}
        <div className="border-b border-gray-200 bg-white">
          <div className="container mx-auto max-w-[1192px] px-6 py-16 md:py-20">
            <div className="flex items-start gap-8">
              {/* Avatar/Icon */}
              <div className="hidden md:block">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-900 text-white">
                  <Home className="h-10 w-10" strokeWidth={1.5} />
                </div>
              </div>

              {/* Description */}
              <div className="flex-1">
                {categoryDesc.featured && (
                  <div className="mb-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[13px] text-gray-600">
                      <Home className="h-4 w-4" strokeWidth={2} />
                      Featured
                    </span>
                  </div>
                )}

                <h1 className="mb-4 text-[2.5rem] font-bold leading-[1.15] tracking-tight text-gray-900 md:text-[3.2rem]">
                  {categoryDesc.title}
                </h1>

                <p className="mb-6 max-w-2xl text-[1.1rem] leading-[1.5] text-gray-600 md:text-[1.25rem]">
                  {categoryDesc.description}
                </p>

                <button
                  type="button"
                  className="rounded-full bg-gray-900 px-5 py-2 text-[14px] font-medium text-white transition-colors hover:bg-black"
                >
                  Follow publication
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
            <span className="text-gray-900">{categoryDesc.title}</span>
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
              <p className="text-gray-600">No articles published yet in this category.</p>
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
            <NewsletterCard source="category" />
          </div>
        </section>
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
