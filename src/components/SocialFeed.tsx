import React from 'react';
import { Twitter, Instagram } from 'lucide-react';
import { FACEBOOK_URL, FACEBOOK_PAGE_URL, INSTAGRAM_URL } from '../lib/socialLinks';
import FacebookPostsFeed from './FacebookPostsFeed';
import InstagramPostsFeed from './InstagramPostsFeed';
import YouTubeVideosFeed from './YouTubeVideosFeed';

export default function SocialFeed() {
  const facebookUrl = FACEBOOK_URL;
  const facebookPageUrl = FACEBOOK_PAGE_URL;
  const instagramUrl = INSTAGRAM_URL;

  return (
    <section id="social" className="py-12 border-t border-slate-100">
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2 block">
            Social Connect
          </span>
          <h2 className="text-3xl font-black text-slate-900">
            சமூக வலைதளங்களில் நாம்
          </h2>
        </div>
        <div className="flex gap-2">
          <a
            href={facebookUrl || facebookPageUrl || '#'}
            target="_blank"
            rel="noreferrer"
            className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors text-[#1877F2] font-black text-xs"
            aria-label="Facebook"
            title="Facebook"
          >
            f
          </a>
          <a href="#" className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
            <Twitter className="w-4 h-4 text-[#1DA1F2]" />
          </a>
          <a
            href={instagramUrl || '#'}
            target="_blank"
            rel="noreferrer"
            className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
          >
            <Instagram className="w-4 h-4 text-[#E4405F]" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <FacebookPostsFeed />
          <YouTubeVideosFeed />
        </div>

        <div className="lg:col-span-7">
          <InstagramPostsFeed />
        </div>
      </div>
    </section>
  );
}
