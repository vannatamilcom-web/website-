import { getSiteConfig } from './runtimeConfig';

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  duration?: string;
  description?: string;
  isLive?: boolean;
}

const ENV_YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const ENV_YOUTUBE_CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID;
const ENV_YOUTUBE_LIVE_VIDEO_ID_OVERRIDE = import.meta.env.VITE_YOUTUBE_LIVE_VIDEO_ID;
const ENV_YOUTUBE_MOVIES_PLAYLIST_ID = import.meta.env.VITE_YOUTUBE_MOVIES_PLAYLIST_ID;

function normalizeYouTubeChannelId(value: string | null | undefined): string | null {
  const raw = typeof value === 'string' ? value.trim() : '';
  if (!raw) return null;

  // Accept a raw channel id (UC...) or an uploads playlist id (UU... -> UC...)
  const direct = raw.match(/\bU[CU][0-9A-Za-z_-]{20,}\b/)?.[0];
  if (direct?.startsWith('UC')) return direct;
  if (direct?.startsWith('UU')) return `UC${direct.slice(2)}`;

  // Accept common YouTube URLs where the channel id or uploads playlist id is present.
  const channelUrlMatch = raw.match(/youtube\.com\/channel\/(UC[0-9A-Za-z_-]{20,})/i)?.[1];
  if (channelUrlMatch) return channelUrlMatch;

  const playlistMatch = raw.match(/[?&]list=(UU[0-9A-Za-z_-]{20,})/i)?.[1];
  if (playlistMatch) return `UC${playlistMatch.slice(2)}`;

  return null;
}

function normalizeYouTubePlaylistId(value: string | null | undefined): string | null {
  const raw = typeof value === 'string' ? value.trim() : '';
  if (!raw) return null;

  // Accept common YouTube URLs with list=...
  const list = raw.match(/[?&]list=([0-9A-Za-z_-]{10,})/i)?.[1];
  if (list) return list;

  // Accept a bare playlist id (PL..., UU..., RD..., etc.)
  const direct = raw.match(/\b[0-9A-Za-z_-]{10,}\b/)?.[0];
  return direct ?? null;
}

async function resolveYouTubeChannelId(): Promise<string | null> {
  const env = normalizeYouTubeChannelId(ENV_YOUTUBE_CHANNEL_ID);
  if (env) return env;
  const config = await getSiteConfig();
  return normalizeYouTubeChannelId(config.youtubeChannelId);
}

async function resolveMoviesPlaylistId(): Promise<string | null> {
  const env = normalizeYouTubePlaylistId(ENV_YOUTUBE_MOVIES_PLAYLIST_ID);
  if (env) return env;
  const config = await getSiteConfig();
  return normalizeYouTubePlaylistId(config.youtubeMoviesPlaylistId);
}

async function resolveLiveVideoIdOverride(): Promise<string | null> {
  if (ENV_YOUTUBE_LIVE_VIDEO_ID_OVERRIDE) return ENV_YOUTUBE_LIVE_VIDEO_ID_OVERRIDE;
  const config = await getSiteConfig();
  return config.youtubeLiveVideoId?.trim() || null;
}

type YouTubeFeedVideo = {
  id: string;
  title: string;
  publishedAt?: string;
  thumbnail?: string;
  url?: string;
  description?: string;
};

type YouTubeFeedResponse = {
  generatedAt?: string;
  channelId?: string;
  count?: number;
  videos?: YouTubeFeedVideo[];
  error?: string;
};

export function getYouTubeChannelUrl(): string | null {
  const channelId = normalizeYouTubeChannelId(ENV_YOUTUBE_CHANNEL_ID);
  if (!channelId) return null;
  return `https://www.youtube.com/channel/${channelId}`;
}

export async function getConfiguredYouTubeChannelId(): Promise<string | null> {
  return resolveYouTubeChannelId();
}

export async function getConfiguredMoviesPlaylistId(): Promise<string | null> {
  return resolveMoviesPlaylistId();
}

