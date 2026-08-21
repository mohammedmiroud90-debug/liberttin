/**
 * Category descriptions for Medium-style category pages.
 * Each category can have a title, description, and optional follow button text.
 */

export type CategoryDescription = {
  name: string;
  title: string;
  description: string;
  /** Featured badge text, e.g., "Featured" */
  featured?: boolean;
  /** Avatar or icon URL (optional) */
  avatar?: string;
  /** Follow button text (optional) */
  followText?: string;
};

export const CATEGORY_DESCRIPTIONS: Record<string, CategoryDescription> = {
  strategy: {
    name: 'Strategy',
    title: 'Strategy',
    description:
      'Insights and applications of strategy for the everyday reader. We publish articles on how to solve problems, improve decision-making, case studies, interviews, and tutorials.',
    featured: true,
  },
  'information-technology': {
    name: 'Information Technology',
    title: 'Information Technology',
    description:
      'Deep dives into technology trends, software development, cybersecurity, and digital transformation. Expert insights for IT professionals and tech enthusiasts.',
    featured: true,
  },
  'role-of-technology': {
    name: 'Role of Technology',
    title: 'Role Of Technology',
    description:
      'Exploring how technology shapes our world, from enterprise solutions to societal impact. Analysis of technological change and its implications for business and life.',
    featured: false,
  },
  maturity: {
    name: 'Maturity',
    title: 'Maturity',
    description:
      'Personal growth, professional development, and organizational maturity. Insights on leadership, decision-making, and building sustainable practices.',
    featured: false,
  },
  business: {
    name: 'Business',
    title: 'Business',
    description:
      'Business strategy, entrepreneurship, and management insights. From startups to enterprises, we cover what it takes to build and grow successful organizations.',
    featured: true,
  },
  cybersecurity: {
    name: 'Cybersecurity',
    title: 'Cybersecurity',
    description:
      'Security threats, defense strategies, and best practices for protecting digital assets. Expert analysis of the evolving cybersecurity landscape.',
    featured: true,
  },
  'artificial-intelligence': {
    name: 'Artificial Intelligence',
    title: 'Artificial Intelligence',
    description:
      'The latest in AI research, applications, and implications. From machine learning to large language models, exploring how AI is transforming industries.',
    featured: true,
  },
  health: {
    name: 'Health',
    title: 'Health',
    description:
      'Evidence-based health information, wellness strategies, and medical insights. Expert perspectives on maintaining physical and mental wellbeing.',
    featured: false,
  },
  'mental-wellbeing': {
    name: 'Mental Wellbeing',
    title: 'Mental Wellbeing',
    description:
      'Mental health resources, mindfulness practices, and emotional wellness strategies. Professional guidance for a balanced, healthy mind.',
    featured: false,
  },
  'living-well': {
    name: 'Living Well',
    title: 'Living Well',
    description:
      'Lifestyle, productivity, and life optimization insights. Practical advice for living a more fulfilling, balanced, and intentional life.',
    featured: false,
  },
  wellness: {
    name: 'Wellness',
    title: 'Wellness',
    description:
      'Holistic wellness approaches covering physical health, mental fitness, nutrition, and lifestyle. Evidence-based guidance for total wellbeing.',
    featured: false,
  },
  general: {
    name: 'General',
    title: 'General',
    description:
      'A collection of diverse topics and perspectives. From thought leadership to practical guides, exploring ideas that matter.',
    featured: false,
  },
};

/**
 * Get description for a category by its slug or name
 */
export function getCategoryDescription(categoryName: string): CategoryDescription | null {
  // Try exact match first
  const exactMatch = CATEGORY_DESCRIPTIONS[categoryName.toLowerCase()];
  if (exactMatch) return exactMatch;

  // Try with slugified key
  const slugKey = categoryName.toLowerCase().replace(/\s+/g, '-');
  const slugMatch = CATEGORY_DESCRIPTIONS[slugKey];
  if (slugMatch) return slugMatch;

  // Try to find by name (case-insensitive)
  const nameMatch = Object.values(CATEGORY_DESCRIPTIONS).find(
    (desc) => desc.name.toLowerCase() === categoryName.toLowerCase()
  );
  if (nameMatch) return nameMatch;

  // Return a default description
  return {
    name: categoryName,
    title: categoryName,
    description: `Articles and insights about ${categoryName}. Expert perspectives and practical guidance.`,
    featured: false,
  };
}

/**
 * Check if a category should show the "Follow publication" button
 */
export function shouldShowFollowButton(categoryName: string): boolean {
  const desc = getCategoryDescription(categoryName);
  return desc?.featured ?? false;
}
