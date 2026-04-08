const normalizeFacebookUrl = (value: string) => value.trim().replace(/#$/, '');
const normalizeInstagramUrl = (value: string) => value.trim().replace(/#$/, '');

export const FACEBOOK_URL = normalizeFacebookUrl(
  import.meta.env.VITE_FACEBOOK_URL || import.meta.env.VITE_FACEBOOK_PAGE_URL || 'https://www.facebook.com/profile.php?id=61586921304748'
);

export const FACEBOOK_PAGE_URL = normalizeFacebookUrl(import.meta.env.VITE_FACEBOOK_PAGE_URL || '');
export const INSTAGRAM_URL = normalizeInstagramUrl(import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/vannatamilnews');

export const isEmbeddableFacebookPageUrl = (value: string) => {
  const url = normalizeFacebookUrl(value);
  if (!url) return false;
  if (!/https?:\/\/(www\.)?facebook\.com\//i.test(url)) return false;
  if (url.includes('facebook.com/profile.php?id=')) return false;
  if (url.includes('facebook.com/share/')) return false;
  return true;
};
