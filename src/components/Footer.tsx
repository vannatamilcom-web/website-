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
              தமிழகமும் உலகமும் முழுவதும் நடைபெறும் சமீபத்திய செய்திகளுக்கான உங்கள் நம்பகமான தளம். தரமான மற்றும் சார்பற்ற செய்திகளை வழங்குகிறோம்.
            </p>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-8">பிரிவுகள்</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  தமிழ்நாடு
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  அரசியல்
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  வணிகம்
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  தொழில்நுட்பம்
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  விளையாட்டு
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-8">நிறுவனம்</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  எங்களை பற்றி
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  தொடர்பு கொள்ள
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  வேலை வாய்ப்புகள்
                </a>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  தனியுரிமைக் கொள்கை
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-white transition-colors">
                  சேவை விதிமுறைகள்
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-8">தொடர்பு</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-medium">
              <li>
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">மின்னஞ்சல்</span>
                <a href="mailto:sheikhameda44@gmail.com" className="hover:text-white transition-colors break-all">
                  sheikhameda44@gmail.com
                </a>
              </li>
              <li>
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">தொலைபேசி</span>
                <a href="tel:+918015007158" className="hover:text-white transition-colors">
                  +91 8015007158
                </a>
              </li>
              <li>
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">முகவரி</span>
                <div className="leading-relaxed">
                  மங்களம்பேட்டை, விருத்தாசலம்,
                  <br />
                  கடலூர், தமிழ்நாடு
                </div>
              </li>
              <li>
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">விளம்பரம்</span>
                <a
                  href="mailto:sheikhameda44@gmail.com?subject=Advertising%20Inquiry%20-%20Vannatamil%20News"
                  className="hover:text-white transition-colors"
                >
                  விளம்பரத்திற்கு தொடர்பு கொள்ள
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-xs font-bold uppercase tracking-widest">
          <p>© 2026. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <Link to="/about" className="hover:text-white transition-colors">
              பற்றி
            </Link>
            <a href={facebookUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              பேஸ்புக்
            </a>
            <a href="#" className="hover:text-white transition-colors">
              ட்விட்டர்
            </a>
            <a href="#" className="hover:text-white transition-colors">
              இன்ஸ்டாகிராம்
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
