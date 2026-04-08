import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Search, Globe, Moon, Sun, X } from 'lucide-react';
import { CATEGORIES } from '../lib/api';
import { FACEBOOK_URL, FACEBOOK_PAGE_URL } from '../lib/socialLinks';
import { getCategoryLabel } from '../lib/categoryDisplay';
import { useAppLanguage } from '../lib/language';

function DesktopNavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-full px-3 py-2 text-sm font-bold uppercase tracking-wide text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:text-primary"
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 rounded-full bg-primary/8 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="absolute bottom-1.5 left-3 h-0.5 w-0 rounded-full bg-primary transition-all duration-300 group-hover:w-[calc(100%-1.5rem)]" />
    </Link>
  );
}

export default function Navbar() {
  const navRef = useRef<HTMLElement | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { lang, toggleLang } = useAppLanguage();
  const facebookUrl = FACEBOOK_URL || FACEBOOK_PAGE_URL || '#';
  const text = lang === 'ta'
    ? {
        youtube: 'யூடியூப்',
        social: 'சமூக ஊடகம்',
        liveTv: 'நேரலை',
        watchLiveTv: 'நேரலை பார்க்க',
      }
    : {
        youtube: 'YouTube',
        social: 'Social Media',
        liveTv: 'LIVE TV',
        watchLiveTv: 'WATCH LIVE TV',
      };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateNavbarHeight = () => {
      if (!navRef.current) return;
      const rootStyles = getComputedStyle(document.documentElement);
      const topbarHeight = parseFloat(rootStyles.getPropertyValue('--topbar-height')) || 0;
      const navbarHeight = navRef.current.offsetHeight;
      document.documentElement.style.setProperty('--navbar-height', `${topbarHeight + navbarHeight}px`);
    };

    updateNavbarHeight();

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateNavbarHeight) : null;
    if (ro && navRef.current) ro.observe(navRef.current);

    window.addEventListener('resize', updateNavbarHeight);
    return () => {
      window.removeEventListener('resize', updateNavbarHeight);
      ro?.disconnect();
    };
  }, []);

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-1.5' : 'bg-white/95 backdrop-blur-md py-2'}`}
      style={{ top: 'var(--topbar-height, 0px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-6">
        <div className="flex justify-between items-center gap-3">
          <Link to="/" className="group flex items-center gap-1 shrink-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(true);
              }}
              className="lg:hidden rounded-lg p-2 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100"
            >
              <Menu className="w-6 h-6 text-primary transition-transform duration-300 group-hover:scale-105" />
            </button>
            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden py-0.5 pr-1 w-[92px] sm:w-[118px] md:w-[132px] lg:w-[148px] xl:w-[160px]"
            >
              <img
                src="/logo.png"
                alt="Logo"
                className="block h-12 sm:h-[58px] md:h-[62px] lg:h-[68px] xl:h-[72px] w-auto max-w-none object-contain object-left transition-transform duration-500 group-hover:scale-[1.03]"
                loading="eager"
                decoding="async"
              />
            </motion.div>
          </Link>

          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {CATEGORIES.map((cat) => (
              <DesktopNavLink key={cat.slug} to={`/category/${cat.slug}`}>
                {getCategoryLabel(cat, lang)}
              </DesktopNavLink>
            ))}
            <DesktopNavLink to="/youtube">{text.youtube}</DesktopNavLink>
            <DesktopNavLink to="/facebook">{text.social}</DesktopNavLink>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button className="rounded-full p-2 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100">
              <Search className="w-5 h-5 text-slate-600" />
            </button>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full p-2 text-xs font-black text-[#1877F2] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-sm"
              aria-label="Facebook"
              title="Facebook"
            >
              f
            </a>
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-200"
            >
              <Globe className="w-4 h-4" />
              {lang === 'ta' ? 'ENGLISH' : 'தமிழ்'}
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className="hidden sm:block rounded-full p-2 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
            <motion.div
              animate={{
                boxShadow: [
                  '0 8px 20px rgba(233, 30, 99, 0.18)',
                  '0 12px 28px rgba(233, 30, 99, 0.3)',
                  '0 8px 20px rgba(233, 30, 99, 0.18)',
                ],
              }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              className="hidden md:block rounded-full"
            >
              <Link
                to="/live-tv"
                className="group relative block overflow-hidden rounded-full bg-primary px-6 py-2 text-xs font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
              >
                <span className="absolute inset-y-0 -left-10 w-8 rotate-12 bg-white/25 blur-sm transition-transform duration-700 group-hover:translate-x-[180px]" />
                <span className="relative z-10">{text.liveTv}</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-full w-4/5 bg-white p-6 shadow-2xl"
          >
            <div className="mb-8 flex items-center justify-between">
              <div className="p-1">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-44 h-auto"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg p-2 transition-colors hover:bg-slate-100"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="border-b border-slate-100 pb-2 text-lg font-bold text-slate-800 transition-colors hover:text-primary"
                >
                  {getCategoryLabel(cat, lang)}
                </Link>
              ))}
              <Link
                to="/youtube"
                onClick={() => setIsMobileMenuOpen(false)}
                className="border-b border-slate-100 pb-2 text-lg font-bold text-slate-800 transition-colors hover:text-primary"
              >
                {text.youtube}
              </Link>
              <Link
                to="/facebook"
                onClick={() => setIsMobileMenuOpen(false)}
                className="border-b border-slate-100 pb-2 text-lg font-bold text-slate-800 transition-colors hover:text-primary"
              >
                {text.social}
              </Link>
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="mt-4 w-full rounded-xl bg-primary py-3 font-bold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
              >
                {text.watchLiveTv}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.nav>
  );
}
