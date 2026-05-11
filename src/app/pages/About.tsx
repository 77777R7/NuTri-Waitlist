import React from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import team1Photo from '../../imports/b2bfe1f7dfdac5099f6a07e691527602.jpg';
import team2Photo from '../../imports/Screenshot_2026-05-09_at_11.28.50_AM.png';
import team3Photo from '../../imports/Screenshot_2026-05-09_at_11.29.12_AM.png';

export default function About() {
  return (
    <main className="flex-1 flex flex-col items-center w-full pt-24 pb-24 z-20 space-y-24">
      {/* About Us Section */}
      <section className="w-full max-w-4xl mx-auto p-10 md:p-16 rounded-[28px] backdrop-blur-[30px] backdrop-saturate-150 bg-[rgba(255,255,255,0.18)] border border-[rgba(255,255,255,0.5)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_20px_60px_rgba(0,0,0,0.05)] text-center animate-fade-up">
        <h1 className="font-['DM_Serif_Display'] font-bold text-4xl md:text-6xl text-slate-900 mb-6">
          About Us
        </h1>
        <p className="font-inter text-lg md:text-xl text-slate-900/70 leading-relaxed max-w-2xl mx-auto">
          Our mission is to make supplement decisions clearer, safer, and easier. By turning complex labels and trusted health references into simple insights, NuTri helps users understand what they’re taking before they buy or use it.
        </p>
      </section>

      {/* Meet Our Team Section */}
      <section className="w-full max-w-5xl mx-auto flex flex-col items-center">
        <h2 className="font-['DM_Serif_Display'] font-bold text-3xl md:text-5xl text-slate-900 mb-12 animate-fade-up delay-100">
          Meet Our Team
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full px-4 md:px-0">
          {/* Member 1: Howard Lun */}
          <div className="flex flex-col items-center p-8 rounded-[24px] backdrop-blur-[30px] backdrop-saturate-150 bg-[rgba(255,255,255,0.18)] border border-[rgba(255,255,255,0.5)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_10px_30px_rgba(0,0,0,0.03)] transition-transform duration-300 hover:-translate-y-2 animate-fade-up delay-200">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/60 to-white/20 border border-white/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_10px_rgba(0,0,0,0.05)] mb-6 overflow-hidden flex items-center justify-center">
              <ImageWithFallback src={team1Photo} alt="Howard Lun" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-inter font-bold text-xl text-slate-900 mb-1">Howard Lun</h3>
            <p className="font-inter text-xs text-slate-900/60 mb-5 font-bold uppercase tracking-widest text-center">Founder / Product Lead</p>
            <p className="font-inter text-sm text-slate-900/70 text-center leading-relaxed">
              I’m a third-year UBC student studying Economics with a Commerce minor. I started NuTri from a personal need, to make supplement choices clearer, safer, and more trustworthy by helping people understand product labels, ingredient evidence, quality signals, and safety considerations before deciding what to take.
            </p>
          </div>

          {/* Member 2: Raymond Zhang */}
          <div className="flex flex-col items-center p-8 rounded-[24px] backdrop-blur-[30px] backdrop-saturate-150 bg-[rgba(255,255,255,0.18)] border border-[rgba(255,255,255,0.5)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_10px_30px_rgba(0,0,0,0.03)] transition-transform duration-300 hover:-translate-y-2 animate-fade-up delay-300">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/60 to-white/20 border border-white/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_10px_rgba(0,0,0,0.05)] mb-6 overflow-hidden flex items-center justify-center">
              <ImageWithFallback src={team2Photo} alt="Raymond Zhang" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-inter font-bold text-xl text-slate-900 mb-1">Raymond Zhang</h3>
            <p className="font-inter text-xs text-slate-900/60 mb-5 font-bold uppercase tracking-widest text-center">Cofounder / Full-Stack Developer</p>
            <p className="font-inter text-sm text-slate-900/70 text-center leading-relaxed">
              I’m a third-year Computer Science student at the UBC with interests in software development and applied artificial intelligence. At NuTri, I help build the technical foundation of the product, turning complex supplement information into a practical, user-friendly experience through app development.
            </p>
          </div>

          {/* Member 3: Shuo Xu */}
          <div className="flex flex-col items-center p-8 rounded-[24px] backdrop-blur-[30px] backdrop-saturate-150 bg-[rgba(255,255,255,0.18)] border border-[rgba(255,255,255,0.5)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_10px_30px_rgba(0,0,0,0.03)] transition-transform duration-300 hover:-translate-y-2 animate-fade-up delay-400">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/60 to-white/20 border border-white/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_10px_rgba(0,0,0,0.05)] mb-6 overflow-hidden flex items-center justify-center">
              <ImageWithFallback src={team3Photo} alt="Shuo Xu" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-inter font-bold text-xl text-slate-900 mb-1">Shuo Xu</h3>
            <p className="font-inter text-xs text-slate-900/60 mb-5 font-bold uppercase tracking-widest text-center">Co-Founder / Marketing &amp; Data Analytics Lead</p>
            <p className="font-inter text-sm text-slate-900/70 text-center leading-relaxed">
              I’m a third-year Mathematics and Statistics student at the University of British Columbia. At NuTri, I focus on marketing, user insights, and data analysis, helping the team better understand supplement users, market trends, and product opportunities. I’m interested in using data-driven thinking to turn user needs into clearer product decisions and more effective growth strategies.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}