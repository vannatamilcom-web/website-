import { Link } from 'react-router-dom';
import { CATEGORIES, getCategoryBg } from '../lib/api';
import { getCategoryLabel } from '../lib/categoryDisplay';

export default function MenuPage() {
  return (
    <main className="pt-[var(--navbar-height)] min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary text-white font-black uppercase tracking-[0.3em] text-xs mb-4">
            MENU
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">Browse sections and videos by category</h1>
          <p className="mt-4 text-slate-600 max-w-2xl">Choose a category to view curated news and YouTube videos from your channel.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {CATEGORIES.map((category) => {
            const labelTa = getCategoryLabel(category, 'ta');
            const labelEn = getCategoryLabel(category, 'en');

            return (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className="group block rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm hover:shadow-xl transition-all"
              >
                <span
                  className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${getCategoryBg(category.slug)}`}
                >
                  {labelTa}
                </span>
                <h2 className="mt-6 text-2xl font-black text-slate-900">{labelEn}</h2>
                <p className="mt-3 text-slate-500 leading-relaxed">
                  Explore only your channelâ€™s videos and related news for {labelEn}.
                </p>
                <div className="mt-8 inline-flex items-center gap-2 text-primary font-black uppercase tracking-wide text-xs group-hover:text-primary/90">
                  Open category
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}

