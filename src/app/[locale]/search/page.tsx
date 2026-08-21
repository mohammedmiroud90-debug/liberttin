import type { Metadata } from 'next';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { PostList } from '@/components/blog/PostList';
import { searchBlogPosts } from '@/lib/blog/parse';

export const metadata: Metadata = {
  title: 'Search',
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q } = await searchParams;

  const query = (q ?? '').trim();
  const results = query ? await searchBlogPosts(query) : [];

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-white">
        <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
          <header className="mb-6 border-b border-gray-200 pb-4">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight text-black">
              {query ? `Results for “${query}”` : 'Search articles'}
            </h1>
            {query && (
              <p className="mt-1 text-sm text-gray-600">
                {results.length} {results.length === 1 ? 'article' : 'articles'} found
              </p>
            )}
          </header>

          {query ? (
            <PostList posts={results} locale={locale} />
          ) : (
            <p className="text-sm text-gray-600">
              Enter a search term using the search icon in the header.
            </p>
          )}
        </div>
      </main>

      <Footer />
      <CookieBanner />
    </>
  );
}
