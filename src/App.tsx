import React, { useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import TopAdBar from './components/TopAdBar';
import BreakingNewsTicker from './components/BreakingNewsTicker';
import NewsCard from './components/NewsCard';
import Footer from './components/Footer';
import GlobalLeftAdSidebar from './components/GlobalLeftAdSidebar';
import GlobalRightSidebar from './components/GlobalRightSidebar';
import LiveTVPage from './pages/LiveTVPage';
import MenuPage from './pages/MenuPage';
import CategoryVideosPage from './pages/CategoryVideosPage';
import YouTubePage from './pages/YouTubePage';
import NewsDetailPage from './pages/NewsDetailPage';
import VideoWatchPage from './pages/VideoWatchPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import AboutPage from './pages/AboutPage';
import FacebookPage from './pages/FacebookPage';
import FacebookPostsFeed from './components/FacebookPostsFeed';
import YouTubeVideosFeed from './components/YouTubeVideosFeed';
import { CATEGORIES, MOCK_NEWS } from './lib/api';
import { getCategoryLabel } from './lib/categoryDisplay';
import { ArrowRight, BadgeCheck, Megaphone, Play, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/youtube" element={<YouTubePage />} />
          <Route path="/facebook" element={<FacebookPage />} />
          <Route path="/category/:slug" element={<CategoryVideosPage />} />
          <Route path="/live-tv" element={<LiveTVPage />} />
          <Route path="/videos/:id" element={<VideoWatchPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function HomePage() {
  const categoryHighlights = useMemo(() => {
    type Category = (typeof CATEGORIES)[number];
    const order = ['tamil-nadu', 'business', 'technology', 'sports', 'entertainment'];
    const bySlug = new Map<string, Category>(CATEGORIES.map((c) => [c.slug, c]));
    const picks = order.map((slug) => bySlug.get(slug)).filter((v): v is Category => Boolean(v));
    return (picks.length ? picks : CATEGORIES).slice(0, 5);
  }, []);

  const trendingArticles = useMemo(() => {
    const items = Array.isArray(MOCK_NEWS) ? MOCK_NEWS : [];
    const trending = items.filter((a) => Boolean(a?.trending));
    return (trending.length ? trending : items).slice(0, 6);
  }, []);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.05 },
    },
  } as const;

  const fadeUpItem = {
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1 },
  } as const;

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-[var(--navbar-height)]"
    >
      {/* Breaking News */}
      <BreakingNewsTicker />

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute -top-24 -left-24 w-[520px] h-[520px] bg-primary/60 blur-3xl rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-[520px] h-[520px] bg-white/20 blur-3xl rounded-full" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-white">
                <Sparkles className="w-4 h-4" /> Vannatamil News
              </div>
              <h1 className="mt-6 text-4xl sm:text-5xl font-black text-white leading-tight">
                Latest Tamil news &amp; videos—fast, verified, and community-first.
              </h1>
              <p className="mt-5 text-white/70 text-base sm:text-lg max-w-2xl">
                Watch the newest YouTube uploads, follow breaking updates, and explore category-wise coverage across Tamil Nadu and beyond.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#social"
                  className="px-8 py-3 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all shadow-xl shadow-black/20 inline-flex items-center gap-2"
                >
                  Explore Videos <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  to="/about"
                  className="px-8 py-3 bg-white/10 border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all inline-flex items-center gap-2"
                >
                  About Us <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/live-tv"
                  className="px-8 py-3 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all inline-flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  Watch Live <Play className="w-4 h-4 fill-white" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black uppercase tracking-widest text-white/60">Quick Highlights</div>
                  <div className="inline-flex items-center gap-2 text-white/70 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4 text-primary" /> Verified focus
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/60">Coverage</div>
                    <div className="mt-2 text-lg font-black text-white">Tamil Nadu + India</div>
                    <div className="mt-1 text-xs text-white/60">Regional + national updates</div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/60">Format</div>
                    <div className="mt-2 text-lg font-black text-white">Video First</div>
                    <div className="mt-1 text-xs text-white/60">YouTube + live coverage</div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-3">
	                {categoryHighlights.map((cat) => (
	                  <Link
	                    key={cat.slug}
	                    to={`/category/${cat.slug}`}
	                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10 transition-colors"
	                  >
	                    <span className="text-sm font-black text-white">{getCategoryLabel(cat, 'ta')}</span>
	                    <span className="text-xs font-bold text-white/70 group-hover:text-white inline-flex items-center gap-2">
	                      Open <ArrowRight className="w-4 h-4" />
	                    </span>
	                  </Link>
	                ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-black uppercase tracking-[0.3em] text-white">
                <TrendingUp className="w-4 h-4" />
                Trending
              </div>
              <h2 className="mt-5 text-3xl sm:text-4xl font-black text-slate-900 leading-tight">Top stories right now</h2>
              <p className="mt-4 max-w-2xl text-slate-600">
                Quick highlights from the latest updates. Tap any card to read the full story.
              </p>
            </div>
            <Link
              to="/menu"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 font-black hover:shadow-md transition-all w-full md:w-auto"
            >
              Browse Categories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {trendingArticles.map((article) => (
              <motion.div
                key={article.id}
                variants={fadeUpItem}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <NewsCard article={article} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social media overview */}
      <section id="social" className="bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-black uppercase tracking-[0.3em] text-white">
              <BadgeCheck className="w-4 h-4" />
              Social Media
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl font-black text-slate-900 leading-tight">Follow us everywhere</h2>
            <p className="mt-4 max-w-2xl text-slate-600">
              Latest updates from our YouTube channel, Instagram feed, and Facebook page—right on the homepage.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-start justify-between gap-6 mb-4">
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-slate-500">YouTube</div>
                    <h3 className="mt-2 text-xl font-black text-slate-900">Latest videos</h3>
                    <p className="mt-2 text-sm text-slate-600">Watch the newest uploads and open the full video player.</p>
                  </div>
                  <Link to="/youtube" className="shrink-0 inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:underline">
                    View all <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <YouTubeVideosFeed limit={10} />
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-start justify-between gap-6 mb-4">
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-slate-500">Facebook</div>
                    <h3 className="mt-2 text-xl font-black text-slate-900">Latest posts</h3>
                    <p className="mt-2 text-sm text-slate-600">Latest Facebook posts on the homepage, with a separate page to view the full feed.</p>
                  </div>
                  <Link to="/facebook" className="shrink-0 inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:underline">
                    View all <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <FacebookPostsFeed limit={10} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement / Branding */}
      <section className="bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-black uppercase tracking-[0.3em] text-white">
                <Megaphone className="w-4 h-4" />
                Advertising
              </div>
              <h2 className="mt-5 text-3xl sm:text-4xl font-black text-slate-900 leading-tight">Promote your brand with us</h2>
              <p className="mt-4 max-w-2xl text-slate-600">
                Reserve space for banner ads, sponsor a section, or run a branded campaign across web + social.
              </p>
            </div>
            <a
              href="mailto:sheikhameda44@gmail.com?subject=Advertising%20Inquiry%20-%20Vannatamil%20News"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-black hover:bg-primary/90 transition-all w-full md:w-auto"
            >
              Contact for Ads <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="text-xs font-black uppercase tracking-widest text-slate-500">Ad Slot</div>
              <div className="mt-3 text-xl font-black text-slate-900">Leaderboard Banner</div>
              <p className="mt-2 text-sm text-slate-600">Suggested size: 728×90 or 970×250 (top-of-page branding).</p>
              <div className="mt-6 h-36 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-500 font-black">
                YOUR BRAND HERE
              </div>
            </div>
            <div className="lg:col-span-4 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="text-xs font-black uppercase tracking-widest text-slate-500">Ad Slot</div>
              <div className="mt-3 text-xl font-black text-slate-900">Sidebar / Card</div>
              <p className="mt-2 text-sm text-slate-600">Suggested size: 300×250 (sponsor block / local business).</p>
              <div className="mt-6 h-36 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-500 font-black text-center px-6">
                SPONSOR
                <br />
                THIS SECTION
              </div>
              <div className="mt-6 text-sm text-slate-700">
                Email: <a className="text-primary font-black hover:underline" href="mailto:sheikhameda44@gmail.com">sheikhameda44@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live TV CTA Section */}
      <section className="bg-primary py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-8 border border-white/30">
            <Play className="w-10 h-10 text-white fill-white" />
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
            எங்கிருந்தும் நேரலையில் செய்திகளைப் பாருங்கள்
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            Stay connected with real-time news updates. Watch our live broadcast anytime, anywhere on any device.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/live-tv" className="px-10 py-4 bg-white text-primary font-black rounded-2xl hover:bg-slate-100 transition-all shadow-xl shadow-black/20">
              WATCH LIVE TV
            </Link>
            <Link to="/about" className="px-10 py-4 bg-white/10 border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all">
              LEARN MORE
            </Link>
          </div>
        </div>
      </section>
    </motion.main>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <TopAdBar />
        <Navbar />
        <GlobalLeftAdSidebar />
        <GlobalRightSidebar />
        <AnimatedRoutes />
        <Footer />
      </div>
    </Router>
  );
}
