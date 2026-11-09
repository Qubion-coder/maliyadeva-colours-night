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
  tone: (['gold', 'rose', 'gold', 'sky'] as const)[i % 4],
}));

const TITLE = 'COLOURS';
/** Jewel tone per letter — the school colours: ruby, gold, royal blue */
const LETTER_TONES = ['ruby', 'gold', 'sapphire', 'ruby', 'gold', 'sapphire', 'ruby'] as const;
/** Where the little star glints sparkle (letter index → position) */
const GLINTS: Record<number, { top: string; left: string; delay: string }> = {
  0: { top: '12%', left: '62%', delay: '5s' },
  2: { top: '8%', left: '18%', delay: '7.2s' },
  4: { top: '14%', left: '70%', delay: '6.1s' },
  6: { top: '20%', left: '58%', delay: '8.3s' },
};

export default function HeroSection() {
  const t = useCountdown(EVENT_DATE);
  const reduce = useReducedMotion();

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-16">
      {/* ===== Living background ===== */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen -z-10 overflow-hidden">
        {/* Drifting colour smoke (maroon · gold · royal blue), like the intro video */}
        <div className="hero-smoke hero-smoke-rose" />
        <div className="hero-smoke hero-smoke-gold" />
        <div className="hero-smoke hero-smoke-blue" />

        {/* Coloured stage spotlights sweeping slowly */}
        <div className="hero-beam hero-beam-left" />
        <div className="hero-beam hero-beam-center" />
        <div className="hero-beam hero-beam-right" />

        {/* Silk ribbons (maroon · royal blue · gold) waving in from the top corners */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="ribMaroon" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff4d6d" />
              <stop offset="35%" stopColor="#c8102e" />
              <stop offset="100%" stopColor="#5a0716" />
            </linearGradient>
            <linearGradient id="ribBlue" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7aa2ff" />
              <stop offset="40%" stopColor="#2a5bea" />
              <stop offset="100%" stopColor="#0b1d6b" />
            </linearGradient>
            <linearGradient id="ribGold" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8a6318" />
              <stop offset="40%" stopColor="#fff1b8" />
              <stop offset="70%" stopColor="#e8b931" />
              <stop offset="100%" stopColor="#8a6318" />
            </linearGradient>
          </defs>
        </svg>
        <svg className="hero-ribbon hero-ribbon-left" viewBox="0 0 360 270" preserveAspectRatio="xMinYMin meet">
          <path d="M0 0 H360 C300 30 235 55 170 95 C105 135 50 195 0 262 Z" fill="url(#ribBlue)" />
          <path d="M0 0 H360 C300 30 235 55 170 95" fill="none" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="3" />
          <path d="M0 0 H235 C190 35 140 65 100 105 C60 145 28 185 0 228 Z" fill="url(#ribMaroon)" />
          <path d="M60 0 C40 40 20 70 0 100" fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="10" strokeLinecap="round" />
          <path d="M238 -4 C190 35 140 66 100 106 C60 146 28 186 -4 232" fill="none" stroke="url(#ribGold)" strokeWidth="6" strokeLinecap="round" />
          <path d="M258 -4 C205 40 155 72 115 112 C75 152 40 196 6 245" fill="none" stroke="url(#ribGold)" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
        </svg>
        <svg className="hero-ribbon hero-ribbon-right" viewBox="0 0 360 270" preserveAspectRatio="xMinYMin meet">
          <path d="M0 0 H360 C300 30 235 55 170 95 C105 135 50 195 0 262 Z" fill="url(#ribMaroon)" />
          <path d="M0 0 H360 C300 30 235 55 170 95" fill="none" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="3" />
          <path d="M0 0 H235 C190 35 140 65 100 105 C60 145 28 185 0 228 Z" fill="url(#ribBlue)" />
          <path d="M60 0 C40 40 20 70 0 100" fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="10" strokeLinecap="round" />
          <path d="M238 -4 C190 35 140 66 100 106 C60 146 28 186 -4 232" fill="none" stroke="url(#ribGold)" strokeWidth="6" strokeLinecap="round" />
          <path d="M258 -4 C205 40 155 72 115 112 C75 152 40 196 6 245" fill="none" stroke="url(#ribGold)" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
        </svg>
        {/* Central warm glow */}
        <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[min(110vw,760px)] h-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(255,214,120,0.18),transparent)] animate-[heroBreath_7s_ease-in-out_infinite]" />
        {/* School-colour light pools */}
        <div className="absolute top-[30%] -left-40 w-[460px] h-[460px] rounded-full bg-[radial-gradient(closest-side,rgba(190,25,50,0.4),transparent)] animate-[heroBreath_9s_ease-in-out_infinite]" />
        <div className="absolute top-[40%] -right-40 w-[460px] h-[460px] rounded-full bg-[radial-gradient(closest-side,rgba(40,85,230,0.4),transparent)] animate-[heroBreath_9s_ease-in-out_4.5s_infinite]" />
        {/* Rising gold sparkles */}
        {SPARKLES.map((s, i) => (
          <span
            key={i}
            className={`hero-sparkle hero-sparkle-${s.tone}`}
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
        <span aria-hidden="true" className="relative flex justify-center text-[clamp(3rem,14.5vw,8.5rem)] tracking-[0.06em] colours-word">
          {/* soft glow behind the word */}
          <span className="absolute inset-x-[10%] inset-y-[20%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(255,200,90,0.35),transparent)] blur-2xl animate-[heroBreath_6s_ease-in-out_infinite]" />
          {TITLE.split('').map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 50, filter: 'blur(14px)', rotateX: 70 }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', rotateX: 0 }}
              transition={{ duration: 1.6, delay: 2.0 + i * 0.18, ease: EASE }}
              className="relative inline-block"
            >
              {/* gold bevel rim sits behind the coloured letter */}
              <span className="jewel-rim">{ch}</span>
              <span
                className={`relative jewel-letter jewel-${LETTER_TONES[i % LETTER_TONES.length]}`}
                style={{ animationDelay: `${3.6 + i * 0.12}s` }}
              >
                {ch}
              </span>
              {/* Twinkling star glints on a few letters */}
              {GLINTS[i] && (
                <svg
                  viewBox="0 0 24 24"
                  className="jewel-glint"
                  style={{ top: GLINTS[i].top, left: GLINTS[i].left, animationDelay: GLINTS[i].delay }}
                >
                  <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" fill="#fff" />
                </svg>
              )}
            </motion.span>
          ))}
        </span>
        {/* Ceremonial sash: maroon → royal blue with gold borders; always one line */}
        <motion.span
          aria-hidden="true"
          initial={{ opacity: 0, scaleX: 0.4 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.8, delay: 3.4, ease: EASE }}
          className="mt-5 flex justify-center"
        >
          <span className="ceremony-sash">
            <span className="ceremony-sash-inner hero-sheen">
              <span className="relative text-gold-gradient font-semibold whitespace-nowrap text-[min(3.9vw,1.75rem)] tracking-[0.24em] pl-[0.24em]">
                Awarding Ceremony
              </span>
            </span>
          </span>
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
        className="relative mt-12 w-full max-w-md"
      >
        <p className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.35em] uppercase text-[#f3e5ab] mb-4 [text-shadow:0_2px_8px_rgba(0,0,0,0.8)]">
          Wednesday · 2nd December 2026
        </p>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {[
            ['Days', t.days],
            ['Hours', t.hours],
            ['Minutes', t.minutes],
            ['Seconds', t.seconds],
          ].map(([label, val], i) => {
            const text = String(val).padStart(2, '0');
            const accent = ['#c8102e', '#e8b931', '#2f6bff', '#e8b931'][i];
            return (
              <div
                key={label as string}
                className="hero-sheen relative flex flex-col items-center rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(20,38,120,0.55),rgba(5,11,42,0.85))] backdrop-blur-md py-3 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                style={{ boxShadow: `0 10px 30px rgba(0,0,0,0.45), 0 0 22px ${accent}33` }}
              >
                <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
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
