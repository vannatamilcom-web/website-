import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Youtube } from 'lucide-react';
import { fetchLatestVideos, Video } from '../lib/youtube';

export default function YouTubePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      setIsLoading(true);
      try {
        const fetchedVideos = await fetchLatestVideos({ max: 50, useMockFallback: false });
        setVideos(fetchedVideos);
      } catch (error) {
        console.error('Failed to load YouTube videos:', error);
        setVideos([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
  }, []);

  return (
    <main className="pt-[var(--navbar-height)] min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-black uppercase tracking-[0.3em] text-white">
            <Youtube className="w-4 h-4" />
            YouTube
          </div>
          <h1 className="mt-5 text-4xl font-black text-slate-900 leading-tight">All channel videos</h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            Browse all available videos from your configured YouTube channel on this separate page.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-80 animate-pulse rounded-[32px] bg-slate-100" />
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Link
                key={video.id}
                to={`/videos/${video.id}`}
                className="group block overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition hover:shadow-xl"
              >
                <div className="relative overflow-hidden rounded-t-[32px] bg-slate-900">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {video.isLive ? (
                    <span className="absolute top-4 left-4 rounded-full bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                      LIVE
                    </span>
                  ) : null}
                </div>
                <div className="p-6">
                  <h2 className="text-lg font-black text-slate-900 line-clamp-2">{video.title}</h2>
                  <p className="mt-3 text-sm text-slate-500 leading-relaxed line-clamp-3">
                    {video.description || 'No description available.'}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-widest text-slate-400">
                    <span>{video.publishedAt}</span>
                    <span className="font-black text-primary">Watch</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[32px] border border-slate-200 bg-white p-12 text-center text-slate-600 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">No channel videos found</h2>
            <p className="mt-4">Your YouTube channel has no videos yet or the API is not returning results.</p>
            <a
              href="https://studio.youtube.com"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-black text-white"
            >
              Open YouTube Studio <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
