import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';

/**
 * Colourful smoke (maroon · rose · gold · royal blue) that drifts across the
 * page as you scroll — like the coloured smoke in the intro video.
 * Fixed behind all content; each cloud moves at its own speed/direction.
 */

interface Cloud {
  color: string;       // core colour
  edge: string;        // softer outer colour
  top: string;
  left: string;
  size: string;        // CSS size (vw-based so it scales with screen)
  dx: number;          // horizontal travel over the whole page (vw)
  dy: number;          // vertical travel over the whole page (vh)
  rotate: number;      // degrees over the whole page
  scale: [number, number];
  opacity: number;
  desktopOnly?: boolean;
}

const CLOUDS: Cloud[] = [
  { color: 'rgba(214,20,58,0.75)', edge: 'rgba(120,10,40,0.0)', top: '55%', left: '-25%', size: 'max(70vw,520px)', dx: 55, dy: -120, rotate: 40, scale: [0.9, 1.35], opacity: 0.68 },
  { color: 'rgba(42,98,255,0.75)', edge: 'rgba(14,42,140,0.0)', top: '70%', left: '55%', size: 'max(75vw,560px)', dx: -60, dy: -140, rotate: -35, scale: [1, 1.4], opacity: 0.68 },
  { color: 'rgba(240,180,41,0.6)', edge: 'rgba(160,110,20,0.0)', top: '95%', left: '15%', size: 'max(55vw,420px)', dx: 30, dy: -170, rotate: 60, scale: [0.8, 1.3], opacity: 0.48 },
  { color: 'rgba(255,92,140,0.6)', edge: 'rgba(180,30,80,0.0)', top: '110%', left: '60%', size: 'max(50vw,380px)', dx: -40, dy: -190, rotate: -50, scale: [0.85, 1.25], opacity: 0.48, desktopOnly: true },
  { color: 'rgba(110,80,230,0.55)', edge: 'rgba(60,30,140,0.0)', top: '125%', left: '-10%', size: 'max(60vw,440px)', dx: 50, dy: -210, rotate: 30, scale: [0.9, 1.3], opacity: 0.42, desktopOnly: true },
];

function SmokeCloud({ c, progress, index }: { c: Cloud; progress: MotionValue<number>; index: number }) {
  const x = useTransform(progress, [0, 1], ['0vw', `${c.dx}vw`]);
  const y = useTransform(progress, [0, 1], ['0vh', `${c.dy}vh`]);
  const rotate = useTransform(progress, [0, 1], [0, c.rotate]);
  const scale = useTransform(progress, [0, 1], c.scale);

  return (
    <motion.div
      className={`scroll-smoke ${c.desktopOnly ? 'hidden md:block' : ''}`}
      style={{
        top: c.top,
        left: c.left,
        width: c.size,
        height: c.size,
        x,
        y,
        rotate,
        scale,
        opacity: c.opacity,
        // irregular, smoke-like shape built from overlapping soft blobs
        background: `
          radial-gradient(38% 32% at 35% 40%, ${c.color}, ${c.edge} 100%),
          radial-gradient(30% 36% at 65% 55%, ${c.color}, ${c.edge} 100%),
          radial-gradient(26% 24% at 50% 25%, ${c.color}, ${c.edge} 100%),
          radial-gradient(28% 30% at 30% 70%, ${c.color}, ${c.edge} 100%)`,
        animationDelay: `${-index * 4}s`,
      }}
    />
  );
}

export default function ScrollSmoke() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  // soften the motion so the smoke glides instead of snapping to the scrollbar
  const progress = useSpring(scrollYProgress, { stiffness: 40, damping: 20, mass: 0.6 });

  if (reduce) return null;

  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {CLOUDS.map((c, i) => (
        <SmokeCloud key={i} c={c} progress={progress} index={i} />
      ))}
    </div>
  );
}
