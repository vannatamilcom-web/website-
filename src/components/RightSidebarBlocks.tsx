import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLatestVideos, Video } from '../lib/youtube';
import { getCategoryKeywords, getCategorySearchQuery } from '../lib/categoryFilters';

type FacebookPost = {
  id: string;
  message: string;
  createdTime?: string;
  permalinkUrl?: string;
};

type FacebookPostsResponse = {
  posts?: FacebookPost[];
};

type RightSidebarBlocksProps = {
  categorySlug?: string | null;
  youtubeTitle?: string;
  facebookTitle?: string;
};

const truncate = (value: string, maxLength: number) => {
  const trimmed = value.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 1)}...`;
};

export default function RightSidebarBlocks({
  categorySlug,
  youtubeTitle = 'YouTube Videos',
  facebookTitle = 'Facebook Posts',
}: RightSidebarBlocksProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [posts, setPosts] = useState<FacebookPost[]>([]);
  const keywords = useMemo(() => getCategoryKeywords(categorySlug), [categorySlug]);

  useEffect(() => {
    const load = async () => {
      try {
        const fetchedVideos = await fetchLatestVideos({
          max: 8,
          query: getCategorySearchQuery(categorySlug),
          keywords: keywords.length ? keywords : undefined,
          useMockFallback: false,
        });
        setVideos(fetchedVideos.slice(0, 6));
      } catch {
        setVideos([]);
      }
    };

    load();
  }, [categorySlug, keywords]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/facebook-posts.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('facebook-posts.json missing');
        const json = (await response.json()) as FacebookPostsResponse;
        const allPosts = Array.isArray(json.posts) ? json.posts : [];
        const filtered = keywords.length
          ? allPosts.filter((post) => {
              const text = (post.message || '').toLowerCase();
              return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
            })
          : allPosts;
        setPosts((filtered.length ? filtered : allPosts).slice(0, 6));
      } catch {
        setPosts([]);
      }
    };

    load();
  }, [keywords]);

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-[#FF0000]">YouTube</div>
            <h3 className="mt-2 text-lg font-black text-slate-900">{youtubeTitle}</h3>
          </div>
          <Link to="/youtube" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {videos.length > 0 ? videos.map((video) => (
            <Link
              key={video.id}
              to={`/videos/${video.id}`}
              className="flex gap-3 rounded-2xl border border-slate-200 p-3 hover:border-slate-300 transition-colors"
            >
              <div className="w-24 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                {video.thumbnail ? (
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : null}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-black text-slate-900 leading-snug line-clamp-2">{video.title}</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">{video.publishedAt}</div>
              </div>
            </Link>
          )) : (
            <div className="text-sm text-slate-500">No YouTube videos available for this section right now.</div>
          )}
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-[#1877F2]">Facebook</div>
            <h3 className="mt-2 text-lg font-black text-slate-900">{facebookTitle}</h3>
          </div>
          <Link to="/facebook" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {posts.length > 0 ? posts.map((post) => (
            <a
              key={post.id}
              href={post.permalinkUrl || '#'}
              target="_blank"
              rel="noreferrer"
              className="block rounded-2xl border border-slate-200 p-4 hover:border-slate-300 transition-colors"
            >
              <div className="text-xs font-black uppercase tracking-widest text-[#1877F2]">Facebook Post</div>
              <div className="mt-2 text-sm font-semibold text-slate-900 leading-snug">
                {truncate(post.message || 'Open post', 140)}
              </div>
              {post.createdTime ? (
                <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {new Date(post.createdTime).toLocaleDateString()}
                </div>
              ) : null}
            </a>
          )) : (
            <div className="text-sm text-slate-500">No Facebook posts available for this section right now.</div>
          )}
        </div>
      </div>
    </div>
  );
}
