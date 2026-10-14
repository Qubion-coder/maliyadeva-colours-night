import React, { useState } from 'react';
import { X, CheckCircle, Sparkles, Phone, User, Building } from 'lucide-react';
import confetti from 'canvas-confetti';
import { RsvpFormData } from '../types';

interface RsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RsvpModal({ isOpen, onClose }: RsvpModalProps) {
  const [formData, setFormData] = useState<RsvpFormData>({
    fullName: '',
    department: '',
    phone: '',
    attending: 'yes',
    dietary: 'standard',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const scriptUrl =
        'https://script.google.com/macros/s/AKfycbyYmA37U1_fjTdyLirO-oe75enhyNW9GW9eCaRftZGXUcS1ekWxDPnyPZUbrBWgX0gkSg/exec';

      // text/plain avoids a CORS preflight, which Apps Script does not support
      const res = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          branch: formData.department.trim(),
          phone: formData.phone.trim(),
          attending: formData.attending,
          dietary: formData.dietary,
        }),
      });
      const result = await res.json();
      if (!result.ok) throw new Error(result.error || 'Submission failed');
    } catch (err) {
      console.error('RSVP submission failed', err);
      setSubmitError('Could not save your RSVP. Please check your connection and try again.');
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(false);
    setIsSubmitted(true);

    // Launch celebratory luxury gold confetti
    if (formData.attending === 'yes') {
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
    }
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

        {!isSubmitted ? (
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


              {/* Branch */}
              <div>
                <label className="block text-xs font-cinzel tracking-wider text-[#e6d5b8] mb-1.5 uppercase">
                  Branch *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kurunegala"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-[#d4af37]/30 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#ffd700] transition-colors"
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
                {submitError && (
                  <p className="mb-3 text-xs text-red-400 text-center font-sans-modern">{submitError}</p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-gold-gradient hover:bg-gold-gradient-hover text-[#120f04] font-cinzel text-xs sm:text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 gold-button-glow flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait"
                >
                  <Sparkles className={`w-4 h-4 text-[#120f04] ${isSubmitting ? 'animate-spin' : ''}`} />
                  <span>{isSubmitting ? 'Saving RSVP…' : 'Submit RSVP Confirmation'}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Thank You Message */
          <div className="p-8 sm:p-10 text-center animate-fadeIn">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#d4af37]/20 border border-[#ffd700] flex items-center justify-center text-[#ffd700]">
              <CheckCircle className="w-9 h-9" />
            </div>

            <span className="font-cinzel text-xs tracking-[0.25em] text-[#d4af37] uppercase font-bold">
              RSVP Received
            </span>
            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-gold-shimmer my-2">
              Thank You, {formData.fullName.trim().split(' ')[0]}!
            </h3>
            <p className="text-sm text-neutral-300 font-sans-modern leading-relaxed">
              {formData.attending === 'yes'
                ? "Your attendance has been confirmed. We look forward to celebrating with you at Billionaire's Night."
                : "We're sorry you can't make it. Thank you for letting us know — you'll be missed!"}
            </p>

            <button
              onClick={onClose}
              className="mt-8 px-8 py-2.5 rounded-full bg-gold-gradient text-black text-xs font-cinzel font-bold uppercase tracking-wider hover:bg-gold-gradient-hover transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
