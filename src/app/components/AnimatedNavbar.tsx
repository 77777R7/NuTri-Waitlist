import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

interface AnimatedNavbarProps {
  isMounted: boolean;
}

export const AnimatedNavbar: React.FC<AnimatedNavbarProps> = ({ isMounted }) => {
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileChevronRef = useRef<SVGSVGElement>(null);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCompactNav, setIsCompactNav] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateCompactNav = () => {
      setIsCompactNav(mediaQuery.matches);
      if (!mediaQuery.matches) {
        setIsMobileMenuOpen(false);
      }
    };

    updateCompactNav();
    mediaQuery.addEventListener('change', updateCompactNav);

    return () => mediaQuery.removeEventListener('change', updateCompactNav);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 60);
  });

  const effectiveIsScrolled = isScrolled && !isCompactNav;

  const baseGlassClass = "backdrop-blur-[72px] backdrop-saturate-[190%] bg-[rgba(238,249,255,0.74)] border border-[rgba(255,255,255,0.72)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),inset_0_-18px_34px_rgba(255,255,255,0.26),0_16px_46px_rgba(15,54,86,0.18)]";

  const springTransition = { duration: 0.5, type: 'spring', bounce: 0.2 };

  useGSAP(() => {
    const menu = mobileMenuRef.current;
    const chevron = mobileChevronRef.current;

    if (!menu) return;

    const items = menu.querySelectorAll('[data-mobile-nav-item]');

    if (isMobileMenuOpen) {
      gsap.set(menu, { height: 'auto', autoAlpha: 1 });
      const targetHeight = menu.offsetHeight;
      gsap.fromTo(
        menu,
        { height: 0, autoAlpha: 0, y: -8 },
        {
          height: targetHeight,
          autoAlpha: 1,
          y: 0,
          duration: 0.36,
          ease: 'power3.out',
          overwrite: 'auto',
          onComplete: () => gsap.set(menu, { height: 'auto' }),
        }
      );
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: -6 },
        { autoAlpha: 1, y: 0, duration: 0.24, ease: 'power2.out', stagger: 0.045, delay: 0.08, overwrite: 'auto' }
      );
      gsap.to(chevron, { rotation: 180, duration: 0.28, ease: 'power2.out', overwrite: 'auto' });
    } else {
      gsap.to(items, { autoAlpha: 0, y: -4, duration: 0.12, ease: 'power1.out', stagger: { each: 0.025, from: 'end' }, overwrite: 'auto' });
      gsap.to(menu, { height: 0, autoAlpha: 0, y: -8, duration: 0.26, ease: 'power2.inOut', overwrite: 'auto' });
      gsap.to(chevron, { rotation: 0, duration: 0.24, ease: 'power2.out', overwrite: 'auto' });
    }
  }, { scope: navRef, dependencies: [isMobileMenuOpen] });

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
    } else if (item === 'Learn More' || item === 'App Overview') {
      if (location.pathname === '/learn-more' && !location.hash) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        smoothScrollAndNavigate('/learn-more');
      }
    } else if (item === 'Waitlist') {
      navigate('/#waitlist');
    } else if (item === 'Contact') {
      navigate('/#contact');
    }
  };

  const handleCtaClick = (e: React.MouseEvent) => {
    if (isCompactNav) {
      e.preventDefault();
      setIsMobileMenuOpen((open) => !open);
      return;
    }

    handleLinkClick(e, 'Learn More');
  };

  const handleDesktopCtaClick = (e: React.MouseEvent) => {
    if (isCompactNav) {
      handleCtaClick(e);
      return;
    }

    if (location.pathname === '/learn-more') {
      e.preventDefault();
      const overview = document.getElementById('app-overview');
      if (overview) {
        overview.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const renderLink = (item: string) => {
    let isActive = false;
    if (item === 'Home' && location.pathname === '/') isActive = true;
    if (item === 'About' && location.pathname === '/about') isActive = true;
    if ((item === 'Learn More' || item === 'App Overview') && location.pathname === '/learn-more') isActive = true;

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

  const renderMobileLink = (item: string) => {
    let isActive = false;
    if (item === 'Home' && location.pathname === '/') isActive = true;
    if (item === 'About' && location.pathname === '/about') isActive = true;
    if ((item === 'Learn More' || item === 'App Overview') && location.pathname === '/learn-more') isActive = true;

    return (
      <motion.a
        key={`mobile-${item}`}
        href="#"
        onClick={(e) => {
          setIsMobileMenuOpen(false);
          handleLinkClick(e, item);
        }}
        transition={springTransition}
        data-mobile-nav-item
        className={`block rounded-[12px] border border-white/60 bg-[rgba(248,253,255,0.58)] px-4 py-3 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-[28px] transition-colors duration-200 ${isActive ? 'text-slate-900' : 'text-slate-900/70 hover:text-slate-900'}`}
      >
        {item}
      </motion.a>
    );
  };

  return (
    <nav 
      ref={navRef}
      className={`sticky top-[calc(env(safe-area-inset-top,0px)+12px)] md:top-[30px] z-50 w-full max-w-4xl mx-auto transition-all duration-1000 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
    >
      {/* Unified Background (when not scrolled) */}
      <AnimatePresence>
        {!effectiveIsScrolled && (
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
        className={`flex w-full flex-col relative z-10 ${!effectiveIsScrolled ? 'px-4 py-3 md:px-6 md:py-4' : ''}`}
      >
        <div className="relative flex w-full items-center justify-between">
          {/* Left Part (Logo + [Home, About] if scrolled) */}
          <motion.div 
            layout
            transition={springTransition}
            className={`relative flex items-center ${effectiveIsScrolled ? 'px-4 py-2 md:px-5 lg:px-6 md:py-3 md:w-[48%] lg:w-[45%] justify-between' : ''}`}
          >
            {/* Split Background Left */}
            <AnimatePresence>
              {effectiveIsScrolled && (
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
            
            {effectiveIsScrolled && (
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
          {!effectiveIsScrolled && (
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
            className={`relative flex items-center ${effectiveIsScrolled ? 'px-4 py-2 md:px-5 lg:px-6 md:py-3 md:w-[48%] lg:w-[45%] justify-between' : ''}`}
          >
            {/* Split Background Right */}
            <AnimatePresence>
              {effectiveIsScrolled && (
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

            {effectiveIsScrolled && (
              <motion.div 
                layout 
                transition={springTransition}
                className="hidden md:flex items-center space-x-6 lg:space-x-8"
              >
                {['Waitlist', 'Contact'].map(renderLink)}
              </motion.div>
            )}
            
            <motion.div
              layoutId="nav-cta"
              transition={springTransition}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex"
            >
              {isCompactNav ? (
                <button
                  type="button"
                  onClick={handleCtaClick}
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-primary-nav"
                  className="group flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-[14px] border border-white/70 bg-[rgba(248,253,255,0.76)] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_28px_rgba(15,54,86,0.12)] backdrop-blur-[30px] text-sm font-medium text-slate-900 transition-colors duration-300 hover:bg-[rgba(255,255,255,0.9)] whitespace-nowrap"
                >
                  Learn More
                  <ChevronDown ref={mobileChevronRef} className="block w-4 h-4 opacity-70 md:hidden" />
                </button>
              ) : (
                <Link
                  to="/learn-more"
                  onClick={handleDesktopCtaClick}
                  className="group flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-[14px] border border-white/70 bg-[rgba(248,253,255,0.76)] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_28px_rgba(15,54,86,0.12)] backdrop-blur-[30px] text-sm font-medium text-slate-900 transition-colors duration-300 hover:bg-[rgba(255,255,255,0.9)] whitespace-nowrap"
                >
                  Learn More
                  <ArrowRight className="hidden w-4 h-4 opacity-70 transition-transform group-hover:translate-x-1 md:block" />
                </Link>
              )}
            </motion.div>
          </motion.div>
        </div>

        <div
          id="mobile-primary-nav"
          ref={mobileMenuRef}
          aria-hidden={!isMobileMenuOpen}
          className="mt-0 grid w-full grid-cols-1 gap-2 overflow-hidden border-t border-white/60 md:hidden"
          style={{ height: 0, opacity: 0, visibility: 'hidden' }}
        >
          <div className="grid grid-cols-1 gap-2 pt-3">
            {['App Overview', 'Home', 'About', 'Waitlist', 'Contact'].map(renderMobileLink)}
          </div>
        </div>

      </motion.div>
    </nav>
  );
};
