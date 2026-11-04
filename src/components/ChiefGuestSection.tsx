import { motion } from 'motion/react';

export default function ChiefGuestSection() {
  return (
    <section className="relative py-16 sm:py-24 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-3xl mx-auto rounded-[28px] p-[1px] bg-[linear-gradient(135deg,rgba(212,175,55,0.7),rgba(125,21,40,0.5)_40%,rgba(27,52,120,0.5)_60%,rgba(212,175,55,0.7))]"
      >
        <div className="relative rounded-[27px] bg-[#0b0a0d] px-6 py-14 sm:px-14 sm:py-16 text-center overflow-hidden">
          {/* Corner glows in the school colours */}
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[radial-gradient(closest-side,rgba(155,27,48,0.35),transparent)]" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-[radial-gradient(closest-side,rgba(30,58,138,0.4),transparent)]" />

          <p className="relative font-cinzel text-[11px] tracking-[0.45em] uppercase text-[#c9b177]">
            Chief Guest
          </p>
          <div className="relative mx-auto mt-4 mb-8 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-[#d4af37]/50" />
            <span className="w-1.5 h-1.5 rotate-45 bg-[#d4af37]" />
            <span className="h-px w-12 bg-[#d4af37]/50" />
          </div>

          <h3 className="relative font-cinzel text-2xl sm:text-4xl font-semibold tracking-[0.06em] text-gold-gradient leading-snug">
            Mr. Abeyrathna Jayasundara
          </h3>
          <p className="relative mt-5 font-serif-luxury italic text-lg sm:text-xl text-[#e6dcc8] leading-relaxed">
            Founder Chairman
          </p>
          <p className="relative font-cinzel text-xs sm:text-sm tracking-[0.2em] uppercase text-[#d8ccb4]">
            Analytical Instruments (Pvt) Ltd
          </p>
        </div>
      </motion.div>
    </section>
  );
}
