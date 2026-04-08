import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, User, Share2, ArrowLeft, MessageCircle } from 'lucide-react';
import { MOCK_NEWS, getCategoryBg } from '../lib/api';
import { getCategorySlugFromName } from '../lib/categoryFilters';
import SidebarTrending from '../components/SidebarTrending';
import RightSidebarBlocks from '../components/RightSidebarBlocks';
import Seo from '../components/Seo';
import { motion } from 'framer-motion';

export default function NewsDetailPage() {
  const { id } = useParams();
  const article = MOCK_NEWS.find((n) => n.id === id) || MOCK_NEWS[0];
  const trendingNews = MOCK_NEWS.filter((n) => n.id !== id).slice(0, 4);
  const categorySlug = getCategorySlugFromName(article.category);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-[var(--navbar-height)] min-h-screen bg-white"
    >
      <Seo
        title={`${article.title} | Vannatamil News`}
        description={article.summary}
        keywords={`${article.category}, Tamil news, Vannatamil News, breaking news`}
        canonicalPath={`/news/${article.id}`}
        type="article"
        image={article.image}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: article.title,
          description: article.summary,
          image: [article.image],
          datePublished: article.date,
          dateModified: article.date,
          author: {
            '@type': 'Person',
            name: article.author,
          },
          publisher: {
            '@type': 'NewsMediaOrganization',
            name: 'Vannatamil News',
            logo: {
              '@type': 'ImageObject',
              url: `${window.location.origin}/logo.png`,
            },
          },
          mainEntityOfPage: `${window.location.origin}/news/${article.id}`,
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <article>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white mb-6 inline-block ${getCategoryBg(article.category)}`}>
                {article.category}
              </span>
              <h1 className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight mb-8">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 py-6 border-y border-slate-100 mb-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-2"><User className="w-4 h-4" /> {article.author}</span>
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> MARCH 18, 2026</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> 4 MIN READ</span>
                <button className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity ml-auto">
                  <Share2 className="w-4 h-4" /> Share Article
                </button>
              </div>

              <div className="rounded-[40px] overflow-hidden mb-10 aspect-video">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed space-y-6">
                <p className="text-xl font-bold text-slate-900 leading-relaxed italic border-l-4 border-primary pl-6 py-2">
                  {article.summary}
                </p>
                <p>{article.content}</p>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap gap-2">
                {['TamilNadu', 'News', 'Trending', 'Vannatamil'].map((tag) => (
                  <span key={tag} className="px-4 py-2 bg-slate-100 rounded-full text-[10px] font-bold text-slate-600 hover:bg-slate-200 cursor-pointer transition-colors">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="mt-16 bg-slate-50 rounded-[40px] p-8 lg:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <MessageCircle className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-black text-slate-900">Comments</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                    <div className="flex-1">
                      <div className="bg-white p-4 rounded-2xl shadow-sm">
                        <p className="text-sm text-slate-600">Very useful update. Thank you.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className="lg:col-span-4">
            <div className="space-y-6">
              <SidebarTrending articles={trendingNews} />
              <RightSidebarBlocks
                categorySlug={categorySlug}
                youtubeTitle={`${article.category} YouTube`}
                facebookTitle={`${article.category} Facebook`}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
