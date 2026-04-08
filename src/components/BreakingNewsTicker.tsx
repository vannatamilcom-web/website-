import React, { useEffect, useMemo, useState } from 'react';

type YouTubeVideo = {
  id: string;
  title?: string;
  publishedAt?: string;
};

type FacebookPost = {
  id: string;
  message?: string;
  createdTime?: string;
};

type YouTubeVideosResponse = {
  videos?: YouTubeVideo[];
};

type FacebookPostsResponse = {
  posts?: FacebookPost[];
};

const FALLBACK_NEWS = [
  'சமீபத்திய செய்திகளை உடனுக்குடன் இங்கே பார்க்கலாம்.',
  'வீடியோக்கள் மற்றும் சமூக வலைதள பதிவுகளிலிருந்து தலைப்புகள் இங்கே காட்டப்படும்.',
];

const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();

const truncate = (value: string, maxLength: number) => {
  const trimmed = normalize(value);
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 1)}...`;
};

const getPostHeading = (message?: string) => {
  const normalized = normalize(message || '');
  if (!normalized) return '';
  const firstSentence = normalized.split(/[.!?]/)[0]?.trim() || normalized;
  return truncate(firstSentence, 110);
};

export default function BreakingNewsTicker() {
  const [videoHeading, setVideoHeading] = useState('');
  const [postHeading, setPostHeading] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadTickerItems = async () => {
      try {
        const [videoResponse, postResponse] = await Promise.allSettled([
          fetch('/youtube-videos.json', { cache: 'no-store' }),
          fetch('/facebook-posts.json', { cache: 'no-store' }),
        ]);

        if (
          videoResponse.status === 'fulfilled' &&
          videoResponse.value.ok
        ) {
          const json = (await videoResponse.value.json()) as YouTubeVideosResponse;
          const latestVideo = Array.isArray(json.videos) ? json.videos[0] : null;
          if (isMounted && latestVideo?.title) {
            setVideoHeading(`வீடியோ: ${truncate(latestVideo.title, 120)}`);
          }
        }

        if (
          postResponse.status === 'fulfilled' &&
          postResponse.value.ok
        ) {
          const json = (await postResponse.value.json()) as FacebookPostsResponse;
          const latestPost = Array.isArray(json.posts) ? json.posts[0] : null;
          const heading = getPostHeading(latestPost?.message);
          if (isMounted && heading) {
            setPostHeading(`போஸ்ட்: ${heading}`);
          }
        }
      } catch {
        // Fall back to default headlines when feed files are not available.
      }
    };

    loadTickerItems();

    return () => {
      isMounted = false;
    };
  }, []);

  const news = useMemo(() => {
    const items = [videoHeading, postHeading].filter(Boolean);
    return items.length > 0 ? items : FALLBACK_NEWS;
  }, [postHeading, videoHeading]);

  return (
    <div className="bg-red-600 text-white py-2 flex items-center">
      <div className="px-4 font-black text-xs uppercase tracking-widest border-r border-white/20 whitespace-nowrap shrink-0">
        சமீபத்திய செய்திகள்
      </div>
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {news.map((item, i) => (
            <span key={i} className="mx-8 text-sm font-medium">
              • {item}
            </span>
          ))}
          {news.map((item, i) => (
            <span key={`dup-${i}`} className="mx-8 text-sm font-medium">
              • {item}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
