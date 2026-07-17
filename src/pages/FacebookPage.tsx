import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import FacebookPostsFeed from '../components/FacebookPostsFeed';
import Seo from '../components/Seo';
import { collectionPageSchema, siteSchema } from '../lib/schema';

export default function FacebookPage() {
  return (
    <main className="pt-[var(--navbar-height)] min-h-screen bg-slate-50">
      <Seo
        title="Social Media Posts | Vannatamil News"
        description="Browse the latest social media posts and updates from Vannatamil News."
        keywords="Vannatamil News Facebook, Tamil news social media, Vannatamil News posts"
        canonicalPath="/facebook"
        structuredData={siteSchema(collectionPageSchema(
          '/facebook',
          'Social Media Posts | Vannatamil News',
          'Browse the latest social media posts and updates from Vannatamil News.',
        ))}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="mt-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <div className="inline-flex items-center rounded-full bg-[#1877F2] px-4 py-2 text-xs font-black uppercase tracking-[0.3em] text-white">
              Social Media
            </div>
            <h1 className="mt-5 text-4xl font-black text-slate-900 leading-tight">All Social Media Posts</h1>
            <p className="mt-4 max-w-2xl text-slate-600">
              Browse the social media feed on its own separate page.
            </p>
          </div>

          <FacebookPostsFeed limit={30} variant="article" />
        </div>
      </div>
    </main>
  );
}
