import React, { useState } from 'react';
import { X, CheckCircle, Sparkles, Download, Phone, User, Building, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';
import { RsvpFormData, VipPass } from '../types';

interface RsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RsvpModal({ isOpen, onClose }: RsvpModalProps) {
  const [formData, setFormData] = useState<RsvpFormData>({
    fullName: '',
    department: 'North Western II Region - Kurunegala',
    staffId: '',
    phone: '',
    attending: 'yes',
    dietary: 'standard',
    notes: '',
  });

  const [submittedPass, setSubmittedPass] = useState<VipPass | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;

    // Generate unique VIP ticket pass ID
    const randomPassId = `BN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newPass: VipPass = {
      id: randomPassId,
      guestName: formData.fullName,
      department: formData.department || 'North Western II Region',
      staffId: formData.staffId || 'STAFF',
      timestamp: new Date().toLocaleDateString('en-GB'),
      dietary: formData.dietary.toUpperCase(),
      tableZone: `GOLDEN ZONE - TABLE ${Math.floor(1 + Math.random() * 15)}`,
    };

    setSubmittedPass(newPass);

    // Launch celebratory luxury gold confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFE898', '#D4AF37', '#AA771C', '#FFFFFF'],
      });
    } catch {
      // safe fallback
    }
  };

  const handlePrintPass = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg my-8 rounded-3xl bg-neutral-950 border border-[#d4af37]/60 shadow-[0_0_50px_rgba(212,175,55,0.25)] overflow-hidden">
        {/* Top Gold Bar */}
        <div className="h-1.5 w-full bg-gold-gradient" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close RSVP dialog"
          className="absolute top-4 right-4 z-10 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submittedPass ? (
          /* RSVP Form */
          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <span className="font-cinzel text-xs tracking-[0.25em] text-[#d4af37] uppercase font-bold">
                VIP Guest Registration
              </span>
              <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-gold-shimmer mt-1">
                Confirm Attendance
              </h3>
              <p className="text-xs text-neutral-400 font-sans-modern mt-1">
                Annual Staff Get Together • North Western II Region
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-cinzel tracking-wider text-[#e6d5b8] mb-1.5 uppercase">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kasun Bandara"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-[#d4af37]/30 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#ffd700] transition-colors"
                  />
                </div>
              </div>

              {/* Department / Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-cinzel tracking-wider text-[#e6d5b8] mb-1.5 uppercase">
                    Branch / Dept
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kurunegala Branch"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-[#d4af37]/30 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#ffd700] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-cinzel tracking-wider text-[#e6d5b8] mb-1.5 uppercase">
                    EPF / Staff ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NW-4820"
                    value={formData.staffId}
                    onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-[#d4af37]/30 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#ffd700] transition-colors"
                  />
                </div>
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-xs font-cinzel tracking-wider text-[#e6d5b8] mb-1.5 uppercase">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 077 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-[#d4af37]/30 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#ffd700] transition-colors"
                  />
                </div>
              </div>

              {/* Attendance Status */}
              <div>
                <label className="block text-xs font-cinzel tracking-wider text-[#e6d5b8] mb-1.5 uppercase">
                  Will You Attend?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.attending === 'yes'
                      ? 'bg-[#d4af37]/20 border-[#ffd700] text-[#fef3c7]'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  }`}>
                    <input
                      type="radio"
                      name="attending"
                      checked={formData.attending === 'yes'}
                      onChange={() => setFormData({ ...formData, attending: 'yes' })}
                      className="hidden"
                    />
                    <CheckCircle className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Joyfully Accept</span>
                  </label>
                  <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.attending === 'no'
                      ? 'bg-neutral-800 border-neutral-600 text-neutral-200'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  }`}>
                    <input
                      type="radio"
                      name="attending"
                      checked={formData.attending === 'no'}
                      onChange={() => setFormData({ ...formData, attending: 'no' })}
                      className="hidden"
                    />
                    <span className="text-xs font-semibold uppercase tracking-wider">Regretfully Decline</span>
                  </label>
                </div>
              </div>

              {/* Dietary Preferences */}
              {formData.attending === 'yes' && (
                <div>
                  <label className="block text-xs font-cinzel tracking-wider text-[#e6d5b8] mb-1.5 uppercase">
                    Dietary Preference
                  </label>
                  <select
                    value={formData.dietary}
                    onChange={(e) => setFormData({ ...formData, dietary: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-[#d4af37]/30 text-white text-sm focus:outline-none focus:border-[#ffd700]"
                  >
                    <option value="standard">Standard Gala Buffet</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="halal">Halal Option</option>
                  </select>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-gold-gradient hover:bg-gold-gradient-hover text-[#120f04] font-cinzel text-xs sm:text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 gold-button-glow flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#120f04]" />
                  <span>Submit RSVP Confirmation</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Personalized VIP Digital Pass */
          <div className="p-6 sm:p-8 text-center animate-fadeIn">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#d4af37]/20 border border-[#ffd700] flex items-center justify-center text-[#ffd700]">
              <CheckCircle className="w-8 h-8" />
            </div>

            <span className="font-cinzel text-xs tracking-[0.25em] text-[#d4af37] uppercase font-bold">
              RSVP Confirmed
            </span>
            <h3 className="font-cinzel text-2xl font-bold text-gold-shimmer my-1">
              Your VIP Digital Pass
            </h3>
            <p className="text-xs text-neutral-400 font-sans-modern mb-6">
              Please present this pass or state your name at the registration desk
            </p>

            {/* Ticket Card */}
            <div className="relative rounded-2xl p-6 bg-gradient-to-b from-[#1c1810] via-[#0d0c0a] to-[#050505] border-2 border-[#d4af37] text-left shadow-2xl overflow-hidden">
              {/* Corner Watermark */}
              <div className="absolute top-2 right-3 font-cinzel text-[10px] tracking-widest text-[#d4af37] font-bold">
                VIP PASS #{submittedPass.id}
              </div>

              <div className="mb-4">
                <p className="font-cinzel text-[10px] tracking-[0.2em] text-[#aa771c] uppercase">
                  Billionaire's Night 2026
                </p>
                <h4 className="font-cinzel text-xl font-bold text-white uppercase tracking-wider">
                  {submittedPass.guestName}
                </h4>
                <p className="text-xs text-[#e6d5b8]">
                  {submittedPass.department} • Staff ID: {submittedPass.staffId}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#d4af37]/30 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-cinzel">Date & Time</span>
                  <p className="text-white font-semibold">14 Nov 2026 • 6:00 PM</p>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-cinzel">Venue</span>
                  <p className="text-white font-semibold">Asliya Golden, Kurunegala</p>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-cinzel">Seating</span>
                  <p className="text-[#ffd700] font-semibold">{submittedPass.tableZone}</p>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-cinzel">Menu Choice</span>
                  <p className="text-white font-semibold">{submittedPass.dietary}</p>
                </div>
              </div>

              {/* QR Code Simulation */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-white p-1 rounded-md">
                    <svg viewBox="0 0 24 24" className="w-full h-full text-black fill-current">
                      <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v2h-4v-2zm-4 0h2v4h-2v-4zm2 4h4v2h-4v-2zm2-2h2v2h-2v-2z" />
                    </svg>
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    <p className="font-semibold text-[#f5d77f]">Authorized Entry</p>
                    <p>North Western II Region</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#fae596] text-[10px] font-cinzel font-bold">
                    VALIDATED
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={handlePrintPass}
                className="px-5 py-2.5 rounded-full bg-neutral-900 border border-[#d4af37]/50 hover:border-[#ffd700] text-xs font-cinzel text-[#fae596] flex items-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save / Print Pass</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-gold-gradient text-black text-xs font-cinzel font-bold uppercase tracking-wider hover:bg-gold-gradient-hover transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
