import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Barcode, Database, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const appHighlights = [
  'Turn a supplement label into a clearer product view.',
  'Check quality signals before you buy or take something.',
  'Use scan or search, depending on what you have in front of you.',
];

const scanOutputs = [
  {
    title: 'NuTri Score',
    body: 'A product quality snapshot that summarizes signals like ingredient safety, label clarity, transparency, manufacturing standards, testing, and product quality.',
  },
  {
    title: 'Personalized Insights',
    body: 'Context-aware notes that help users understand how a product may relate to their goals, allergies, daily use, or medication caution areas.',
  },
  {
    title: 'Deep Dive',
    body: 'A more detailed section for people who want to look past the summary and understand why NuTri is flagging strengths, gaps, or caution points.',
  },
];

const qualitySignals = [
  ['Ingredient Safety', 'High'],
  ['Formula Transparency', 'High'],
  ['Label Clarity', 'High'],
  ['Testing & Verification', 'Limited'],
];

export default function LearnMore() {
  const pageRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const q = gsap.utils.selector(pageRef);
    const mm = gsap.matchMedia();
    const revealTargets = q('.gsap-copy-item, .gsap-mobile-shot, .gsap-caption, .gsap-scroll-reveal, .gsap-panel, .gsap-panel-item');

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(revealTargets, { autoAlpha: 1, clearProps: 'transform' });
      gsap.set(q('.gsap-glow'), { autoAlpha: 1, clearProps: 'transform' });
    });

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const heroItems = q('.gsap-copy-item');
      const shots = q('.gsap-mobile-shot');
      const shotFloaters = q('.gsap-shot-float');
      const panel = q('.gsap-panel');
      const panelItems = q('.gsap-panel-item');
      const scrollItems = q('.gsap-scroll-reveal');

      gsap.set(heroItems, { autoAlpha: 0, y: 28 });
      gsap.set(shots, { autoAlpha: 0, y: 44, scale: 0.94, rotation: -2 });
      gsap.set(panel, { autoAlpha: 0, y: 38, scale: 0.96 });
      gsap.set(panelItems, { autoAlpha: 0, y: 18 });
      gsap.set(q('.gsap-caption'), { autoAlpha: 0, y: 12 });
      gsap.set(q('.gsap-glow'), { autoAlpha: 0, scale: 0.82 });
      gsap.set(scrollItems, { autoAlpha: 0, y: 34, scale: 0.985 });

      const intro = gsap.timeline({
        defaults: { duration: 0.72, ease: 'power3.out' },
      });

      intro
        .to(heroItems, { autoAlpha: 1, y: 0, stagger: 0.075 })
        .to(q('.gsap-glow'), { autoAlpha: 1, scale: 1, duration: 1.05, ease: 'power2.out' }, '<0.08')
        .to(panel, { autoAlpha: 1, y: 0, scale: 1, duration: 0.88 }, '<0.02')
        .to(panelItems, { autoAlpha: 1, y: 0, duration: 0.52, stagger: 0.055 }, '<0.2')
        .to(shots, { autoAlpha: 1, y: 0, scale: 1, rotation: 0, stagger: 0.12 }, '<0.06')
        .to(q('.gsap-caption'), { autoAlpha: 1, y: 0, duration: 0.45 }, '<0.32');

      gsap.to(shotFloaters, {
        y: (index) => (index === 0 ? -8 : 8),
        duration: 4.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.35,
        delay: 1.15,
      });

      ScrollTrigger.batch(scrollItems, {
        start: 'top 82%',
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.72,
            ease: 'power3.out',
            stagger: 0.08,
            overwrite: true,
          });
        },
      });

      ScrollTrigger.refresh();
    });

    return () => mm.revert();
  }, { scope: pageRef });

  return (
    <main id="app-overview" ref={pageRef} className="relative z-20 flex-1 scroll-mt-28 pt-10 pb-24 md:pt-12 md:pb-28 lg:pt-14">
      <section className="mx-auto grid w-full max-w-[1360px] items-center gap-10 lg:min-h-[660px] lg:grid-cols-[0.78fr_1.22fr] lg:gap-14 xl:gap-20">
        <div className="max-w-2xl lg:pt-4">
          <p className="gsap-copy-item mb-4 font-inter text-xs font-bold uppercase tracking-[0.22em] text-slate-900/45">
            NuTri app overview
          </p>
          <h1 className="gsap-copy-item font-['DM_Serif_Display'] text-[clamp(48px,12vw,88px)] leading-[0.98] tracking-[-0.02em] text-slate-900 lg:text-[92px] xl:text-[104px]">
            Scan or search supplements before you take them.
          </h1>
          <p className="gsap-copy-item mt-7 max-w-xl font-inter text-[17px] font-medium leading-[1.7] text-slate-900/68 md:text-[20px]">
            NuTri is being built to make supplement decisions easier to understand. Open the app, scan a barcode or search the database, then review the product signals that matter before adding something to your routine.
          </p>
          <div className="gsap-copy-item mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/#waitlist"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-slate-950 px-7 font-inter text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_16px_34px_rgba(15,23,42,0.18)] transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Join the waitlist
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/"
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/70 bg-[rgba(248,253,255,0.66)] px-7 font-inter text-sm font-bold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_30px_rgba(15,54,86,0.1)] backdrop-blur-[32px] transition-colors duration-300 hover:bg-white/85"
            >
              Back to home
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[620px] lg:hidden">
          <div className="gsap-glow absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#31a9ff]/35 blur-[90px]" aria-hidden="true" />
          <div className="relative grid grid-cols-[0.9fr_0.82fr] items-center gap-4 sm:gap-6">
            <div className="gsap-mobile-shot">
              <div className="gsap-shot-float rounded-[34px] border border-white/65 bg-[rgba(255,255,255,0.36)] p-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_24px_70px_rgba(15,54,86,0.14)] backdrop-blur-[34px]">
                <ImageWithFallback
                  src="/email/nutri-score.png"
                  alt="NuTri Score product quality screen"
                  className="h-auto w-full rounded-[24px]"
                />
              </div>
            </div>
            <div className="gsap-mobile-shot mt-12 sm:mt-20">
              <div className="gsap-shot-float rounded-[32px] border border-white/65 bg-[rgba(255,255,255,0.32)] p-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_20px_60px_rgba(15,54,86,0.12)] backdrop-blur-[34px]">
                <ImageWithFallback
                  src="/email/personalized-insights.png"
                  alt="NuTri Personalized Insights screen"
                  className="h-auto w-full rounded-[22px]"
                />
              </div>
            </div>
          </div>
          <p className="gsap-caption mt-4 text-center font-inter text-xs font-semibold text-slate-900/45">
            Early product screens. Final app details may evolve as NuTri develops.
          </p>
        </div>

        <div className="gsap-panel relative hidden min-w-0 lg:block">
          <div className="gsap-glow absolute left-1/2 top-1/2 h-[72%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#31a9ff]/35 blur-[110px]" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[38px] border border-white/70 bg-[rgba(245,252,255,0.34)] p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-24px_60px_rgba(255,255,255,0.22),0_28px_90px_rgba(15,54,86,0.16)] backdrop-blur-[42px] xl:p-6">
            <div className="absolute right-[-12%] top-[-18%] h-[320px] w-[320px] rounded-full bg-[#32c6ff]/35 blur-[70px]" aria-hidden="true" />
            <div className="absolute bottom-[-22%] left-[12%] h-[280px] w-[280px] rounded-full bg-white/45 blur-[80px]" aria-hidden="true" />

            <div className="gsap-panel-item relative mb-5 flex items-center justify-between rounded-[24px] border border-white/65 bg-white/38 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.88)] backdrop-blur-[26px]">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-[#ff6d6d]" />
                <span className="h-3 w-3 rounded-full bg-[#ffd166]" />
                <span className="h-3 w-3 rounded-full bg-[#4ade80]" />
              </div>
              <p className="font-inter text-sm font-bold text-slate-900/62">NuTri product view</p>
              <span className="rounded-full bg-slate-950 px-3 py-1 font-inter text-xs font-bold text-white">Early access</span>
            </div>

            <div className="relative grid gap-5 xl:grid-cols-[0.88fr_1.12fr]">
              <div className="space-y-5">
                <div className="gsap-panel-item rounded-[28px] border border-white/65 bg-[rgba(255,255,255,0.4)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_16px_42px_rgba(15,54,86,0.08)] backdrop-blur-[28px]">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-slate-950 text-white">
                      <Barcode className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-inter text-lg font-bold text-slate-900">Scan barcode</h2>
                      <p className="font-inter text-sm font-semibold text-slate-900/52">Start from the bottle in hand.</p>
                    </div>
                  </div>
                  <div className="rounded-[22px] border border-white/70 bg-[rgba(255,255,255,0.54)] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-inter text-xs font-bold uppercase tracking-[0.18em] text-slate-900/42">Barcode read</span>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 font-inter text-xs font-bold text-emerald-700">Matched</span>
                    </div>
                    <div className="flex h-24 items-center justify-center rounded-[18px] bg-white/72">
                      <div className="flex h-14 items-end gap-1">
                        {[18, 34, 24, 44, 28, 52, 20, 38, 46, 26, 54, 30].map((height, index) => (
                          <span key={index} className="w-2 rounded-full bg-slate-950" style={{ height }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="gsap-panel-item rounded-[28px] border border-white/65 bg-[rgba(255,255,255,0.34)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.88)] backdrop-blur-[28px]">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-white/70 text-slate-900">
                      <Search className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-inter text-lg font-bold text-slate-900">Database search</h2>
                      <p className="font-inter text-sm font-semibold text-slate-900/52">Look up before you buy.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-full border border-white/70 bg-white/64 px-4 py-3">
                    <Search className="h-4 w-4 text-slate-900/48" />
                    <span className="font-inter text-sm font-bold text-slate-900/72">Search product or brand</span>
                  </div>
                </div>
              </div>

              <div className="gsap-panel-item rounded-[30px] border border-white/65 bg-[rgba(255,255,255,0.44)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_18px_50px_rgba(15,54,86,0.1)] backdrop-blur-[30px] xl:p-6">
                <div className="mb-6 flex items-start justify-between gap-6">
                  <div>
                    <p className="font-inter text-xs font-bold uppercase tracking-[0.2em] text-slate-900/42">Product quality</p>
                    <h2 className="mt-2 font-['DM_Serif_Display'] text-5xl leading-none tracking-[-0.02em] text-slate-900">85<span className="font-inter text-2xl font-bold text-slate-900/42">/100</span></h2>
                    <p className="mt-2 font-inter text-sm font-bold text-emerald-600">Strong signal profile</p>
                  </div>
                  <div className="rounded-[22px] border border-white/70 bg-white/58 px-4 py-3 text-right">
                    <p className="font-inter text-xs font-bold uppercase tracking-[0.14em] text-slate-900/38">Deep Dive</p>
                    <p className="mt-1 font-inter text-sm font-bold text-slate-900">Reasons ready</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {qualitySignals.map(([label, status], index) => (
                    <div key={label} className="rounded-[20px] border border-white/65 bg-white/52 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="font-inter text-sm font-bold text-slate-900">{label}</span>
                        <span className={`font-inter text-xs font-bold ${status === 'High' ? 'text-emerald-600' : 'text-amber-700'}`}>{status}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-900/8">
                        <div
                          className={`h-full rounded-full ${status === 'High' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          style={{ width: status === 'High' ? `${90 - index * 6}%` : '58%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-[20px] border border-white/65 bg-white/44 p-4">
                    <p className="font-inter text-xs font-bold uppercase tracking-[0.16em] text-slate-900/38">Personalized</p>
                    <p className="mt-2 font-inter text-sm font-bold leading-[1.4] text-slate-900">Goal and caution context</p>
                  </div>
                  <div className="rounded-[20px] border border-white/65 bg-white/44 p-4">
                    <p className="font-inter text-xs font-bold uppercase tracking-[0.16em] text-slate-900/38">Database</p>
                    <p className="mt-2 font-inter text-sm font-bold leading-[1.4] text-slate-900">Product lookup path</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="gsap-caption mt-4 text-center font-inter text-xs font-semibold text-slate-900/45">
            Desktop concept view built from the same product surfaces shown in the mobile app.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-20 grid w-full max-w-6xl gap-6 lg:grid-cols-2">
        <article className="gsap-scroll-reveal rounded-[30px] border border-white/65 bg-[rgba(255,255,255,0.22)] p-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.78),0_18px_52px_rgba(15,54,86,0.08)] backdrop-blur-[34px] md:p-9">
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-[18px] border border-white/70 bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_26px_rgba(15,54,86,0.1)]">
            <Barcode className="h-7 w-7 text-slate-900" />
          </div>
          <p className="mb-3 font-inter text-xs font-bold uppercase tracking-[0.2em] text-slate-900/45">
            Main function 01
          </p>
          <h2 className="font-['DM_Serif_Display'] text-4xl leading-[1.05] tracking-[-0.02em] text-slate-900 md:text-5xl">
            Scan a barcode
          </h2>
          <p className="mt-5 font-inter text-[16px] font-medium leading-[1.7] text-slate-900/68 md:text-[18px]">
            Scan the barcode on a supplement package and NuTri starts from the product in front of you. The goal is to move users from a confusing label to a clearer view of what the product is, what signals look strong, and what deserves a closer read.
          </p>
          <div className="mt-8 grid gap-3">
            {scanOutputs.map((item) => (
              <div
                key={item.title}
                className="rounded-[22px] border border-white/60 bg-[rgba(255,255,255,0.38)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-[24px]"
              >
                <h3 className="font-inter text-base font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 font-inter text-sm font-medium leading-[1.6] text-slate-900/62">{item.body}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="gsap-scroll-reveal rounded-[30px] border border-white/65 bg-[rgba(255,255,255,0.22)] p-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.78),0_18px_52px_rgba(15,54,86,0.08)] backdrop-blur-[34px] md:p-9">
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-[18px] border border-white/70 bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_26px_rgba(15,54,86,0.1)]">
            <Search className="h-7 w-7 text-slate-900" />
          </div>
          <p className="mb-3 font-inter text-xs font-bold uppercase tracking-[0.2em] text-slate-900/45">
            Main function 02
          </p>
          <h2 className="font-['DM_Serif_Display'] text-4xl leading-[1.05] tracking-[-0.02em] text-slate-900 md:text-5xl">
            Search the database
          </h2>
          <p className="mt-5 font-inter text-[16px] font-medium leading-[1.7] text-slate-900/68 md:text-[18px]">
            When you do not have the bottle in hand, search by product or brand instead. Database search is designed for comparison moments, online shopping, and checking a supplement before you decide whether it belongs in your routine.
          </p>
          <div className="mt-8 space-y-4">
            {appHighlights.map((highlight, index) => (
              <div key={highlight} className="flex gap-4 rounded-[22px] border border-white/60 bg-[rgba(255,255,255,0.34)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-[24px]">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 font-inter text-xs font-bold text-white">
                  {index + 1}
                </span>
                <p className="font-inter text-base font-semibold leading-[1.5] text-slate-900/74">{highlight}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-3 rounded-[24px] border border-white/60 bg-[rgba(255,255,255,0.3)] p-5 backdrop-blur-[24px] sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-slate-900/72" />
              <span className="font-inter text-sm font-bold text-slate-900/72">Product lookup</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-slate-900/72" />
              <span className="font-inter text-sm font-bold text-slate-900/72">Safety context</span>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-slate-900/72" />
              <span className="font-inter text-sm font-bold text-slate-900/72">Clear summary</span>
            </div>
          </div>
        </article>
      </section>

      <section className="gsap-scroll-reveal mx-auto mt-16 w-full max-w-4xl rounded-[30px] border border-white/65 bg-[rgba(255,255,255,0.24)] p-8 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.78),0_20px_60px_rgba(15,54,86,0.08)] backdrop-blur-[34px] md:p-10">
        <h2 className="font-['DM_Serif_Display'] text-4xl leading-[1.05] tracking-[-0.02em] text-slate-900 md:text-5xl">
          Built for clearer supplement decisions.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl font-inter text-[16px] font-medium leading-[1.7] text-slate-900/65 md:text-[18px]">
          NuTri is not a replacement for a clinician or pharmacist. It is a practical decision-support layer for people who want clearer product information before they buy, scan, or take a supplement.
        </p>
        <Link
          to="/#waitlist"
          className="mt-8 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-slate-950 px-7 font-inter text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_16px_34px_rgba(15,23,42,0.18)] transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          Reserve your spot
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}
