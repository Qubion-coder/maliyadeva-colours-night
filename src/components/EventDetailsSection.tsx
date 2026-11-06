import { motion } from 'motion/react';
import { CalendarDays, Clock, Landmark, MapPin } from 'lucide-react';

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const details = [
  { icon: CalendarDays, label: 'Date', value: '2nd December 2026', sub: 'Wednesday' },
  { icon: Clock, label: 'Time', value: '3:00 PM', sub: 'Onwards' },
  { icon: Landmark, label: 'Venue', value: 'College Auditorium', sub: 'Maliyadeva College' },
];

export default function EventDetailsSection() {
  return (
    <section id="details" className="relative py-20 sm:py-28 px-4">
      <motion.div {...reveal()} className="text-center mb-12">
        <p className="font-cinzel text-[11px] tracking-[0.4em] uppercase text-[#c9b177]">The Occasion</p>
        <h2 className="mt-3 font-serif-luxury italic text-3xl sm:text-4xl text-[#f4efe6]">
          An evening honouring excellence
        </h2>
      </motion.div>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
        {details.map(({ icon: Icon, label, value, sub }, i) => (
          <motion.div
            key={label}
            {...reveal(0.1 + i * 0.12)}
            className="group relative rounded-2xl bg-dark-card border border-[#d4af37]/20 px-6 py-8 text-center overflow-hidden hover:border-[#d4af37]/45 transition-colors duration-500"
          >
            <div className="absolute inset-x-0 top-0 tricolour-rule opacity-70" />
            <div className="mx-auto mb-5 w-12 h-12 rounded-full border border-[#d4af37]/40 flex items-center justify-center bg-[#d4af37]/5 group-hover:bg-[#d4af37]/10 transition-colors">
              <Icon className="w-5 h-5 text-[#e8c15a]" strokeWidth={1.5} />
            </div>
            <p className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-[#c9b177]">{label}</p>
            <p className="mt-2 font-cinzel text-lg sm:text-xl font-semibold text-[#fae596]">{value}</p>
            <p className="mt-1 font-serif-luxury italic text-[#d8ccb4]">{sub}</p>
          </motion.div>
        ))}
      </div>

      <motion.div {...reveal(0.4)} className="mt-8 text-center">
        <a
          href="https://www.google.com/maps/search/?api=1&query=Maliyadeva+College+Kurunegala"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#d4af37]/40 text-[#f5d77f] font-cinzel text-[11px] tracking-[0.25em] uppercase hover:border-[#ffd700] hover:bg-[#d4af37]/10 transition-colors"
        >
          <MapPin className="w-4 h-4" />
          Get Directions
        </a>
      </motion.div>
    </section>
  );
}
