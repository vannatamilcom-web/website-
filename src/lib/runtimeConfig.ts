export type SiteConfig = {
  youtubeChannelId?: string;
  youtubeLiveVideoId?: string;
  youtubeMoviesPlaylistId?: string;
};

let cachedConfig: SiteConfig | null = null;
let inflight: Promise<SiteConfig> | null = null;

export async function getSiteConfig(): Promise<SiteConfig> {
  if (cachedConfig) return cachedConfig;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const response = await fetch('/site-config.json', { cache: 'no-store' });
      if (!response.ok) {
        cachedConfig = {};
        return cachedConfig;
      }
      const json = (await response.json()) as unknown;
      cachedConfig =
        json && typeof json === 'object'
          ? (json as SiteConfig)
          : {};
      return cachedConfig;
    } catch {
      cachedConfig = {};
      return cachedConfig;
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}
