import { NextResponse } from 'next/server';
import { getAllCategories, getAllTags } from '@/lib/blog/parse';

export const revalidate = 60;

/** Public nav taxonomy for the site header dropdowns. */
export async function GET() {
  try {
    const [categories, tags] = await Promise.all([getAllCategories(), getAllTags()]);
    return NextResponse.json(
      { categories, tags },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch {
    return NextResponse.json({ categories: [], tags: [] }, { status: 200 });
  }
}
