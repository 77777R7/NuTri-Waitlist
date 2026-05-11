import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

/**
 * NuTri Landing Page - 背景视频更新版本
 * 背景已更换为最新的 MP4 视频链接。
 */
export default function App() {
  const [libsLoaded, setLibsLoaded] = useState(false);
  
  // 视频交替状态逻辑，用于实现无缝切换
  const [activeVideo, setActiveVideo] = useState(1);
  const activeVideoRef = useRef(1);
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const isTransitioning = useRef(false);

  // 动画与布局相关 Refs
  const pageRef = useRef(null);
  const bgRef = useRef(null);
  const heroRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroCopyRef = useRef(null);
  const heroCtaRef = useRef(null);
  const waitlistStageRef = useRef(null);
  const waitlistOuterRef = useRef(null);
  const waitlistInnerRef = useRef(null);

  // 换回之前的 MP4 视频链接
  const videoSrc = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_094301_a14978cb-069c-4fdb-a8cb-57d2d0de50fb.mp4";

  // 1. 动态加载 GSAP 脚本 (移除 HLS.js)
  useEffect(() => {
    const scripts = [
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollToPlugin.min.js"
    ];

    let loadedCount = 0;
    const onScriptLoad = () => {
      loadedCount++;
      if (loadedCount === scripts.length) {
        window.gsap.registerPlugin(window.ScrollTrigger, window.ScrollToPlugin);
        setLibsLoaded(true);
      }
    };

    scripts.forEach(src => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = onScriptLoad;
      document.head.appendChild(script);
    });
  }, []);

  // 2. 初始化视频播放与 GSAP 交互动画
  useLayoutEffect(() => {
    if (!libsLoaded || !pageRef.current || !window.gsap) return;

    const gsap = window.gsap;

    const ctx = gsap.context(() => {
      // (1) 初始进场动画 - 仅透明度渐显，保持位置固定
      gsap.from([heroTitleRef.current, heroCopyRef.current, heroCtaRef.current], {
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power3.out",
      });

      // (2) Hero 滚动逻辑 - 保持固定，仅添加模糊和淡出效果
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: pageRef.current,
          start: "top top",
          end: "+=800",
          scrub: 1.2,
        },
      });

      heroTl
        .to(heroTitleRef.current, { opacity: 0, ease: "none" }, 0)
        .to(heroCopyRef.current, { opacity: 0, ease: "none" }, 0)
        .to(heroCtaRef.current, { opacity: 0, ease: "none" }, 0)
        .to(heroRef.current, { filter: "blur(20px)", ease: "none" }, 0);

      // (3) Waitlist 区域滑入动画 - 移除 opacity 动画，解决毛玻璃渲染 bug
      gsap.fromTo(
        waitlistOuterRef.current,
        { yPercent: 120 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: waitlistStageRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1.4,
          },
        }
      );

      // (4) 背景视差效果
      const bgX = gsap.quickTo(bgRef.current, "x", { duration: 1.5, ease: "power3.out" });
      const bgY = gsap.quickTo(bgRef.current, "y", { duration: 1.5, ease: "power3.out" });

      const onMouseMove = (e) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        bgX(nx * -20);
        bgY(ny * -20);

        // 卡片 3D 效果已移除
        if (waitlistInnerRef.current) {
          gsap.to(waitlistInnerRef.current, {
            rotationX: ny * -6,
            rotationY: nx * 6,
            duration: 1,
            ease: "power3.out"
          });
        }
      };

      window.addEventListener("mousemove", onMouseMove);

      // (5) 视频无缝循环切换计时器
      const v1 = video1Ref.current;
      const v2 = video2Ref.current;
      
      if (v1) v1.play().catch(() => {});

      const checkTime = setInterval(() => {
        const currentActive = activeVideoRef.current;
        const activeEl = currentActive === 1 ? v1 : v2;
        const nextEl = currentActive === 1 ? v2 : v1;
        
        if (!activeEl || !activeEl.duration) return;

        const timeRemaining = activeEl.duration - activeEl.currentTime;
        if (timeRemaining <= 1.5 && !isTransitioning.current) {
          isTransitioning.current = true;
          if (nextEl) {
            nextEl.currentTime = 0;
            nextEl.play().catch(() => {});
          }
          activeVideoRef.current = currentActive === 1 ? 2 : 1;
          setActiveVideo(activeVideoRef.current);
          setTimeout(() => { isTransitioning.current = false; }, 1500);
        }
      }, 200);

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        clearInterval(checkTime);
      };
    }, pageRef);

    return () => ctx.revert();
  }, [libsLoaded]);

  const scrollToWaitlist = (e) => {
    e.preventDefault();
    if (!window.gsap) return;
    window.gsap.to(window, {
      duration: 1.5,
      scrollTo: waitlistStageRef.current,
      ease: "power3.inOut",
    });
  };

  return (
    <div className="bg-[#020813] text-white min-h-screen selection:bg-white/20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;700&display=swap');
        :root { --font-display: 'Instrument Serif', serif; --font-body: 'Inter', sans-serif; }
        
        .liquid-glass {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
        }
        .matte-glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>

      {/* 背景视频层 - 双视频轨道交叉淡入淡出 */}
      <div ref={bgRef} className="fixed inset-0 z-0 scale-[1.1] will-change-transform" style={{ filter: 'brightness(1.15)' }}>
        <video 
          ref={video1Ref} 
          muted 
          playsInline 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ${activeVideo === 1 ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <video 
          ref={video2Ref} 
          muted 
          playsInline 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ${activeVideo === 2 ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        {/* 降低遮罩透明度以提亮背景 */}
        <div className="absolute inset-0 bg-[#000a14]/10" />
      </div>

      {/* 导航栏 */}
      <header className="fixed top-0 left-0 right-0 z-[100] max-w-7xl mx-auto px-8 py-6 flex justify-between items-center pointer-events-none">
        <div className="text-[32px] tracking-tight text-white flex items-start pointer-events-auto cursor-pointer" style={{ fontFamily: 'var(--font-display)' }}>
          NuTri<sup className="text-[11px] mt-2 ml-0.5 opacity-80">®</sup>
        </div>
        <nav className="hidden md:flex items-center gap-7 matte-glass px-8 py-3.5 rounded-full pointer-events-auto">
          <a href="#" className="text-sm font-medium text-white transition-colors">Home</a>
          <span className="w-1 h-1 bg-white/40 rounded-full"></span>
          <a href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors">How It Works</a>
          <a href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Science</a>
          <a href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Journal</a>
          <a href="#" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Reach Us</a>
        </nav>
      </header>

      <div ref={pageRef} className="relative h-[250vh]" style={{ fontFamily: 'var(--font-body)' }}>
        {!libsLoaded && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020813]">
             <div className="animate-pulse text-white/50 text-sm tracking-widest uppercase">Initializing Interface...</div>
          </div>
        )}

        {/* Hero 区域 - 已根据要求向下移动并保持固定 */}
        <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
          <main ref={heroRef} className="flex flex-col items-center text-center px-6 pointer-events-auto will-change-transform mt-32">
            <h1 ref={heroTitleRef} className="text-5xl sm:text-[64px] md:text-[76px] font-normal tracking-[-0.02em] text-white leading-[1.05] max-w-4xl" style={{ fontFamily: 'var(--font-display)' }}>
              Know what’s in your supplements before you buy.
            </h1>
            <p ref={heroCopyRef} className="mt-8 text-base sm:text-lg text-white/80 max-w-[600px] leading-relaxed font-light">
              NuTri helps you scan supplement labels, understand ingredient science, and compare products.
            </p>
            <div ref={heroCtaRef} className="mt-12 flex flex-col items-center">
              <button onClick={scrollToWaitlist} className="liquid-glass text-white px-10 py-4 rounded-full text-[15px] font-medium transition-all hover:scale-105 cursor-pointer">
                Join Waitlist
              </button>
              <div className="mt-6 matte-glass rounded-full px-5 py-2">
                <p className="text-[11px] text-white/50 tracking-widest font-medium uppercase">
                  Early access • Beta invites • Launch updates
                </p>
              </div>
            </div>
          </main>
        </div>

        {/* Waitlist 区域 - 滚动时滑入 */}
        <div ref={waitlistStageRef} className="absolute bottom-0 left-0 w-full h-screen flex items-center justify-center z-20 px-6">
          <div ref={waitlistOuterRef} className="w-full flex justify-center will-change-transform">
            {/* 移除了干扰渲染的 3D Transform 属性 */}
            <section ref={waitlistInnerRef} className="w-full max-w-2xl liquid-glass rounded-[48px] p-12 md:p-16 text-center shadow-2xl">
              <h2 className="text-4xl md:text-5xl text-white font-normal" style={{ fontFamily: "var(--font-display)" }}>
                Get early access to NuTri
              </h2>
              <p className="text-white/60 text-sm md:text-base mt-4 mb-10 max-w-md mx-auto leading-relaxed font-light">
                Be among the first to try a smarter way to evaluate supplements before you spend money on them.
              </p>
              <form className="w-full flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-grow bg-white/5 border border-white/20 rounded-full px-6 py-3.5 text-white placeholder:text-white/40 outline-none focus:bg-white/10 transition-all text-sm" 
                />
                <button type="submit" className="bg-white text-black px-8 py-3.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
                  Join Waitlist
                </button>
              </form>
              <p className="text-white/30 text-[11px] mt-8 tracking-widest uppercase font-bold">
                🔒 No spam. Launching soon.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}