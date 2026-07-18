import { copyFile, mkdir, readFile, readdir, stat } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';

const distDir = resolve('dist');
const indexPath = resolve(distDir, 'index.html');
const fallbackPath = resolve(distDir, '404.html');
const textFileExtensions = new Set(['.html', '.js', '.css', '.json', '.xml', '.txt']);
const staticRoutes = [
  '/menu',
  '/youtube',
  '/facebook',
  '/live-tv',
  '/about',
  '/privacy-policy',
  '/terms-of-service',
  '/category/tamil-nadu',
  '/category/business',
  '/category/technology',
  '/category/sports',
  '/category/entertainment',
  '/news/1',
  '/news/2',
  '/news/3',
  '/news/4',
  '/news/5',
];

await copyFile(indexPath, fallbackPath);

async function walkFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walkFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function normalizeRoutePath(value) {
  const withoutHash = value.split('#')[0];
  const pathOnly = withoutHash.split('?')[0].trim().replace(/\/$/, '');
  if (!pathOnly || pathOnly === '/') return null;
  if (!pathOnly.startsWith('/')) return null;
  if (pathOnly.includes('://') || pathOnly.startsWith('//')) return null;
  if (/\.[a-z0-9]{2,5}$/i.test(pathOnly)) return null;
  return pathOnly;
}

function addRoute(routes, value) {
  const routePath = normalizeRoutePath(value);
  if (routePath) routes.add(routePath);
}

const sitemapPath = resolve(distDir, 'sitemap.xml');
const sitemap = await readFile(sitemapPath, 'utf8').catch(() => '');
const routes = new Set(staticRoutes);

for (const match of sitemap.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)) {
  addRoute(routes, match[1]);
}

const textFiles = (await walkFiles(distDir)).filter((filePath) => textFileExtensions.has(extname(filePath)));

for (const filePath of textFiles) {
  const fileStat = await stat(filePath);
  if (fileStat.size > 5_000_000) continue;

  const content = await readFile(filePath, 'utf8').catch(() => '');
  const linkMatches = content.matchAll(/(?:https?:\/\/vannatamil\.news)?\/(?:menu|youtube|facebook|category|live-tv|videos|news|about|privacy-policy|terms-of-service)\/?[A-Za-z0-9._~!$&'()*+,;=:@%-]*/g);

  for (const match of linkMatches) {
    addRoute(routes, match[0].replace(/^https?:\/\/vannatamil\.news/i, ''));
  }
}

const youtubeFeedPath = resolve(distDir, 'youtube-videos.json');
const youtubeFeed = await readFile(youtubeFeedPath, 'utf8').catch(() => '');
if (youtubeFeed) {
  try {
    const parsed = JSON.parse(youtubeFeed);
    const videos = Array.isArray(parsed?.videos) ? parsed.videos : [];
    for (const video of videos) {
      if (typeof video?.id === 'string' && video.id.trim()) {
        addRoute(routes, `/videos/${encodeURIComponent(video.id.trim())}`);
      }
    }
  } catch {
    console.warn('Could not parse dist/youtube-videos.json while creating route indexes.');
  }
}

for (const routePath of routes) {
  const normalizedPath = routePath
    .split('/')
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment))
    .join('/');
  const routeIndexPath = resolve(distDir, normalizedPath, 'index.html');

  if (!routeIndexPath.startsWith(distDir)) {
    throw new Error(`Refusing to write route outside dist: ${routePath}`);
  }

  await mkdir(dirname(routeIndexPath), { recursive: true });
  await copyFile(indexPath, routeIndexPath);
}

console.log(`Created dist/404.html and ${routes.size} route index files for GitHub Pages.`);
