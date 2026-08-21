import { ContentHubPage } from '@/components/pages/ContentLandingPage';
import { HUBS } from '@/lib/content-pages';
import { contentHubMetadata } from '@/lib/content-metadata';

export async function generateMetadata() {
  return contentHubMetadata(HUBS[0]);
}

export default function ConditionsHubPage() {
  return <ContentHubPage hub={HUBS[0]} />;
}
