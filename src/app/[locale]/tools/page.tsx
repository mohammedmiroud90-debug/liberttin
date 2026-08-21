import { OurValueHubPage } from '@/components/pages/OurValueLandingPage';
import { HUBS } from '@/lib/content-pages';
import { contentHubMetadata } from '@/lib/content-metadata';

export async function generateMetadata() {
  return contentHubMetadata(HUBS[2]);
}

export default function ToolsHubPage() {
  return <OurValueHubPage hub={HUBS[2]} />;
}
