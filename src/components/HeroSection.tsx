import React, { useState, useEffect } from 'react';
import { CrownFlourish, InfinitySwirl, GoldRibbon } from './OrnamentalDivider';
import { Sparkles, Calendar, Clock, MapPin, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  onOpenRsvp: () => void;
  onScrollToVideo: () => void;
  onScrollToDetails: () => void;
}

export default function HeroSection({ onOpenRsvp, onScrollToVideo, onScrollToDetails }: HeroSectionProps) {
  // Target: 14 November 2026, 18:00 (6:00 PM)
  const eventDate = new Date('2026-11-14T18:00:00');
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +eventDate - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-between text-center pt-8 pb-12 px-4 overflow-hidden z-10">
      {/* Ambient Top Light Beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#d4af37]/20 via-[#aa771c]/05 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Corporate Brand Header - LOLC Finance */}
      <div className="flex flex-col items-center gap-1.5 animate-fadeIn">
        <div className="flex items-center justify-center h-16 sm:h-20">
          <img 
            src="/image-removebg-preview (2).png" 
            alt="LOLC Finance Logo" 
            className="h-full w-auto object-contain drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)]"
          />
        </div>
      </div>

      {/* Main Title Group */}
      <div className="my-auto py-6 max-w-4xl w-full flex flex-col items-center">
        {/* Cordially Invited Subheading */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#d4af37]/70"></div>
          <p className="font-cinzel text-xs sm:text-sm tracking-[0.3em] uppercase text-[#e6d5b8] font-medium">
            You Are Cordially Invited To
          </p>
          <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#d4af37]/70"></div>
        </div>

        {/* Crown and Title */}
        <div className="relative flex flex-col items-center justify-center mb-1">
          {/* Royal Crown insignia */}
          <div className="mb-1 transform hover:scale-110 transition-transform duration-300">
            <CrownFlourish className="w-10 h-8 sm:w-12 sm:h-9" />
          </div>

          {/* BILLIONAIRE'S */}
          <h1
            id="event-main-title"
            className="font-cinzel-decorative text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[0.08em] sm:tracking-[0.12em] text-gold-shimmer drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)] select-none uppercase px-2"
          >
            BILLIONAIRE'S
          </h1>

          {/* Night with Cinzel and Flanking Infinity Swirls */}
          <div className="flex items-center justify-center -mt-1 sm:-mt-2 gap-2 sm:gap-6 w-full">
            <InfinitySwirl side="left" className="w-16 sm:w-28 md:w-36 h-8 sm:h-12" />
            <span className="font-cinzel-decorative text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[0.08em] sm:tracking-[0.12em] text-gold-gradient select-none uppercase px-2">
              NIGHT
            </span>
            <InfinitySwirl side="right" className="w-16 sm:w-28 md:w-36 h-8 sm:h-12" />
          </div>
        </div>

        {/* Ribbon / Sub-banner */}
        <GoldRibbon
          text={
            <>
              Annual <br />
              Staff get together of <br />
              North Western II region
            </>
          }
        />

        {/* Key Event Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-4 text-xs font-sans-modern text-[#f3e5ab]">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 border border-[#d4af37]/30">
            <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Saturday, 14 Nov 2026</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 border border-[#d4af37]/30">
            <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>6:00 PM Onwards</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 border border-[#d4af37]/30">
            <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Asliya Golden Cassandra, Kurunegala</span>
          </div>
        </div>

        {/* VIP Countdown Clock */}
        <div className="mt-8 pt-5 border-t border-[#d4af37]/20 w-full max-w-lg">
          <p className="font-cinzel text-[11px] tracking-[0.25em] text-[#c9b177] uppercase mb-3">
            Countdown To The Gala
          </p>
          <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
            {[
              { label: 'DAYS', val: timeLeft.days },
              { label: 'HOURS', val: timeLeft.hours },
              { label: 'MINUTES', val: timeLeft.minutes },
              { label: 'SECONDS', val: timeLeft.seconds },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center py-2.5 px-1 sm:px-2 rounded-xl bg-gradient-to-b from-[#181612]/90 to-[#0a0a0c]/95 border border-[#d4af37]/40 shadow-inner"
              >
                <span className="font-cinzel text-xl sm:text-2xl font-bold text-gold-gradient">
                  {String(item.val).padStart(2, '0')}
                </span>
                <span className="text-[9px] tracking-widest text-neutral-400 font-sans-modern mt-0.5">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 w-full max-w-md">
          <button
            onClick={onOpenRsvp}
            id="hero-rsvp-btn"
            className="w-full sm:w-auto flex-1 px-8 py-3.5 rounded-full bg-gold-gradient hover:bg-gold-gradient-hover text-[#120f04] font-cinzel text-xs sm:text-sm font-bold tracking-[0.18em] uppercase transition-all duration-300 transform hover:-translate-y-0.5 gold-button-glow flex items-center justify-center gap-2 group"
          >
            <Sparkles className="w-4 h-4 text-[#120f04] group-hover:rotate-12 transition-transform" />
            <span>Reserve Your Place</span>
          </button>

          <button
            onClick={onScrollToVideo}
            id="hero-video-btn"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-black/60 hover:bg-neutral-900 border border-[#d4af37]/60 hover:border-[#ffd700] text-[#f5d77f] font-cinzel text-xs tracking-[0.16em] uppercase transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Watch Invitation</span>
          </button>
        </div>
      </div>

      {/* Gentle Scroll Down Indicator */}
      <button
        onClick={onScrollToDetails}
        aria-label="Scroll to event details"
        className="text-[#d4af37]/60 hover:text-[#fae596] transition-colors flex flex-col items-center gap-1 group mt-2"
      >
        <span className="text-[10px] tracking-[0.25em] font-cinzel uppercase text-neutral-400 group-hover:text-[#fae596]">
          Explore Invitation
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce text-[#d4af37]" />
      </button>
    </section>
  );
}
