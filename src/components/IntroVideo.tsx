import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Play, SkipForward, Volume2, VolumeX } from 'lucide-react';
import Crest from './Crest';

interface IntroVideoProps {
  onFinish: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

/**
 * Full-screen cinematic intro.
 * 1. Gate screen with "Open Invitation" (the video preloads behind it).
 * 2. The tap plays the muted intro video at once; the same tap also unlocks
 *    the background song (see App).
 * If the browser still blocks playback (e.g. iOS Low Power Mode), a play
 * button is shown. On end / skip the overlay fades to reveal the invitation.
 */
export default function IntroVideo({ onFinish, isMusicPlaying, onToggleMusic }: IntroVideoProps) {
  const [visible, setVisible] = useState(true);
  const [gate, setGate] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Lock page scroll while the intro is on screen
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const tryPlay = async () => {
    const v = videoRef.current;
    if (!v) return;
    // iOS needs the muted *attribute* (React only sets the property)
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    try {
      await v.play();
      setBlocked(false);
    } catch {
      setBlocked(true);
    }
  };

  // Make sure the video is downloading while the guest is on the gate screen
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.setAttribute('muted', '');
    v.load();
  }, []);

  // "Open Invitation" tap → play the intro right away (inside the tap gesture)
  const openInvitation = () => {
    setGate(false);
    tryPlay();
    setTimeout(() => {
      const v = videoRef.current;
      if (v && (v.paused || v.currentTime === 0)) setBlocked(true);
    }, 4000);
  };

  const finish = () => {
    videoRef.current?.pause();
    setVisible(false);
  };

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {visible && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] bg-black overflow-hidden"
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Blurred ambient fill for wide screens (static image — light on phones) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-center bg-cover scale-125 blur-3xl opacity-40"
            style={{ backgroundImage: 'url(/intro-first.jpg)' }}
          />

          <video
            ref={videoRef}
            src="/intro.mp4"
            poster="/intro-first.jpg"
            muted
            playsInline
            preload="auto"
            onPlaying={() => {
              setStarted(true);
              setBlocked(false);
            }}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.duration) setProgress(v.currentTime / v.duration);
            }}
            onEnded={finish}
            onError={finish}
            className="absolute inset-0 m-auto h-full w-full object-cover md:w-auto md:aspect-[9/16] md:object-contain md:shadow-[0_0_120px_rgba(0,0,0,0.9)]"
          />

          {/* Soft vignette */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)]" />

          {/* Gate screen: "Open Invitation" */}
          <AnimatePresence>
            {gate && (
              <motion.div
                key="gate"
                className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 bg-[#07060a]"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[radial-gradient(closest-side,rgba(212,175,55,0.18),transparent)]" />
                  <div className="absolute bottom-0 -left-32 w-96 h-96 bg-[radial-gradient(closest-side,rgba(155,27,48,0.25),transparent)]" />
                  <div className="absolute bottom-0 -right-32 w-96 h-96 bg-[radial-gradient(closest-side,rgba(30,58,138,0.28),transparent)]" />
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="relative flex flex-col items-center"
                >
                  <Crest className="w-28 h-32 sm:w-36 sm:h-40 mb-6 drop-shadow-[0_8px_30px_rgba(212,175,55,0.35)]" />
                  <p className="font-cinzel text-[11px] sm:text-xs tracking-[0.4em] uppercase text-[#c9b177] mb-3">
                    Maliyadeva College
                  </p>
                  <h1 className="font-serif-luxury italic text-3xl sm:text-5xl text-gold-subtle leading-tight">
                    An Invitation Awaits
                  </h1>
                  <div className="tricolour-rule w-40 mt-6 mb-10" />
                  <button
                    onClick={openInvitation}
                    className="group relative px-10 py-4 rounded-full border border-[#d4af37]/60 text-[#fae596] font-cinzel text-xs sm:text-sm tracking-[0.3em] uppercase overflow-hidden transition-colors hover:text-[#120f04]"
                  >
                    <span className="absolute inset-0 bg-gold-gradient translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    <span className="absolute inset-0 rounded-full animate-pulse-glow border border-[#d4af37]/30" />
                    <span className="relative">Open Invitation</span>
                  </button>
                  <p className="mt-5 text-[10px] tracking-[0.25em] uppercase text-neutral-500 font-sans-modern">
                    Sound on for the best experience
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading spinner before first frame plays */}
          {!gate && !started && !blocked && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 rounded-full border-2 border-[#d4af37]/25 border-t-[#d4af37] animate-spin" />
            </div>
          )}

          {/* Fallback play button if the browser blocked autoplay */}
          {blocked && (
            <button
              onClick={tryPlay}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40"
            >
              <span className="w-20 h-20 rounded-full bg-gold-gradient gold-button-glow flex items-center justify-center">
                <Play className="w-8 h-8 text-[#120f04] fill-current ml-1" />
              </span>
              <span className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#fae596]">
                Play Intro
              </span>
            </button>
          )}

          {!gate && (<>
          {/* Progress bar */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-white/10">
            <div
              className="h-full bg-gold-gradient transition-[width] duration-200 ease-linear"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* Controls */}
          <div className="absolute bottom-6 inset-x-0 px-5 flex items-center justify-between">
            <button
              onClick={onToggleMusic}
              aria-label={isMusicPlaying ? 'Mute music' : 'Play music'}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[#fae596] hover:border-[#d4af37]/70 transition-colors"
            >
              {isMusicPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              {!isMusicPlaying && (
                <span className="font-cinzel text-[10px] tracking-[0.2em] uppercase">Tap for music</span>
              )}
            </button>
            <button
              onClick={finish}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[#fae596] font-cinzel text-[11px] tracking-[0.25em] uppercase hover:border-[#d4af37]/70 transition-colors"
            >
              Skip
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
          </>)}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
