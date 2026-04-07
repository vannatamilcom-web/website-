import fs from 'node:fs/promises';
import path from 'node:path';

const configPath = path.join(process.cwd(), 'public', 'site-config.json');

async function readSiteConfig() {
  try {
    const raw = await fs.readFile(configPath, 'utf8');
    const json = JSON.parse(raw);
    return json && typeof json === 'object' ? json : {};
  } catch {
    return {};
  }
}

const config = await readSiteConfig();
const configChannelId = typeof config.youtubeChannelId === 'string' ? config.youtubeChannelId.trim() : '';

const normalizeYouTubeChannelId = (value) => {
  const raw = typeof value === 'string' ? value.trim() : '';
  if (!raw) return '';

  const direct = raw.match(/\bU[CU][0-9A-Za-z_-]{20,}\b/)?.[0];
  if (direct?.startsWith('UC')) return direct;
  if (direct?.startsWith('UU')) return `UC${direct.slice(2)}`;

  const channelUrlMatch = raw.match(/youtube\.com\/channel\/(UC[0-9A-Za-z_-]{20,})/i)?.[1];
  if (channelUrlMatch) return channelUrlMatch;

  const playlistMatch = raw.match(/[?&]list=(UU[0-9A-Za-z_-]{20,})/i)?.[1];
  if (playlistMatch) return `UC${playlistMatch.slice(2)}`;

  return '';
};

const channelId = normalizeYouTubeChannelId(process.env.YOUTUBE_CHANNEL_ID) ||
  normalizeYouTubeChannelId(process.env.VITE_YOUTUBE_CHANNEL_ID) ||
  normalizeYouTubeChannelId(configChannelId) ||
  '';
const limit = Number(process.env.YOUTUBE_VIDEO_LIMIT || 12);
const outputPath = path.join(process.cwd(), 'public', 'youtube-videos.json');

const decodeXml = (value) =>
  value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'");

const extractTagText = (entry, tagName) => {
  const match = entry.match(new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  return match?.[1] ? decodeXml(match[1].trim()) : '';
};

const extractAttr = (entry, tagName, attrName) => {
  const match = entry.match(new RegExp(`<${tagName}[^>]*\\s${attrName}="([^"]+)"[^>]*/?>`, 'i'));
  return match?.[1] ? decodeXml(match[1].trim()) : '';
};

async function writeFeed(payload) {
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(payload, null, 2), 'utf8');
}

if (!channelId) {
  const message = '[youtube] Missing YOUTUBE_CHANNEL_ID (or VITE_YOUTUBE_CHANNEL_ID).';
  console.log(`${message} Writing empty feed.`);
  await writeFeed({
    generatedAt: new Date().toISOString(),
    channelId: '',
    count: 0,
    videos: [],
    error: message,
  });
  process.exit(0);
}

if (!Number.isFinite(limit) || limit <= 0) {
  throw new Error(`[youtube] Invalid YOUTUBE_VIDEO_LIMIT: ${process.env.YOUTUBE_VIDEO_LIMIT}`);
}

const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
console.log(`[youtube] Fetching RSS: ${feedUrl}`);

try {
  const response = await fetch(feedUrl);
  if (!response.ok) throw new Error(`[youtube] RSS error (${response.status})`);

  const xml = await response.text();
  const entries = Array.from(xml.matchAll(/<entry>([\s\S]*?)<\/entry>/gi)).map((m) => m[1] || '');

  const videos = entries.slice(0, limit).map((entry) => {
    const id = extractTagText(entry, 'yt:videoId');
    const title = extractTagText(entry, 'title');
    const publishedAt = extractTagText(entry, 'published');
    const description = extractTagText(entry, 'media:description') || extractTagText(entry, 'content') || '';
    const thumbnail = extractAttr(entry, 'media:thumbnail', 'url') || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '');
    const url = id ? `https://www.youtube.com/watch?v=${encodeURIComponent(id)}` : '';

    if (!id || !title) return null;
    return { id, title, publishedAt, thumbnail, url, ...(description ? { description } : {}) };
  }).filter(Boolean);

  await writeFeed({
    generatedAt: new Date().toISOString(),
    channelId,
    count: videos.length,
    videos,
  });

  console.log(`[youtube] Wrote ${videos.length} videos to ${outputPath}`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);

  await writeFeed({
    generatedAt: new Date().toISOString(),
    channelId,
    count: 0,
    videos: [],
    error: message,
  });

  console.log(`[youtube] Wrote fallback empty feed to ${outputPath}`);
  process.exit(0);
}
