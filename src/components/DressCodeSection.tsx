import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function DressCodeSection() {
  return (
    <section id="dress-code" className="relative py-8 px-4 max-w-3xl mx-auto z-10">
      {/* Luxury Dress Code Card */}
      <div className="relative rounded-2xl p-7 sm:p-9 bg-dark-card border border-[#d4af37]/50 shadow-xl overflow-hidden text-center group hover:border-[#ffd700] transition-colors duration-300">
        {/* Subtle decorative background light */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-48 h-24 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Minimal Luxury Fashion / Suit Icon in Gold */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#2a2312] to-[#0f0c05] border border-[#d4af37]/50 flex items-center justify-center text-[#f5d77f] shadow-lg group-hover:scale-105 transition-transform duration-300">
          <SuitBowtieIcon className="w-9 h-9" />
        </div>

        {/* Heading */}
        <p className="font-cinzel text-xs tracking-[0.3em] text-[#d4af37] uppercase font-bold mb-1">
          DRESS CODE
        </p>

        {/* Dress Code Title */}
        <h3 className="font-cinzel text-3xl sm:text-4xl font-bold text-gold-shimmer tracking-wide my-2 mb-4">
          Smart Casual Only
        </h3>
      </div>
    </section>
  );
}

// Minimalist Gold Suit & Bow-Tie Vector Icon
function SuitBowtieIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Tuxedo Collar / Lapels */}
      <path
        d="M16 12L28 40L24 60M48 12L36 40L40 60"
        stroke="url(#suitGoldGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Outer Shoulders */}
      <path
        d="M8 20L16 12L48 12L56 20L52 60L12 60L8 20Z"
        stroke="url(#suitGoldGrad)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Bow tie in center */}
      <path
        d="M26 21L38 29V21L26 29V21Z"
        fill="url(#suitGoldGrad)"
      />
      <circle cx="32" cy="25" r="2.5" fill="#FFF1B8" />
      {/* Shirt V-line */}
      <path
        d="M32 28V46"
        stroke="url(#suitGoldGrad)"
        strokeWidth="1.8"
        strokeDasharray="2 3"
      />
      {/* Subtle cufflinks/pocket square */}
      <path
        d="M18 42L22 42"
        stroke="#FFF1B8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="suitGoldGrad" x1="10" y1="12" x2="54" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF1B8" />
          <stop offset="0.5" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#AA771C" />
        </linearGradient>
      </defs>
    </svg>
  );
}
