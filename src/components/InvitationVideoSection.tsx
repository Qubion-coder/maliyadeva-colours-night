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
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [wasMusicPlaying, setWasMusicPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handlePlayClick = (videoSrc: string) => {
    setActiveVideo(videoSrc);
    if (isMusicPlaying) {
      setWasMusicPlaying(true);
      onToggleMusic();
    } else {
      setWasMusicPlaying(false);
    }
  };

  const handleCloseModal = () => {
    setActiveVideo(null);
    if (wasMusicPlaying && !isMusicPlaying) {
      onToggleMusic();
    }
  };

  const reels = [
    {
      title: "Pyramidz Band",
      src: "/reel1.mp4",
      poster: "/pyramidz.png",
    },
    {
      title: "Athma Liyanage",
      src: "/reel2.mp4",
      poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDlTrgsDbIQfrbQV2uAb6GL4uAXBZUzcpMK31a4-vawlNGzWYkR0Erb0V9&s=10",
    }
  ];

  return (
    <section id="invitation-video" className="relative py-12 px-4 max-w-5xl mx-auto z-10">
      {/* Decorative Gold Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 text-[#d4af37] mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-cinzel text-xs tracking-[0.28em] uppercase text-[#e6d5b8]">
            Exclusive Greetings
          </span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <h2 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-gold-shimmer">
          Messages From Our Artists
        </h2>
      </div>

      {/* Main Luxury Video Cards - Side by Side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {reels.map((reel, index) => (
          <div key={index} className="relative rounded-2xl md:rounded-3xl p-[1.5px] bg-gradient-to-b from-[#FFF1B8]/80 via-[#D4AF37]/50 to-[#8A6318]/30 shadow-2xl shadow-black max-w-[320px] mx-auto w-full">
            <div className="relative rounded-2xl md:rounded-[22px] overflow-hidden bg-[#090807] aspect-[9/16] flex items-center justify-center group">
              {/* Image */}
              <img
                src={reel.poster}
                alt={`Luxury black and gold gala event ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.1] scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
                referrerPolicy="no-referrer"
              />

              {/* Dark luxury vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 pointer-events-none" />

              {/* Golden Bokeh & Chandelier Light Glimmer */}
              <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#d4af37]/20 to-transparent pointer-events-none" />

              {/* Corner Ornamental Accents */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#d4af37]/60 pointer-events-none" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#d4af37]/60 pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#d4af37]/60 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#d4af37]/60 pointer-events-none" />

              {/* Center Play Button & Invitation Teaser */}
              <div className="relative z-10 flex flex-col items-center text-center p-6">
                <button
                  onClick={() => handlePlayClick(reel.src)}
                  type="button"
                  className="relative group/btn flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-transform duration-300 hover:scale-110 active:scale-95 focus:outline-none"
                  aria-label="Play Reel"
                >
                  <div className="absolute inset-0 rounded-full bg-[#d4af37] opacity-30 animate-ping duration-1000" />
                  <div className="absolute -inset-2 rounded-full border border-[#f5d77f]/40 opacity-80 group-hover/btn:opacity-100 transition-opacity" />
                  <div className="relative w-full h-full rounded-full bg-gold-gradient shadow-[0_0_30px_rgba(212,175,55,0.6)] flex items-center justify-center border border-[#fff2b2]">
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 text-[#120f04] fill-[#120f04] ml-1 transform group-hover/btn:scale-110 transition-transform" />
                  </div>
                </button>

                <p className="mt-4 font-cinzel text-xs sm:text-sm font-bold tracking-[0.2em] text-[#fff5d0] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] text-center px-2">
                  {reel.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Music Toggle Control */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-2 max-w-[640px] mx-auto">
        <div className="flex items-center gap-2 text-xs text-[#c2ad82]">
          <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse"></span>
          <span className="font-serif-luxury italic text-sm">
            Atmospheric Gala Melodies & Orchestration
          </span>
        </div>
        <div id="video-music-toggle-container">
          <MusicController isPlaying={isMusicPlaying} onToggle={onToggleMusic} inline={true} />
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-2xl overflow-hidden bg-neutral-950 border border-[#d4af37]/60 shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-900/90 border-b border-[#d4af37]/30 shrink-0">
              <div className="flex items-center gap-2">
                <CrownFlourishHeader />
                <h3 className="font-cinzel text-xs font-bold text-gold-shimmer">
                  Billionaire's Night Gala
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
            <div className="relative w-full flex-grow bg-black flex items-center justify-center overflow-hidden min-h-0 aspect-[9/16]">
              <video
                ref={videoRef}
                autoPlay
                controls
                playsInline
                className="w-full h-full object-contain"
                src={activeVideo}
              >
                Your browser does not support HTML video.
              </video>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function CrownFlourishHeader() {
  return (
    <svg viewBox="0 0 24 18" className="w-4 h-3 text-[#d4af37] fill-current">
      <path d="M12 2L15 8L22 4L19 16H5L2 4L9 8L12 2Z" />
    </svg>
  );
}
