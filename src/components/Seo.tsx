import { useEffect } from 'react';

type SeoProps = {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article';
  canonicalPath?: string;
  noindex?: boolean;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
};

const DEFAULT_IMAGE = '/logo.png';

function upsertMeta(selector: string, attrs: Record<string, string>, content: string) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    Object.entries(attrs).forEach(([key, value]) => element!.setAttribute(key, value));
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertLink(selector: string, rel: string, href: string) {
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

export default function Seo({
  title,
  description,
  keywords,
  image = DEFAULT_IMAGE,
  type = 'website',
  canonicalPath,
  noindex = false,
  structuredData,
}: SeoProps) {
  useEffect(() => {
    const absoluteImage = image.startsWith('http') ? image : new URL(image, window.location.origin).toString();
    const canonicalUrl = new URL(canonicalPath || window.location.pathname, window.location.origin).toString();

    document.title = title;
    document.documentElement.lang = 'ta';

    upsertMeta('meta[name="description"]', { name: 'description' }, description);
    upsertMeta('meta[name="keywords"]', { name: 'keywords' }, keywords || '');
    upsertMeta('meta[name="robots"]', { name: 'robots' }, noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large');
    upsertMeta('meta[property="og:title"]', { property: 'og:title' }, title);
    upsertMeta('meta[property="og:description"]', { property: 'og:description' }, description);
    upsertMeta('meta[property="og:type"]', { property: 'og:type' }, type);
    upsertMeta('meta[property="og:url"]', { property: 'og:url' }, canonicalUrl);
    upsertMeta('meta[property="og:image"]', { property: 'og:image' }, absoluteImage);
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image');
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, title);
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, description);
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, absoluteImage);
    upsertLink('link[rel="canonical"]', 'canonical', canonicalUrl);

    const scriptId = 'page-structured-data';
    const existing = document.getElementById(scriptId);
    if (structuredData) {
      const script = existing ?? document.createElement('script');
      script.id = scriptId;
      script.setAttribute('type', 'application/ld+json');
      script.textContent = JSON.stringify(structuredData);
      if (!existing) document.head.appendChild(script);
    } else if (existing) {
      existing.remove();
    }

    return () => {
      const current = document.getElementById(scriptId);
      if (current) current.remove();
    };
  }, [title, description, keywords, image, type, canonicalPath, noindex, structuredData]);

  return null;
}
