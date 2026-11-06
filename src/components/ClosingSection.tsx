import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import Crest from './Crest';

interface ClosingSectionProps {
  onReplayIntro: () => void;
}

export default function ClosingSection({ onReplayIntro }: ClosingSectionProps) {
  return (
    <section className="relative text-center">
      {/* Full-bleed night sky + college building, anchored to the bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen overflow-hidden -z-10"
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,#071242_25%,#0a1850_60%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col items-center px-4 pt-20 sm:pt-28"
      >
        {/* Script heading with gold swoosh */}
        <h2 className="font-script text-[clamp(2.6rem,11vw,4.5rem)] leading-[1.1] text-gold-gradient drop-shadow-[0_3px_10px_rgba(0,0,0,0.6)]">
          Your presence is our honour
        </h2>
        <svg viewBox="0 0 300 20" className="w-[min(70%,360px)] h-5 -mt-1" aria-hidden="true">
          <defs>
            <linearGradient id="swoosh" x1="0" x2="1">
              <stop offset="0%" stopColor="#e8c15a" stopOpacity="0" />
              <stop offset="45%" stopColor="#fff1b8" />
              <stop offset="100%" stopColor="#e8c15a" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M5 16 Q150 -4 295 8" fill="none" stroke="url(#swoosh)" strokeWidth="2" />
        </svg>

        <p className="mt-6 max-w-md font-serif-luxury text-lg sm:text-xl text-[#f4efe6] leading-relaxed [text-shadow:0_2px_8px_rgba(0,0,0,0.7)]">
          Join us as we celebrate the students who carried the colours of Maliyadeva with pride.
        </p>

        {/* Gold button flanked by glowing lines */}
        <div className="mt-10 flex items-center gap-3 w-full max-w-lg">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#f5d77f] shadow-[0_0_8px_rgba(245,215,127,0.8)]" />
          <button
            onClick={onReplayIntro}
            className="shrink-0 inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gold-gradient hover:bg-gold-gradient-hover text-[#120f04] font-cinzel text-sm font-bold tracking-[0.22em] uppercase gold-button-glow border border-[#fff1b8]/70 transition-transform hover:-translate-y-0.5"
          >
            <Play className="w-4 h-4 fill-current" />
            Replay Intro
          </button>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#f5d77f] shadow-[0_0_8px_rgba(245,215,127,0.8)]" />
        </div>

        {/* Crest, diamond divider, date */}
        <Crest className="mt-12 h-28 sm:h-32 w-auto aspect-[372/420] drop-shadow-[0_6px_20px_rgba(212,175,55,0.35)]" />
        <div className="mt-6 flex items-center gap-2 w-[min(85%,420px)]">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#e8c15a]" />
          <span className="w-2 h-2 rotate-45 border border-[#f5d77f]" />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#e8c15a]" />
        </div>
        <p className="mt-4 font-cinzel text-xs sm:text-sm tracking-[0.3em] uppercase text-[#e8c15a] whitespace-nowrap">
          02 · 12 · 2026 &nbsp;|&nbsp; Maliyadeva College
        </p>
      </motion.div>

      {/* College building at night — tree tops rise softly behind the date line */}
      <div className="relative left-1/2 -translate-x-1/2 w-screen -mt-[min(22vw,190px)]">
        {/* Side fade on wide screens so the photo blends into the page */}
        <div className="max-w-[1000px] mx-auto md:[mask-image:linear-gradient(to_right,transparent_0%,black_14%,black_86%,transparent_100%)] md:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_14%,black_86%,transparent_100%)]">
          <img
            src="/decor/campus.jpg"
            alt="Maliyadeva College at night"
            className="block w-full select-none pointer-events-none [mask-image:linear-gradient(to_bottom,transparent_0%,black_30%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_30%)]"
          />
        </div>
      </div>

      {/* Credit */}
      <p className="relative z-10 py-5 font-sans-modern text-[11px] sm:text-xs tracking-[0.2em] uppercase text-[#c9b177]">
        Design by{' '}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://wa.me/94707819074"
          className="text-[#f4efe6] underline decoration-[#d4af37]/60 underline-offset-4 hover:text-[#fae596] hover:decoration-[#fae596] transition-colors"
        >
          invitemint
        </a>
      </p>
    </section>
  );
}
