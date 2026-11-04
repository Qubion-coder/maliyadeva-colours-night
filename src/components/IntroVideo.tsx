import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SkipForward, Volume2, VolumeX } from 'lucide-react';

interface IntroVideoProps {
  onFinish: () => void;
  /** Starts the background song — called directly inside the tap. */
  onStart: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

/**
 * Full-screen cinematic intro.
 * 1. Gate screen with "Open Invitation" (the video preloads behind it).
 * 2. The tap plays the muted intro video at once; the same tap also unlocks
 *    the background song (see App).
 * It retries silently until playback starts. On end / skip the overlay fades to reveal the invitation.
 */
export default function IntroVideo({ onFinish, onStart, isMusicPlaying, onToggleMusic }: IntroVideoProps) {
  const [visible, setVisible] = useState(true);
  const [gate, setGate] = useState(true);
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

  const wantPlay = useRef(false);

  const tryPlay = () => {
    const v = videoRef.current;
    if (!v || !v.paused) return;
    // iOS needs the muted *attribute* (React only sets the property)
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.play().catch(() => {});
  };

  // Make sure the video is downloading while the guest is on the gate screen
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.setAttribute('muted', '');
    v.load();
  }, []);

  // After "Open Invitation": keep retrying quietly until the video runs.
  // If it never starts (very slow network), go straight to the invitation.
  useEffect(() => {
    if (gate || started) return;
    const retry = setInterval(tryPlay, 1000);
    const giveUp = setTimeout(() => finish(), 15000);
    return () => {
      clearInterval(retry);
      clearTimeout(giveUp);
    };
  }, [gate, started]);

  // "Open Invitation" tap → song + intro video start right away (inside the tap)
  const openInvitation = () => {
    onStart();
    wantPlay.current = true;
    tryPlay();
    setGate(false);
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
          onClick={() => wantPlay.current && tryPlay()}
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
            onPlaying={() => setStarted(true)}
            onCanPlay={() => wantPlay.current && tryPlay()}
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

          {/* Gate screen: the designed invitation cover (public/gate.jpg) */}
          <AnimatePresence>
            {gate && (
              <motion.div
                key="gate"
                className="absolute inset-0 z-10 flex items-center justify-center bg-[#0a1140] overflow-hidden"
                exit={{ opacity: 0, scale: 1.03 }}
                transition={{ duration: 0.7 }}
              >
                {/* Blurred colour fill for the space around the artwork */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-center bg-cover scale-125 blur-2xl opacity-70"
                  style={{ backgroundImage: 'url(/gate.jpg)' }}
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  className="relative z-[1] aspect-[853/1280] h-full max-h-full max-w-full shadow-[0_0_80px_rgba(0,0,0,0.6)]"
                  style={{ maxWidth: 'min(100%, calc(100svh * 853 / 1280))' }}
                >
                  <img
                    src="/gate.jpg"
                    alt="Maliyadeva College — An Invitation Awaits"
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-contain select-none"
                  />

                  {/* Tap area over the artwork's "Open Invitation" button */}
                  <button
                    onClick={openInvitation}
                    aria-label="Open Invitation"
                    className="absolute left-[13%] top-[55.6%] w-[74%] h-[8%] rounded-full animate-gate-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fae596]"
                  />
                </motion.div>

                {/* Tapping anywhere else on the cover opens it too */}
                <button
                  onClick={openInvitation}
                  aria-hidden="true"
                  tabIndex={-1}
                  className="absolute inset-0 -z-0 cursor-pointer"
                  style={{ zIndex: 0 }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading spinner before first frame plays */}
          {!gate && !started && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 rounded-full border-2 border-[#d4af37]/25 border-t-[#d4af37] animate-spin" />
            </div>
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
