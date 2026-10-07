import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Check, Share2, CalendarPlus } from 'lucide-react';
import { OrnamentalSectionDivider } from './OrnamentalDivider';

export default function EventDetailsSection() {
  const [copied, setCopied] = useState(false);

  // Helper to generate Google Calendar link
  const createGoogleCalendarLink = () => {
    const title = encodeURIComponent("Billionaire's Night - Annual Staff Get Together");
    const details = encodeURIComponent(
      "North Western II Region Annual Staff Get Together at Asliya Golden Cassandra, Kurunegala."
    );
    const location = encodeURIComponent(
      "Asliya Golden Cassandra, Dambokka, Kurunegala"
    );
    // 2026-11-14 18:00 to 23:59 local (UTC approx)
    const dates = "20261114T123000Z/20261114T183000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  // Helper to download .ics iCal calendar event
  const downloadIcsFile = () => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//LOLC Finance//Billionaires Night//EN',
      'BEGIN:VEVENT',
      'UID:billionaires-night-2026@lolc.lk',
      'DTSTAMP:20260921T100000Z',
      'DTSTART:20261114T123000Z',
      'DTEND:20261114T190000Z',
      'SUMMARY:Billionaire\'s Night - Annual Staff Get Together',
      'DESCRIPTION:North Western II Region Annual Staff Get Together',
      'LOCATION:Asliya Golden Cassandra\\, Dambokka\\, Kurunegala',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Billionaires_Night_2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyVenue = () => {
    navigator.clipboard.writeText(
      'Asliya Golden Cassandra, Dambokka, Kurunegala'
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="event-details" className="relative py-14 px-4 max-w-6xl mx-auto z-10">
      {/* Ornamental Section Header */}
      <div className="text-center">
        <OrnamentalSectionDivider title="EVENT DETAILS" />
        <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-gold-shimmer mb-2">
          Essential Information
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-sans-modern max-w-md mx-auto">
          Every fine detail curated for an unforgettable staff gathering
        </p>
      </div>

      {/* Three Information Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-10">
        {/* CARD 1: DATE */}
        <div
          id="detail-card-date"
          className="group relative rounded-2xl p-6 bg-dark-card border border-gold-subtle hover:border-[#ffd700]/70 hover:border-gold-glow transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
        >
          {/* Subtle gold corner highlight */}
          <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-[#d4af37]/15 to-transparent rounded-tr-2xl pointer-events-none" />

          <div>
            {/* Minimal Luxury Gold Line Icon */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a2414] to-[#120f06] border border-[#d4af37]/40 flex items-center justify-center text-[#f5d77f] mb-5 group-hover:scale-110 transition-transform duration-300 shadow-md">
              <Calendar className="w-6 h-6 stroke-[1.5]" />
            </div>

            {/* Gold Heading */}
            <p className="font-cinzel text-xs tracking-[0.25em] text-[#d4af37] uppercase font-bold mb-2">
              DATE
            </p>

            {/* Information Text */}
            <h3 className="font-cinzel text-2xl font-bold text-[#fcfaf5] tracking-wide mb-1">
              14 November 2026
            </h3>
            <p className="font-serif-luxury italic text-lg text-[#e6d5b8]">
              Saturday
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#d4af37]/20 flex items-center gap-2">
            <button
              onClick={downloadIcsFile}
              className="text-[11px] font-cinzel text-[#fae596] hover:text-white flex items-center gap-1.5 transition-colors"
              title="Add to your calendar"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Add to Calendar</span>
            </button>
            <span className="text-neutral-600">•</span>
            <a
              href={createGoogleCalendarLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-sans-modern text-neutral-400 hover:text-[#fae596] transition-colors"
            >
              Google
            </a>
          </div>
        </div>

        {/* CARD 2: TIME */}
        <div
          id="detail-card-time"
          className="group relative rounded-2xl p-6 bg-dark-card border border-gold-subtle hover:border-[#ffd700]/70 hover:border-gold-glow transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-[#d4af37]/15 to-transparent rounded-tr-2xl pointer-events-none" />

          <div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a2414] to-[#120f06] border border-[#d4af37]/40 flex items-center justify-center text-[#f5d77f] mb-5 group-hover:scale-110 transition-transform duration-300 shadow-md">
              <Clock className="w-6 h-6 stroke-[1.5]" />
            </div>

            <p className="font-cinzel text-xs tracking-[0.25em] text-[#d4af37] uppercase font-bold mb-2">
              TIME
            </p>

            <h3 className="font-cinzel text-2xl font-bold text-[#fcfaf5] tracking-wide mb-1">
              6:00 PM
            </h3>
            <p className="font-serif-luxury italic text-lg text-[#e6d5b8]">
              Onwards
            </p>
          </div>


        </div>

        {/* CARD 3: VENUE */}
        <div
          id="detail-card-venue"
          className="group relative rounded-2xl p-6 bg-dark-card border border-gold-subtle hover:border-[#ffd700]/70 hover:border-gold-glow transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-[#d4af37]/15 to-transparent rounded-tr-2xl pointer-events-none" />

          <div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a2414] to-[#120f06] border border-[#d4af37]/40 flex items-center justify-center text-[#f5d77f] mb-5 group-hover:scale-110 transition-transform duration-300 shadow-md">
              <MapPin className="w-6 h-6 stroke-[1.5]" />
            </div>

            <p className="font-cinzel text-xs tracking-[0.25em] text-[#d4af37] uppercase font-bold mb-2">
              VENUE
            </p>

            <h3 className="font-cinzel text-lg font-bold text-[#fcfaf5] tracking-wide mb-1">
              Asliya Golden Cassandra
            </h3>
            <p className="text-xs text-[#e6d5b8] font-sans-modern leading-relaxed">
              Dambokka, Kurunegala
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#d4af37]/20 flex items-center justify-between">
            <button
              onClick={handleCopyVenue}
              className="text-[11px] font-cinzel text-[#fae596] hover:text-white flex items-center gap-1 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <span>Copy Address</span>
                </>
              )}
            </button>
            <a
              href="https://maps.app.goo.gl/3sgTDNnxk43pg2rH7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-sans-modern text-[#d4af37] hover:underline"
            >
              Maps &rarr;
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
