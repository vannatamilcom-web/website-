type CategoryLike = {
  slug: string;
  name: string;
  nameTa: string;
};

const TAMIL_BY_SLUG: Record<string, string> = {
  'tamil-nadu': 'தமிழ்நாடு',
  business: 'வணிகம்',
  technology: 'தொழில்நுட்பம்',
  sports: 'விளையாட்டு',
  entertainment: 'திரைப்படங்கள்',
};

const EN_BY_SLUG: Record<string, string> = {
  entertainment: 'Movies',
};

export function getCategoryLabel(category: CategoryLike, lang: 'ta' | 'en') {
  if (lang === 'ta') return TAMIL_BY_SLUG[category.slug] ?? category.nameTa;
  return EN_BY_SLUG[category.slug] ?? category.name;
}

