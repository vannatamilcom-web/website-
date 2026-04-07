import React from 'react';
import { TrendingUp, Mail, Instagram, Twitter, Youtube } from 'lucide-react';
import NewsCard from './NewsCard';

export default function SidebarTrending({ articles }: { articles: any[] }) {
  return (
    <aside className="space-y-12 sticky top-24">
      {/* Trending News */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-accent-breaking/10 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-accent-breaking" />
          </div>
          <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Trending Now</h3>
        </div>
        <div className="space-y-6">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} variant="small" />
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="bg-primary rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        <Mail className="w-10 h-10 mb-4 opacity-50" />
        <h3 className="text-xl font-black mb-2">Stay Updated</h3>
        <p className="text-white/70 text-sm mb-6">Get the latest news delivered straight to your inbox daily.</p>
        <div className="space-y-3">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm focus:outline-none focus:bg-white/20 transition-all"
          />
          <button className="w-full py-3 bg-white text-primary font-black rounded-xl text-sm hover:bg-slate-100 transition-colors">
            SUBSCRIBE
          </button>
        </div>
      </div>

      {/* Social Links */}
      <div>
        <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6">Follow Us</h3>
        <div className="grid grid-cols-3 gap-3">
          <a href="#" className="flex flex-col items-center justify-center p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors group">
            <Twitter className="w-5 h-5 text-slate-600 group-hover:text-[#1DA1F2]" />
            <span className="text-[10px] font-bold mt-2">X</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors group">
            <Instagram className="w-5 h-5 text-slate-600 group-hover:text-[#E4405F]" />
            <span className="text-[10px] font-bold mt-2">INSTA</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors group">
            <Youtube className="w-5 h-5 text-slate-600 group-hover:text-[#FF0000]" />
            <span className="text-[10px] font-bold mt-2">YT</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
