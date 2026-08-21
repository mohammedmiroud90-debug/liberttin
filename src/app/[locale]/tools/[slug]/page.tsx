import { notFound } from 'next/navigation';
import { OurValueLandingPage } from '@/components/pages/OurValueLandingPage';
import { VALUE_PAGES, HUBS, ECLIPSE_RELATED, findPage, relatedFromHub } from '@/lib/content-pages';
import { contentPageMetadata } from '@/lib/content-metadata';

export function generateStaticParams() {
  return VALUE_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = findPage('/tools', slug);
  if (!page) return {};
  return contentPageMetadata(page);
}

export default async function ToolsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hub = HUBS[2];
  const page = findPage('/tools', slug);
  if (!page) notFound();

  return (
    <OurValueLandingPage
      page={page}
      hub={hub}
      related={[...relatedFromHub(hub), ECLIPSE_RELATED]}
    />
  );
}
