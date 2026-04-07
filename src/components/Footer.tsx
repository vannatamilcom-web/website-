import React from 'react';
import { Link } from 'react-router-dom';
import { FACEBOOK_URL, FACEBOOK_PAGE_URL } from '../lib/socialLinks';

export default function Footer() {
  const facebookUrl = FACEBOOK_URL || FACEBOOK_PAGE_URL || '#';

  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="p-1">
              <img src="/footer-logo.jpg" alt="Logo" className="h-28 w-55" loading="lazy" decoding="async" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              தமிழகமும் உலகம் முழுவதும் நடைபெறும் சமீபத்திய செய்திகளுக்கான உங்கள் முதன்மையான ஆதாரம். தரமான, பக்கபாதமற்ற பத்திரிகையியலை வழங்குகிறோம்.
            </p>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-8">Categories</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Tamil Nadu
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Politics
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Business
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Technology
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Sports
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-8">Company</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-8">Contact</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              <li>
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Email</span>
                <a href="mailto:sheikhameda44@gmail.com" className="hover:text-white transition-colors break-all">
                  sheikhameda44@gmail.com
                </a>
              </li>
              <li>
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Phone</span>
                <a href="tel:+918015007158" className="hover:text-white transition-colors">
                  +91 8015007158
                </a>
              </li>
              <li>
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Address</span>
                <div className="leading-relaxed">
                  Mangalampettai, Vriddhachalam,
                  <br />
                  Cuddalore, Tamil Nadu
                </div>
              </li>
              <li>
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Advertising</span>
                <a
                  href="mailto:sheikhameda44@gmail.com?subject=Advertising%20Inquiry%20-%20Vannatamil%20News"
                  className="hover:text-white transition-colors"
                >
                  Contact for Ads
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-xs font-bold uppercase tracking-widest">
          <p>© 2026. ALL RIGHTS RESERVED.</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <Link to="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <a href={facebookUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              Facebook
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

