import { notFound } from 'next/navigation';
import { ContentLandingPage } from '@/components/pages/ContentLandingPage';
import { CONDITION_PAGES, HUBS, findPage, relatedFromHub } from '@/lib/content-pages';
import { contentPageMetadata } from '@/lib/content-metadata';

export function generateStaticParams() {
  return CONDITION_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = findPage('/conditions', slug);
  if (!page) return {};
  return contentPageMetadata(page);
}

export default async function ConditionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hub = HUBS[0];
  const page = findPage('/conditions', slug);
  if (!page) notFound();

  return <ContentLandingPage page={page} hub={hub} related={relatedFromHub(hub)} />;
}
