import React, { useState, useEffect } from 'react';
import GoldParticleBackground from './components/GoldParticleBackground';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import InvitationVideoSection from './components/InvitationVideoSection';
import EventDetailsSection from './components/EventDetailsSection';
import CelebrationSection from './components/CelebrationSection';
import DressCodeSection from './components/DressCodeSection';
import RsvpSection from './components/RsvpSection';
import LocationSection from './components/LocationSection';
import ClosingSection from './components/ClosingSection';
import RsvpModal from './components/RsvpModal';
import MusicController, { luxuryAudio } from './components/BackgroundMusicPlayer';

export default function App() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);

  useEffect(() => {
    // Attempt auto-play on load
    const attemptAutoplay = async () => {
      const success = await luxuryAudio.playAudio();
      if (success) {
        setIsMusicPlaying(true);
      }
    };
    
    attemptAutoplay();

    // Fallback to start playing on first user interaction if autoplay was blocked
    const handleFirstInteraction = async () => {
      if (!luxuryAudio.isPlaying()) {
        const success = await luxuryAudio.playAudio();
        if (success) {
          setIsMusicPlaying(true);
        }
      }
      // Remove listeners after first interaction
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    document.addEventListener('scroll', handleFirstInteraction, { passive: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
    };
  }, []);

  // Toggle background gala lounge music
  const handleToggleMusic = () => {
    const newState = luxuryAudio.toggle();
    setIsMusicPlaying(newState);
  };

  // Scroll helpers
  const handleScrollToVideo = () => {
    document.getElementById('invitation-video')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToDetails = () => {
    document.getElementById('event-details')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#050507] text-[#f4efe6] font-sans-modern overflow-x-hidden selection:bg-[#d4af37]/30 selection:text-[#fae596]">
      {/* Interactive Golden Particle Canvas Background */}
      <GoldParticleBackground />

      {/* Atmospheric Ambient Lighting Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 mobile-ambient-lighting">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#d4af37]/10 via-[#8a6318]/05 to-transparent blur-[120px]" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-[#aa771c]/05 rounded-full blur-[100px]" />
        <div className="absolute top-2/3 -right-40 w-96 h-96 bg-[#d4af37]/05 rounded-full blur-[100px]" />
      </div>

      {/* Luxury Sticky Navbar */}
      <Navbar
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
        onOpenRsvp={() => setIsRsvpOpen(true)}
      />

      {/* Main Content Area (Max width 1200px centered for desktop luxury presentation) */}
      <main className="relative z-10 max-w-[1200px] mx-auto px-2 sm:px-4">
        {/* 1. HERO / OPENING SECTION */}
        <HeroSection
          onOpenRsvp={() => setIsRsvpOpen(true)}
          onScrollToVideo={handleScrollToVideo}
          onScrollToDetails={handleScrollToDetails}
        />

        {/* 2. INVITATION VIDEO SECTION */}
        <InvitationVideoSection
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={handleToggleMusic}
        />

        {/* 3. EVENT DETAILS (4 Information Cards Grid) */}
        <EventDetailsSection />

        {/* 4. CELEBRATION SECTION (Dancing couple silhouette, champagne flutes, gold confetti) */}
        <CelebrationSection />

        {/* 5. DRESS CODE SECTION ("Smart Casual" luxury card with gold suit icon) */}
        <DressCodeSection />

        {/* 6. RSVP SECTION ("RESERVE YOUR PLACE" CTA & Coordinator details) */}
        <RsvpSection onOpenRsvp={() => setIsRsvpOpen(true)} />

        {/* 7. LOCATION SECTION (Asliya Golden Cassandra, Kurunegala, Map embed & Google Maps link) */}
        <LocationSection />

        {/* 8. FINAL CLOSING SECTION (QR Code, Script farewell, Gold Heart, "14 • 11 • 2026") */}
        <ClosingSection onScrollToTop={handleScrollToTop} />
      </main>

      {/* Interactive VIP RSVP Registration Modal & Pass Generator */}
      <RsvpModal isOpen={isRsvpOpen} onClose={() => setIsRsvpOpen(false)} />

      {/* Floating Bottom Music Player Badge */}
      <MusicController isPlaying={isMusicPlaying} onToggle={handleToggleMusic} />
    </div>
  );
}
