import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowRightCircle, Star } from 'lucide-react';

const App = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white font-inter text-slate-900 selection:bg-blue-200 selection:text-blue-900" style={{ WebkitFontSmoothing: 'antialiased' }}>
      
      {/* Inject Fonts and Custom Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Fustat:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
        
        .font-fustat { font-family: 'Fustat', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-up {
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        /* Hide scrollbar for clean look */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
      `}} />

      {/* Background System: White base + Blurred Gradient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-120px] left-[-120px] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full bg-[#60B1FF] opacity-[0.12] blur-[100px] md:blur-[140px] transform translate-z-0"></div>
        <div className="absolute top-[40px] left-[180px] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-[#319AFF] opacity-[0.08] blur-[100px] md:blur-[120px] transform translate-z-0"></div>
        {/* Optional faint wash right */}
        <div className="absolute top-[20%] right-[-10%] w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] rounded-full bg-[#e0f2fe] opacity-[0.3] blur-[120px] transform translate-z-0"></div>
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-5 md:px-8 xl:px-12 flex flex-col min-h-screen pb-12">
        
        {/* 1. Strong Liquid Glass Navbar */}
        <nav className={`sticky top-[20px] md:top-[30px] z-50 w-full max-w-4xl mx-auto flex items-center justify-between px-4 py-3 md:px-6 md:py-4 transition-all duration-1000 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
          backdrop-blur-[50px] bg-[rgba(255,255,255,0.3)] rounded-[16px] border border-[rgba(0,0,0,0.1)] shadow-[inset_0_4px_4px_0_rgba(255,255,255,0.25)]`}
        >
          {/* Logo */}
          <div className="font-fustat font-bold text-xl md:text-2xl text-slate-900 tracking-[-0.03em]">
            NuTri
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {['Home', 'About', 'Waitlist', 'Contact'].map((item) => (
              <a key={item} href="#" className="text-sm font-medium text-slate-900/70 hover:text-slate-900 transition-colors duration-200">
                {item}
              </a>
            ))}
          </div>

          {/* Nav CTA */}
          <button className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.8)] border border-white/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5)] rounded-[14px] text-sm font-medium text-slate-900 transition-all duration-300 hover:scale-[1.02]">
            Join Waitlist
            <ArrowRight className="w-4 h-4 opacity-70" />
          </button>
        </nav>

        {/* 2 & 4. Hero Section & Waitlist Integration Wrapper */}
        <main className="flex-1 flex flex-col pt-12 md:pt-20 lg:pt-24 pb-16">
          
          <div className="grid lg:grid-cols-2 items-center gap-10 lg:gap-16">
            
            {/* 3. Hero Left Content */}
            <div className="flex flex-col items-start max-w-[650px] z-20">
              
              {/* Badge */}
              <div className="animate-fade-up flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 mb-6 md:mb-8 rounded-full bg-white/40 backdrop-blur-md border border-[rgba(0,0,0,0.1)] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="flex gap-[2px] text-[#FF801E]">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <span className="text-xs md:text-sm font-medium text-slate-900/80 ml-1">
                  Early access opens soon
                </span>
                <span className="hidden md:inline text-slate-900/30 mx-1">•</span>
                <span className="hidden md:inline text-xs md:text-sm font-medium text-slate-900/60">
                  Join 2,700+ people on the waitlist
                </span>
              </div>

              {/* Headline */}
              <h1 className="animate-fade-up delay-100 font-fustat font-bold text-[40px] leading-[1.05] tracking-[-2px] sm:text-[50px] md:text-[64px] lg:text-[75px] text-slate-900 mb-6">
                Know what’s worth trying before everyone else.
              </h1>

              {/* Subheadline */}
              <p className="animate-fade-up delay-200 font-inter text-[16px] md:text-[18px] leading-[1.6] tracking-[-1px] text-slate-900/65 max-w-[560px] mb-8 md:mb-10">
                NuTri is building a smarter supplement experience. Join the waitlist to get early access, launch updates, and priority entry when we open.
              </p>

              {/* Primary CTA Area */}
              <div className="animate-fade-up delay-300 flex flex-col items-start gap-4">
                <button className="group flex items-center gap-3 px-6 py-4 md:px-8 md:py-4 bg-[rgba(0,132,255,0.8)] hover:bg-[rgba(0,132,255,0.9)] text-white rounded-[16px] shadow-[inset_0_4px_4px_0_rgba(255,255,255,0.35)] backdrop-blur-[2px] transition-all duration-300 hover:scale-[1.02]">
                  <span className="font-semibold text-base md:text-lg">Join Waitlist</span>
                  <ArrowRightCircle className="w-5 h-5 opacity-90 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-xs md:text-sm text-slate-900/45 font-medium ml-2">
                  No spam. Just launch updates and early access.
                </p>
              </div>

              {/* Mobile Only Waitlist form preview (Optional if you want it closer to hero on mobile, but keeping it in the card below as requested) */}
            </div>

            {/* 4. Hero Right Visual — Glassy Orb */}
            <div className="animate-fade-up delay-400 relative flex justify-center lg:justify-end items-center h-[350px] sm:h-[450px] md:h-[500px] lg:h-[650px] w-full z-10 pointer-events-none">
              <div className="relative w-full h-full flex items-center justify-center animate-float">
                {/* The orb video is carefully transformed to match the #319AFF brand glow 
                  using the requested CSS filter grade. 
                */}
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="max-w-none w-[120%] h-[120%] object-contain"
                  style={{ 
                    filter: 'hue-rotate(-55deg) saturate(250%) brightness(1.2) contrast(1.1)', 
                    mixBlendMode: 'screen',
                    transform: 'scale(1.25) translateX(5%)'
                  }}
                >
                  <source src="https://future.co/images/homepage/glassy-orb/orb-purple.webm" type="video/webm" />
                </video>
              </div>
            </div>

          </div>
        </main>

        {/* 5. Waitlist Signup Card (Centered & Elevated) */}
        <section className="animate-fade-up delay-500 w-full max-w-[760px] mx-auto z-20 relative -mt-4 md:-mt-12 lg:-mt-24 mb-20 md:mb-32">
          <div className="w-full flex flex-col items-center p-8 md:p-12 lg:p-14 rounded-[28px] backdrop-blur-[40px] bg-[rgba(255,255,255,0.45)] border border-[rgba(255,255,255,0.8)] shadow-[inset_0_4px_4px_rgba(255,255,255,0.4),0_20px_60px_rgba(0,0,0,0.05)]">
            
            <h2 className="font-fustat font-bold text-3xl md:text-[42px] leading-[1.1] tracking-[-1px] text-slate-900 text-center mb-4 md:mb-5">
              Get early access to NuTri
            </h2>
            
            <p className="font-inter text-[15px] md:text-[17px] leading-[1.6] text-slate-900/65 text-center max-w-[500px] mb-8 md:mb-10">
              Be the first to know when we launch. Join the waitlist for beta access, launch updates, and priority entry.
            </p>

            <form className="w-full max-w-[500px] flex flex-col md:flex-row gap-3 md:gap-2 mb-4" onSubmit={(e) => e.preventDefault()}>
              <div className="relative flex-1 w-full">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  required
                  className="w-full h-[56px] md:h-[64px] px-6 rounded-full bg-white/60 border border-white/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:bg-white/80 transition-all font-inter font-medium text-slate-900 placeholder:text-slate-900/35 placeholder:font-normal"
                />
              </div>
              <button 
                type="submit"
                className="h-[56px] md:h-[64px] px-8 rounded-full bg-[#1A8BFF] hover:bg-[#0070E0] text-white font-semibold text-[15px] md:text-[16px] shadow-[inset_0_4px_4px_rgba(255,255,255,0.2),0_6px_16px_rgba(26,139,255,0.25)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
              >
                Reserve My Spot
              </button>
            </form>

            <p className="text-xs text-slate-900/45 font-medium text-center">
              Free to join &middot; No spam &middot; Unsubscribe anytime
            </p>

          </div>
        </section>

        {/* 6. Trusted-by Footer Logos */}
        <footer className="animate-fade-up delay-500 w-full flex flex-col items-center mt-auto pb-8 z-10">
          <p className="text-xs md:text-sm font-semibold tracking-wider uppercase text-slate-900/30 mb-8 md:mb-10 text-center">
            Trusted by top-tier product companies
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-[40px] md:gap-[100px] opacity-40 grayscale mix-blend-multiply">
            {/* Minimal SVG Placeholder Logos */}
            <svg className="h-6 md:h-7" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 15C10 9.47715 14.4772 5 20 5C25.5228 5 30 9.47715 30 15C30 20.5228 25.5228 25 20 25C14.4772 25 10 20.5228 10 15ZM35 5H45V25H35V5ZM50 5H70V10H60V25H50V5ZM75 5H95V10H85V25H75V5Z" fill="currentColor"/>
            </svg>
            <svg className="h-5 md:h-6" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="15" cy="15" r="10" fill="currentColor"/>
              <rect x="30" y="5" width="20" height="20" rx="4" fill="currentColor"/>
              <path d="M60 25L70 5L80 25H60Z" fill="currentColor"/>
            </svg>
            <svg className="h-6 md:h-7 hidden sm:block" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="5" width="90" height="20" rx="10" border="2" stroke="currentColor" strokeWidth="4"/>
              <circle cx="20" cy="15" r="5" fill="currentColor"/>
              <circle cx="40" cy="15" r="5" fill="currentColor"/>
            </svg>
            <svg className="h-6 md:h-7 hidden md:block" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 5H30V10H20V25H10V5ZM40 15C40 9.47715 44.4772 5 50 5C55.5228 5 60 9.47715 60 15C60 20.5228 55.5228 25 50 25C44.4772 25 40 20.5228 40 15ZM70 5H80L90 15L80 25H70L80 15L70 5Z" fill="currentColor"/>
            </svg>
            <svg className="h-5 md:h-6 hidden lg:block" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 15L20 5V25L5 15ZM25 15L40 5V25L25 15ZM45 15L60 5V25L45 15ZM65 15L80 5V25L65 15Z" fill="currentColor"/>
            </svg>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default App;