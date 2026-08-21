import { ContentHubPage } from '@/components/pages/ContentLandingPage';
import { HUBS } from '@/lib/content-pages';
import { contentHubMetadata } from '@/lib/content-metadata';

export async function generateMetadata() {
  return contentHubMetadata(HUBS[1]);
}

export default function WellnessHubPage() {
  return <ContentHubPage hub={HUBS[1]} />;
}
