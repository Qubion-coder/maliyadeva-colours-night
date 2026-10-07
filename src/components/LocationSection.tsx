import React from 'react';
import { MapPin, ExternalLink, Navigation, Compass, Car } from 'lucide-react';
import { OrnamentalSectionDivider } from './OrnamentalDivider';

export default function LocationSection() {
  const mapLink = 'https://maps.app.goo.gl/3sgTDNnxk43pg2rH7';
  // Kurunegala / Dambokka coordinates for Golden Cassandra / Asliya: ~7.4475, 80.3700
  const embedMapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15822.428456209426!2d80.360144!3d7.453982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae33bb2a0000001%3A0x6b4f76269df919!2sGolden%20Cassandra!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk';

  return (
    <section id="location-section" className="relative py-14 px-4 max-w-5xl mx-auto z-10">
      <div className="text-center">
        <OrnamentalSectionDivider title="LOCATION" />
        <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-gold-shimmer mb-2">
          The Venue
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-sans-modern max-w-md mx-auto">
          Asliya, Golden Cassandra • Dambokka, Kurunegala
        </p>
      </div>

      {/* Main Location Card */}
      <div className="mt-10 rounded-3xl p-6 sm:p-8 bg-dark-card border border-[#d4af37]/40 shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Map Preview Column */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden border border-[#d4af37]/40 aspect-[16/10] sm:aspect-[16/9] shadow-inner bg-neutral-900 group">
              {/* Google Map iframe */}
              <iframe
                title="Asliya Golden Cassandra Kurunegala Location Map"
                src={embedMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(85%) contrast(120%)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />

              {/* Gold Pin Badge Overlay */}
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/85 border border-[#d4af37]/60 backdrop-blur-md text-xs text-[#fae596] shadow-lg pointer-events-none">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37]" />
                <span className="font-cinzel font-semibold">The Venue</span>
              </div>

              {/* Interactive Direct Map Link Overlay Button on Hover */}
              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/90 border border-[#d4af37] text-xs font-cinzel text-[#fae596] hover:bg-[#d4af37] hover:text-black transition-all shadow-xl"
              >
                <span>Open in Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
                <p className="font-cinzel text-xs tracking-[0.25em] text-[#d4af37] uppercase font-bold">
                  VENUE ADDRESS
                </p>
              </div>

              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mb-2">
                Asliya Golden Cassandra
              </h3>
              <p className="text-sm text-[#e6d5b8] font-sans-modern leading-relaxed">
                Dambokka, Kurunegala,
                <br />
                Sri Lanka
              </p>
            </div>

            {/* Practical Amenities */}
            <div className="space-y-2.5 pt-2 border-t border-[#d4af37]/20 text-xs font-sans-modern text-neutral-300">
              <div className="flex items-start gap-2.5">
                <Car className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>Dedicated VIP & Staff Vehicle Parking Available</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Compass className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>Convenient access via Colombo - Kurunegala Expressway</span>
              </div>
            </div>

            {/* View on Google Maps Button */}
            <div className="pt-2">
              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                id="view-google-maps-btn"
                className="w-full py-3.5 px-6 rounded-full bg-neutral-950 hover:bg-neutral-900 border-2 border-[#d4af37] hover:border-[#ffd700] text-[#f5d77f] font-cinzel text-xs sm:text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg group"
              >
                <MapPin className="w-4 h-4 text-[#d4af37] group-hover:scale-110 transition-transform" />
                <span>VIEW ON GOOGLE MAPS</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
