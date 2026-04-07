import React, { useEffect, useState } from 'react';
import { fetchLatestVideos, Video } from '../lib/youtube';

interface YouTubePlayerSectionProps {
  className?: string;
  query?: string;
  sectionTitle?: string;
}

export default function YouTubePlayerSection({ className = '', query, sectionTitle }: YouTubePlayerSectionProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const fetchedVideos = await fetchLatestVideos({ max: 10, query });
        setVideos(fetchedVideos);
        if (fetchedVideos.length > 0) {
          setSelectedVideo(fetchedVideos[0]);
        }
      } catch (error) {
        console.error('Failed to load videos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
  }, [query]);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  if (isLoading) {
    return (
      <section className={`bg-slate-900 rounded-[40px] p-8 lg:p-12 text-white ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
            <div className="lg:col-span-3 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 bg-slate-700 rounded-2xl"></div>
              ))}
            </div>
            <div className="lg:col-span-7">
              <div className="aspect-video bg-slate-700 rounded-3xl"></div>
              <div className="mt-6 space-y-4">
                <div className="h-8 bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return (
      <section className={`bg-slate-900 rounded-[40px] p-8 lg:p-12 text-white ${className}`}>
        <div className="text-center">
          <h2 className="text-3xl font-black mb-4">வீடியோ செய்திகள்</h2>
          <p className="text-white/70">No videos available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`bg-slate-900 rounded-[40px] p-8 lg:p-12 text-white ${className}`}>
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-tech mb-2 block">
            Watch Now
          </span>
          <h2 className="text-3xl font-black">{sectionTitle ?? 'வீடியோ செய்திகள்'}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-3">
          <div className="bg-slate-800/50 rounded-3xl p-6 max-h-[600px] overflow-y-auto">
            <h3 className="text-lg font-black mb-6">Latest Videos</h3>
            <div className="space-y-4">
              {videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => handleVideoClick(video)}
                  className={`cursor-pointer p-3 rounded-2xl transition-all hover:bg-slate-700/50 ${
                    selectedVideo?.id === video.id ? 'bg-slate-700 ring-2 ring-primary' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-600 flex-shrink-0 relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {video.isLive && (
                        <div className="absolute top-1 left-1 bg-red-600 text-white text-xs font-bold px-1 py-0.5 rounded">
                          LIVE
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold leading-snug line-clamp-2 mb-1">
                        {video.title}
                      </h4>
                      {video.description ? (
                        <p className="text-xs text-white/70 line-clamp-2 mb-1">
                          {video.description}
                        </p>
                      ) : null}
                      <p className="text-xs text-white/60">{video.publishedAt}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Player */}
        <div className="lg:col-span-7">
          {selectedVideo && (
            <>
              <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl">
                <iframe
                  key={selectedVideo.id}
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${selectedVideo.id}?autoplay=1&mute=0&rel=0&modestbranding=1`}
                  title={selectedVideo.title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <article className="mt-6">
                <h2 className="text-2xl font-black leading-tight mb-3">
                  {selectedVideo.title}
                </h2>
                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                  {selectedVideo.description || 'No description available.'}
                </p>
              </article>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
