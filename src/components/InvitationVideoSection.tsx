import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, Film, X } from 'lucide-react';
import MusicController from './BackgroundMusicPlayer';

interface InvitationVideoSectionProps {
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

export default function InvitationVideoSection({
  isMusicPlaying,
  onToggleMusic,
}: InvitationVideoSectionProps) {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handlePlayClick = () => {
    setIsVideoModalOpen(true);
    setIsPlayingVideo(true);
  };

  const handleCloseModal = () => {
    setIsVideoModalOpen(false);
    setIsPlayingVideo(false);
  };

  return (
    <section id="invitation-video" className="relative py-12 px-4 max-w-5xl mx-auto z-10">
      {/* Decorative Gold Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 text-[#d4af37] mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-cinzel text-xs tracking-[0.28em] uppercase text-[#e6d5b8]">
            Exclusive VIP Premiere
          </span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-gold-shimmer">
          Official Invitation Reel
        </h2>
      </div>

      {/* Main Luxury Video Card */}
      <div className="relative rounded-2xl md:rounded-3xl p-[1.5px] bg-gradient-to-b from-[#FFF1B8]/80 via-[#D4AF37]/50 to-[#8A6318]/30 shadow-2xl shadow-black">
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-[#090807] aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center group">
          {/* Atmospheric Gala Ballroom Image with Chandeliers & Champagne */}
          <img
            src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1600&q=85"
            alt="Luxury black and gold gala ballroom with chandeliers, candlelight and champagne"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.1] scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
            referrerPolicy="no-referrer"
          />

          {/* Dark luxury vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 pointer-events-none" />

          {/* Golden Bokeh & Chandelier Light Glimmer */}
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#d4af37]/20 to-transparent pointer-events-none" />

          {/* Corner Ornamental Accents */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#d4af37]/60 pointer-events-none" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#d4af37]/60 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#d4af37]/60 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#d4af37]/60 pointer-events-none" />

          {/* Center Play Button & Invitation Teaser */}
          <div className="relative z-10 flex flex-col items-center text-center p-6">
            <button
              onClick={handlePlayClick}
              id="play-invitation-video-btn"
              type="button"
              className="relative group/btn flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full transition-transform duration-300 hover:scale-110 active:scale-95 focus:outline-none"
              aria-label="Play Invitation Video"
            >
              {/* Outer pulsing gold halo */}
              <div className="absolute inset-0 rounded-full bg-[#d4af37] opacity-30 animate-ping duration-1000" />
              <div className="absolute -inset-2 rounded-full border border-[#f5d77f]/40 opacity-80 group-hover/btn:opacity-100 transition-opacity" />

              {/* Metallic gold button surface */}
              <div className="relative w-full h-full rounded-full bg-gold-gradient shadow-[0_0_30px_rgba(212,175,55,0.6)] flex items-center justify-center border border-[#fff2b2]">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 text-[#120f04] fill-[#120f04] ml-1 transform group-hover/btn:scale-110 transition-transform" />
              </div>
            </button>

            {/* Play Button Text */}
            <p className="mt-5 font-cinzel text-xs sm:text-sm md:text-base font-bold tracking-[0.25em] text-[#fff5d0] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Play Invitation Video
            </p>
            <p className="text-[11px] sm:text-xs text-[#c4af88] tracking-wider font-sans-modern mt-1 max-w-sm">
              An exclusive glimpse into the gala celebration of North Western II Region
            </p>
          </div>

          {/* Bottom badge on video */}
          <div className="absolute bottom-4 left-6 right-6 hidden sm:flex items-center justify-between pointer-events-none text-xs text-[#e6d5b8]">
            <span className="flex items-center gap-1.5 font-cinzel tracking-widest text-[#d4af37]">
              <Film className="w-3.5 h-3.5" /> 4K Ultra Cinematic Preview
            </span>
            <span className="font-sans-modern tracking-wider text-neutral-400">
              Asliya Golden Cassandra • 14.11.2026
            </span>
          </div>
        </div>
      </div>

      {/* Music Toggle Control Directly Below Video */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-2 text-xs text-[#c2ad82]">
          <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></span>
          <span className="font-serif-luxury italic text-sm">
            Atmospheric Gala Melodies & Orchestration
          </span>
        </div>

        {/* Music Switch Toggle */}
        <div id="video-music-toggle-container">
          <MusicController isPlaying={isMusicPlaying} onToggle={onToggleMusic} inline={true} />
        </div>
      </div>

      {/* Video Modal Player */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden bg-neutral-950 border border-[#d4af37]/60 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-neutral-900/90 border-b border-[#d4af37]/30">
              <div className="flex items-center gap-2">
                <CrownFlourishHeader />
                <h3 className="font-cinzel text-sm sm:text-base font-bold text-gold-shimmer">
                  Billionaire's Night Gala Invitation Reel
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Container */}
            <div className="relative aspect-[16/9] bg-black">
              <video
                ref={videoRef}
                autoPlay
                controls
                playsInline
                className="w-full h-full object-cover"
                poster="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1600&q=85"
              >
                {/* High quality royalty-free luxury gala celebration video clip */}
                <source
                  src="https://assets.mixkit.co/videos/preview/mixkit-glasses-of-wine-at-a-luxurious-party-39726-large.mp4"
                  type="video/mp4"
                />
                Your browser does not support HTML video.
              </video>
            </div>

            {/* Video Caption Bar */}
            <div className="p-4 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-[#d4af37]/20">
              <div className="text-center sm:text-left">
                <p className="font-cinzel text-sm text-[#f5d77f]">
                  North Western II Region • Annual Staff Get Together
                </p>
                <p className="text-neutral-400">14 November 2026 • Asliya Golden Cassandra</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="px-5 py-2 rounded-full bg-[#d4af37] text-black font-cinzel text-xs font-bold uppercase tracking-wider hover:bg-[#ffe599] transition-colors"
              >
                Continue to Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function CrownFlourishHeader() {
  return (
    <svg viewBox="0 0 24 18" className="w-5 h-4 text-[#d4af37] fill-current">
      <path d="M12 2L15 8L22 4L19 16H5L2 4L9 8L12 2Z" />
    </svg>
  );
}
