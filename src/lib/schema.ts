const SITE_NAME = 'Vannatamil News';
const SITE_URL = 'https://vannatamil.news';
const LOGO_PATH = '/logo.png';
const DEFAULT_SOCIAL_LINKS = [
  'https://www.youtube.com/',
  'https://www.facebook.com/',
];

type SchemaObject = Record<string, unknown>;

function getOrigin() {
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin;
  }

  return SITE_URL;
}

export function absoluteUrl(path = '/') {
  if (path.startsWith('http')) return path;
  return new URL(path, getOrigin()).toString();
}

export function siteSchema(extraSchema: SchemaObject | SchemaObject[] = []) {
  const origin = getOrigin();
  const graph = [
    {
      '@type': 'WebSite',
      '@id': `${origin}/#website`,
      name: SITE_NAME,
      url: `${origin}/`,
      inLanguage: 'ta-IN',
      publisher: {
        '@id': `${origin}/#organization`,
      },
    },
    {
      '@type': 'NewsMediaOrganization',
      '@id': `${origin}/#organization`,
      name: SITE_NAME,
      url: `${origin}/`,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(LOGO_PATH),
      },
      sameAs: DEFAULT_SOCIAL_LINKS,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'info@vannatamil.news',
        telephone: '+91-8015007158',
        areaServed: 'IN',
        availableLanguage: ['Tamil', 'English'],
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Vriddhachalam',
        addressRegion: 'Tamil Nadu',
        postalCode: '606104',
        addressCountry: 'IN',
      },
    },
    ...(Array.isArray(extraSchema) ? extraSchema : [extraSchema]),
  ].filter((item) => Object.keys(item).length > 0);

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export function webPageSchema(path: string, name: string, description: string): SchemaObject {
  const url = absoluteUrl(path);

  return {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: 'ta-IN',
    isPartOf: {
      '@id': `${getOrigin()}/#website`,
    },
  };
}

export function collectionPageSchema(path: string, name: string, description: string): SchemaObject {
  return {
    ...webPageSchema(path, name, description),
    '@type': 'CollectionPage',
  };
}

export function videoSchema(video: {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  publishedAt?: string;
}): SchemaObject {
  const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`;

  return {
    '@type': 'VideoObject',
    name: video.title || 'Vannatamil News Video',
    description: video.description || 'Tamil news video from Vannatamil News.',
    thumbnailUrl: video.thumbnail ? [video.thumbnail] : [absoluteUrl(LOGO_PATH)],
    uploadDate: video.publishedAt || undefined,
    embedUrl: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id)}`,
    contentUrl: watchUrl,
    publisher: {
      '@id': `${getOrigin()}/#organization`,
    },
  };
}
