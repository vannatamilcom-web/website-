import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getConfiguredYouTubeChannelId, getYouTubeChannelUrl } from '../lib/youtube';

type YouTubeVideo = {
  id: string;
  title: string;
  publishedAt?: string;
  thumbnail?: string;
  url?: string;
};

type YouTubeVideosResponse = {
  generatedAt?: string;
  channelId?: string;
  count?: number;
  videos?: YouTubeVideo[];
  error?: string;
};

const truncate = (value: string, maxLength: number) => {
  const trimmed = value.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 1)}…`;
};

export default function YouTubeVideosFeed() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [data, setData] = useState<YouTubeVideosResponse | null>(null);
  const channelUrl = useMemo(() => {
    return (
      getYouTubeChannelUrl() ??
      (data?.channelId ? `https://www.youtube.com/channel/${data.channelId}` : null)
    );
  }, [data]);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response = await fetch('/youtube-videos.json', { cache: 'no-store' });
        if (!response.ok) throw new Error(`Missing youtube-videos.json (${response.status})`);

        const json = (await response.json()) as YouTubeVideosResponse;
        const configuredChannelId = await getConfiguredYouTubeChannelId();
        if (configuredChannelId && json?.channelId && json.channelId.trim() !== configuredChannelId) {
          throw new Error('YouTube feed does not match configured channel. Regenerate youtube-videos.json for your channel.');
        }
        if (!isMounted) return;
        setData(json);
      } catch (error) {
        if (!isMounted) return;
        setData(null);
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load YouTube videos');
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    run();
    return () => {
      isMounted = false;
    };
  }, []);

  const videos = useMemo(() => (Array.isArray(data?.videos) ? data!.videos : []), [data]);

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
        <div className="h-4 w-40 bg-slate-100 rounded mb-4" />
        <div className="space-y-4">
          <div className="h-20 bg-slate-100 rounded-2xl" />
          <div className="h-20 bg-slate-100 rounded-2xl" />
          <div className="h-20 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (errorMessage || videos.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
        <div className="text-sm font-black text-slate-900 mb-2">YouTube latest videos</div>
        <div className="text-sm text-slate-700 leading-relaxed">
          {errorMessage ? 'YouTube videos are not available yet on this deployment.' : 'No YouTube videos found yet for this deployment.'}
        </div>
        {data?.error ? (
          <div className="text-xs text-slate-500 mt-3 leading-relaxed">
            Debug: <span className="font-mono">{data.error}</span>
          </div>
        ) : null}
        <div className="text-xs text-slate-500 mt-3 leading-relaxed">
          To enable: set <span className="font-mono">VITE_YOUTUBE_CHANNEL_ID</span> (GitHub Secret / .env) or update <span className="font-mono">public/site-config.json</span> with your channel ID (UC...) or channel URL, then rebuild/deploy.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-black text-slate-900">YouTube latest videos</div>
          {data?.generatedAt ? (
            <div className="text-[10px] font-bold text-slate-400 mt-1">Updated: {new Date(data.generatedAt).toLocaleString()}</div>
          ) : null}
        </div>
        {channelUrl ? (
          <a
            href={channelUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] font-black uppercase tracking-widest text-[#FF0000] hover:text-[#CC0000] transition-colors"
          >
            Channel
          </a>
        ) : null}
      </div>

      <div className="divide-y divide-slate-100">
        {videos.slice(0, 6).map((video) => (
          <Link
            key={video.id}
            to={`/videos/${video.id}`}
            className="block p-6 hover:bg-slate-50 transition-colors"
          >
            <div className="flex gap-4">
              {video.thumbnail ? (
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img
                    src={video.thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-slate-100 flex-shrink-0" />
              )}

              <div className="min-w-0">
                <div className="text-xs font-black uppercase tracking-widest text-[#FF0000] mb-1">YouTube</div>
                <div className="text-sm text-slate-800 font-semibold leading-snug">{truncate(video.title || 'Open video', 140)}</div>
                {video.publishedAt ? (
                  <div className="text-[10px] font-bold text-slate-400 mt-2">{new Date(video.publishedAt).toLocaleString()}</div>
                ) : null}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
