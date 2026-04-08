import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import RightSidebarBlocks from './RightSidebarBlocks';

export default function GlobalRightSidebar() {
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
          aria-label="Close right sidebar overlay"
          className="fixed inset-0 z-[55] bg-slate-950/30 backdrop-blur-[2px] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="global-right-sidebar"
        className="fixed right-0 top-1/2 z-[61] -translate-y-1/2 rounded-l-2xl border border-r-0 border-slate-200 bg-white px-3 py-4 shadow-xl transition-colors hover:bg-slate-50"
      >
        <span className="flex items-center gap-2 [writing-mode:vertical-rl] rotate-180 text-[11px] font-black uppercase tracking-[0.35em] text-slate-700">
          Quick Updates
          {isOpen ? <ChevronRight className="h-4 w-4 rotate-90" /> : <ChevronLeft className="h-4 w-4 -rotate-90" />}
        </span>
      </button>

      <aside
        id="global-right-sidebar"
        className={`fixed right-0 z-[60] w-[min(24rem,calc(100vw-1rem))] overflow-y-auto border-l border-slate-200 bg-slate-50 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          top: 'calc(var(--navbar-height) + 1rem)',
          height: 'calc(100vh - var(--navbar-height) - 2rem)',
        }}
      >
          <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
            <div className="text-[11px] font-black uppercase tracking-[0.35em] text-primary">Right Sidebar</div>
            <h2 className="mt-2 text-lg font-black text-slate-900">Latest videos and posts</h2>
            <p className="mt-1 text-sm text-slate-500">This panel is available on every page.</p>
          </div>
          <div className="p-4">
            <RightSidebarBlocks />
          </div>
      </aside>
    </>
  );
}
