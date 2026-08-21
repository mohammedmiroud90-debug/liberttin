import { contentPageMetadata } from '@/lib/content-metadata';
import { EXTRA_PAGES } from '@/lib/content-pages';

export async function generateMetadata() {
  return contentPageMetadata(EXTRA_PAGES[1]);
}

export default function LivingWellLayout({ children }: { children: React.ReactNode }) {
  return children;
}
