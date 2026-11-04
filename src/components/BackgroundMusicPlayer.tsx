import { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface MusicControllerProps {
  isPlaying: boolean;
  onToggle: () => void;
  inline?: boolean;
}

export class LuxuryAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private running: boolean = false;

  public init() {
    if (!this.audio) {
      this.audio = new Audio('/song.mp3');
      this.audio.loop = true;
      this.audio.volume = 0.6;
      this.audio.preload = 'auto';
    }
  }

  public async playAudio(): Promise<boolean> {
    this.init();
    if (!this.audio) return false;
    try {
      await this.audio.play();
      this.running = true;
      return true;
    } catch (err) {
      console.log("Audio autoplay was prevented:", err);
      this.running = false;
      return false;
    }
  }

  public stop() {
    if (this.audio) {
      this.audio.pause();
      this.running = false;
    }
  }

  public toggle(): boolean {
    if (this.running) {
      this.stop();
      return false;
    } else {
      // For synchronous toggle behavior from UI
      this.playAudio();
      this.running = true; // Assume true immediately for UI responsiveness
      return true;
    }
  }

  public isPlaying(): boolean {
    return this.running;
  }
}

// Global audio engine instance
export const luxuryAudio = new LuxuryAudioEngine();

export default function MusicController({ isPlaying, onToggle, inline = false }: MusicControllerProps) {
  if (inline) {
    return (
      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black/60 border border-[#d4af37]/40 backdrop-blur-md shadow-lg shadow-black/40">
        <Music className={`w-4 h-4 ${isPlaying ? 'text-[#f5d77f] animate-pulse' : 'text-neutral-500'}`} />
        <span className="text-xs uppercase tracking-wider text-[#e6d5b8] font-medium">
          Background Music
        </span>
        <button
          onClick={onToggle}
          type="button"
          aria-label={isPlaying ? 'Mute background music' : 'Play background music'}
          className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-[#d4af37] ${
            isPlaying ? 'bg-[#d4af37]' : 'bg-neutral-800'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full transition-transform duration-300 shadow-md ${
              isPlaying
                ? 'translate-x-7 bg-black'
                : 'translate-x-1 bg-neutral-400'
            }`}
          />
        </button>
        <span className={`text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded ${
          isPlaying ? 'text-[#fef3c7] bg-[#d4af37]/20 border border-[#d4af37]/30' : 'text-neutral-500 bg-neutral-900'
        }`}>
          {isPlaying ? 'ON' : 'OFF'}
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={onToggle}
      type="button"
      title={isPlaying ? 'Pause Background Music' : 'Play VIP Gala Music'}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black/80 border border-[#d4af37]/50 backdrop-blur-md shadow-xl text-xs uppercase tracking-widest text-[#fae596] hover:border-[#f5d77f] hover:bg-neutral-900/90 transition-all duration-300 group"
    >
      {isPlaying ? (
        <>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8c15a] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#d4af37]"></span>
          </span>
          <Volume2 className="w-4 h-4 text-[#fae596] animate-pulse" />
          <span className="hidden sm:inline text-[#e6d5b8]">Gala Ambiance:</span>
          <span className="font-semibold text-[#ffd700]">ON</span>
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4 text-neutral-400 group-hover:text-[#fae596]" />
          <span className="hidden sm:inline text-neutral-400 group-hover:text-[#e6d5b8]">Music:</span>
          <span className="font-semibold text-neutral-400 group-hover:text-[#ffd700]">OFF</span>
        </>
      )}
    </button>
  );
}
