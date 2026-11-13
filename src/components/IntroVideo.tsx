import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Crest from './Crest';
import { SkipForward, Volume2, VolumeX } from 'lucide-react';

interface IntroVideoProps {
  onFinish: () => void;
  /** Starts the background song — called directly inside the tap. */
  onStart: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  /** Guest's name from a personal link; null shows the general invitation. */
  guestName?: string | null;
}

/**
 * Full-screen cinematic intro.
 * 1. Gate screen with "Open Invitation" (the video preloads behind it).
 * 2. The tap plays the muted intro video at once; the same tap also unlocks
 *    the background song (see App).
 * It retries silently until playback starts. On end / skip the overlay fades to reveal the invitation.
 */
export default function IntroVideo({ onFinish, onStart, isMusicPlaying, onToggleMusic, guestName }: IntroVideoProps) {
  // Long names get a smaller size so they stay on at most two lines
  const nameSize =
    !guestName ? '' :
    guestName.length <= 16 ? 'text-[min(7.6vw,4.4svh)] md:text-[clamp(1.8rem,4.4svh,2.8rem)]' :
    guestName.length <= 28 ? 'text-[min(6.2vw,3.6svh)] md:text-[clamp(1.5rem,3.6svh,2.3rem)]' :
    'text-[min(5vw,3svh)] md:text-[clamp(1.2rem,3svh,1.9rem)]';
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

          {/* Gate screen: palace background (public/gate-bg.jpg) + hand-built invitation cover */}
          <AnimatePresence>
            {gate && (
              <motion.div
                key="gate"
                className="absolute inset-0 z-10 flex items-center justify-center bg-[#050b2a] overflow-hidden"
                exit={{ opacity: 0, scale: 1.03 }}
                transition={{ duration: 0.7 }}
              >
                {/* Blurred fill for wide screens */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-center bg-cover scale-110 blur-2xl opacity-60"
                  style={{ backgroundImage: 'url(/gate-bg.jpg)' }}
                />

                {/* Portrait card: full screen on phones, centred 9:16 on desktop */}
                <div
                  className="relative z-[1] h-full w-full md:w-auto md:aspect-[9/16] bg-cover bg-bottom md:shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden"
                  style={{ backgroundImage: 'url(/gate-bg.jpg)' }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className={`absolute inset-x-0 ${guestName ? 'top-[6%]' : 'top-[8%]'} flex flex-col items-center text-center px-6`}
                  >
                    {/* Crest with golden sunburst */}
                    <div className="relative">
                      <div className="absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgba(255,214,120,0.75),rgba(255,190,80,0.25)_45%,transparent_75%)] animate-pulse-glow" />
                      <div className="absolute -inset-16 rounded-full bg-[repeating-conic-gradient(from_0deg,rgba(255,225,150,0.22)_0deg_3deg,transparent_3deg_12deg)] [mask-image:radial-gradient(closest-side,black_20%,transparent_80%)] [-webkit-mask-image:radial-gradient(closest-side,black_20%,transparent_80%)]" />
                      <Crest className={`relative ${guestName ? 'h-[clamp(64px,11.5svh,140px)]' : 'h-[clamp(78px,15svh,170px)]'} w-auto aspect-[372/420] drop-shadow-[0_6px_18px_rgba(0,0,0,0.55)]`} />
                    </div>

                    <p className="mt-[clamp(12px,3.2svh,32px)] font-cinzel font-semibold whitespace-nowrap text-[min(4.4vw,2.3svh)] md:text-[clamp(1rem,2.6svh,1.5rem)] tracking-[0.14em] sm:tracking-[0.18em] uppercase text-gold-gradient drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
                      Maliyadeva College
                    </p>

                    {/* Line + diamond divider */}
                    <div className="mt-3 flex items-center gap-2 w-[min(80%,320px)]">
                      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#e8c15a]" />
                      <span className="w-2 h-2 rotate-45 bg-gold-gradient shadow-[0_0_8px_rgba(250,229,150,0.8)]" />
                      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#e8c15a]" />
                    </div>

                    {guestName ? (
                      <>
                        {/* Personalised greeting for the guest */}
                        <p className="mt-[clamp(8px,2svh,18px)] font-serif-luxury italic text-[min(4.6vw,2.4svh)] md:text-[clamp(1rem,2.4svh,1.35rem)] text-[#f3e5ab] drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
                          Dear
                        </p>
                        <p className={`mt-1 max-w-[92%] font-cinzel font-bold uppercase tracking-[0.06em] leading-[1.15] text-gold-shimmer drop-shadow-[0_3px_10px_rgba(0,0,0,0.7)] break-words ${nameSize}`}>
                          {guestName}
                        </p>
                        <h1 className="mt-[clamp(6px,1.6svh,16px)] font-script text-[min(8vw,4.6svh)] md:text-[clamp(1.9rem,4.2svh,2.8rem)] leading-[1.05] text-gold-gradient drop-shadow-[0_3px_10px_rgba(0,0,0,0.6)] px-2">
                          Your Invitation Awaits
                        </h1>
                      </>
                    ) : (
                      <h1 className="mt-[clamp(6px,2svh,20px)] font-script text-[min(9.5vw,5.6svh)] md:text-[clamp(2.2rem,5svh,3.3rem)] leading-[1.05] text-gold-gradient drop-shadow-[0_3px_10px_rgba(0,0,0,0.6)] px-2">
                        An Invitation Awaits
                      </h1>
                    )}

                    {/* Swoosh with spark */}
                    <div className="relative mt-1 w-[min(78%,320px)] h-4">
                      <span className="absolute inset-x-0 top-1/2 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#e8c15a] to-transparent" />
                      <span className="absolute right-[18%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_14px_6px_rgba(255,220,130,0.9)]" />
                    </div>

                    {/* Ornate gold button */}
                    <button
                      onClick={openInvitation}
                      className={`group relative ${guestName ? 'mt-[clamp(16px,3.5svh,40px)]' : 'mt-[clamp(22px,6svh,64px)]'} flex items-center justify-center`}
                    >
                      <span className="absolute -left-5 top-1/2 -translate-y-1/2 w-6 h-px bg-[#e8c15a]" />
                      <span className="absolute -right-5 top-1/2 -translate-y-1/2 w-6 h-px bg-[#e8c15a]" />
                      <span className="relative flex items-center whitespace-nowrap gap-3 px-6 sm:px-10 py-[clamp(9px,1.5svh,15px)] rounded-full p-[1.5px] bg-gold-gradient animate-gate-glow">
                        <span className="absolute inset-[2px] rounded-full bg-[linear-gradient(180deg,#0d1a55,#050b2a)] group-hover:bg-[linear-gradient(180deg,#16297a,#0a1446)] transition-colors" />
                        <span className="relative w-1.5 h-1.5 rotate-45 bg-[#f5d77f]" />
                        <span className="relative font-cinzel whitespace-nowrap text-[min(3.6vw,15px)] sm:text-lg tracking-[0.2em] uppercase text-gold-gradient">
                          Open Invitation
                        </span>
                        <span className="relative w-1.5 h-1.5 rotate-45 bg-[#f5d77f]" />
                      </span>
                    </button>

                  </motion.div>
                </div>
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
