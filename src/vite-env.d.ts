/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_YOUTUBE_API_KEY?: string;
  readonly VITE_YOUTUBE_CHANNEL_ID?: string;
  readonly VITE_YOUTUBE_LIVE_VIDEO_ID?: string;
  readonly VITE_FACEBOOK_URL?: string;
  readonly VITE_FACEBOOK_PAGE_URL?: string;
  readonly VITE_INSTAGRAM_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
