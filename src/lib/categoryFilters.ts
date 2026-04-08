export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'tamil-nadu': ['tamil nadu', 'tamil', 'chennai', 'madurai', 'politics', 'news'],
  business: ['business', 'economy', 'finance', 'trade', 'stock', 'market'],
  technology: ['technology', 'tech', 'ai', 'software', 'internet', 'robotics'],
  sports: ['sports', 'cricket', 'football', 'kabaddi', 'olympics', 'ipl'],
  entertainment: ['movie', 'movies', 'film', 'cinema', 'kollywood', 'trailer', 'teaser', 'review', 'song'],
};

export const CATEGORY_SEARCH_QUERY: Partial<Record<string, string>> = {
  entertainment: 'tamil movie',
};

export function getCategoryKeywords(slug?: string | null): string[] {
  if (!slug) return [];
  return CATEGORY_KEYWORDS[slug] ?? [];
}

export function getCategorySearchQuery(slug?: string | null): string | undefined {
  if (!slug) return undefined;
  return CATEGORY_SEARCH_QUERY[slug];
}

export function getCategorySlugFromName(name?: string | null): string | null {
  if (!name) return null;
  const normalized = name.trim().toLowerCase();
  if (normalized === 'tamil nadu') return 'tamil-nadu';
  if (normalized === 'business') return 'business';
  if (normalized === 'technology') return 'technology';
  if (normalized === 'sports') return 'sports';
  if (normalized === 'entertainment') return 'entertainment';
  return null;
}
