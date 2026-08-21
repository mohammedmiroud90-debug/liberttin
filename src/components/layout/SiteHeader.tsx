import { getAllCategories, getAllTags } from '@/lib/blog/parse';
import { Header } from './Header';

/**
 * Server wrapper that hydrates the header with live categories and tags
 * so the first paint already has real dropdown items.
 */
export async function SiteHeader() {
  let categories: string[] = [];
  let tags: string[] = [];

  try {
    [categories, tags] = await Promise.all([getAllCategories(), getAllTags()]);
  } catch {
    // Header still renders; client fetch can recover.
  }

  return <Header categories={categories} tags={tags} />;
}
