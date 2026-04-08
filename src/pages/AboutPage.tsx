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
            <ArrowLeft className="w-4 h-4" /> முகப்புக்கு திரும்ப
          </Link>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-white">
                <BadgeCheck className="w-4 h-4" /> வண்ணதமிழ் நியூஸ் பற்றி
              </div>
              <h1 className="mt-6 text-4xl sm:text-5xl font-black text-white leading-tight">
                தமிழ் மக்களுக்கு துல்லியமான, விரைவான, தாக்கம் கொண்ட செய்திகளை வழங்கும் டிஜிட்டல் தளம்.
              </h1>
              <p className="mt-5 text-white/70 text-base sm:text-lg max-w-2xl">
                <span className="font-bold text-white">AS Computer &amp; CCTV</span> நிறுவனம் வழிநடத்தும் இந்த ஊடக தளம், தொழில்நுட்பத்தையும்
                பத்திரிகையாளர்தன்மையையும் இணைத்து நம்பகமான தகவல்களை வெளிப்படைத்தன்மையுடன் வழங்குகிறது.
              </p>
            </div>
            <div className="lg:col-span-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="text-xs font-black uppercase tracking-widest text-white/60">தொடக்கம்</div>
                  <div className="mt-2 text-2xl font-black text-white">2021</div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="text-xs font-black uppercase tracking-widest text-white/60">இடம்</div>
                  <div className="mt-2 text-lg font-black text-white leading-snug">விருத்தாச்சலம்</div>
                  <div className="text-xs font-bold text-white/60">தமிழ்நாடு</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard title="நாங்கள் யார்?" icon={<Globe2 className="w-6 h-6" />}>
            <p className="text-slate-700">
              <span className="font-black text-slate-900">வண்ணதமிழ் நியூஸ்</span> என்பது தமிழ் மக்களுக்காக
              <span className="font-bold"> உள்ளூர், மாநில, தேசிய மற்றும் டிஜிட்டல் முன்னுரிமை செய்திகளை</span> வழங்கும் வேகமாக வளர்ந்து வரும்
              டிஜிட்டல் செய்தி மற்றும் ஊடக தளம்.
            </p>
            <p className="mt-4 text-slate-700">
              மக்களுக்கு எளிதாக புரியும், சமூகத்துடன் இணைந்த, பயன்படும் செய்திகளை வெளியிடுவதன் மூலம் அவர்கள் விழிப்புணர்வுடன் இருக்க உதவுகிறோம்.
            </p>
          </SectionCard>

          <SectionCard title="எங்கள் பணி" icon={<Target className="w-6 h-6" />}>
            <ul className="space-y-3 text-slate-800 font-bold">
              <li className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-primary mt-0.5" /> உண்மையான மற்றும் சார்பில்லாத செய்திகளை வழங்குதல்
              </li>
              <li className="flex gap-3">
                <Megaphone className="w-5 h-5 text-primary mt-0.5" /> உள்ளூர் குரல்கள் மற்றும் மக்கள் வாழ்வு கதைகளை முன்னிறுத்துதல்
              </li>
              <li className="flex gap-3">
                <Zap className="w-5 h-5 text-primary mt-0.5" /> டிஜிட்டல் தளங்களை பயன்படுத்தி செய்திகளை விரைவாக கொண்டு சேர்த்தல்
              </li>
              <li className="flex gap-3">
                <BadgeCheck className="w-5 h-5 text-primary mt-0.5" /> சமூகத்தில் தகவல் அடிப்படையிலான முடிவெடுப்பை ஊக்குவித்தல்
              </li>
            </ul>
          </SectionCard>

          <SectionCard title="நாங்கள் வழங்குவது" icon={<Megaphone className="w-6 h-6" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'அரசியல் மற்றும் நிர்வாகம்',
                'விளையாட்டு புதுப்பிப்புகள்',
                'வணிகம் மற்றும் தொழில்நுட்பம்',
                'மாவட்ட மற்றும் உள்ளூர் செய்திகள்',
                'வீடியோ செய்திகள் மற்றும் நேரலை ஒளிபரப்பு',
                'பிரேக்கிங் நியூஸ் மற்றும் டிரெண்டிங் அப்டேட்ஸ்',
              ].map((label) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800">
                  {label}
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="எங்கள் டிஜிட்டல் வலிமை" icon={<Zap className="w-6 h-6" />}>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['டிஜிட்டல் செய்தி வெளியீடு', 'யூடியூப் செய்தி ஒளிபரப்பு', 'சமூக ஊடக விநியோகம்', 'ஐ.டி ஆதரவு கொண்ட ஊடக சேவைகள்'].map(
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
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">நிறுவன விவரங்கள்</h2>
                  <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <dt className="text-[10px] font-black uppercase tracking-widest text-slate-500">நிறுவனத்தின் பெயர்</dt>
                      <dd className="mt-2 font-black text-slate-900">AS Computer &amp; CCTV</dd>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <dt className="text-[10px] font-black uppercase tracking-widest text-slate-500">பிராண்ட்</dt>
                      <dd className="mt-2 font-black text-slate-900">Vannatamil News</dd>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <dt className="text-[10px] font-black uppercase tracking-widest text-slate-500">வகை</dt>
                      <dd className="mt-2 font-black text-slate-900">Micro Enterprise (MSME)</dd>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <dt className="text-[10px] font-black uppercase tracking-widest text-slate-500">தொடங்கிய தேதி</dt>
                      <dd className="mt-2 font-black text-slate-900">April 1, 2022</dd>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 sm:col-span-2">
                      <dt className="text-[10px] font-black uppercase tracking-widest text-slate-500">முகவரி</dt>
                      <dd className="mt-2 font-black text-slate-900">Vriddhachalam, Cuddalore District, Tamil Nadu - 606104</dd>
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
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">எங்கள் நோக்கம்</h2>
                  <p className="mt-4 text-slate-700 leading-relaxed">
                    <span className="font-black text-slate-900">முன்னணி தமிழ் டிஜிட்டல் செய்தி தளங்களில் ஒன்றாக</span> வளர்ந்து, தகவலுக்கும் மக்களுக்கும்
                    இடையேயான தூரத்தை <span className="font-black text-slate-900">புதுமை, நம்பிக்கை, நேர்மை</span> ஆகியவற்றின் மூலம் இணைப்பதே எங்கள் நோக்கம்.
                  </p>
                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">தொடர்பு</div>
                    <div className="mt-3 space-y-2 text-sm font-bold text-slate-800">
                      <div>
                        மின்னஞ்சல்:{' '}
                        <a className="text-primary hover:underline" href="mailto:info@vannatamil.news">
                          info@vannatamil.news
                        </a>
                      </div>
                      <div>
                        தொலைபேசி:{' '}
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
