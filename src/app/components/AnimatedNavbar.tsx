import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

interface AnimatedNavbarProps {
  isMounted: boolean;
}

export const AnimatedNavbar: React.FC<AnimatedNavbarProps> = ({ isMounted }) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 60);
  });

  const baseGlassClass = "backdrop-blur-[50px] bg-[rgba(255,255,255,0.3)] border border-[rgba(0,0,0,0.1)] shadow-[inset_0_4px_4px_0_rgba(255,255,255,0.25)]";

  const springTransition = { duration: 0.5, type: 'spring', bounce: 0.2 };

  const handleLinkClick = (e: React.MouseEvent, item: string) => {
    e.preventDefault();

    const smoothScrollAndNavigate = (path: string) => {
      if (window.scrollY > 50) {
        // Prevent layout shifts during transition
        document.body.style.overflow = 'hidden';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          navigate(path);
          // Restore overflow after navigation and a tiny tick to ensure DOM paints
          setTimeout(() => {
            document.body.style.overflow = 'unset';
          }, 50);
        }, 500); // Wait for the scroll animation to complete before changing the page
      } else {
        navigate(path);
      }
    };

    if (item === 'Home') {
      if (location.pathname === '/' && !location.hash) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        smoothScrollAndNavigate('/');
      }
    } else if (item === 'About') {
      if (location.pathname === '/about' && !location.hash) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        smoothScrollAndNavigate('/about');
      }
    } else if (item === 'Waitlist') {
      navigate('/#waitlist');
    } else if (item === 'Contact') {
      navigate('/#contact');
    }
  };

  const renderLink = (item: string) => {
    let isActive = false;
    if (item === 'Home' && location.pathname === '/') isActive = true;
    if (item === 'About' && location.pathname === '/about') isActive = true;

    return (
      <motion.a
        layoutId={`nav-link-${item}`}
        key={item}
        href="#"
        onClick={(e) => handleLinkClick(e, item)}
        transition={springTransition}
        className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap ${isActive ? 'text-slate-900' : 'text-slate-900/70 hover:text-slate-900'}`}
      >
        {item}
      </motion.a>
    );
  };

  return (
    <nav 
      className={`sticky top-[20px] md:top-[30px] z-50 w-full max-w-4xl mx-auto transition-all duration-1000 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
    >
      {/* Unified Background (when not scrolled) */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.div
            key="unified"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={`absolute inset-0 ${baseGlassClass} rounded-[16px] -z-10`}
          />
        )}
      </AnimatePresence>

      <motion.div 
        layout
        transition={springTransition}
        className={`flex items-center w-full justify-between relative z-10 ${!isScrolled ? 'px-4 py-3 md:px-6 md:py-4' : ''}`}
      >
        {/* Left Part (Logo + [Home, About] if scrolled) */}
        <motion.div 
          layout
          transition={springTransition}
          className={`relative flex items-center ${isScrolled ? 'px-4 py-2 md:px-5 lg:px-6 md:py-3 md:w-[48%] lg:w-[45%] justify-between' : ''}`}
        >
          {/* Split Background Left */}
          <AnimatePresence>
            {isScrolled && (
              <motion.div
                key="split-left"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className={`absolute inset-0 ${baseGlassClass} rounded-[100px] -z-10`}
              />
            )}
          </AnimatePresence>

          <motion.div layoutId="nav-logo" transition={springTransition} className="font-['Inter'] font-bold text-xl md:text-2xl text-slate-900 tracking-[-0.03em] whitespace-nowrap">
            NuTri
          </motion.div>
          
          {isScrolled && (
            <motion.div 
              layout 
              transition={springTransition}
              className="hidden md:flex items-center space-x-6 lg:space-x-8"
            >
              {['Home', 'About'].map(renderLink)}
            </motion.div>
          )}
        </motion.div>

        {/* Center Part (All Links if NOT scrolled) */}
        {!isScrolled && (
          <motion.div 
            layout 
            transition={springTransition}
            className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-6 lg:space-x-8"
          >
            {['Home', 'About', 'Waitlist', 'Contact'].map(renderLink)}
          </motion.div>
        )}

        {/* Right Part ([Waitlist, Contact] if scrolled + CTA) */}
        <motion.div 
          layout
          transition={springTransition}
          className={`relative flex items-center ${isScrolled ? 'px-4 py-2 md:px-5 lg:px-6 md:py-3 md:w-[48%] lg:w-[45%] justify-between' : ''}`}
        >
          {/* Split Background Right */}
          <AnimatePresence>
            {isScrolled && (
              <motion.div
                key="split-right"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className={`absolute inset-0 ${baseGlassClass} rounded-[100px] -z-10`}
              />
            )}
          </AnimatePresence>

          {isScrolled && (
            <motion.div 
              layout 
              transition={springTransition}
              className="hidden md:flex items-center space-x-6 lg:space-x-8"
            >
              {['Waitlist', 'Contact'].map(renderLink)}
            </motion.div>
          )}
          
          <motion.button 
            layoutId="nav-cta"
            transition={springTransition}
            onClick={(e) => handleLinkClick(e, 'Waitlist')} 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.8)] border border-white/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5)] rounded-[14px] text-sm font-medium text-slate-900 transition-colors duration-300 whitespace-nowrap"
          >Learn More<ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" /></motion.button>
        </motion.div>

      </motion.div>
    </nav>
  );
};
