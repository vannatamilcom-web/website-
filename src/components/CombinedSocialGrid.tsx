import React, { useEffect, useMemo, useState } from 'react';

type UnifiedItem = {
  id: string;
  source: 'facebook' | 'instagram' | 'youtube';
  title: string;
  message?: string;
  createdTime?: string; // ISO
  permalinkUrl?: string;
  thumbnail?: string | null;
  mediaType?: string;
};

export default function CombinedSocialGrid({ limit = 10 }: { limit?: number }) {
  const [items, setItems] = useState<UnifiedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [fbResp, igResp, ytResp] = await Promise.allSettled([
          fetch('/facebook-posts.json', { cache: 'no-store' }),
          fetch('/instagram-posts.json', { cache: 'no-store' }),
          fetch('/youtube-videos.json', { cache: 'no-store' }),
        ]);

        const fbJson = fbResp.status === 'fulfilled' && fbResp.value.ok ? await fbResp.value.json() : null;
        const igJson = igResp.status === 'fulfilled' && igResp.value.ok ? await igResp.value.json() : null;
        const ytJson = ytResp.status === 'fulfilled' && ytResp.value.ok ? await ytResp.value.json() : null;

        const fbItems: UnifiedItem[] = Array.isArray(fbJson?.posts)
          ? fbJson.posts.map((p: any) => ({
              id: `facebook-${p.id}`,
              source: 'facebook',
              title: p.attachmentTitle || (p.message || '').slice(0, 120) || 'Facebook post',
              message: p.message || '',
              createdTime: p.createdTime || p.created_time || '',
              permalinkUrl: p.permalinkUrl || p.permalink_url || '',
              thumbnail: p.fullPicture || null,
              mediaType: p.mediaType || p.media_type || '',
            }))
          : [];

        const igItems: UnifiedItem[] = Array.isArray(igJson?.posts)
          ? igJson.posts.map((p: any) => ({
              id: `instagram-${p.id}`,
              source: 'instagram',
              title: (p.caption || '').slice(0, 120) || 'Instagram post',
              message: p.caption || '',
              createdTime: p.timestamp || '',
              permalinkUrl: p.permalink || '',
              thumbnail: p.thumbnailUrl || p.mediaUrl || p.thumbnail_url || null,
              mediaType: p.mediaType || p.media_type || '',
            }))
          : [];

        const ytItems: UnifiedItem[] = Array.isArray(ytJson?.videos)
          ? ytJson.videos.map((v: any) => ({
              id: `youtube-${v.id}`,
              source: 'youtube',
              title: v.title || 'YouTube video',
              message: v.description || '',
              createdTime: v.publishedAt || v.publishedAt || v.published || '',
              permalinkUrl: v.url || v.url || (v.id ? `https://www.youtube.com/watch?v=${v.id}` : ''),
              thumbnail: v.thumbnail || null,
              mediaType: 'video',
            }))
          : [];

        const combined = [...fbItems, ...igItems, ...ytItems]
          .filter((it) => it && (it.createdTime || it.permalinkUrl || it.title))
          .sort((a, b) => {
            const ta = a.createdTime ? Date.parse(a.createdTime) : 0;
            const tb = b.createdTime ? Date.parse(b.createdTime) : 0;
            return tb - ta;
          })
          .slice(0, limit || 10);

        if (mounted) setItems(combined);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [limit]);

  const placeholder = (source: string) => `No image available (${source})`;

  if (isLoading) {
    return <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">Loading social posts...</div>;
  }

  if (error) {
    return <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">{error}</div>;
  }

  if (!items.length) {
    return <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">No social posts available.</div>;
  }

  return (
    <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
      <div className="text-sm font-black text-slate-900 mb-4">Latest social updates</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-10 gap-4">
        {items.map((it) => {
          const hasLink = typeof it.permalinkUrl === 'string' && it.permalinkUrl.trim().length > 0;
          const Thumbnail = (
            <div className="w-full h-36 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
              {it.thumbnail ? (
                // eslint-disable-next-line jsx-a11y/img-redundant-alt
                <img src={it.thumbnail} alt={it.title || 'thumbnail'} className="w-full h-full object-cover" />
              ) : (
                <div className="text-xs text-slate-500">{placeholder(it.source)}</div>
              )}
            </div>
          );

          const content = (
            <div className="rounded-2xl border border-slate-200 p-3 h-full flex flex-col">
              {Thumbnail}
              <div className="mt-3 flex-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{it.source.toUpperCase()}</div>
                <div className="mt-2 text-sm font-semibold text-slate-900 leading-snug line-clamp-2">{it.title || it.message}</div>
              </div>
              <div className="mt-3 text-[10px] text-slate-400">{it.createdTime ? new Date(it.createdTime).toLocaleString() : ''}</div>
            </div>
          );

          if (hasLink) {
            return (
              <a
                key={it.id}
                href={it.permalinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {content}
              </a>
            );
          }

          // No link available: show disabled tile; if it's a video, show "Video unavailable"
          return (
            <div key={it.id} className="block opacity-80 cursor-not-allowed" title={it.mediaType === 'video' ? 'Video unavailable' : 'No link available'}>
              {content}
              {it.mediaType === 'video' ? (
                <div className="mt-2 text-xs font-bold text-red-500">Video unavailable</div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
