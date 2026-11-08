import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import Crest from './Crest';

export const EVENT_DATE = new Date('2026-12-02T15:00:00+05:30');

const EASE = [0.22, 1, 0.36, 1] as const;

/** Slow, cinematic fade-up */
const fadeUp = (delay = 0, duration = 1.8) => ({
  initial: { opacity: 0, y: 30, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration, delay, ease: EASE },
});

/** A line that draws outward from its centre */
const drawLine = (delay = 0) => ({
  initial: { scaleX: 0, opacity: 0 },
  animate: { scaleX: 1, opacity: 1 },
  transition: { duration: 1.6, delay, ease: EASE },
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
const SPARKLES = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 37) % 100,
  size: 2 + ((i * 7) % 4),
  delay: (i * 1.3) % 14,
  duration: 12 + ((i * 5) % 10),
}));

const TITLE = 'COLOURS';

export default function HeroSection() {
  const t = useCountdown(EVENT_DATE);
  const reduce = useReducedMotion();

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 overflow-hidden">
      {/* ===== Living background ===== */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {/* Two slowly sweeping stage spotlights */}
        <div className="hero-beam hero-beam-left" />
        <div className="hero-beam hero-beam-right" />
        {/* Central warm glow */}
        <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[min(110vw,760px)] h-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(255,214,120,0.18),transparent)] animate-[heroBreath_7s_ease-in-out_infinite]" />
        {/* School-colour light pools */}
        <div className="absolute top-[30%] -left-40 w-[460px] h-[460px] rounded-full bg-[radial-gradient(closest-side,rgba(190,25,50,0.4),transparent)] animate-[heroBreath_9s_ease-in-out_infinite]" />
        <div className="absolute top-[40%] -right-40 w-[460px] h-[460px] rounded-full bg-[radial-gradient(closest-side,rgba(40,85,230,0.4),transparent)] animate-[heroBreath_9s_ease-in-out_4.5s_infinite]" />
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
      </div>

      {/* ===== Crest with rotating golden rays ===== */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, filter: 'blur(12px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 2.4, delay: 0.2, ease: EASE }}
        className="relative"
      >
        <div className="absolute -inset-20 sm:-inset-24 rounded-full bg-[repeating-conic-gradient(from_0deg,rgba(255,225,150,0.28)_0deg_3deg,transparent_3deg_14deg)] [mask-image:radial-gradient(closest-side,black_15%,transparent_75%)] [-webkit-mask-image:radial-gradient(closest-side,black_15%,transparent_75%)] animate-[spin_60s_linear_infinite]" />
        <div className="absolute -inset-8 rounded-full bg-[radial-gradient(closest-side,rgba(255,214,120,0.55),rgba(255,190,80,0.15)_55%,transparent)] animate-[heroBreath_5s_ease-in-out_infinite]" />
        <Crest className="relative w-28 h-32 sm:w-36 sm:h-40 mx-auto drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)] animate-float-slow" />
      </motion.div>

      <motion.p
        {...fadeUp(1.2)}
        className="mt-8 font-cinzel text-xs sm:text-sm tracking-[0.45em] uppercase text-[#f4efe6] [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]"
      >
        Maliyadeva College
      </motion.p>

      <motion.p
        {...fadeUp(1.6)}
        className="mt-2 font-serif-luxury italic text-base sm:text-lg text-[#f3e5ab] [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]"
      >
        cordially invites you to the
      </motion.p>

      {/* ===== Title ===== */}
      <h1 className="mt-6 font-cinzel font-bold uppercase leading-[0.95]">
        <span className="sr-only">Colours Awarding Ceremony</span>
        <span aria-hidden="true" className="relative flex justify-center text-[clamp(3rem,14.5vw,8.5rem)] tracking-[0.06em]">
          {/* soft glow behind the word */}
          <span className="absolute inset-x-[10%] inset-y-[20%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(255,200,90,0.35),transparent)] blur-2xl animate-[heroBreath_6s_ease-in-out_infinite]" />
          {TITLE.split('').map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 50, filter: 'blur(14px)', rotateX: 70 }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', rotateX: 0 }}
              transition={{ duration: 1.6, delay: 2.0 + i * 0.18, ease: EASE }}
              className="inline-block text-gold-shimmer-slow drop-shadow-[0_6px_18px_rgba(0,0,0,0.85)]"
            >
              {ch}
            </motion.span>
          ))}
        </span>
        <motion.span
          aria-hidden="true"
          initial={{ opacity: 0, letterSpacing: '0.9em' }}
          animate={{ opacity: 1, letterSpacing: '0.35em' }}
          transition={{ duration: 2.6, delay: 3.4, ease: EASE }}
          className="block mt-4 text-lg sm:text-2xl md:text-3xl text-[#f4efe6] [text-shadow:0_2px_12px_rgba(0,0,0,0.9)] pl-[0.35em]"
        >
          Awarding Ceremony
        </motion.span>
      </h1>

      <div className="mt-8 flex items-center gap-4">
        <motion.span {...drawLine(4.2)} className="h-px w-10 sm:w-20 bg-gradient-to-r from-transparent to-[#f5d77f] origin-right" />
        <motion.span {...fadeUp(4.0, 1.6)} className="font-serif-luxury text-2xl sm:text-3xl text-gold-subtle tracking-widest">
          2024 / 2025
        </motion.span>
        <motion.span {...drawLine(4.2)} className="h-px w-10 sm:w-20 bg-gradient-to-l from-transparent to-[#f5d77f] origin-left" />
      </div>

      <motion.div {...drawLine(4.6)} className="tricolour-rule w-56 sm:w-72 mt-7 h-[3px]" />

      {/* ===== Countdown ===== */}
      <motion.div
        {...fadeUp(5.0, 1.8)}
        className="hero-sheen relative mt-12 w-full max-w-md rounded-2xl border border-[#d4af37]/40 bg-[#050b2a]/75 backdrop-blur-md px-2 pt-4 pb-4 shadow-[0_10px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(212,175,55,0.12)] overflow-hidden"
      >
        <p className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.35em] uppercase text-[#f3e5ab] mb-3">
          Wednesday · 2nd December 2026
        </p>
        <div className="grid grid-cols-4 divide-x divide-[#d4af37]/20 border-t border-[#d4af37]/20 pt-3">
          {[
            ['Days', t.days],
            ['Hours', t.hours],
            ['Minutes', t.minutes],
            ['Seconds', t.seconds],
          ].map(([label, val]) => {
            const text = String(val).padStart(2, '0');
            return (
              <div key={label as string} className="flex flex-col items-center">
                <span className="relative h-9 sm:h-10 overflow-hidden font-cinzel text-2xl sm:text-3xl font-semibold tabular-nums">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={text}
                      initial={reduce ? false : { y: '-100%', opacity: 0, filter: 'blur(4px)' }}
                      animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                      exit={reduce ? undefined : { y: '100%', opacity: 0, filter: 'blur(4px)' }}
                      transition={{ duration: 0.7, ease: EASE }}
                      className="block text-gold-gradient"
                    >
                      {text}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="mt-1 text-[9px] tracking-[0.25em] uppercase text-neutral-400 font-sans-modern">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.button
        {...fadeUp(5.8, 1.4)}
        onClick={() => document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Scroll to event details"
        className="mt-14 flex flex-col items-center gap-1 text-[#d4af37]/80 hover:text-[#fae596] transition-colors"
      >
        <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase">Details</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </motion.button>
    </section>
  );
}
