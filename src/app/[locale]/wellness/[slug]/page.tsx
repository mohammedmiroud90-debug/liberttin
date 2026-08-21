import { notFound } from 'next/navigation';
import { ContentLandingPage } from '@/components/pages/ContentLandingPage';
import { WELLNESS_PAGES, HUBS, findPage, relatedFromHub } from '@/lib/content-pages';
import { contentPageMetadata } from '@/lib/content-metadata';

export function generateStaticParams() {
  return WELLNESS_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = findPage('/wellness', slug);
  if (!page) return {};
  return contentPageMetadata(page);
}

export default async function WellnessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hub = HUBS[1];
  const page = findPage('/wellness', slug);
  if (!page) notFound();

  return <ContentLandingPage page={page} hub={hub} related={relatedFromHub(hub)} />;
}
