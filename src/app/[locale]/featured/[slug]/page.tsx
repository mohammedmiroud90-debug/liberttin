import { notFound } from 'next/navigation';
import { ContentLandingPage } from '@/components/pages/ContentLandingPage';
import { CHALLENGE_PAGES, HUBS, findPage, relatedFromHub } from '@/lib/content-pages';
import { contentPageMetadata } from '@/lib/content-metadata';

export function generateStaticParams() {
  return CHALLENGE_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = findPage('/featured', slug);
  if (!page) return {};
  return contentPageMetadata(page);
}

export default async function FeaturedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hub = HUBS[3];
  const page = findPage('/featured', slug);
  if (!page) notFound();

  return <ContentLandingPage page={page} hub={hub} related={relatedFromHub(hub)} />;
}
