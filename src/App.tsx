import React, { useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import TopAdBar from './components/TopAdBar';
import BreakingNewsTicker from './components/BreakingNewsTicker';
import Footer from './components/Footer';
import GlobalLeftAdSidebar from './components/GlobalLeftAdSidebar';
import GlobalRightSidebar from './components/GlobalRightSidebar';
import Seo from './components/Seo';
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
import { CATEGORIES } from './lib/api';
import { getCategoryLabel } from './lib/categoryDisplay';
import { ArrowRight, BadgeCheck, Megaphone, Play, ShieldCheck, Sparkles } from 'lucide-react';
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

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-[var(--navbar-height)]">
      <Seo
        title="Vannatamil News | Tamil News, Breaking Updates, Live TV"
        description="Latest Tamil news, breaking updates, live TV, YouTube videos, and category-wise coverage from Vannatamil News."
        keywords="Tamil news, breaking news Tamil, live TV Tamil, Vannatamil News, Tamil Nadu news, YouTube Tamil news"
        canonicalPath="/"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'NewsMediaOrganization',
          name: 'Vannatamil News',
          url: window.location.origin,
          logo: `${window.location.origin}/logo.png`,
          sameAs: ['https://www.youtube.com/', 'https://www.facebook.com/'],
        }}
      />
      <BreakingNewsTicker />

      <section className="relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute -top-24 -left-24 w-[520px] h-[520px] bg-primary/60 blur-3xl rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-[520px] h-[520px] bg-white/20 blur-3xl rounded-full" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-white">
                <Sparkles className="w-4 h-4" /> வண்ணதமிழ் நியூஸ்
              </div>
              <h1 className="mt-6 text-4xl sm:text-5xl font-black text-white leading-tight">
                சமீபத்திய தமிழ் செய்திகள் மற்றும் வீடியோக்கள், வேகமாகவும் நம்பகமாகவும்.
              </h1>
              <p className="mt-5 text-white/70 text-base sm:text-lg max-w-2xl">
                புதிய YouTube பதிவுகளை பாருங்கள், உடனடி செய்திகளைப் பெறுங்கள், மற்றும் பிரிவுகளின்படி செய்திகளை ஆராயுங்கள்.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#social"
                  className="px-8 py-3 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all shadow-xl shadow-black/20 inline-flex items-center gap-2"
                >
                  வீடியோக்களை பார்க்க <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  to="/about"
                  className="px-8 py-3 bg-white/10 border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all inline-flex items-center gap-2"
                >
                  எங்களை பற்றி <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/live-tv"
                  className="px-8 py-3 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all inline-flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  நேரலை பார்க்க <Play className="w-4 h-4 fill-white" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black uppercase tracking-widest text-white/60">முக்கிய அம்சங்கள்</div>
                  <div className="inline-flex items-center gap-2 text-white/70 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4 text-primary" /> சரிபார்க்கப்பட்ட தகவல்
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/60">செய்தி பரப்பு</div>
                    <div className="mt-2 text-lg font-black text-white">தமிழ்நாடு + இந்தியா</div>
                    <div className="mt-1 text-xs text-white/60">மாநில மற்றும் தேசிய அப்டேட்கள்</div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/60">வடிவம்</div>
                    <div className="mt-2 text-lg font-black text-white">வீடியோ மையம்</div>
                    <div className="mt-1 text-xs text-white/60">YouTube + நேரலை ஒளிபரப்பு</div>
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
                        திறக்க <ArrowRight className="w-4 h-4" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-black uppercase tracking-[0.3em] text-white">
                <BadgeCheck className="w-4 h-4" />
                Latest Posts
              </div>
              <h2 className="mt-5 text-3xl sm:text-4xl font-black text-slate-900 leading-tight">முகப்புப் பக்கத்திற்கான சமீபத்திய பதிவுகள்</h2>
              <p className="mt-4 max-w-2xl text-slate-600">
                முக்கியமான சமூக ஊடக அப்டேட்களில் இருந்து 2 சமீபத்திய பதிவுகளை இங்கே நேரடியாக பார்க்கலாம்.
              </p>
            </div>
            <Link
              to="/facebook"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 font-black hover:shadow-md transition-all w-full md:w-auto"
            >
              அனைத்து பதிவுகளும் <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
            <FacebookPostsFeed limit={2} />
          </div>
        </div>
      </section>

      <section id="social" className="bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-black uppercase tracking-[0.3em] text-white">
              <BadgeCheck className="w-4 h-4" />
              சமூக ஊடகம்
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl font-black text-slate-900 leading-tight">எங்களை எல்லா தளங்களிலும் பின்தொடருங்கள்</h2>
            <p className="mt-4 max-w-2xl text-slate-600">
              எங்கள் YouTube சேனல், Instagram feed மற்றும் சமூக ஊடக பக்கங்களின் சமீபத்திய அப்டேட்கள் இங்கே.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-start justify-between gap-6 mb-4">
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-slate-500">யூடியூப்</div>
                    <h3 className="mt-2 text-xl font-black text-slate-900">சமீபத்திய வீடியோக்கள்</h3>
                    <p className="mt-2 text-sm text-slate-600">புதிய பதிவுகளைப் பாருங்கள் மற்றும் முழு வீடியோவைத் திறக்கவும்.</p>
                  </div>
                  <Link to="/youtube" className="shrink-0 inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:underline">
                    அனைத்தையும் பார்க்க <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <YouTubeVideosFeed limit={10} />
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-start justify-between gap-6 mb-4">
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-slate-500">SOCIAL MEDIA</div>
                    <h3 className="mt-2 text-xl font-black text-slate-900">சமீபத்திய சமூக ஊடக பதிவுகள்</h3>
                    <p className="mt-2 text-sm text-slate-600">முகப்புப் பக்கத்திலேயே சமீபத்திய சமூக ஊடக பதிவுகளைப் பாருங்கள்.</p>
                  </div>
                  <Link to="/facebook" className="shrink-0 inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:underline">
                    அனைத்தையும் பார்க்க <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <FacebookPostsFeed limit={2} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-black uppercase tracking-[0.3em] text-white">
                <Megaphone className="w-4 h-4" />
                விளம்பரம்
              </div>
              <h2 className="mt-5 text-3xl sm:text-4xl font-black text-slate-900 leading-tight">உங்கள் பிராண்டை எங்களுடன் விளம்பரப்படுத்துங்கள்</h2>
              <p className="mt-4 max-w-2xl text-slate-600">
                பேனர் விளம்பரம், ஸ்பான்சர் பகுதி, அல்லது உங்கள் பிராண்டு பிரச்சாரத்திற்கான இடத்தை பதிவு செய்யுங்கள்.
              </p>
            </div>
            <a
              href="https://wa.me/919791067553?text=Hello%20Vannatamil%20News%2C%20I%20would%20like%20to%20advertise%20on%20your%20website."
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-black hover:bg-primary/90 transition-all w-full md:w-auto"
            >
              விளம்பரத்திற்கு தொடர்பு கொள்ள <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="text-xs font-black uppercase tracking-widest text-slate-500">விளம்பர இடம்</div>
              <div className="mt-3 text-xl font-black text-slate-900">மேல் பேனர்</div>
              <p className="mt-2 text-sm text-slate-600">பரிந்துரைக்கப்படும் அளவு: 728x90 அல்லது 970x250.</p>
              <div className="mt-6 h-36 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-500 font-black">
                உங்கள் பிராண்டு இங்கே
              </div>
            </div>
            <div className="lg:col-span-4 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="text-xs font-black uppercase tracking-widest text-slate-500">விளம்பர இடம்</div>
              <div className="mt-3 text-xl font-black text-slate-900">பக்க கார்டு</div>
              <p className="mt-2 text-sm text-slate-600">பரிந்துரைக்கப்படும் அளவு: 300x250.</p>
              <div className="mt-6 h-36 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-500 font-black text-center px-6">
                ஸ்பான்சர்
                <br />
                இந்த பகுதி
              </div>
              <div className="mt-6 text-sm text-slate-700">
                மின்னஞ்சல்: <a className="text-primary font-black hover:underline" href="mailto:info@vannatamil.news">info@vannatamil.news</a>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            நேரடி செய்தி அப்டேட்களுடன் இணைந்திருங்கள். எந்த நேரத்திலும் எந்த சாதனத்திலும் எங்கள் நேரலை ஒளிபரப்பைப் பாருங்கள்.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/live-tv" className="px-10 py-4 bg-white text-primary font-black rounded-2xl hover:bg-slate-100 transition-all shadow-xl shadow-black/20">
              நேரலை டிவி பார்க்க
            </Link>
            <Link to="/about" className="px-10 py-4 bg-white/10 border border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all">
              மேலும் அறிய
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
