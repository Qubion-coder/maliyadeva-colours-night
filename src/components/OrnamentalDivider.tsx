import React from 'react';

export function CrownFlourish({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M24 2L31 16L44 8L39 30H9L4 8L17 16L24 2Z"
        stroke="url(#goldGradCrown)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="url(#goldGradCrownFill)"
      />
      <circle cx="24" cy="3" r="2.5" fill="#FFE898" />
      <circle cx="4" cy="8" r="2" fill="#FFE898" />
      <circle cx="44" cy="8" r="2" fill="#FFE898" />
      <circle cx="14" cy="24" r="1.5" fill="#FFE898" />
      <circle cx="24" cy="24" r="2" fill="#FFE898" />
      <circle cx="34" cy="24" r="1.5" fill="#FFE898" />
      <defs>
        <linearGradient id="goldGradCrown" x1="4" y1="2" x2="44" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF1B8" />
          <stop offset="0.5" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#8A6318" />
        </linearGradient>
        <linearGradient id="goldGradCrownFill" x1="24" y1="2" x2="24" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D4AF37" stopOpacity="0.25" />
          <stop offset="1" stopColor="#8A6318" stopOpacity="0.05" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function InfinitySwirl({ side = 'left', className = 'w-16 h-8' }: { side?: 'left' | 'right'; className?: string }) {
  return (
    <svg
      viewBox="0 0 100 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${side === 'right' ? 'transform scale-x-[-1]' : ''}`}
    >
      <path
        d="M5 25C15 25 22 15 32 15C42 15 48 27 60 27C72 27 78 12 90 12C96 12 99 15 97 20C95 24 88 28 80 28C70 28 65 20 54 20C42 20 38 32 26 32C14 32 8 22 2 22"
        stroke="url(#goldGradSwirl)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="94" cy="16" r="2" fill="#FFE898" />
      <circle cx="4" cy="23" r="1.5" fill="#ECC558" />
      <defs>
        <linearGradient id="goldGradSwirl" x1="0" y1="20" x2="100" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#AA771C" stopOpacity="0.4" />
          <stop offset="0.4" stopColor="#F5D77F" />
          <stop offset="0.8" stopColor="#D4AF37" />
          <stop offset="1" stopColor="#FFF1B8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function OrnamentalSectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center gap-3 my-6 select-none">
      <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-[#d4af37]"></div>
      <div className="flex items-center gap-1.5 text-[#d4af37]">
        <span className="text-[10px] transform rotate-45 inline-block w-1.5 h-1.5 bg-[#f5d77f]"></span>
        <span className="text-xs uppercase tracking-[0.35em] font-cinzel font-semibold text-gold-shimmer">
          {title}
        </span>
        <span className="text-[10px] transform rotate-45 inline-block w-1.5 h-1.5 bg-[#f5d77f]"></span>
      </div>
      <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent via-[#d4af37]/60 to-[#d4af37]"></div>
    </div>
  );
}

export function GoldRibbon({ text, subtext }: { text: React.ReactNode; subtext?: React.ReactNode }) {
  return (
    <div className="relative inline-flex items-center justify-center px-8 sm:px-14 py-2.5 my-3">
      {/* Ribbon tails */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-5 h-8 bg-gradient-to-r from-[#8f6d22] to-[#cba343] clip-ribbon-left hidden sm:block"></div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-5 h-8 bg-gradient-to-l from-[#8f6d22] to-[#cba343] clip-ribbon-right hidden sm:block"></div>

      {/* Main ribbon body */}
      <div className="relative z-10 px-6 py-2 rounded-sm bg-gradient-to-r from-[#8A6318]/90 via-[#D4AF37] to-[#8A6318]/90 border-y border-[#FFF1B8]/60 shadow-lg shadow-black/60 text-center">
        <p className="font-cinzel text-xs sm:text-sm font-bold tracking-[0.18em] text-[#1a1202] uppercase drop-shadow-sm">
          {text}
        </p>
        {subtext && (
          <p className="font-serif-luxury italic text-xs tracking-wider text-[#2d2208] -mt-0.5">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}
