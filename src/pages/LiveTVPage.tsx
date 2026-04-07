import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Info, MessageCircle, Play, Share2, Video as VideoIcon } from 'lucide-react';
import { fetchLiveVideoId, fetchPastLiveVideos, Video } from '../lib/youtube';

function formatPublishedAt(value: string | undefined) {
  if (!value) return '';
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
  } catch {
    return value;
  }
}

export default function LiveTVPage() {
  const [liveVideoId, setLiveVideoId] = useState<string | null>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [pastVideos, setPastVideos] = useState<Video[]>([]);
  const [pastError, setPastError] = useState<string | null>(null);
  const [isLoadingPast, setIsLoadingPast] = useState(true);

  useEffect(() => {
    fetchLiveVideoId().then(setLiveVideoId);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        setIsLoadingPast(true);
        setPastError(null);

        const videos = await fetchPastLiveVideos({ max: 12, useMockFallback: false });
        if (!isMounted) return;
        setPastVideos(videos);
      } catch (error) {
        if (!isMounted) return;
        setPastVideos([]);
        setPastError(error instanceof Error ? error.message : 'Failed to load previous live videos');
      } finally {
        if (!isMounted) return;
        setIsLoadingPast(false);
      }
    };

    run();
    return () => {
      isMounted = false;
    };
  }, []);

  const pastLiveVideos = useMemo(() => {
    if (!liveVideoId) return pastVideos;
    return pastVideos.filter((video) => video.id !== liveVideoId);
  }, [pastVideos, liveVideoId]);

  const videos = pastLiveVideos;

  const previousLive = useMemo(() => {
    const keywords = ['live', 'நேரலை', 'நேரடி', 'stream'];
    return videos
      .filter((v) => {
        const title = (v.title || '').toLowerCase();
        return keywords.some((k) => title.includes(k));
      })
      .slice(0, 6);
  }, [videos]);

  const fallbackPlayerId = previousLive[0]?.id || videos[0]?.id || null;
  const playerVideoId = selectedVideoId ?? liveVideoId ?? fallbackPlayerId;
  const nowPlaying = useMemo(() => {
    const id = playerVideoId ?? '';
    return videos.find((v) => v.id === id) ?? null;
  }, [playerVideoId, videos]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      window.alert('Link copied to clipboard');
    } catch {
      window.alert('Unable to copy link.');
    }
  };

  const handleFocusChat = () => {
    document.getElementById('live-chat-input')?.focus();
  };

  return (
    <main className="pt-[var(--navbar-height)] min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left list */}
          <aside className="lg:col-span-4 order-2 lg:order-1 space-y-6">
            <div className="bg-slate-900/80 border border-white/10 rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/50">Live</div>
                <h3 className="text-lg font-black mt-1">Previous Live</h3>
                <p className="text-sm text-slate-400 mt-1">Past live streams (live replays) from the channel.</p>
              </div>
              <div className="max-h-[340px] overflow-y-auto">
                <div className="p-4 space-y-3">
                  {isLoadingPast ? (
                    Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="h-20 rounded-3xl bg-slate-800 animate-pulse" />
                    ))
                  ) : pastError ? (
                    <div className="text-sm text-slate-400 p-4">{pastError}</div>
                  ) : previousLive.length > 0 ? (
                    previousLive.map((video) => {
                      const isActive = video.id === playerVideoId;
                      return (
                        <button
                          key={video.id}
                          type="button"
                          onClick={() => setSelectedVideoId(video.id)}
                          className={`w-full text-left flex gap-3 p-3 rounded-2xl transition-colors border ${
                            isActive ? 'bg-white/10 border-white/20' : 'bg-transparent hover:bg-white/5 border-transparent'
                          }`}
                        >
                          <div className="w-28 aspect-video rounded-xl overflow-hidden bg-black/40 shrink-0">
                            {video.thumbnail ? (
                              <img
                                src={video.thumbnail}
                                alt=""
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                                loading="lazy"
                                decoding="async"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-black text-sm leading-snug line-clamp-2">{video.title}</div>
                            <div className="text-[10px] text-white/50 font-bold uppercase mt-1 tracking-widest">
                              {formatPublishedAt(video.publishedAt)}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="text-sm text-slate-400 p-4">No previous live videos found yet.</div>
                  )}
                </div>
              </div>
            </div>

          </aside>

          {/* Player + chat */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 border border-white/10">
              {playerVideoId ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${playerVideoId}?autoplay=1&mute=1&rel=0&modestbranding=1`}
                  title={liveVideoId ? 'Vannatamil News Live' : nowPlaying?.title || 'Vannatamil Video'}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Play className="w-10 h-10 fill-white" />
                    </div>
                    <p className="text-sm font-bold tracking-widest uppercase opacity-50">Loading video...</p>
                  </div>
                </div>
              )}

              {liveVideoId ? (
                <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1 bg-accent-breaking rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-widest">LIVE</span>
                </div>
              ) : (
                <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/10 backdrop-blur-md rounded-full">
                  <VideoIcon className="w-4 h-4 text-white" />
                  <span className="text-[10px] font-black uppercase tracking-widest">REPLAY</span>
                </div>
              )}
            </div>

            <div className="mt-8">
              <h1 className="text-2xl lg:text-3xl font-black mb-3">
                {liveVideoId ? 'Vannatamil News Live TV' : nowPlaying?.title || 'Vannatamil News'}
              </h1>
              {nowPlaying?.publishedAt ? (
                <div className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">
                  {formatPublishedAt(nowPlaying.publishedAt)}
                </div>
              ) : null}
              <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-white/50 uppercase tracking-widest">
                <span className="flex items-center gap-2"><Info className="w-4 h-4" /> 24/7 News Broadcast</span>
                <button onClick={handleShare} className="flex items-center gap-2 hover:text-white transition-colors">
                  <Share2 className="w-4 h-4" /> Share
                </button>
                <button onClick={handleFocusChat} className="flex items-center gap-2 hover:text-white transition-colors">
                  <MessageCircle className="w-4 h-4" /> Live Chat
                </button>
                {playerVideoId ? (
                  <a
                    href={`https://www.youtube.com/watch?v=${encodeURIComponent(playerVideoId)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    YouTube <ExternalLink className="w-4 h-4" />
                  </a>
                ) : null}
              </div>
            </div>

            <div className="mt-10 bg-white/5 border border-white/10 rounded-3xl h-[420px] flex flex-col">
              <div className="p-6 border-b border-white/10">
                <h3 className="font-black uppercase tracking-widest text-sm">Live Chat</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-tech shrink-0" />
                    <div>
                      <span className="text-xs font-black text-white/50 block mb-1">User_{i}</span>
                      <p className="text-sm text-white/90">
                        நேரலை செய்திகள் மிகவும் பயனுள்ளதாக இருக்கிறது! வாழ்க.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-white/10">
                <input
                  id="live-chat-input"
                  type="text"
                  placeholder="Say something..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm focus:outline-none focus:bg-white/20 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
