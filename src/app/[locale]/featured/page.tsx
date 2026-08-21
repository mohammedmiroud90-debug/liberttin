import { ContentHubPage } from '@/components/pages/ContentLandingPage';
import { HUBS } from '@/lib/content-pages';
import { contentHubMetadata } from '@/lib/content-metadata';

export async function generateMetadata() {
  return contentHubMetadata(HUBS[3]);
}

export default function FeaturedHubPage() {
  return <ContentHubPage hub={HUBS[3]} />;
}
