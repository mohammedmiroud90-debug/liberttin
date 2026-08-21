import type { Metadata } from 'next';
import { HomeFeed } from '@/components/blog/HomeFeed';

export const metadata: Metadata = {
  title: 'Home (Medium feed)',
  description: 'Medium-style article feed preview for Billiant.',
};

export const revalidate = 60;

/**
 * Always renders the Medium feed so you can preview it even when the
 * active homepage setting is still "classic".
 */
export default async function Home2Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  return (
    <HomeFeed
      locale={locale}
      page={page}
      layout="medium"
      basePath="/home2"
      source="home2"
    />
  );
}
