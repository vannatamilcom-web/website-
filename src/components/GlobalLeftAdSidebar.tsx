import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Megaphone } from 'lucide-react';

export default function GlobalLeftAdSidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="Close advertising sidebar overlay"
          className="fixed inset-0 z-[55] bg-slate-950/25 backdrop-blur-[2px] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="global-left-ad-sidebar"
        className="fixed left-0 top-1/2 z-[61] -translate-y-1/2 rounded-r-2xl border border-l-0 border-slate-200 bg-white px-3 py-4 shadow-xl transition-colors hover:bg-slate-50"
      >
        <span className="flex items-center gap-2 [writing-mode:vertical-rl] text-[11px] font-black uppercase tracking-[0.35em] text-slate-700">
          Promote Here
          {isOpen ? <ChevronLeft className="h-4 w-4 rotate-90" /> : <ChevronRight className="h-4 w-4 -rotate-90" />}
        </span>
      </button>

      <aside
        id="global-left-ad-sidebar"
        className={`fixed left-0 z-[60] w-[min(26rem,calc(100vw-1rem))] overflow-y-auto border-r border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          top: 'calc(var(--navbar-height) + 1rem)',
          height: 'calc(100vh - var(--navbar-height) - 2rem)',
        }}
      >
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
          <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.35em] text-primary">
            <Megaphone className="h-4 w-4" />
            Advertising
          </div>
          <h2 className="mt-3 text-xl font-black text-slate-900">Promote your product on every page</h2>
          <p className="mt-2 text-sm text-slate-500">
            A left-side sliding ad block for sponsors, local businesses, and featured product promotions.
          </p>
        </div>

        <div className="space-y-6 p-4">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-xs font-black uppercase tracking-widest text-slate-500">Ad Slot</div>
            <div className="mt-3 text-2xl font-black text-slate-900">Leaderboard Banner</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Suggested size: 728x90 or 970x250. Perfect for product launches, brand promotions, and seasonal campaigns.
            </p>
            <div className="mt-6 flex h-36 items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 text-center text-slate-500 font-black">
              YOUR BRAND HERE
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-xs font-black uppercase tracking-widest text-slate-500">Ad Slot</div>
            <div className="mt-3 text-2xl font-black text-slate-900">Sidebar / Card</div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Suggested size: 300x250. Great for service ads, shop promotions, offers, and local business visibility.
            </p>
            <div className="mt-6 flex h-36 items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 text-center text-slate-500 font-black">
              SPONSOR THIS SECTION
            </div>
            <a
              href="https://wa.me/919791067553?text=Hello%20Vannatamil%20News%2C%20I%20would%20like%20to%20advertise%20on%20your%20website."
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-black text-white transition-colors hover:bg-primary/90"
            >
              Contact for Ads
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
