import { motion } from 'motion/react';
import { Play } from 'lucide-react';
import Crest from './Crest';

interface ClosingSectionProps {
  onReplayIntro: () => void;
}

export default function ClosingSection({ onReplayIntro }: ClosingSectionProps) {
  return (
    <section className="relative py-20 sm:py-28 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center"
      >
        <p className="font-script text-4xl sm:text-5xl text-gold-subtle">Your presence is our honour</p>
        <p className="mt-5 max-w-md font-serif-luxury text-lg text-[#d8ccb4] leading-relaxed">
          Join us as we celebrate the students who carried the colours of Maliyadeva with pride.
        </p>

        <button
          onClick={onReplayIntro}
          className="mt-10 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-gradient hover:bg-gold-gradient-hover text-[#120f04] font-cinzel text-[11px] font-bold tracking-[0.25em] uppercase gold-button-glow transition-transform hover:-translate-y-0.5"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          Replay Intro
        </button>

        <div className="mt-16 flex flex-col items-center gap-3 opacity-80">
          <Crest className="w-14 h-16" />
          <div className="tricolour-rule w-24" />
          <p className="font-cinzel text-[10px] tracking-[0.4em] uppercase text-[#a88a44]">
            02 · 12 · 2026 &nbsp;|&nbsp; Maliyadeva College
          </p>
        </div>
      </motion.div>
    </section>
  );
}
