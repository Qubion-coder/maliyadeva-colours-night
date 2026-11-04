import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SkipForward, Volume2, VolumeX } from 'lucide-react';
import Crest from './Crest';

interface IntroVideoProps {
  onFinish: () => void;
  /** Called on the "Open Invitation" tap so the background song can start. */
  onStart: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

type Stage = 'gate' | 'playing' | 'done';

/**
 * Full-screen cinematic intro.
 * 1. "Gate" screen — the tap unlocks audio so the background song can play.
 * 2. Video plays full-screen and muted (song plays over it).
 * 3. On end / skip, the overlay fades away to reveal the invitation.
 */
export default function IntroVideo({ onFinish, onStart, isMusicPlaying, onToggleMusic }: IntroVideoProps) {
  const [stage, setStage] = useState<Stage>('gate');
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const bgRef = useRef<HTMLVideoElement | null>(null);

  // Lock page scroll while the intro is on screen
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const finish = () => {
    if (stage === 'done') return;
    videoRef.current?.pause();
    bgRef.current?.pause();
    setStage('done');
  };

  const start = async () => {
    onStart();
    setStage('playing');
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = true;
    try {
      await v.play();
    } catch {
      finish();
    }
    bgRef.current?.play().catch(() => {});
  };

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {stage !== 'done' && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] bg-black overflow-hidden"
          exit={{ opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Blurred ambient fill (visible on landscape screens) */}
          <video
            ref={bgRef}
            src="/intro.mp4"
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover scale-125 blur-3xl opacity-50"
          />

          {/* Main portrait video */}
          <video
            ref={videoRef}
            src="/intro.mp4"
            poster="/intro-poster.jpg"
            muted
            playsInline
            preload="auto"
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.duration) setProgress(v.currentTime / v.duration);
            }}
            onEnded={finish}
            className="absolute inset-0 m-auto h-full w-full object-cover md:w-auto md:aspect-[9/16] md:object-contain md:shadow-[0_0_120px_rgba(0,0,0,0.9)]"
          />

          {/* Soft vignette */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.75)_100%)]" />

          {/* Gate screen */}
          <AnimatePresence>
            {stage === 'gate' && (
              <motion.div
                key="gate"
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-[#07060a]"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
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
                    onClick={start}
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

          {/* Playback controls */}
          {stage === 'playing' && (
            <>
              <div className="absolute top-0 inset-x-0 h-[2px] bg-white/10">
                <div
                  className="h-full bg-gold-gradient transition-[width] duration-200 ease-linear"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <div className="absolute bottom-6 inset-x-0 px-5 flex items-center justify-between">
                <button
                  onClick={onToggleMusic}
                  aria-label={isMusicPlaying ? 'Mute music' : 'Play music'}
                  className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[#fae596] hover:border-[#d4af37]/70 transition-colors"
                >
                  {isMusicPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={finish}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[#fae596] font-cinzel text-[11px] tracking-[0.25em] uppercase hover:border-[#d4af37]/70 transition-colors"
                >
                  Skip
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
