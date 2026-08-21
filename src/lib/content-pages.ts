export type MenuGroup = 'healthConditions' | 'wellness' | 'tools' | 'featured';

export type ContentPage = {
  slug: string;
  menu: MenuGroup | 'resources';
  item: string;
};

export type ContentHub = {
  id: 'conditions' | 'wellness' | 'tools' | 'featured';
  path: string;
  menu: MenuGroup;
  pages: ContentPage[];
};

export type RelatedItem = {
  href: string;
  menu: ContentPage['menu'];
  item: string;
};

export const CONDITION_PAGES: ContentPage[] = [
  { slug: 'heart-disease', menu: 'healthConditions', item: 'heartDisease' },
  { slug: 'mental-health', menu: 'healthConditions', item: 'mentalHealth' },
  { slug: 'diabetes', menu: 'healthConditions', item: 'diabetes' },
  { slug: 'respiratory', menu: 'healthConditions', item: 'respiratory' },
  { slug: 'eye-health', menu: 'healthConditions', item: 'eyeHealth' },
  { slug: 'bone-joint', menu: 'healthConditions', item: 'boneJoint' },
];

export const WELLNESS_PAGES: ContentPage[] = [
  { slug: 'clinical-support', menu: 'wellness', item: 'clinicalSupport' },
  { slug: 'drug-support', menu: 'wellness', item: 'drugSupport' },
  { slug: 'innovation', menu: 'wellness', item: 'innovation' },
  { slug: 'education', menu: 'wellness', item: 'education' },
  { slug: 'insights', menu: 'wellness', item: 'insights' },
];

export const VALUE_PAGES: ContentPage[] = [
  { slug: 'why-choose', menu: 'tools', item: 'whyChoose' },
  { slug: 'benefits', menu: 'tools', item: 'benefits' },
  { slug: 'editorial', menu: 'tools', item: 'editorial' },
  { slug: 'ai-content', menu: 'tools', item: 'aiContent' },
];

export const CHALLENGE_PAGES: ContentPage[] = [
  { slug: 'aligning-teams', menu: 'featured', item: 'aligningTeams' },
  { slug: 'quality-costs', menu: 'featured', item: 'qualityCosts' },
  { slug: 'equity', menu: 'featured', item: 'equity' },
  { slug: 'burnout', menu: 'featured', item: 'burnout' },
  { slug: 'outcomes', menu: 'featured', item: 'outcomes' },
  { slug: 'care-management', menu: 'featured', item: 'careManagement' },
];

export const HUBS: ContentHub[] = [
  { id: 'conditions', path: '/conditions', menu: 'healthConditions', pages: CONDITION_PAGES },
  { id: 'wellness', path: '/wellness', menu: 'wellness', pages: WELLNESS_PAGES },
  { id: 'tools', path: '/tools', menu: 'tools', pages: VALUE_PAGES },
  { id: 'featured', path: '/featured', menu: 'featured', pages: CHALLENGE_PAGES },
];

export const EXTRA_PAGES: ContentPage[] = [
  { slug: 'mental-wellbeing', menu: 'resources', item: 'mentalWellbeing' },
  { slug: 'living-well', menu: 'resources', item: 'livingWell' },
];

export const ECLIPSE_RELATED: RelatedItem = {
  href: '/eclipse-llm',
  menu: 'tools',
  item: 'remoteDiagnostics',
};

export function findHub(path: string): ContentHub | undefined {
  return HUBS.find((hub) => hub.path === path);
}

export function findPage(hubPath: string, slug: string): ContentPage | undefined {
  return findHub(hubPath)?.pages.find((page) => page.slug === slug);
}

export function relatedFromHub(hub: ContentHub): RelatedItem[] {
  return hub.pages.map((page) => ({
    href: `${hub.path}/${page.slug}`,
    menu: page.menu,
    item: page.item,
  }));
}
