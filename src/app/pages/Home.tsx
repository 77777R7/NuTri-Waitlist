import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, CircleAlert, Copy, Gift, Users } from 'lucide-react';
import { Link } from 'react-router';
import '../../styles/logoloop.css';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import logo1 from '../../imports/image.png';
import logo2 from '../../imports/image-1.png';
import logo3 from '../../imports/image-2.png';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const REFERRAL_STORAGE_KEY = 'nutri_waitlist_referral';
type UTMKey = (typeof UTM_KEYS)[number];
type WaitlistAttribution = Partial<Record<UTMKey, string>> & {
  referring_site?: string;
  ref?: string;
};
type ReferralInvite = {
  code: string;
  inviteUrl: string;
  tiers: {
    friends: number;
    bonusDays: number;
    totalTrialDays: number;
  }[];
};

function cleanAttributionValue(value: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, 200) : '';
}

function cleanReferralCode(value: string | null) {
  const trimmed = value?.trim().toLowerCase();
  if (!trimmed || !/^[a-z0-9_-]{6,64}$/.test(trimmed)) return '';
  return trimmed.slice(0, 64);
}

function readIncomingReferralCode() {
  const params = new URLSearchParams(window.location.search);
  const urlReferralCode = cleanReferralCode(params.get('ref'));

  if (urlReferralCode) {
    try {
      sessionStorage.setItem(REFERRAL_STORAGE_KEY, urlReferralCode);
    } catch {
      // Referral capture should never block a signup if browser storage is unavailable.
    }
    return urlReferralCode;
  }

  try {
    return cleanReferralCode(sessionStorage.getItem(REFERRAL_STORAGE_KEY));
  } catch {
    try {
      sessionStorage.removeItem(REFERRAL_STORAGE_KEY);
    } catch {
      // Ignore storage cleanup failures in restricted browser contexts.
    }
    return '';
  }
}

