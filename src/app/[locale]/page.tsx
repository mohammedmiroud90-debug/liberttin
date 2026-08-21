import type { Metadata } from 'next';
import { redirect } from '@/i18n/routing';
import { HomeFeed } from '@/components/blog/HomeFeed';
import { categoryPath } from '@/lib/blog/config';
import { fetchSeoSettings } from '@/lib/blog/seo-settings';

export const metadata: Metadata = {
  title: 'Billiant — Articles',
  description: 'Long-form articles, guides, and analysis from the Billiant editorial team.',
};

export const revalidate = 60;

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam, category: categoryParam } = await searchParams;

  if (categoryParam?.trim()) {
    redirect({ href: categoryPath(categoryParam.trim()), locale });
  }

  const seo = await fetchSeoSettings();
  const page = Math.max(1, Number(pageParam) || 1);

  return (
    <HomeFeed
      locale={locale}
      page={page}
      layout={seo.homeLayout}
      basePath="/"
      source="home"
    />
  );
}
