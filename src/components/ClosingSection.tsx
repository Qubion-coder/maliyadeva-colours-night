import React, { useState } from 'react';
import { Heart, Share2, Copy, Check, ArrowUp, Sparkles, MessageCircle } from 'lucide-react';
import { CrownFlourish } from './OrnamentalDivider';

interface ClosingSectionProps {
  onScrollToTop: () => void;
}

export default function ClosingSection({ onScrollToTop }: ClosingSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      "👑 You are cordially invited to BILLIONAIRE'S NIGHT 2026 - Annual Staff Get Together of North Western II Region!\n\n📅 Date: 14 November 2026 (6:00 PM onwards)\n📍 Venue: Asliya Golden Cassandra, Kurunegala\n\nOpen your VIP digital invitation here:\n" +
        window.location.href
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <footer className="relative py-16 px-4 max-w-4xl mx-auto text-center z-10 border-t border-[#d4af37]/20">
      {/* Background Soft Glow */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-72 h-36 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none -z-10" />



      {/* Main Closing Calligraphy Statement */}
      <div className="my-8">
        <CrownFlourish className="w-8 h-8 mx-auto mb-3 opacity-80" />

        <h3 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.18em] text-gold-shimmer uppercase mb-2">
          WE LOOK FORWARD
          <br />
          TO CELEBRATING WITH YOU!
        </h3>

        {/* Script subtitle matching reference "We look forward to celebrating with you!" */}
        <p className="font-script text-3xl sm:text-4xl text-[#fae596] my-2 select-none">
          We look forward to celebrating with you!
        </p>

        {/* Gold ornamental lines and small gold heart detail */}
        <div className="flex items-center justify-center gap-4 my-6">
          <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-r from-transparent to-[#d4af37]"></div>
          <div className="flex items-center gap-2 text-[#d4af37]">
            <Heart className="w-4 h-4 fill-[#d4af37] text-[#d4af37] animate-pulse" />
          </div>
          <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-l from-transparent to-[#d4af37]"></div>
        </div>

        {/* Date numeral */}
        <p className="font-cinzel text-lg sm:text-xl font-bold tracking-[0.35em] text-gold-gradient">
          14 • 11 • 2026
        </p>
      </div>

      {/* Brand & Region Signature */}
      <div className="pt-8 border-t border-[#d4af37]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans-modern text-neutral-500">
        <p>
          LOLC Finance • North Western II Region • Annual Staff Get Together 2026
        </p>

        <button
          onClick={onScrollToTop}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-[#d4af37]/30 text-neutral-400 hover:text-[#fae596] hover:border-[#ffd700] transition-colors"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span className="text-[11px] font-cinzel">Back to Top</span>
        </button>
      </div>
    </footer>
  );
}
