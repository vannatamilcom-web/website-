import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Search, Globe, Moon, Sun, X } from 'lucide-react';
import { CATEGORIES } from '../lib/api';
import { FACEBOOK_URL, FACEBOOK_PAGE_URL } from '../lib/socialLinks';
import { getCategoryLabel } from '../lib/categoryDisplay';

export default function Navbar() {
  const navRef = useRef<HTMLElement | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'ta' | 'en'>('ta');
  const [isDark, setIsDark] = useState(false);
  const facebookUrl = FACEBOOK_URL || FACEBOOK_PAGE_URL || '#';

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
    <nav
      ref={navRef}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-md py-4'}`}
      style={{ top: 'var(--topbar-height, 0px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <button onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(true); }} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
              <Menu className="w-6 h-6 text-primary" />
            </button>
            <div className="p-1">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-44 sm:w-56 md:w-64 h-auto"
                loading="eager"
                decoding="async"
              />
            </div>
          </Link>

          {/* Desktop Categories */}
          <div className="hidden lg:flex items-center gap-8">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="text-sm font-bold text-slate-700 hover:text-primary transition-colors uppercase tracking-wide"
              >
                {getCategoryLabel(cat, lang)}
              </Link>
            ))}
            <Link
              to="/youtube"
              className="text-sm font-bold text-slate-700 hover:text-primary transition-colors uppercase tracking-wide"
            >
              YouTube
            </Link>
            <Link
              to="/facebook"
              className="text-sm font-bold text-slate-700 hover:text-primary transition-colors uppercase tracking-wide"
            >
              Facebook
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Search className="w-5 h-5 text-slate-600" />
            </button>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-[#1877F2] font-black text-xs"
              aria-label="Facebook"
              title="Facebook"
            >
              f
            </a>
            <button 
              onClick={() => setLang(lang === 'ta' ? 'en' : 'ta')}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-xs font-bold transition-colors"
            >
              <Globe className="w-4 h-4" />
              {lang === 'ta' ? 'ENGLISH' : 'தமிழ்'}
            </button>
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors hidden sm:block"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
            <Link to="/live-tv" className="hidden md:block px-6 py-2 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              LIVE TV
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden">
          <div className="w-4/5 h-full bg-white p-6 shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center mb-8">
              <div className="p-1">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-44 h-auto"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2"
                >
                  {getCategoryLabel(cat, lang)}
                </Link>
              ))}
              <Link
                to="/youtube"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2"
              >
                YouTube
              </Link>
              <Link
                to="/facebook"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2"
              >
                Facebook
              </Link>
              <button className="mt-4 w-full py-3 bg-primary text-white font-bold rounded-xl">
                WATCH LIVE TV
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
