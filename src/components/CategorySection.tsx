import React from 'react';
import { ArrowRight } from 'lucide-react';
import NewsCard from './NewsCard';
import { getCategoryColor } from '../lib/api';

interface CategorySectionProps {
  key?: React.Key;
  title: string;
  titleTa: string;
  category: string;
  articles: any[];
}

export default function CategorySection({ title, titleTa, category, articles }: CategorySectionProps) {
  const colorClass = getCategoryColor(category);
  
  return (
    <section className="py-12 border-t border-slate-100" id={category.toLowerCase().replace(' ', '-')}>
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 block ${colorClass.split(' ')[0]}`}>
            {title}
          </span>
          <h2 className="text-3xl font-black text-slate-900">{titleTa}</h2>
        </div>
        <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
          View All <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {articles.map((article, i) => (
          <NewsCard key={article.id} article={article} variant={i === 0 ? 'medium' : 'medium'} />
        ))}
      </div>
    </section>
  );
}
