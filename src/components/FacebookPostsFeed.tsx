import React, { useEffect, useMemo, useState } from 'react';

type FacebookPost = {
  id: string;
  message: string;
  createdTime: string;
  permalinkUrl: string;
  fullPicture: string | null;
};

type FacebookPostsResponse = {
  generatedAt?: string;
  pageId?: string;
  count?: number;
  posts?: FacebookPost[];
  error?: string;
};

type FacebookPostsFeedProps = {
  limit?: number;
};

const truncate = (value: string, maxLength: number) => {
  const trimmed = value.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 1)}…`;
};

export default function FacebookPostsFeed({ limit = 10 }: FacebookPostsFeedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [data, setData] = useState<FacebookPostsResponse | null>(null);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response = await fetch('/facebook-posts.json', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`facebook-posts.json returned ${response.status}`);
        }

        const json = (await response.json()) as FacebookPostsResponse;
        if (!isMounted) return;
        setData(json);
      } catch (error) {
        if (!isMounted) return;
        setData(null);
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load Facebook posts');
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

  const posts = useMemo(() => (Array.isArray(data?.posts) ? data!.posts : []), [data]);

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

  if (errorMessage || posts.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
        <div className="text-sm font-black text-slate-900 mb-2">Facebook latest posts</div>
        <div className="text-sm text-slate-700 leading-relaxed">
          {errorMessage
            ? 'Facebook posts are not available right now.'
            : 'No Facebook posts found yet for this page.'}
        </div>
        {data?.error ? (
          <div className="text-xs text-slate-500 mt-3 leading-relaxed">
            Debug: <span className="font-mono">{data.error}</span>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="text-sm font-black text-slate-900">Facebook latest posts</div>
        {data?.generatedAt && (
          <div className="text-[10px] font-bold text-slate-400 mt-1">Updated: {new Date(data.generatedAt).toLocaleString()}</div>
        )}
      </div>
      <div className="divide-y divide-slate-100">
        {posts.slice(0, limit).map((post) => (
          <a
            key={post.id}
            href={post.permalinkUrl || '#'}
            target="_blank"
            rel="noreferrer"
            className="block p-6 hover:bg-slate-50 transition-colors"
          >
            <div className="flex gap-4">
              {post.fullPicture ? (
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img
                    src={post.fullPicture}
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
                <div className="text-xs font-black uppercase tracking-widest text-primary mb-1">Facebook</div>
                <div className="text-sm text-slate-800 font-semibold leading-snug">
                  {post.message ? truncate(post.message, 140) : 'Open post'}
                </div>
                {post.createdTime && (
                  <div className="text-[10px] font-bold text-slate-400 mt-2">
                    {new Date(post.createdTime).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
