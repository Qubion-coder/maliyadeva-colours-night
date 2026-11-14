import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import Crest from './Crest';

export const EVENT_DATE = new Date('2026-12-02T15:00:00+05:30');

/** Very soft ease-out: starts gently and glides to a stop */
const EASE = [0.16, 1, 0.3, 1] as const;
/** Pace of the entrance: durations ×1.5, start times ×1.35 (slower, more graceful) */
const DUR = 1.5;
const AT = 1.35;

/** Slow, cinematic fade-up */
const fadeUp = (delay = 0, duration = 1.8) => ({
  initial: { opacity: 0, y: 26, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: duration * DUR, delay: delay * AT, ease: EASE },
});

/** A line that draws outward from its centre */
const drawLine = (delay = 0) => ({
  initial: { scaleX: 0, opacity: 0 },
  animate: { scaleX: 1, opacity: 1 },
  transition: { duration: 1.6 * DUR, delay: delay * AT, ease: EASE },
});

function useCountdown(target: Date) {
  const calc = () => {
    const diff = Math.max(0, +target - Date.now());
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff / 3_600_000) % 24),
      minutes: Math.floor((diff / 60_000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/** Fixed sparkle positions so they don't jump between renders */
const SPARKLES = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 37) % 100,
  size: 2 + ((i * 7) % 3),
  delay: (i * 1.3) % 14,
  duration: 20 + ((i * 5) % 12),
}));

const TITLE = 'COLOURS';

