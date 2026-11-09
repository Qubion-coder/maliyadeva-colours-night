import { useEffect, useState } from 'react';
import GoldParticleBackground from './components/GoldParticleBackground';
import IntroVideo from './components/IntroVideo';
import ScrollSmoke from './components/ScrollSmoke';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import EventDetailsSection from './components/EventDetailsSection';
import ChiefGuestSection from './components/ChiefGuestSection';
import ClosingSection from './components/ClosingSection';
import { luxuryAudio } from './components/BackgroundMusicPlayer';
import { readGuestName } from './lib/invite';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [introKey, setIntroKey] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  // Personal link (?to=...) → Coloursman's name on the opening screen
  const [guestName] = useState(() => readGuestName());

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
      window.removeEventListener('click', onFirst);
      window.removeEventListener('keydown', onFirst);
      window.removeEventListener('touchend', onFirst);
    };
    window.addEventListener('click', onFirst);
    window.addEventListener('keydown', onFirst);
    window.addEventListener('touchend', onFirst);
    return () => {
      window.removeEventListener('click', onFirst);
      window.removeEventListener('keydown', onFirst);
      window.removeEventListener('touchend', onFirst);
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
    <div className="relative min-h-screen bg-[#050b2a] text-[#f4efe6] font-sans-modern overflow-x-hidden selection:bg-[#d4af37]/30 selection:text-[#fae596]">
      {showIntro && (
        <IntroVideo
          key={introKey}
          onFinish={handleIntroFinish}
          onStart={startMusic}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={handleToggleMusic}
          guestName={guestName}
        />
      )}

      <GoldParticleBackground />

      {/* Ambient light in the school colours */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#14298a_0%,#0a1650_35%,#050b2a_75%)]" />
        <div className="absolute top-1/3 -left-48 w-[520px] h-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(180,24,48,0.35),transparent)]" />
        <div className="absolute top-2/3 -right-48 w-[520px] h-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(40,80,220,0.35),transparent)]" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[radial-gradient(closest-side,rgba(212,175,55,0.14),transparent)]" />
      </div>

      {/* Colour smoke that drifts as you scroll */}
      {!showIntro && <ScrollSmoke />}

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
