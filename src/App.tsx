import { useEffect, useState } from 'react';
import GoldParticleBackground from './components/GoldParticleBackground';
import IntroVideo from './components/IntroVideo';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import EventDetailsSection from './components/EventDetailsSection';
import ChiefGuestSection from './components/ChiefGuestSection';
import ClosingSection from './components/ClosingSection';
import { luxuryAudio } from './components/BackgroundMusicPlayer';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [introKey, setIntroKey] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const startMusic = async () => {
    if (luxuryAudio.isPlaying()) return;
    const ok = await luxuryAudio.playAudio();
    setIsMusicPlaying(ok);
  };

  // Play the song from the very start. Browsers usually block sound until the
  // first tap, so also retry on the first interaction (e.g. "Open Invitation").
  useEffect(() => {
    startMusic();
    const onFirst = () => {
      startMusic();
      window.removeEventListener('pointerdown', onFirst);
      window.removeEventListener('keydown', onFirst);
    };
    window.addEventListener('pointerdown', onFirst);
    window.addEventListener('keydown', onFirst);
    return () => {
      window.removeEventListener('pointerdown', onFirst);
      window.removeEventListener('keydown', onFirst);
    };
  }, []);

  const handleIntroFinish = () => {
    setShowIntro(false);
    window.scrollTo({ top: 0 });
  };

  const handleReplayIntro = () => {
    setIntroKey((k) => k + 1);
    setShowIntro(true);
  };

  const handleToggleMusic = () => setIsMusicPlaying(luxuryAudio.toggle());

  return (
    <div className="relative min-h-screen bg-[#07060a] text-[#f4efe6] font-sans-modern overflow-x-hidden selection:bg-[#d4af37]/30 selection:text-[#fae596]">
      {showIntro && (
        <IntroVideo
          key={introKey}
          onFinish={handleIntroFinish}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={handleToggleMusic}
        />
      )}

      <GoldParticleBackground />

      {/* Ambient light in the school colours */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 -left-48 w-[480px] h-[480px] rounded-full bg-[radial-gradient(closest-side,rgba(125,21,40,0.22),transparent)]" />
        <div className="absolute top-1/2 -right-48 w-[480px] h-[480px] rounded-full bg-[radial-gradient(closest-side,rgba(27,52,120,0.25),transparent)]" />
      </div>

      <Navbar isMusicPlaying={isMusicPlaying} onToggleMusic={handleToggleMusic} />

      {!showIntro && (
        <main className="relative z-10 max-w-[1200px] mx-auto">
          <HeroSection />
          <EventDetailsSection />
          <ChiefGuestSection />
          <ClosingSection onReplayIntro={handleReplayIntro} />
        </main>
      )}
    </div>
  );
}
