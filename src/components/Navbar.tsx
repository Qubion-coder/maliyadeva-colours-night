import { Volume2, VolumeX } from 'lucide-react';
import Crest from './Crest';

interface NavbarProps {
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

export default function Navbar({ isMusicPlaying, onToggleMusic }: NavbarProps) {
  return (
    <header className="fixed top-0 inset-x-0 z-40 backdrop-blur-xl bg-[#050b2a]/70 border-b border-[#d4af37]/15">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 text-left"
        >
          <Crest className="w-7 h-8" />
          <span className="font-cinzel text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#fae596]">
            Colours Night
            <span className="hidden sm:inline text-[#a88a44] font-normal"> · 2024/25</span>
          </span>
        </button>

        <button
          onClick={onToggleMusic}
          aria-label={isMusicPlaying ? 'Mute music' : 'Play music'}
          className="p-2 rounded-full border border-[#d4af37]/35 hover:border-[#ffd700] text-[#f5d77f] transition-colors"
        >
          {isMusicPlaying ? (
            <Volume2 className="w-4 h-4 text-[#ffd700]" />
          ) : (
            <VolumeX className="w-4 h-4 text-neutral-400" />
          )}
        </button>
      </div>
    </header>
  );
}
