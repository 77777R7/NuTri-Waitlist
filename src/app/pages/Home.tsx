import React, { useEffect, useRef } from 'react';
import '../../styles/logoloop.css';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import logo1 from '../../imports/image.png';
import logo2 from '../../imports/image-1.png';
import logo3 from '../../imports/image-2.png';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Force muted and play to ensure autoplay works across all browsers (like Safari/iOS)
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(e => console.log("Autoplay blocked:", e));
    }
  }, []);

  return (
    <>
      <main className="relative flex-1 overflow-hidden pt-8 pb-4 md:pt-20 md:pb-6 lg:pb-12">
        <section className="relative flex min-h-0 items-start pt-14 pb-5 sm:pt-16 sm:pb-7 md:pt-20 md:pb-8 lg:min-h-[720px] lg:items-center lg:pt-0 lg:pb-0">
          <div className="relative z-20 max-w-[680px]">
            <h1 className="animate-fade-up delay-100 font-['DM_Serif_Display'] leading-[1.02] tracking-[-0.02em] text-slate-900 mb-5 text-[clamp(50px,14vw,68px)] md:mb-6 md:text-[76px] lg:text-[85px]">Know what’s worth taking before you take it.</h1>
            <p className="animate-fade-up delay-200 font-inter text-[16px] sm:text-[18px] md:text-[20px] leading-[1.6] text-slate-900/65 max-w-[520px] mb-8 md:mb-10" style={{ fontWeight: 500 }}>
              NuTri is building a smarter supplement experience. Join the waitlist to get early access, launch updates, and priority entry when we open.
            </p>
            <div className="animate-fade-up delay-300 flex flex-col items-start gap-4">
            </div>
          </div>
          <div 
            className="animate-fade-up delay-400 pointer-events-none absolute right-[-7vw] top-1/2 z-10 hidden h-[720px] w-[720px] -translate-y-1/2 items-center justify-center lg:flex"
            style={{ mixBlendMode: 'screen' }}
          >
            <div className="relative w-full h-full flex items-center justify-center animate-float">
              <video 
                ref={videoRef}
                autoPlay 
                loop 
                muted 
                playsInline
                poster="/orb-poster.png"
                className="max-w-none h-[120%] w-[120%] object-contain"
                style={{ 
                  filter: 'hue-rotate(-55deg) saturate(250%) brightness(1.2) contrast(1.1)',
                  transform: 'scale(1.22) translateX(5%)'
                }}
              >
                <source src="/orb-purple.webm" type="video/webm" />
              </video>
            </div>
          </div>
        </section>
      </main>

      <section id="waitlist" className="animate-fade-up delay-500 w-full max-w-[760px] mx-auto z-20 relative mt-4 md:mt-8 lg:mt-24 mb-16 md:mb-24 scroll-mt-24 md:scroll-mt-28">
        <div className="relative isolate w-full flex flex-col items-center p-8 md:p-12 lg:p-14 rounded-[28px] backdrop-blur-[30px] backdrop-saturate-150 bg-[rgba(255,255,255,0.18)] border border-[rgba(255,255,255,0.5)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_4px_20px_rgba(255,255,255,0.2),0_20px_60px_rgba(0,0,0,0.05)] before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:-z-10 before:w-[260px] before:h-[260px] before:bg-[#319AFF]/50 before:blur-[70px] before:rounded-full before:animate-pulse before:pointer-events-none">
          <h2 className="font-['DM_Serif_Display'] font-bold text-3xl md:text-[42px] leading-[1.1] tracking-[-1px] text-slate-900 text-center mb-4 md:mb-5">
            Get early access to NuTri
          </h2>
          <p className="font-inter text-[15px] md:text-[17px] leading-[1.6] text-slate-900/65 text-center max-w-[500px] mb-8 md:mb-10">Be the first to know when we launch. Join the waitlist for beta access, launch updates, and <span className="font-bold">Founding Member Pricing.</span></p>
          <form className="w-full max-w-[500px] flex flex-col md:flex-row gap-3 md:gap-2 mb-4" onSubmit={(e) => e.preventDefault()}>
            <div className="relative flex-1 w-full">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required
                className="w-full h-[56px] md:h-[64px] px-6 rounded-full bg-white/60 border-2 border-black shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:bg-white/80 transition-all font-inter font-medium text-slate-900 placeholder:text-slate-900/35 placeholder:font-normal"
              />
            </div>
            <button 
              type="submit"
              className="h-[56px] md:h-[64px] px-8 rounded-full bg-black hover:bg-neutral-800 text-white font-semibold text-[15px] md:text-[16px] shadow-[inset_0_4px_4px_rgba(255,255,255,0.15),0_6px_16px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              Reserve My Spot
            </button>
          </form>
          <p className="text-xs text-slate-900/45 font-medium text-center">
            Free to join &middot; No spam &middot; Unsubscribe anytime
          </p>
        </div>
      </section>

      <footer className="animate-fade-up delay-500 w-full flex flex-col items-center mt-auto pb-8 md:pb-16 z-10 overflow-hidden">
        <p className="text-xs md:text-sm font-semibold tracking-wider uppercase text-slate-900/30 mb-8 md:mb-10 text-center">
          BUILT WITH TRUSTED HEALTH REFERENCES
        </p>
        <div className="logoloop logoloop--fade" style={{ '--logoloop-fadeColor': 'transparent', '--logoloop-gap': '80px', '--logoloop-logoHeight': '28px', '--logoloop-duration': '80s' } as React.CSSProperties}>
          <div className="logoloop__track opacity-40 grayscale mix-blend-multiply">
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="logoloop__list">
                {[...Array(6)].map((_, innerIdx) => (
                  <React.Fragment key={innerIdx}>
                    <div className="logoloop__item">
                      <ImageWithFallback key={`logo1-fix-${innerIdx}`} src={logo1} alt="Logo 1" className="h-6 md:h-7 object-contain mix-blend-multiply grayscale" />
                    </div>
                    <div className="logoloop__item">
                      <ImageWithFallback key={`logo2-fix-${innerIdx}`} src={logo2} alt="Logo 2" className="h-6 md:h-7 object-contain mix-blend-multiply grayscale" />
                    </div>
                    <div className="logoloop__item">
                      <ImageWithFallback key={`logo3-fix-${innerIdx}`} src={logo3} alt="Logo 3" className="h-6 md:h-7 object-contain mix-blend-multiply grayscale" />
                    </div>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>
      </footer>

      <section id="contact" className="animate-fade-up delay-500 w-full max-w-[1200px] mx-auto z-20 relative mb-4">
        <div className="w-full h-[1px] bg-black mb-8 md:mb-12 opacity-20"></div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4 md:px-8">
          <div className="flex items-center gap-5 md:gap-6">
            <a href="https://x.com/Superidol56754" target="_blank" rel="noopener noreferrer" className="text-slate-900 hover:text-black hover:scale-110 transition-transform" aria-label="X">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
            </a>
            <a href="https://www.reddit.com/user/SimilarWhile1517/" target="_blank" rel="noopener noreferrer" className="text-slate-900 hover:text-black hover:scale-110 transition-transform" aria-label="Reddit">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .883.175 1.188.467 1.209-.871 2.894-1.442 4.75-1.503l.859-4.041c.026-.123.134-.213.26-.213l3.051.643a1.241 1.241 0 0 1 1.12-.855zm-7.611 6.309c-.742 0-1.344.602-1.344 1.344 0 .742.602 1.344 1.344 1.344.742 0 1.344-.602 1.344-1.344 0-.742-.602-1.344-1.344-1.344zm6.052 0c-.742 0-1.344.602-1.344 1.344 0 .742.602 1.344 1.344 1.344.742 0 1.344-.602 1.344-1.344 0-.742-.602-1.344-1.344-1.344zm-3.045 4.607c-1.458 0-2.812-.338-3.791-.941a.508.508 0 0 0-.535.856c1.139.712 2.68 1.099 4.326 1.099 1.647 0 3.188-.387 4.326-1.1a.508.508 0 0 0-.536-.856c-.979.603-2.333.942-3.79.942z"/></svg>
            </a>
            <a href="https://www.instagram.com/nutrisupplementapp/" target="_blank" rel="noopener noreferrer" className="text-slate-900 hover:text-black hover:scale-110 transition-transform" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://www.linkedin.com/company/nutrisupplementapp/" target="_blank" rel="noopener noreferrer" className="text-slate-900 hover:text-black hover:scale-110 transition-transform" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" stroke="currentColor" strokeWidth="0"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-[13px] md:text-sm font-medium text-slate-900/60">
            
            <div className="flex gap-4 md:gap-6">
              <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
            </div>
            <span className="hidden md:inline">&copy; 2026 NuTri</span>
          </div>
        </div>
      </section>
    </>
  );
}
