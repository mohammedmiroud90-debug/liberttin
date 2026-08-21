import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations('Header');
  return {
    title: `${t('menus.andMore')} | Billiant`,
    description: t('menus.exploreAll'),
  };
}

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
