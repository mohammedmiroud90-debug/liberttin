import { getTranslations } from 'next-intl/server';
import { SITE_NAME } from '@/lib/site';
import type { ContentHub, ContentPage } from './content-pages';

type MenusCopy = Record<string, Record<string, string>>;
type PagesCopy = Record<string, { title?: string; subtitle?: string; overview?: string }>;

export async function contentPageMetadata(page: ContentPage) {
  const tHeader = await getTranslations('Header');
  const tContent = await getTranslations('ContentPages');
  const menus = tHeader.raw('menus') as MenusCopy;
  const pages = tContent.raw('pages') as PagesCopy;
  const copy = pages[page.slug];

  const title =
    page.menu === 'resources' ? copy?.title || SITE_NAME : menus[page.menu]?.[page.item] || SITE_NAME;
  const description =
    page.menu === 'resources'
      ? copy?.subtitle || copy?.overview
      : menus[page.menu]?.[`${page.item}Desc`] || copy?.overview;

  return { title: `${title} | ${SITE_NAME}`, description };
}

export async function contentHubMetadata(hub: ContentHub) {
  const tHeader = await getTranslations('Header');
  const menus = tHeader.raw('menus') as MenusCopy;
  return {
    title: `${menus[hub.menu]?.title || SITE_NAME} | ${SITE_NAME}`,
    description: menus[hub.menu]?.blurb,
  };
}