/** Thin line – diamond – thin line */
function DiamondDivider({ delay, wide = false }: { delay: number; wide?: boolean }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${wide ? 'w-[min(88%,520px)]' : 'w-[min(70%,340px)]'}`}>
      <motion.span {...drawLine(delay)} className="h-px flex-1 origin-right bg-gradient-to-r from-transparent via-[#c9a14a] to-[#f5d77f]" />
      <motion.svg {...fadeUp(delay, 1.2)} viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
        <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="url(#heroGold)" />
      </motion.svg>
      <motion.span {...drawLine(delay)} className="h-px flex-1 origin-left bg-gradient-to-l from-transparent via-[#c9a14a] to-[#f5d77f]" />
    </div>
  );
}

/** Ornate flourish divider under the title */
function FlourishDivider({ delay }: { delay: number }) {
  return (
    <div className="flex items-center justify-center gap-2 w-[min(92%,600px)]">
      <motion.span {...drawLine(delay)} className="h-[1.5px] flex-1 origin-right bg-gradient-to-r from-transparent via-[#c9a14a] to-[#f5d77f]" />
      <motion.svg {...fadeUp(delay, 1.3)} viewBox="0 0 120 40" className="w-20 h-7 shrink-0" aria-hidden="true">
        <g fill="none" stroke="url(#heroGold)" strokeWidth="2" strokeLinecap="round">
          <path d="M60 6 C54 14 54 20 60 26 C66 20 66 14 60 6 Z" fill="url(#heroGold)" />
          <path d="M60 30 C52 30 44 34 40 26 C37 20 44 16 48 20 C51 23 48 27 45 26" />
          <path d="M60 30 C68 30 76 34 80 26 C83 20 76 16 72 20 C69 23 72 27 75 26" />
          <path d="M40 26 C30 30 20 26 6 26" />
          <path d="M80 26 C90 30 100 26 114 26" />
        </g>
        <circle cx="60" cy="33" r="2.4" fill="url(#heroGold)" />
      </motion.svg>
      <motion.span {...drawLine(delay)} className="h-[1.5px] flex-1 origin-left bg-gradient-to-l from-transparent via-[#c9a14a] to-[#f5d77f]" />
    </div>
  );
}

/** Flowing gold satin ribbon for the corners */
function GoldRibbon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 300 300" className={className} aria-hidden="true" preserveAspectRatio="xMinYMin meet">
      <path d="M0 210 C60 170 90 120 130 80 C170 40 220 15 300 0 L300 14 C228 28 182 54 144 92 C104 132 72 182 0 228 Z" fill="url(#heroRibbonGold)" />
      <path d="M0 228 C72 182 104 132 144 92" fill="none" stroke="#fff6d0" strokeOpacity="0.55" strokeWidth="1.2" />
      <path d="M0 250 C50 222 80 190 108 152" fill="none" stroke="url(#heroRibbonGold)" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

export default function HeroSection() {
  const t = useCountdown(EVENT_DATE);
  const reduce = useReducedMotion();

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-4 pt-20 pb-14">
      {/* Shared gold gradients */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <linearGradient id="heroGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff6d0" />
            <stop offset="45%" stopColor="#f0c55a" />
            <stop offset="100%" stopColor="#a87a1f" />
          </linearGradient>
          <linearGradient id="heroRibbonGold" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#7a5410" />
            <stop offset="30%" stopColor="#e8b931" />
            <stop offset="50%" stopColor="#fff3c4" />
            <stop offset="70%" stopColor="#d9a52a" />
            <stop offset="100%" stopColor="#8a6318" />
          </linearGradient>
        </defs>
      </svg>

      {/* ===== Royal-blue silk backdrop ===== */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen -z-10 overflow-hidden">
        <div className="hero-silk" />
        {/* Gold spotlight from above */}
        <div className="hero-spot" />
        {/* Faint college silhouette behind the countdown */}
        <img
          src="/decor/campus.jpg"
          alt=""
          className="hero-silhouette"
        />
        {/* Gold satin ribbon in the bottom-right corner */}
        <GoldRibbon className="absolute bottom-0 right-0 w-[min(46vw,330px)] h-auto -scale-x-100 opacity-95 drop-shadow-[0_-6px_14px_rgba(0,0,0,0.5)]" />
        {/* Rising gold sparkles */}
        {SPARKLES.map((s, i) => (
          <span
            key={i}
            className="hero-sparkle"
            style={{
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
        {/* soft fade into the next section */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#050b2a]" />
      </div>

      {/* ===== Crest ===== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, filter: 'blur(12px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 2.2 * DUR, delay: 0.6 * AT, ease: EASE }}
        className="relative"
      >
        <div className="absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgba(255,214,120,0.45),rgba(255,190,80,0.12)_55%,transparent)] animate-[heroBreath_10s_ease-in-out_infinite]" />
        <Crest className="relative h-[clamp(110px,17vh,170px)] w-auto aspect-[372/420] mx-auto drop-shadow-[0_10px_24px_rgba(0,0,0,0.6)] crest-float" />
      </motion.div>

      {/* ===== Invitation line ===== */}
      <motion.p
        {...fadeUp(1.4)}
        className="mt-7 font-cinzel font-semibold text-[min(5.2vw,1.9rem)] tracking-[0.2em] pl-[0.2em] uppercase text-gold-gradient whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
      >
        Maliyadeva College
      </motion.p>
      <motion.p
        {...fadeUp(1.8)}
        className="mt-2 font-serif-luxury italic text-[min(5.6vw,1.75rem)] text-[#f0cf7a] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
      >
        cordially invites you to the
      </motion.p>

      <div className="mt-4 w-full flex justify-center">
        <DiamondDivider delay={2.2} />
      </div>

      {/* ===== Title ===== */}
      <h1 className="mt-3 w-full font-cinzel font-bold uppercase leading-none">
        <span className="sr-only">Colours Awarding Ceremony</span>
        <span aria-hidden="true" className="relative flex justify-center text-[clamp(3.2rem,16vw,8.5rem)] tracking-[0.03em]">
          <span className="absolute inset-x-[5%] inset-y-[10%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(255,200,90,0.32),transparent)] blur-2xl animate-[heroBreath_10s_ease-in-out_infinite]" />
          {TITLE.split('').map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.6 * DUR, delay: (2.5 + i * 0.2) * AT, ease: EASE }}
              className="inline-block"
            >
              <span className="gold-3d" style={{ animationDelay: `${7 + i * 0.15}s` }}>
                {ch}
              </span>
            </motion.span>
          ))}
        </span>
        {/* Golden light streak spreading out to both sides */}
        <span aria-hidden="true" className="relative block w-full h-[clamp(22px,5vw,36px)]">
          <motion.span
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 2.2 * DUR, delay: 3.8 * AT, ease: EASE }}
            className="gold-streak"
          >
            <span className="gold-streak-glow" />
            <span className="gold-streak-line" />
            <span className="gold-streak-core" />
          </motion.span>
        </span>
        <motion.span
          aria-hidden="true"
          initial={{ opacity: 0, letterSpacing: '0.4em' }}
          animate={{ opacity: 1, letterSpacing: '0.16em' }}
          transition={{ duration: 2.2 * DUR, delay: 4.0 * AT, ease: EASE }}
          className="block whitespace-nowrap font-cinzel font-semibold text-[min(5.1vw,2.6rem)] pl-[0.16em] text-gold-gradient drop-shadow-[0_3px_10px_rgba(0,0,0,0.65)]"
        >
          Awarding Ceremony
        </motion.span>
      </h1>

      <div className="mt-4 w-full flex justify-center">
        <FlourishDivider delay={4.4} />
      </div>

      {/* ===== Year ===== */}
      <div className="mt-4 flex items-center justify-center gap-4 w-[min(88%,560px)]">
        <motion.span {...drawLine(4.8)} className="h-px flex-1 origin-right bg-gradient-to-r from-transparent to-[#d9b45a]" />
        <motion.span {...fadeUp(4.7, 1.6)} className="font-cinzel font-semibold text-[min(6.4vw,2.2rem)] tracking-[0.12em] text-gold-gradient whitespace-nowrap">
          2024 / 2025
        </motion.span>
        <motion.span {...drawLine(4.8)} className="h-px flex-1 origin-left bg-gradient-to-l from-transparent to-[#d9b45a]" />
      </div>

      {/* ===== Countdown box ===== */}
      <motion.div
        {...fadeUp(5.3, 1.8)}
        className="hero-sheen relative mt-10 sm:mt-14 w-full max-w-xl rounded-2xl p-[1.5px] bg-[linear-gradient(135deg,#8a6318,#fff1b8_25%,#d9a52a_50%,#fff1b8_75%,#8a6318)] shadow-[0_14px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(212,175,55,0.18)] overflow-hidden"
      >
        <div className="rounded-[15px] bg-[linear-gradient(180deg,rgba(8,16,60,0.92),rgba(4,9,36,0.96))] px-3 sm:px-6 pt-4 pb-4">
          <p className="font-cinzel text-[min(3.6vw,1.05rem)] tracking-[0.22em] uppercase text-[#f0cf7a] whitespace-nowrap">
            Wednesday · 2nd December 2026
          </p>
          <div className="mt-3 h-px bg-gradient-to-r from-transparent via-[#d9b45a] to-transparent" />
          <div className="mt-3 grid grid-cols-4">
            {[
              ['Days', t.days],
              ['Hours', t.hours],
              ['Minutes', t.minutes],
              ['Seconds', t.seconds],
            ].map(([label, val], i) => {
              const text = String(val).padStart(2, '0');
              return (
                <div
                  key={label as string}
                  className={`flex flex-col items-center ${i > 0 ? 'border-l border-[#d9b45a]/60' : ''}`}
                >
                  <span className="relative h-[clamp(36px,9vw,52px)] overflow-hidden font-cinzel font-semibold text-[clamp(1.7rem,7.5vw,2.6rem)] leading-none tabular-nums">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={text}
                        initial={reduce ? false : { y: '-100%', opacity: 0, filter: 'blur(4px)' }}
                        animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                        exit={reduce ? undefined : { y: '100%', opacity: 0, filter: 'blur(4px)' }}
                        transition={{ duration: 0.9, ease: EASE }}
                        className="block pt-1 text-gold-gradient"
                      >
                        {text}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="mt-1 font-cinzel text-[min(2.8vw,0.85rem)] tracking-[0.18em] uppercase text-[#e6cf8f]">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <motion.button
        {...fadeUp(6.0, 1.4)}
        onClick={() => document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Scroll to event details"
        className="mt-10 flex flex-col items-center gap-1 text-[#d4af37]/80 hover:text-[#fae596] transition-colors"
      >
        <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase">Details</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </motion.button>
    </section>
  );
}
