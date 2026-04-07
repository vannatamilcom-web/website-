import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CATEGORIES, getCategoryBg } from '../lib/api';
import { getCategoryLabel } from '../lib/categoryDisplay';
import { fetchLatestVideos, getConfiguredMoviesPlaylistId, Video } from '../lib/youtube';
import { ExternalLink } from 'lucide-react';

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'tamil-nadu': ['தமிழ்நாடு', 'tamil nadu', 'tamil', 'chennai', 'madurai', 'பழநி', 'politics', 'நிலவரம்'],
  business: ['business', 'economy', 'finance', 'trade', 'stock', 'வணிகம்', 'பொருளாதாரம்'],
  technology: ['technology', 'tech', 'ai', 'software', 'internet', 'robotics', 'தொழில்நுட்பம்', 'செயற்கை நுண்ணறிவு'],
  sports: ['sports', 'cricket', 'football', 'kabaddi', 'olympics', 'விளையாட்டு', 'IPL'],
  entertainment: [
    'movie',
    'movies',
    'tamil movie',
    'film',
    'cinema',
    'tamil cinema',
    'kollywood',
    'trailer',
    'teaser',
    'review',
    'songs',
    'song',
    'lyrics',
    'திரைப்படம்',
    'திரைப்பட',
    'படம்',
    'சினிமா',
    'ட்ரெய்லர்',
    'டீசர்',
    'விமர்சனம்',
    'பாடல்',
    'பாடல்கள்',
    'கொலிவுட்',
  ],
};

const CATEGORY_SEARCH_QUERY: Partial<Record<string, string>> = {
  entertainment: 'tamil movie',
};

export default function CategoryVideosPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = useMemo(() => CATEGORIES.find((item) => item.slug === slug), [slug]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    const load = async () => {
      setIsLoading(true);
      try {
        const moviesPlaylistId =
          category.slug === 'entertainment' ? await getConfiguredMoviesPlaylistId() : null;

        const fetchedVideos = await fetchLatestVideos({
          max: 36,
          query: CATEGORY_SEARCH_QUERY[category.slug],
          playlistId: moviesPlaylistId ?? undefined,
          keywords: CATEGORY_KEYWORDS[category.slug] ?? [category.name],
          useMockFallback: false,
        });
        setVideos(fetchedVideos);
        setSelectedVideo(fetchedVideos[0] ?? null);
      } catch (error) {
        console.error('Failed to load category videos:', error);
        setVideos([]);
        setSelectedVideo(null);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [category]);

  const handleVideoClick = (video: Video) => setSelectedVideo(video);

  if (!category) {
    return (
      <main className="pt-[var(--navbar-height)] min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-4">Category not found</h1>
          <p className="text-slate-600 mb-8">Please choose a valid category from the menu.</p>
          <Link to="/menu" className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full font-black hover:bg-primary/90 transition-all">
            Back to menu
          </Link>
        </div>
      </main>
    );
  }

  const categoryTa = getCategoryLabel(category, 'ta');
  const categoryEn = getCategoryLabel(category, 'en');

  return (
    <main className="pt-[var(--navbar-height)] min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span
              className={`inline-flex px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${getCategoryBg(category.slug)}`}
            >
              {categoryTa}
            </span>
            <h1 className="mt-4 text-4xl font-black text-slate-900 leading-tight">{categoryEn} Videos</h1>
            <p className="mt-3 text-slate-600 max-w-2xl">Watching the latest YouTube content filtered for {categoryEn} topics.</p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-900 hover:border-primary hover:text-primary transition-all"
          >
            Back to menu
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl">
              {selectedVideo ? (
                <iframe
                  key={selectedVideo.id}
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${selectedVideo.id}?autoplay=1&mute=0&rel=0&modestbranding=1`}
                  title={selectedVideo.title}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/70">No video selected</div>
              )}
            </div>

            <article className="rounded-[40px] bg-white p-8 shadow-sm border border-slate-200">
              <h2 className="text-2xl font-black text-slate-900 mb-3">{selectedVideo?.title ?? 'Select a video'}</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {selectedVideo?.description || 'Select a video from the right to view details and description.'}
              </p>
              {selectedVideo ? (
                <p className="mt-4 text-xs uppercase tracking-widest text-slate-400">Published: {selectedVideo.publishedAt}</p>
              ) : null}
              {selectedVideo ? (
                <a
                  href={`https://www.youtube.com/watch?v=${encodeURIComponent(selectedVideo.id)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-black text-primary"
                >
                  Watch on YouTube <ExternalLink className="w-4 h-4" />
                </a>
              ) : null}
            </article>
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-[40px] bg-white p-6 shadow-sm border border-slate-200 max-h-[760px] overflow-y-auto">
              <h2 className="text-xl font-black text-slate-900 mb-6">Category videos</h2>
              <div className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="h-24 rounded-3xl bg-slate-100 animate-pulse" />
                  ))
                ) : videos.length > 0 ? (
                  videos.map((video) => (
                    <button
                      key={video.id}
                      onClick={() => handleVideoClick(video)}
                      className={`w-full text-left rounded-3xl border p-4 transition-all ${selectedVideo?.id === video.id ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                      <div className="font-semibold text-slate-900 line-clamp-2">{video.title}</div>
                      {video.description ? (
                        <div className="mt-2 text-sm text-slate-600 line-clamp-2">{video.description}</div>
                      ) : null}
                      <div className="mt-2 text-xs uppercase tracking-widest text-slate-500">{video.publishedAt}</div>
                    </button>
                  ))
                ) : (
                  <div className="text-slate-500">No videos were found for this topic right now.</div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
