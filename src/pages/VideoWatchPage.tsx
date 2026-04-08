import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import RightSidebarBlocks from '../components/RightSidebarBlocks';
import { fetchLatestVideos, Video } from '../lib/youtube';

function toPlainText(value: string | undefined): string {
  if (!value) return '';
  return value.replace(/<[^>]*>/g, '').trim();
}

export default function VideoWatchPage() {
  const { id } = useParams<{ id: string }>();
  const videoId = id ?? '';
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    fetchLatestVideos({ max: 30 }).then(setVideos);
  }, []);

  const selectedVideo = useMemo(() => {
    return videos.find((v) => v.id === videoId) ?? (videoId ? { id: videoId, title: '', thumbnail: '', publishedAt: '' } : null);
  }, [videoId, videos]);

  if (!videoId) {
    return (
      <main className="pt-[var(--navbar-height)] min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-black text-slate-900">Video not found</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-[var(--navbar-height)] min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 border border-white/10">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1`}
                title={selectedVideo?.title || 'Vannatamil Video'}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>

            <article className="mt-8 space-y-4">
              <h1 className="text-2xl lg:text-3xl font-black leading-tight">
                {selectedVideo?.title || 'Video'}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-white/50 uppercase tracking-widest">
                <span>{selectedVideo?.publishedAt || ''}</span>
                <a
                  href={`https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  Watch on YouTube <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {toPlainText(selectedVideo?.description) ? (
                <p className="text-sm lg:text-base text-white/80 whitespace-pre-wrap leading-relaxed">
                  {toPlainText(selectedVideo?.description)}
                </p>
              ) : (
                <p className="text-sm lg:text-base text-white/80 leading-relaxed">
                  No description available.
                </p>
              )}
            </article>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h3 className="font-black uppercase tracking-widest text-sm">More videos</h3>
              </div>
              <div className="max-h-[720px] overflow-y-auto">
                <div className="p-4 space-y-3">
                  {videos.map((v) => {
                    const isActive = v.id === videoId;
                    return (
                      <Link
                        key={v.id}
                        to={`/videos/${v.id}`}
                        className={`flex gap-3 p-3 rounded-2xl transition-colors border ${
                          isActive ? 'bg-white/10 border-white/20' : 'bg-transparent hover:bg-white/5 border-transparent'
                        }`}
                      >
                        <div className="w-28 aspect-video rounded-xl overflow-hidden bg-black/40 shrink-0">
                          {v.thumbnail ? (
                            <img
                              src={v.thumbnail}
                              alt={v.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <div className="font-black text-sm leading-snug line-clamp-2">{v.title}</div>
                          {v.description ? (
                            <div className="text-xs text-white/70 line-clamp-2 mt-1">{toPlainText(v.description)}</div>
                          ) : null}
                          <div className="text-[10px] text-white/50 font-bold uppercase mt-1 tracking-widest">
                            {v.publishedAt}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            <RightSidebarBlocks />
          </div>
        </div>
      </div>
    </main>
  );
}
