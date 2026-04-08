import React, { useEffect, useMemo, useState } from 'react';

type FacebookVideo = {
  id: string;
  description: string;
  source: string;
  createdTime?: string | null;
};

type FacebookVideosResponse = {
  generatedAt?: string;
  pageId?: string;
  count?: number;
  videos?: FacebookVideo[];
  error?: string;
};

const truncate = (value: string, maxLength: number) => {
  const trimmed = value.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 1)}...`;
};

export default function FacebookVideosFeed() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [data, setData] = useState<FacebookVideosResponse | null>(null);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response = await fetch('/facebook-videos.php', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`facebook-videos.php returned ${response.status}`);
        }

        const json = (await response.json()) as FacebookVideosResponse;
        if (!isMounted) return;
        setData(json);
      } catch (error) {
        if (!isMounted) return;
        setData(null);
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load Facebook videos');
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

  const videos = useMemo(() => (Array.isArray(data?.videos) ? data!.videos : []), [data]);

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
        <div className="h-4 w-40 bg-slate-100 rounded mb-4" />
        <div className="space-y-4">
          <div className="h-24 bg-slate-100 rounded-2xl" />
          <div className="h-24 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (errorMessage || videos.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6">
        <div className="text-sm font-black text-slate-900 mb-2">Facebook latest videos</div>
        <div className="text-sm text-slate-700 leading-relaxed">
          {errorMessage ? 'Facebook videos are not available right now.' : 'No Facebook videos found yet for this page.'}
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
        <div className="text-sm font-black text-slate-900">Facebook latest videos</div>
        {data?.generatedAt ? (
          <div className="text-[10px] font-bold text-slate-400 mt-1">
            Updated: {new Date(data.generatedAt).toLocaleString()}
          </div>
        ) : null}
      </div>
      <div className="divide-y divide-slate-100">
        {videos.slice(0, 5).map((video) => (
          <a
            key={video.id}
            href={video.source}
            target="_blank"
            rel="noreferrer"
            className="block p-6 hover:bg-slate-50 transition-colors"
          >
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-2xl bg-[#1877F2]/10 flex-shrink-0 flex items-center justify-center">
                <span className="text-[#1877F2] text-xs font-black uppercase tracking-widest">Video</span>
              </div>

              <div className="min-w-0">
                <div className="text-xs font-black uppercase tracking-widest text-[#1877F2] mb-1">Facebook</div>
                <div className="text-sm text-slate-800 font-semibold leading-snug">
                  {truncate(video.description || 'Watch the latest Facebook video', 140)}
                </div>
                {video.createdTime ? (
                  <div className="text-[10px] font-bold text-slate-400 mt-2">
                    {new Date(video.createdTime).toLocaleString()}
                  </div>
                ) : null}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
