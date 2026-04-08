import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Share2, Play } from 'lucide-react';
import { CATEGORIES, getCategoryBg } from '../lib/api';
import { getCategoryLabel } from '../lib/categoryDisplay';
import { useAppLanguage } from '../lib/language';

interface NewsCardProps {
  key?: React.Key;
  article: any;
  variant?: 'large' | 'medium' | 'small' | 'video';
}

export default function NewsCard({ article, variant = 'medium' }: NewsCardProps) {
  const { lang } = useAppLanguage();
  const linkPath = variant === 'video' ? `/videos/${article.id}` : `/news/${article.id}`;
  const matchedCategory = CATEGORIES.find((category) => category.name === article.category) ?? CATEGORIES[0];
  const categoryLabel = getCategoryLabel(matchedCategory, lang);
  const title = lang === 'en' ? article.titleEn || article.title : article.title;
  const summary = lang === 'en' ? article.summaryEn || article.summary : article.summary;
  const hoursAgo = lang === 'en' ? '4 HOURS AGO' : '4 மணி நேரம் முன்பு';
  const byText = lang === 'en' ? 'BY' : 'எழுதியவர்';

  if (variant === 'large') {
    return (
      <Link to={linkPath} className="group relative block overflow-hidden rounded-3xl bg-slate-900 aspect-[16/9] lg:aspect-auto lg:h-[600px] cursor-pointer">
        <img 
          src={article.image} 
          alt={title}
          className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="absolute bottom-0 p-6 lg:p-12 w-full">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white mb-4 inline-block ${getCategoryBg(article.category)}`}>
            {categoryLabel}
          </span>
          <h2 className="text-2xl lg:text-5xl font-black text-white leading-tight mb-4 group-hover:text-white/90 transition-colors">
            {title}
          </h2>
          <p className="text-white/70 text-sm lg:text-lg max-w-2xl line-clamp-2 mb-6">
            {summary}
          </p>
          <div className="flex items-center gap-4 text-white/50 text-xs font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {lang === 'en' ? '2 HOURS AGO' : '2 மணி நேரம் முன்பு'}</span>
            <span>{byText} {article.author}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'video') {
    return (
      <Link to={linkPath} className="group block cursor-pointer">
        <div className="relative aspect-video rounded-2xl overflow-hidden mb-3">
          <img 
            src={article.thumbnail} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-[10px] font-bold rounded">
            12:45
          </div>
        </div>
        <h3 className="font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{article.publishedAt}</p>
      </Link>
    );
  }

  return (
    <div className={`group ${variant === 'small' ? 'flex gap-4' : ''}`}>
      <Link to={linkPath} className={`relative block overflow-hidden rounded-2xl ${variant === 'small' ? 'w-24 h-24 shrink-0' : 'aspect-[16/9] mb-4'}`}>
        <img 
          src={article.image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {variant !== 'small' && (
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white ${getCategoryBg(article.category)}`}>
            {categoryLabel}
          </div>
        )}
      </Link>
      <div className="flex-1">
        <Link to={linkPath} className={`block font-black text-slate-900 leading-tight hover:text-primary transition-colors ${variant === 'small' ? 'text-sm line-clamp-2' : 'text-xl mb-2'}`}>
          {title}
        </Link>
        {variant !== 'small' && (
          <p className="text-slate-500 text-sm line-clamp-2 mb-4">
            {summary}
          </p>
        )}
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {hoursAgo}</span>
          <button className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
