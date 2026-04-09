import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLatestVideos, getConfiguredYouTubeChannelId, getYouTubeChannelUrl, Video } from '../lib/youtube';

type YouTubeVideosFeedProps = {
  limit?: number;
};

const truncate = (value: string, maxLength: number) => {
  const trimmed = value.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 1)}…`;
};

export default function YouTubeVideosFeed({ limit = 10 }: YouTubeVideosFeedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [channelId, setChannelId] = useState<string | null>(null);
  const channelUrl = useMemo(() => {
    return (
      getYouTubeChannelUrl() ??
      (channelId ? `https://www.youtube.com/channel/${channelId}` : null)
    );
  }, [channelId]);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);
        const configuredChannelId = await getConfiguredYouTubeChannelId();
        const fetchedVideos = await fetchLatestVideos({ max: Math.max(limit, 12), useMockFallback: false });
        if (!isMounted) return;
        setChannelId(configuredChannelId);
        setVideos(fetchedVideos);
      } catch (error) {
        if (!isMounted) return;
        setVideos([]);
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
  }, [limit]);

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
        {videos.slice(0, limit).map((video) => (
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