function readWaitlistAttribution(): WaitlistAttribution {
  const params = new URLSearchParams(window.location.search);
  const attribution: WaitlistAttribution = {};
  let hasUrlAttribution = false;

  UTM_KEYS.forEach((key) => {
    const value = cleanAttributionValue(params.get(key));
    if (value) {
      attribution[key] = value;
      hasUrlAttribution = true;
    }
  });

  if (hasUrlAttribution) {
    try {
      sessionStorage.setItem('nutri_waitlist_attribution', JSON.stringify(attribution));
    } catch {
      // Attribution should never block a signup if browser storage is unavailable.
    }
  } else {
    try {
      const storedAttribution = sessionStorage.getItem('nutri_waitlist_attribution');
      if (storedAttribution) {
        Object.assign(attribution, JSON.parse(storedAttribution));
      }
    } catch {
      sessionStorage.removeItem('nutri_waitlist_attribution');
    }
  }

  const referralCode = readIncomingReferralCode();
  if (referralCode) {
    attribution.ref = referralCode;
  }

  attribution.referring_site = cleanAttributionValue(document.referrer) || window.location.href;
  return attribution;
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [email, setEmail] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [waitlistMessage, setWaitlistMessage] = useState('');
  const [incomingReferralCode, setIncomingReferralCode] = useState('');
  const [referralInvite, setReferralInvite] = useState<ReferralInvite | null>(null);
  const [inviteCopied, setInviteCopied] = useState(false);

  useEffect(() => {
    setIncomingReferralCode(readIncomingReferralCode());

    // Force muted and play to ensure autoplay works across all browsers (like Safari/iOS)
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(e => console.log("Autoplay blocked:", e));
    }
  }, []);

  const handleWaitlistSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const submittedEmail = String(formData.get('email') || '').trim();
    const company = String(formData.get('company') || '').trim();

    if (!submittedEmail) {
      setWaitlistStatus('error');
      setWaitlistMessage('Please enter your email address.');
      return;
    }

    setWaitlistStatus('submitting');
    setWaitlistMessage('');

    try {
      const attribution = readWaitlistAttribution();
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: submittedEmail, company, ...attribution }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'Unable to join the waitlist right now.');
      }

      setWaitlistStatus('success');
      setWaitlistMessage(result.message || 'You are on the NuTri waitlist.');
      setReferralInvite(result.referral || null);
      setInviteCopied(false);
      setEmail('');
    } catch (error) {
      setWaitlistStatus('error');
      setWaitlistMessage(error instanceof Error ? error.message : 'Unable to join the waitlist right now.');
    }
  };

  const handleCopyInvite = async () => {
    if (!referralInvite) return;

    try {
      await navigator.clipboard.writeText(referralInvite.inviteUrl);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = referralInvite.inviteUrl;
      textArea.setAttribute('readonly', 'true');
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    setInviteCopied(true);
    window.setTimeout(() => setInviteCopied(false), 1800);
  };

  return (
    <>
      <main className="relative flex-1 overflow-hidden pt-8 pb-4 md:pt-20 md:pb-6 lg:overflow-visible lg:pb-12">
        <section className="relative flex min-h-0 items-start pt-14 pb-5 sm:pt-16 sm:pb-7 md:pt-20 md:pb-8 lg:min-h-[720px] lg:items-center lg:pt-0 lg:pb-0">
          <div className="relative z-20 max-w-[680px]">
            <h1 className="animate-fade-up delay-100 font-['DM_Serif_Display'] leading-[1.02] tracking-[-0.02em] text-slate-900 mb-5 text-[clamp(50px,14vw,68px)] md:mb-6 md:text-[76px] lg:text-[85px]">Know what’s worth taking before you take it.</h1>
            <p className="animate-fade-up delay-200 font-inter text-[16px] sm:text-[18px] md:text-[20px] leading-[1.6] text-slate-900/65 max-w-[520px] mb-8 md:mb-10" style={{ fontWeight: 500 }}>
              NuTri is building a smarter supplement experience. Join the waitlist to get launch updates and a 3-day starting trial.
            </p>
            <div className="animate-fade-up delay-300 flex flex-col items-start gap-4">
            </div>
          </div>
          <div 
            className="animate-fade-up delay-400 pointer-events-none absolute top-[56%] z-10 hidden h-[680px] w-[680px] -translate-y-1/2 items-center justify-center lg:flex"
            style={{ 
              mixBlendMode: 'screen',
              right: 'clamp(-220px, calc((1600px - 100vw) * 0.45), 0px)'
            }}
          >
            <div className="relative w-full h-full flex items-center justify-center animate-float">
              <video 
                ref={videoRef}
                autoPlay 
                loop 
                muted 
                playsInline
                poster="/orb-poster.png"
                className="max-w-none h-[108%] w-[108%] object-contain"
                style={{ 
                  filter: 'hue-rotate(-55deg) saturate(250%) brightness(1.2) contrast(1.1)',
                  transform: 'scale(1.04)'
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
          <p className="font-inter text-[15px] md:text-[17px] leading-[1.6] text-slate-900/65 text-center max-w-[560px] mb-8 md:mb-10">
            Join the waitlist for launch access and a 3-day starting trial. Invite friends after signup to unlock up to 4 extra trial days before NuTri opens.
          </p>
          {incomingReferralCode && waitlistStatus !== 'success' && (
            <div className="mb-5 flex w-full max-w-[500px] items-start gap-3 rounded-[22px] border border-white/60 bg-white/35 px-4 py-3 text-left text-slate-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.75),0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-[18px]">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white" aria-hidden="true">
                <Users className="h-4 w-4" />
              </span>
              <div>
                <p className="font-inter text-sm font-bold">You came from a friend's invite.</p>
                <p className="mt-1 font-inter text-sm leading-[1.45] text-slate-900/65">
                  Join with your email and this signup will count toward their extra NuTri trial days.
                </p>
              </div>
            </div>
          )}
          <form className="w-full max-w-[500px] flex flex-col md:flex-row gap-3 md:gap-2 mb-4" onSubmit={handleWaitlistSubmit}>
            <input
              type="text"
              name="company"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <div className="relative flex-1 w-full">
              <input 
                type="email" 
                name="email"
                placeholder="Enter your email address" 
                required
                value={email}
                disabled={waitlistStatus === 'submitting'}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (waitlistStatus !== 'idle') {
                    setWaitlistStatus('idle');
                    setWaitlistMessage('');
                  }
                }}
                className="w-full h-[56px] md:h-[64px] px-6 rounded-full bg-white/60 border-2 border-black shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:bg-white/80 transition-all font-inter font-medium text-slate-900 placeholder:text-slate-900/35 placeholder:font-normal"
              />
            </div>
            <button 
              type="submit"
              disabled={waitlistStatus === 'submitting'}
              className="h-[56px] md:h-[64px] px-8 rounded-full bg-black hover:bg-neutral-800 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white font-semibold text-[15px] md:text-[16px] shadow-[inset_0_4px_4px_rgba(255,255,255,0.15),0_6px_16px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 whitespace-nowrap"
            >
              {waitlistStatus === 'submitting' ? 'Joining...' : waitlistStatus === 'success' ? "You're In" : 'Join the Waitlist'}
            </button>
          </form>
          {waitlistMessage && (
            <div
              className={`mb-5 flex w-full max-w-[500px] items-start gap-3 rounded-[22px] border px-4 py-3 text-left shadow-[inset_0_1px_1px_rgba(255,255,255,0.75),0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-[18px] ${
                waitlistStatus === 'success'
                  ? 'border-emerald-500/30 bg-emerald-50/75 text-emerald-950'
                  : 'border-red-500/30 bg-red-50/75 text-red-950'
              }`}
              role={waitlistStatus === 'error' ? 'alert' : 'status'}
              aria-live="polite"
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  waitlistStatus === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                }`}
                aria-hidden="true"
              >
                {waitlistStatus === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <CircleAlert className="h-4 w-4" />}
              </span>
              <div>
                <p className="font-inter text-sm font-bold">
                  {waitlistStatus === 'success' ? 'You are on the waitlist.' : 'Could not join yet.'}
                </p>
                <p className="mt-1 font-inter text-sm leading-[1.45] opacity-80">
                  {waitlistStatus === 'success' ? 'We saved your spot and will use this email for NuTri launch updates.' : waitlistMessage}
                </p>
              </div>
            </div>
          )}
          {waitlistStatus === 'success' && referralInvite && (
            <div className="mb-5 w-full max-w-[500px] rounded-[26px] border border-white/60 bg-white/35 p-4 text-left shadow-[inset_0_1px_1px_rgba(255,255,255,0.75),0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-[20px]">
              <div className="mb-4 flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white" aria-hidden="true">
                  <Gift className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-inter text-sm font-bold text-slate-950">Invite friends, unlock more trial days</p>
                  <p className="mt-1 font-inter text-sm leading-[1.45] text-slate-900/65">
                    Everyone starts with a 3-day trial. Confirmed friends who join from your link add bonus days at launch.
                  </p>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-3 gap-2">
                {referralInvite.tiers.map((tier) => (
                  <div key={tier.friends} className="rounded-[18px] border border-white/55 bg-white/40 px-3 py-3 text-center">
                    <p className="font-inter text-[11px] font-bold uppercase tracking-[0.08em] text-slate-900/45">
                      {tier.friends} {tier.friends === 1 ? 'friend' : 'friends'}
                    </p>
                    <p className="mt-1 font-inter text-lg font-black text-slate-950">+{tier.bonusDays}d</p>
                    <p className="font-inter text-[11px] font-semibold text-slate-900/50">{tier.totalTrialDays} days total</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="min-w-0 flex-1 rounded-full border border-slate-900/15 bg-white/60 px-4 py-3 font-inter text-xs font-semibold text-slate-900/65">
                  <span className="block truncate">{referralInvite.inviteUrl}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyInvite}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 font-inter text-sm font-bold text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Copy className="h-4 w-4" />
                  {inviteCopied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="mt-3 font-inter text-[12px] leading-[1.45] text-slate-900/45">
                We count unique confirmed waitlist signups from this link. Self-referrals do not count.
              </p>
            </div>
          )}
          <p className="text-xs text-slate-900/45 font-medium text-center">
            Free to join &middot; No spam &middot; Share your invite after signup
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
              <Link to="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
            </div>
            <span>&copy; 2026 NuTri. All rights reserved.</span>
          </div>
        </div>
      </section>
    </>
  );
}
