import React from 'react';
import { Sparkles } from 'lucide-react';

export default function CelebrationSection() {
  return (
    <section className="relative py-16 px-4 max-w-5xl mx-auto overflow-hidden z-10">
      {/* Background Soft Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Luxury Celebration Card Container */}
      <div className="relative rounded-3xl p-8 sm:p-12 md:p-16 bg-gradient-to-b from-[#14120f]/90 to-[#08080a]/95 border border-[#d4af37]/40 shadow-2xl overflow-hidden">
        {/* Ambient Golden Ribbons & Lights */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#d4af37]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-2 md:grid-cols-12 gap-4 md:gap-8 items-center">
          {/* Left: Dancing Couple Silhouette SVG */}
          <div className="col-span-1 md:col-span-3 flex justify-center md:justify-start order-2 md:order-1">
            <div className="relative w-32 sm:w-44 md:w-48 aspect-square flex items-center justify-center">
              {/* Golden Confetti Particles surrounding couple */}
              <div className="absolute inset-0 pointer-events-none">
                <span className="absolute top-2 left-6 w-1.5 h-1.5 rounded-full bg-[#fae596] animate-pulse"></span>
                <span className="absolute bottom-4 right-6 w-2 h-2 rounded-full bg-[#d4af37] animate-ping duration-1000"></span>
                <span className="absolute top-10 right-4 w-1 h-1 rounded-full bg-[#ffe898]"></span>
                <span className="absolute bottom-10 left-3 w-1.5 h-1.5 rounded-full bg-[#c59c35]"></span>
              </div>

              {/* Dancing Couple Vector Silhouette with Gold Shimmer */}
              <img
                src="/images/dancing_couple.jpg"
                alt="Elegant Dancing Couple"
                className="w-full h-full object-cover rounded-full shadow-[0_0_20px_rgba(212,175,55,0.5)] border-2 border-[#d4af37]/40"
              />
            </div>
          </div>

          {/* Center: Main Textual Message */}
          <div className="col-span-2 md:col-span-6 text-center order-1 md:order-2 mb-6 md:mb-0">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#f5d77f]" />
              <span className="text-[11px] font-cinzel font-semibold tracking-[0.25em] text-[#fae596] uppercase">
                Gala Night Experience
              </span>
            </div>

            <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-black text-gold-shimmer leading-snug tracking-wide mb-4">
              AN EVENING OF CELEBRATION,
              <br />
              <span className="font-script text-4xl sm:text-5xl lg:text-6xl text-gold-gradient normal-case font-normal block my-1">
                Connection & Memories
              </span>
            </h2>

            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto my-4" />

            <p className="text-sm sm:text-base text-[#e6d5b8] font-sans-modern leading-relaxed max-w-lg mx-auto">
              Let's come together to celebrate our collective achievements, honor our milestones, and create unforgettable memories that last a lifetime!
            </p>
          </div>

          {/* Right: Clinking Champagne Glasses SVG */}
          <div className="col-span-1 md:col-span-3 flex justify-center md:justify-end order-3">
            <div className="relative w-32 sm:w-44 md:w-48 aspect-square flex items-center justify-center">
              {/* Sparkle bursts around champagne */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center">
                <span className="w-2.5 h-2.5 bg-[#fff8db] rounded-full animate-ping duration-700" />
              </div>

              {/* Toasting Champagne Flutes Vector */}
              <img
                src="/images/champagne_glasses.jpg"
                alt="Clinking Champagne Glasses"
                className="w-full h-full object-cover rounded-full shadow-[0_0_20px_rgba(212,175,55,0.5)] border-2 border-[#d4af37]/40"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
