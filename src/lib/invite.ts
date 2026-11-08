/**
 * Personal invitation links for Coloursmen.
 *
 * The guest's name travels inside the link itself (?to=<code>), so no server
 * or database is needed: anyone opening the link sees their own name on the
 * opening screen. The plain site link (no ?to=) stays the general invitation.
 *
 * The code is base64url-encoded UTF-8, so Sinhala/Tamil names work and the
 * link looks tidy in WhatsApp.
 */

const PARAM = 'to';
const MAX_NAME = 60;

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(code: string): string {
  const b64 = code.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Tidy whitespace and cap the length so a bad link can't break the layout. */
export function cleanName(name: string): string {
  return name.replace(/\s+/g, ' ').trim().slice(0, MAX_NAME);
}

export function buildInviteLink(name: string, origin = window.location.origin): string {
  return `${origin}/?${PARAM}=${toBase64Url(cleanName(name))}`;
}

/** Reads the guest name from the current URL, or null for the general invitation. */
export function readGuestName(search = window.location.search): string | null {
  const code = new URLSearchParams(search).get(PARAM);
  if (!code) return null;
  try {
    const name = cleanName(fromBase64Url(code));
    return name || null;
  } catch {
    return null;
  }
}

/**
 * Turns a Sri Lankan phone number into WhatsApp's international format.
 * "077 123 4567" / "+94771234567" / "0094..." → "94771234567". Returns null if unusable.
 */
export function toWhatsAppNumber(raw: string): string | null {
  let digits = raw.replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = '94' + digits.slice(1);
  if (digits.length === 9) digits = '94' + digits; // e.g. 771234567
  return digits.length >= 10 && digits.length <= 15 ? digits : null;
}