export const MOCK_VIDEOS: Video[] = [
  {
    id: "dQw4w9WgXcQ",
    title: "தமிழக அரசியல் களம்: இன்றைய முக்கிய நிகழ்வுகள்",
    thumbnail: "https://picsum.photos/seed/video1/400/225",
    publishedAt: "2 hours ago",
  },
  {
    id: "jNQXAC9IVRw",
    title: "வானிலை அறிக்கை: அடுத்த 3 நாட்களுக்கு கனமழை எச்சரிக்கை",
    thumbnail: "https://picsum.photos/seed/video2/400/225",
    publishedAt: "5 hours ago",
  },
  {
    id: "9bZkp7q19f0",
    title: "தங்கம் விலை நிலவரம்: இன்று அதிரடி சரிவு",
    thumbnail: "https://picsum.photos/seed/video3/400/225",
    publishedAt: "8 hours ago",
  },
];

export async function fetchLatestVideos(options?: {
  max?: number;
  query?: string;
  keywords?: string[];
  playlistId?: string;
  useMockFallback?: boolean;
}): Promise<Video[]> {
  const max = options?.max ?? 18;
  const useMockFallback = options?.useMockFallback ?? false;
  try {
    const channelId = await resolveYouTubeChannelId();
    const liveOverrideId = await resolveLiveVideoIdOverride();
    const apiKey = ENV_YOUTUBE_API_KEY;
    const canUseApi = Boolean(apiKey && channelId);
    const playlistId = normalizeYouTubePlaylistId(options?.playlistId);

    const matchesKeyword = (value: string) => {
      if (!options?.keywords?.length) return true;
      const normalized = value.toLowerCase();
      return options.keywords.some((keyword) => normalized.includes(keyword.toLowerCase()));
    };

    const applyKeywordFilter = (videos: Video[]) => {
      if (!options?.keywords?.length) return videos;
      return videos.filter((video) => {
        return (
          matchesKeyword(video.title) ||
          (video.description ? matchesKeyword(video.description) : false)
        );
      });
    };

    if (playlistId) {
      try {
        const playlistVideos = await fetchYouTubePlaylistRssVideos({ playlistId, max });
        const filtered = applyKeywordFilter(playlistVideos);
        if (filtered.length) return filtered;
      } catch {
        // Ignore playlist errors and fall back to other sources.
      }
    }

    const tryLoadDeployedFeed = async (): Promise<Video[]> => {
      try {
        const response = await fetch('/youtube-videos.json', { cache: 'no-store' });
        if (!response.ok) return [];
        const json = (await response.json()) as YouTubeFeedResponse;
        if (channelId && json?.channelId && json.channelId.trim() !== channelId) return [];
        const list = Array.isArray(json?.videos) ? json.videos : [];
        const mapped = list
          .map((v) => {
            if (!v?.id || !v?.title) return null;
            const thumbnail = v.thumbnail?.trim() || (v.id ? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg` : '');
            if (!thumbnail) return null;
            const publishedAt = v.publishedAt ? timeAgo(v.publishedAt) : '';
            const description = v.description?.trim() || undefined;
            const video: Video = {
              id: v.id,
              title: v.title,
              thumbnail,
              publishedAt,
              ...(description ? { description } : {}),
            };
            if (liveOverrideId && v.id === liveOverrideId) video.isLive = true;
            return video;
          })
          .filter((v): v is Video => v !== null);
        return mapped.slice(0, max);
      } catch {
        return [];
      }
    };

    const feedVideos = await tryLoadDeployedFeed();
    if (feedVideos.length) {
      return applyKeywordFilter(feedVideos);
    }

    if (canUseApi) {
      const params: Record<string, string> = {
        order: "date",
        maxResults: String(Math.min(50, max)),
      };

      if (options?.query) {
        params.q = options.query;
      }

      const items = await fetchYouTubeSearch({ apiKey: apiKey!, channelId: channelId! }, params);
      if (items.length) {
        const videos: Video[] = items
          .map((item) => {
            const itemChannelId = item.snippet?.channelId;
            if (itemChannelId && channelId && itemChannelId !== channelId) return null;
            const id = item.id?.videoId;
            const title = item.snippet?.title;
            const description = item.snippet?.description;
            const publishedAt = item.snippet?.publishedAt;
            const thumbnail =
              item.snippet?.thumbnails?.high?.url ??
              item.snippet?.thumbnails?.medium?.url ??
              item.snippet?.thumbnails?.default?.url;
            if (!id || !title || !thumbnail || !publishedAt) return null;
            const video: Video = {
              id,
              title,
              thumbnail,
              publishedAt: timeAgo(publishedAt),
              ...(description ? { description } : {}),
            };
            if (liveOverrideId && id === liveOverrideId) video.isLive = true;
            return video;
          })
          .filter((v): v is Video => v !== null);

        const filteredVideos = applyKeywordFilter(videos);

        try {
          const liveItems = await fetchYouTubeSearch(
            { apiKey: apiKey!, channelId: channelId! },
            { eventType: "live", order: "date", maxResults: "10" }
          );
          const liveIds = new Set(liveItems.map((item) => item.id?.videoId).filter(Boolean));
          filteredVideos.forEach((video) => {
            if (liveIds.has(video.id)) {
              video.isLive = true;
            }
          });
        } catch {
          // Ignore live check errors
        }

        return filteredVideos;
      }
    }

    if (channelId) {
      const rssVideos = await fetchYouTubeRssVideos({ channelId, max });
      const filtered = applyKeywordFilter(rssVideos);
      if (filtered.length) return filtered;
    }

    return useMockFallback ? MOCK_VIDEOS : [];
  } catch {
    try {
      const channelId = await resolveYouTubeChannelId();
      if (channelId) {
        const rssVideos = await fetchYouTubeRssVideos({ channelId, max });
        if (rssVideos.length) return rssVideos;
      }
      return useMockFallback ? MOCK_VIDEOS : [];
    } catch {
      return useMockFallback ? MOCK_VIDEOS : [];
    }
  }
}

export async function fetchLiveVideoId(): Promise<string | null> {
  const override = await resolveLiveVideoIdOverride();
  if (override) return override;
  try {
    const channelId = await resolveYouTubeChannelId();
    if (!ENV_YOUTUBE_API_KEY || !channelId) return null;
    const items = await fetchYouTubeSearch(
      { apiKey: ENV_YOUTUBE_API_KEY, channelId },
      { eventType: "live", order: "date", maxResults: "1" }
    );
    const id = items[0]?.id?.videoId;
    return id ?? null;
  } catch {
    return null;
  }
}

function looksLikeLiveReplay(video: Video): boolean {
  const title = video.title?.toLowerCase?.() ?? '';
  const description = video.description?.toLowerCase?.() ?? '';
  return (
    title.includes('live') ||
    title.includes('livestream') ||
    title.includes('live stream') ||
    title.includes('நேரலை') ||
    title.includes('லைவ்') ||
    description.includes('live') ||
    description.includes('livestream') ||
    description.includes('live stream') ||
    description.includes('நேரலை') ||
    description.includes('லைவ்')
  );
}

export async function fetchPastLiveVideos(options?: { max?: number; useMockFallback?: boolean }): Promise<Video[]> {
  const max = options?.max ?? 8;
  const useMockFallback = options?.useMockFallback ?? false;

  try {
    const channelId = await resolveYouTubeChannelId();
    const liveOverrideId = await resolveLiveVideoIdOverride();
    const apiKey = ENV_YOUTUBE_API_KEY;
    const canUseApi = Boolean(apiKey && channelId);

    if (canUseApi) {
      const items = await fetchYouTubeSearch(
        { apiKey: apiKey!, channelId: channelId! },
        { eventType: "completed", order: "date", maxResults: String(Math.min(50, max)) }
      );

      const videos: Video[] = items
        .map((item) => {
          const itemChannelId = item.snippet?.channelId;
          if (itemChannelId && channelId && itemChannelId !== channelId) return null;
          const id = item.id?.videoId;
          const title = item.snippet?.title;
          const description = item.snippet?.description;
          const publishedAt = item.snippet?.publishedAt;
          const thumbnail =
            item.snippet?.thumbnails?.high?.url ??
            item.snippet?.thumbnails?.medium?.url ??
            item.snippet?.thumbnails?.default?.url;
          if (!id || !title || !thumbnail || !publishedAt) return null;
          const video: Video = {
            id,
            title,
            thumbnail,
            publishedAt: timeAgo(publishedAt),
            ...(description ? { description } : {}),
          };
          if (liveOverrideId && id === liveOverrideId) video.isLive = true;
          return video;
        })
        .filter((v): v is Video => v !== null);

      return videos.slice(0, max);
    }

    if (channelId) {
      const latest = await fetchLatestVideos({ max: Math.max(36, max * 6), useMockFallback: false });
      const replays = latest.filter(looksLikeLiveReplay);
      return replays.slice(0, max);
    }

    return useMockFallback ? MOCK_VIDEOS.filter(looksLikeLiveReplay).slice(0, max) : [];
  } catch {
    return useMockFallback ? MOCK_VIDEOS.filter(looksLikeLiveReplay).slice(0, max) : [];
  }
}

function timeAgo(isoDateString: string): string {
  const date = new Date(isoDateString);
  const ms = Date.now() - date.getTime();
  const minutes = Math.floor(ms / 60000);
  if (Number.isNaN(minutes) || minutes < 0) return isoDateString;
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

type YouTubeSearchItem = {
  id?: { videoId?: string };
  snippet?: {
    channelId?: string;
    title?: string;
    description?: string;
    publishedAt?: string;
    thumbnails?: { medium?: { url?: string }; high?: { url?: string }; default?: { url?: string } };
  };
};

async function fetchYouTubeSearch(
  auth: { apiKey: string; channelId: string },
  params: Record<string, string>
): Promise<YouTubeSearchItem[]> {
  const { apiKey, channelId } = auth;

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("channelId", channelId);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error(`YouTube API error: ${response.status}`);
  const data = (await response.json()) as { items?: YouTubeSearchItem[] };
  return data.items ?? [];
}

async function fetchYouTubeRssVideos(options: { channelId: string; max: number }): Promise<Video[]> {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(options.channelId)}`;
  const response = await fetch(feedUrl);
  if (!response.ok) throw new Error(`YouTube RSS error: ${response.status}`);

  const xml = await response.text();
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const entries = Array.from(doc.getElementsByTagName("entry")).slice(0, options.max);

  const videos: Video[] = entries
    .map((entry) => {
      const id = entry.getElementsByTagName("yt:videoId")[0]?.textContent?.trim();
      const title = entry.getElementsByTagName("title")[0]?.textContent?.trim();
      const publishedAt = entry.getElementsByTagName("published")[0]?.textContent?.trim();

      const description =
        entry.getElementsByTagName("media:description")[0]?.textContent?.trim() ??
        entry.getElementsByTagName("content")[0]?.textContent?.trim() ??
        undefined;

      const thumbEl = entry.getElementsByTagName("media:thumbnail")[0] as Element | undefined;
      const thumbnail =
        thumbEl?.getAttribute("url")?.trim() ?? (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null);

      if (!id || !title || !publishedAt || !thumbnail) return null;
      const video: Video = {
        id,
        title,
        thumbnail,
        publishedAt: timeAgo(publishedAt),
        ...(description ? { description } : {}),
      };
      return video;
    })
    .filter((v): v is Video => v !== null);

  return videos;
}

async function fetchYouTubePlaylistRssVideos(options: { playlistId: string; max: number }): Promise<Video[]> {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${encodeURIComponent(options.playlistId)}`;
  const response = await fetch(feedUrl);
  if (!response.ok) throw new Error(`YouTube RSS error: ${response.status}`);

  const xml = await response.text();
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const entries = Array.from(doc.getElementsByTagName("entry")).slice(0, options.max);

  const videos: Video[] = entries
    .map((entry) => {
      const id = entry.getElementsByTagName("yt:videoId")[0]?.textContent?.trim();
      const title = entry.getElementsByTagName("title")[0]?.textContent?.trim();
      const publishedAt = entry.getElementsByTagName("published")[0]?.textContent?.trim();

      const description =
        entry.getElementsByTagName("media:description")[0]?.textContent?.trim() ??
        entry.getElementsByTagName("content")[0]?.textContent?.trim() ??
        undefined;

      const thumbEl = entry.getElementsByTagName("media:thumbnail")[0] as Element | undefined;
      const thumbnail =
        thumbEl?.getAttribute("url")?.trim() ?? (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null);

      if (!id || !title || !publishedAt || !thumbnail) return null;
      const video: Video = {
        id,
        title,
        thumbnail,
        publishedAt: timeAgo(publishedAt),
        ...(description ? { description } : {}),
      };
      return video;
    })
    .filter((v): v is Video => v !== null);

  return videos;
}
