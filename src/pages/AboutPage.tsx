import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, Building2, Globe2, Megaphone, Rocket, ShieldCheck, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

function SectionCard(props: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            {props.icon}
          </div>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">{props.title}</h2>
            <div className="mt-4 text-slate-700 leading-relaxed">{props.children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-[var(--navbar-height)] min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute -top-24 -left-24 w-[520px] h-[520px] bg-primary/60 blur-3xl rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-[520px] h-[520px] bg-white/20 blur-3xl rounded-full" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-white">
                <BadgeCheck className="w-4 h-4" /> About Vannatamil News
              </div>
              <h1 className="mt-6 text-4xl sm:text-5xl font-black text-white leading-tight">
                Accurate, timely, and impactful news for Tamil audiences.
              </h1>
              <p className="mt-5 text-white/70 text-base sm:text-lg max-w-2xl">
                Operated under <span className="font-bold text-white">AS Computer &amp; CCTV</span>, we combine technology and journalism to
                deliver reliable information with transparency and speed.
              </p>
            </div>
            <div className="lg:col-span-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="text-xs font-black uppercase tracking-widest text-white/60">Established</div>
                  <div className="mt-2 text-2xl font-black text-white">2021</div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="text-xs font-black uppercase tracking-widest text-white/60">Location</div>
                  <div className="mt-2 text-lg font-black text-white leading-snug">Vriddhachalam</div>
                  <div className="text-xs font-bold text-white/60">Tamil Nadu</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard title="Who We Are" icon={<Globe2 className="w-6 h-6" />}>
            <p className="text-slate-700">
              <span className="font-black text-slate-900">Vannatamil News</span> is a fast-growing digital news and media platform focused on
              <span className="font-bold"> regional, national, and digital-first reporting</span> for Tamil audiences across India and beyond.
            </p>
            <p className="mt-4 text-slate-700">
              We publish stories that are accessible, relevant, and community-driven—so readers can stay informed and make better decisions.
            </p>
          </SectionCard>

          <SectionCard title="Our Mission" icon={<Target className="w-6 h-6" />}>
            <ul className="space-y-3 text-slate-800 font-bold">
              <li className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-primary mt-0.5" /> Deliver truthful and unbiased news
              </li>
              <li className="flex gap-3">
                <Megaphone className="w-5 h-5 text-primary mt-0.5" /> Promote local voices and grassroots stories
              </li>
              <li className="flex gap-3">
                <Zap className="w-5 h-5 text-primary mt-0.5" /> Leverage digital platforms for faster reach
              </li>
              <li className="flex gap-3">
                <BadgeCheck className="w-5 h-5 text-primary mt-0.5" /> Support informed decision-making in society
              </li>
            </ul>
          </SectionCard>

          <SectionCard title="What We Cover" icon={<Megaphone className="w-6 h-6" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Politics & Governance',
                'Sports Updates',
                'Business & Technology',
                'Regional & Local News (Tamil Nadu)',
                'Video News & Live Coverage',
                'Breaking News & Trending',
              ].map((label) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800">
                  {label}
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Our Digital Strength" icon={<Zap className="w-6 h-6" />}>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Digital News Publishing', 'YouTube News Broadcasting', 'Social Media Distribution', 'IT-enabled Media Services'].map(
                (item) => (
                  <li key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800">
                    {item}
                  </li>
                ),
              )}
            </ul>
          </SectionCard>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Organization Details</h2>
                  <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <dt className="text-[10px] font-black uppercase tracking-widest text-slate-500">Enterprise Name</dt>
                      <dd className="mt-2 font-black text-slate-900">AS Computer &amp; CCTV</dd>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <dt className="text-[10px] font-black uppercase tracking-widest text-slate-500">Brand</dt>
                      <dd className="mt-2 font-black text-slate-900">Vannatamil News</dd>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <dt className="text-[10px] font-black uppercase tracking-widest text-slate-500">Type</dt>
                      <dd className="mt-2 font-black text-slate-900">Micro Enterprise (MSME)</dd>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <dt className="text-[10px] font-black uppercase tracking-widest text-slate-500">Business Start Date</dt>
                      <dd className="mt-2 font-black text-slate-900">April 1, 2022</dd>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 sm:col-span-2">
                      <dt className="text-[10px] font-black uppercase tracking-widest text-slate-500">Location</dt>
                      <dd className="mt-2 font-black text-slate-900">Vriddhachalam, Cuddalore District, Tamil Nadu – 606104</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <Rocket className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">Our Vision</h2>
                  <p className="mt-4 text-slate-700 leading-relaxed">
                    To become one of the <span className="font-black text-slate-900">leading Tamil digital news platforms</span>, bridging the
                    gap between information and people through{' '}
                    <span className="font-black text-slate-900">innovation, trust, and integrity</span>.
                  </p>
                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Contact</div>
                    <div className="mt-3 space-y-2 text-sm font-bold text-slate-800">
                      <div>
                        Email:{' '}
                        <a className="text-primary hover:underline" href="mailto:sheikhameda44@gmail.com">
                          sheikhameda44@gmail.com
                        </a>
                      </div>
                      <div>
                        Phone:{' '}
                        <a className="text-primary hover:underline" href="tel:+918015007158">
                          +91 8015007158
                        </a>
                      </div>
                      <div className="text-slate-600">Mangalampettai, Vriddhachalam, Cuddalore, Tamil Nadu</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}

