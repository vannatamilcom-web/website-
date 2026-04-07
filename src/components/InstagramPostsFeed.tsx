import React, { useEffect, useMemo, useState } from 'react';

type InstagramPost = {
  id: string;
  caption: string;
  mediaType: string;
  mediaUrl: string;
  permalink: string;
  thumbnailUrl: string;
  timestamp: string;
  username: string;
};

type InstagramPostsResponse = {
  generatedAt?: string;
  count?: number;
  posts?: InstagramPost[];
  error?: string;
};

const truncate = (value: string, maxLength: number) => {
  const trimmed = value.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 1)}…`;
};

export default function InstagramPostsFeed() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [data, setData] = useState<InstagramPostsResponse | null>(null);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response = await fetch('/instagram-posts.json', { cache: 'no-store' });
        if (!response.ok) throw new Error(`Missing instagram-posts.json (${response.status})`);

        const json = (await response.json()) as InstagramPostsResponse;
        if (!isMounted) return;
        setData(json);
      } catch (error) {
        if (!isMounted) return;
        setData(null);
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load Instagram posts');
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

  const posts = useMemo(() => (Array.isArray(data?.posts) ? data!.posts : []), [data]);

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
        <div className="h-4 w-44 bg-slate-100 rounded mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-44 bg-slate-100 rounded-2xl" />
          <div className="h-44 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (errorMessage || posts.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
        <div className="text-sm font-black text-slate-900 mb-2">Instagram latest posts</div>
        <div className="text-sm text-slate-700 leading-relaxed">
          {errorMessage ? 'Instagram posts are not available yet on this deployment.' : 'No Instagram posts found yet for this deployment.'}
        </div>
        {data?.error ? (
          <div className="text-xs text-slate-500 mt-3 leading-relaxed">
            Debug: <span className="font-mono">{data.error}</span>
          </div>
        ) : null}
        <div className="text-xs text-slate-500 mt-3 leading-relaxed">
          To enable: add GitHub Secret <span className="font-mono">INSTAGRAM_ACCESS_TOKEN</span> (and optionally{' '}
          <span className="font-mono">INSTAGRAM_USER_ID</span>), then run the deploy workflow.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="text-sm font-black text-slate-900">Instagram latest posts</div>
        {data?.generatedAt && (
          <div className="text-[10px] font-bold text-slate-400 mt-1">Updated: {new Date(data.generatedAt).toLocaleString()}</div>
        )}
      </div>

      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {posts.slice(0, 6).map((post) => {
          const previewImage = post.mediaType === 'VIDEO' ? post.thumbnailUrl : post.mediaUrl;
          return (
            <a
              key={post.id}
              href={post.permalink || '#'}
              target="_blank"
              rel="noreferrer"
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-slate-100">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                ) : null}
              </div>
              <div className="p-4">
                <div className="text-xs font-black uppercase tracking-widest text-[#E4405F] mb-2">Instagram</div>
                <div className="text-sm font-semibold text-slate-800 leading-snug">
                  {post.caption ? truncate(post.caption, 120) : 'Open post'}
                </div>
                {post.timestamp && (
                  <div className="text-[10px] font-bold text-slate-400 mt-2">{new Date(post.timestamp).toLocaleString()}</div>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
