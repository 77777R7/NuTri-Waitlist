import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { AnimatedNavbar } from './components/AnimatedNavbar';
import bgImage from '../imports/ChatGPT_Image_2026_5_8____03_32_06.png';

export default function RootLayout() {
  const [isMounted, setIsMounted] = useState(false);
  const location = useLocation();

  const [prevPath, setPrevPath] = useState(location.pathname);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } else {
      if (prevPath !== location.pathname) {
        // Use requestAnimationFrame to ensure the DOM has updated before we instantly snap to top.
        // This prevents the visual "jump" from rendering the bottom of the new page before snapping.
        requestAnimationFrame(() => {
          // Disable smooth scrolling temporarily to prevent conflict with browser history
          document.documentElement.style.scrollBehavior = 'auto';
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          setTimeout(() => {
             document.documentElement.style.scrollBehavior = 'smooth';
          }, 0);
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    setPrevPath(location.pathname);
  }, [location.pathname, location.hash, prevPath]);

  return (
    <div className="relative min-h-screen w-full overflow-clip bg-white font-inter text-slate-900 selection:bg-blue-200 selection:text-blue-900" style={{ WebkitFontSmoothing: 'antialiased' }}>
      
      {/* Inject Fonts and Custom Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        :root { --safe-top: env(safe-area-inset-top, 0px); }

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

        @keyframes bgFloat {
          0% { transform: scale(1.0) translate(0px, 0px); }
          50% { transform: scale(1.1) translate(-1.5%, 1.5%); }
          100% { transform: scale(1.0) translate(0px, 0px); }
        }
        
        .animate-bg-float {
          animation: bgFloat 30s ease-in-out infinite;
        }

        /* Hide scrollbar for clean look */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
      `}} />

      {/* Background System: White base + Animated Image + Blurred Gradient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 w-full h-full">
          <ImageWithFallback
            key="bg-image-remount-fix"
            src={bgImage}
            alt="Ambient Background"
            className="w-full h-full object-cover animate-bg-float"
            style={{ filter: 'saturate(1.15) contrast(1.05)' }}
          />
        </div>
        {/* Very light protective wash so text stays legible without hiding the image */}
        <div className="absolute inset-0 bg-white/10"></div>

        {/* Subtle vignette to add depth at edges while preserving the sky in the center */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 90% 80% at 50% 50%, rgba(255,255,255,0) 50%, rgba(120,170,220,0.18) 100%)'
        }}></div>
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-5 md:px-8 xl:px-12 flex flex-col min-h-screen pb-12">
        <AnimatedNavbar isMounted={isMounted} />
        <Outlet />
      </div>
    </div>
  );
}
