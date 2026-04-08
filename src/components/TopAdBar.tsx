import React, { useEffect, useRef } from 'react';

export default function TopAdBar() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const update = () => {
      const height = barRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty('--topbar-height', `${height}px`);
    };

    update();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    if (ro && barRef.current) ro.observe(barRef.current);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
      ro?.disconnect();
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 inset-x-0 z-[55] bg-white border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">விளம்பரம்</div>
            <div className="text-sm font-black text-slate-900 truncate">
              உங்கள் வியாபாரத்தை வண்ணதமிழ் நியூஸில் விளம்பரப்படுத்துங்கள்
            </div>
          </div>
          <a
            className="shrink-0 px-4 py-2 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-colors"
            href="mailto:sheikhameda44@gmail.com?subject=Advertising%20Inquiry%20-%20Vannatamil%20News"
          >
            தொடர்பு கொள்ள
          </a>
        </div>
      </div>
    </div>
  );
}
