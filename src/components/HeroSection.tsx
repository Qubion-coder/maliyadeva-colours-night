import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import Crest from './Crest';

export const EVENT_DATE = new Date('2026-12-02T15:30:00+05:30');

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] as const },
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

export default function HeroSection() {
  const t = useCountdown(EVENT_DATE);

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-16">
      {/* Spotlight beam echoing the intro video */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(90vw,520px)] h-[80vh] pointer-events-none -z-10 bg-[linear-gradient(180deg,rgba(255,236,170,0.16),rgba(212,175,55,0.05)_55%,transparent)] [clip-path:polygon(42%_0,58%_0,100%_100%,0_100%)] blur-xl" />

      <motion.div {...fadeUp(0.1)}>
        <Crest className="w-28 h-32 sm:w-36 sm:h-40 mx-auto drop-shadow-[0_6px_20px_rgba(212,175,55,0.35)]" />
      </motion.div>

      <motion.p
        {...fadeUp(0.3)}
        className="mt-6 font-cinzel text-xs sm:text-sm tracking-[0.45em] uppercase text-[#f4efe6] [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]"
      >
        Maliyadeva College
      </motion.p>

      <motion.p
        {...fadeUp(0.45)}
        className="mt-2 font-serif-luxury italic text-base sm:text-lg text-[#f3e5ab] [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]"
      >
        cordially invites you to the
      </motion.p>

      <motion.h1
        {...fadeUp(0.6)}
        className="mt-6 font-cinzel font-bold uppercase leading-[0.95] tracking-[0.08em]"
      >
        <span className="block text-5xl sm:text-7xl md:text-8xl text-gold-shimmer drop-shadow-[0_6px_18px_rgba(0,0,0,0.85)]">
          Colours
        </span>
        <span className="block mt-3 text-lg sm:text-2xl md:text-3xl tracking-[0.35em] text-[#f4efe6] [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]">
          Awarding Ceremony
        </span>
      </motion.h1>

      <motion.div {...fadeUp(0.8)} className="mt-7 flex items-center gap-4">
        <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#d4af37]" />
        <span className="font-serif-luxury text-2xl sm:text-3xl text-gold-subtle tracking-widest">
          2024 / 2025
        </span>
        <span className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#d4af37]" />
      </motion.div>

      <motion.div {...fadeUp(0.9)} className="tricolour-rule w-48 sm:w-64 mt-7" />

      {/* Countdown */}
      <motion.div {...fadeUp(1.05)} className="mt-12 w-full max-w-md rounded-2xl border border-[#d4af37]/30 bg-[#050b2a]/75 backdrop-blur-md px-2 pt-4 pb-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        <p className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.35em] uppercase text-[#f3e5ab] mb-3">
          Wednesday · 2nd December 2026
        </p>
        <div className="grid grid-cols-4 divide-x divide-[#d4af37]/20 border-t border-[#d4af37]/20 pt-3">
          {[
            ['Days', t.days],
            ['Hours', t.hours],
            ['Minutes', t.minutes],
            ['Seconds', t.seconds],
          ].map(([label, val]) => (
            <div key={label as string} className="flex flex-col items-center">
              <span className="font-cinzel text-2xl sm:text-3xl font-semibold text-gold-gradient tabular-nums">
                {String(val).padStart(2, '0')}
              </span>
              <span className="mt-1 text-[9px] tracking-[0.25em] uppercase text-neutral-400 font-sans-modern">
                {label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.button
        {...fadeUp(1.3)}
        onClick={() => document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Scroll to event details"
        className="mt-14 flex flex-col items-center gap-1 text-[#d4af37]/70 hover:text-[#fae596] transition-colors"
      >
        <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase">Details</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </motion.button>
    </section>
  );
}
