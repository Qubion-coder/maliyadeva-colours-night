import { useEffect, useMemo, useState } from 'react';
import { Check, Copy, Download, ExternalLink, Plus, Send, Trash2, Users } from 'lucide-react';
import Crest from './Crest';
import { buildInviteLink, cleanName, toWhatsAppNumber } from '../lib/invite';

interface Guest {
  id: string;
  name: string;
  phone: string;
  sent: boolean;
}

const STORE_GUESTS = 'mdc-colours-guests';
const STORE_TEMPLATE = 'mdc-colours-template';

const DEFAULT_TEMPLATE = `Dear {name},

Congratulations on being awarded College Colours! 🏅
You are cordially invited to the Maliyadeva College Colours Awarding Ceremony 2024/2025.

📅 Wednesday, 2nd December 2026
🕒 3:00 PM onwards
📍 College Auditorium

Open your personal invitation:
{link}`;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — list still works for this session */
  }
}

/** "Name, 0771234567" or "Name<TAB>0771234567" or just "Name" */
function parseLines(text: string): { name: string; phone: string }[] {
  return text
    .split(/\r?\n/)
    .map((line) => {
      const [name, ...rest] = line.split(/[,\t]/);
      return { name: cleanName(name ?? ''), phone: rest.join(' ').trim() };
    })
    .filter((g) => g.name);
}

export default function AdminPage() {
  const [guests, setGuests] = useState<Guest[]>(() => load(STORE_GUESTS, []));
  const [template, setTemplate] = useState<string>(() => load(STORE_TEMPLATE, DEFAULT_TEMPLATE));
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => save(STORE_GUESTS, guests), [guests]);
  useEffect(() => save(STORE_TEMPLATE, template), [template]);

  // Keep this page out of search engines
  useEffect(() => {
    document.title = 'Admin · Colours Invitations';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  const addGuests = () => {
    const parsed = parseLines(input);
    if (!parsed.length) return;
    setGuests((prev) => {
      const existing = new Set(prev.map((g) => g.name.toLowerCase()));
      const fresh = parsed
        .filter((g) => !existing.has(g.name.toLowerCase()))
        .map((g, i) => ({ id: `${Date.now()}-${i}`, name: g.name, phone: g.phone, sent: false }));
      return [...prev, ...fresh];
    });
    setInput('');
  };

  const update = (id: string, patch: Partial<Guest>) =>
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));

  const remove = (id: string) => setGuests((prev) => prev.filter((g) => g.id !== id));

  const messageFor = (g: Guest) =>
    template.replaceAll('{name}', g.name).replaceAll('{link}', buildInviteLink(g.name));

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1600);
  };

  const whatsappUrl = (g: Guest) => {
    const num = toWhatsAppNumber(g.phone);
    const text = encodeURIComponent(messageFor(g));
    return num ? `https://wa.me/${num}?text=${text}` : `https://wa.me/?text=${text}`;
  };

  const exportCsv = () => {
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const rows = [
      ['Name', 'Phone', 'Invitation link', 'Sent'],
      ...guests.map((g) => [g.name, g.phone, buildInviteLink(g.name), g.sent ? 'Yes' : 'No']),
    ];
    const csv = '﻿' + rows.map((r) => r.map(esc).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'coloursmen-invitations.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const shown = useMemo(
    () => guests.filter((g) => g.name.toLowerCase().includes(filter.toLowerCase())),
    [guests, filter],
  );
  const sentCount = guests.filter((g) => g.sent).length;

  return (
    <div className="min-h-screen bg-[#050b2a] text-[#f4efe6] font-sans-modern">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,#14298a_0%,#0a1650_35%,#050b2a_75%)]" />

      <div className="relative max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="flex items-center gap-4">
          <Crest className="w-12 h-14" />
          <div>
            <p className="font-cinzel text-[11px] tracking-[0.3em] uppercase text-[#c9b177]">Maliyadeva College</p>
            <h1 className="font-cinzel text-xl sm:text-2xl font-semibold text-gold-gradient">Coloursmen Invitations</h1>
          </div>
        </header>
        <p className="mt-4 text-sm text-[#d8ccb4] leading-relaxed">
          Add each Coloursman's name to create a personal link. Their name appears on the opening screen of the
          invitation. The normal link (without a name) still works for everyone else.
        </p>

        {/* Add names */}
        <section className="mt-8 rounded-2xl border border-[#d4af37]/25 bg-[#0b1650]/60 p-4 sm:p-6">
          <h2 className="font-cinzel text-sm tracking-[0.2em] uppercase text-[#f5d77f]">Add names</h2>
          <p className="mt-1 text-xs text-[#a9a08a]">
            One per line. Add a phone number after a comma to send straight to their WhatsApp —
            e.g. <span className="text-[#f3e5ab]">Kasun Perera, 0771234567</span>. You can paste from Excel.
          </p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            placeholder={'Kasun Perera, 0771234567\nNimal Bandara\nසචින් ජයසූරිය, 0712345678'}
            className="mt-3 w-full rounded-xl bg-[#050b2a]/80 border border-[#d4af37]/25 focus:border-[#f5d77f] focus:outline-none p-3 text-sm placeholder:text-neutral-500"
          />
          <button
            onClick={addGuests}
            disabled={!input.trim()}
            className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-gradient text-[#120f04] font-cinzel text-xs font-bold tracking-[0.2em] uppercase disabled:opacity-40"
          >
            <Plus className="w-4 h-4" /> Create links
          </button>
        </section>

        {/* Message template */}
        <details className="mt-4 rounded-2xl border border-[#d4af37]/25 bg-[#0b1650]/60 p-4 sm:p-6">
          <summary className="cursor-pointer font-cinzel text-sm tracking-[0.2em] uppercase text-[#f5d77f]">
            WhatsApp message
          </summary>
          <p className="mt-2 text-xs text-[#a9a08a]">
            <span className="text-[#f3e5ab]">{'{name}'}</span> and <span className="text-[#f3e5ab]">{'{link}'}</span> are
            filled in for each person.
          </p>
          <textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            rows={11}
            className="mt-3 w-full rounded-xl bg-[#050b2a]/80 border border-[#d4af37]/25 focus:border-[#f5d77f] focus:outline-none p-3 text-sm"
          />
          <button onClick={() => setTemplate(DEFAULT_TEMPLATE)} className="mt-2 text-xs text-[#c9b177] underline underline-offset-4">
            Reset to default
          </button>
        </details>

        {/* Guest list */}
        <section className="mt-8">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <h2 className="flex items-center gap-2 font-cinzel text-sm tracking-[0.2em] uppercase text-[#f5d77f]">
              <Users className="w-4 h-4" /> {guests.length} Coloursmen
              <span className="text-[#a9a08a] normal-case tracking-normal font-sans-modern text-xs">· {sentCount} sent</span>
            </h2>
            <div className="flex items-center gap-2">
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search"
                className="w-32 sm:w-44 rounded-full bg-[#050b2a]/80 border border-[#d4af37]/25 focus:border-[#f5d77f] focus:outline-none px-4 py-2 text-xs"
              />
              <button
                onClick={exportCsv}
                disabled={!guests.length}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#d4af37]/40 text-[#f5d77f] text-xs disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            </div>
          </div>

          {!guests.length && (
            <p className="mt-6 text-center text-sm text-[#a9a08a] py-10 rounded-2xl border border-dashed border-[#d4af37]/20">
              No names yet — add some above.
            </p>
          )}

          <ul className="mt-4 space-y-3">
            {shown.map((g) => {
              const link = buildInviteLink(g.name);
              const hasNumber = !!toWhatsAppNumber(g.phone);
              return (
                <li
                  key={g.id}
                  className={`rounded-2xl border p-4 transition-colors ${g.sent ? 'border-emerald-400/30 bg-emerald-900/10' : 'border-[#d4af37]/20 bg-[#0b1650]/50'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-cinzel font-semibold text-[#fae596] break-words">{g.name}</p>
                      <input
                        value={g.phone}
                        onChange={(e) => update(g.id, { phone: e.target.value })}
                        placeholder="WhatsApp number (optional)"
                        className="mt-1 w-56 max-w-full bg-transparent border-b border-[#d4af37]/20 focus:border-[#f5d77f] focus:outline-none text-xs py-1 placeholder:text-neutral-500"
                      />
                    </div>
                    <label className="shrink-0 flex items-center gap-1.5 text-xs text-[#d8ccb4] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={g.sent}
                        onChange={(e) => update(g.id, { sent: e.target.checked })}
                        className="accent-[#d4af37] w-4 h-4"
                      />
                      Sent
                    </label>
                  </div>

                  <p className="mt-2 text-[11px] text-[#8f88a8] break-all">{link}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={whatsappUrl(g)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => update(g.id, { sent: true })}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1fa855] hover:bg-[#25c463] text-white text-xs font-semibold"
                      title={hasNumber ? 'Open WhatsApp chat with this number' : 'Choose a WhatsApp contact'}
                    >
                      <Send className="w-3.5 h-3.5" /> {hasNumber ? 'WhatsApp' : 'Share'}
                    </a>
                    <button
                      onClick={() => copy(`m-${g.id}`, messageFor(g))}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#d4af37]/40 text-[#f5d77f] text-xs"
                    >
                      {copied === `m-${g.id}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Message
                    </button>
                    <button
                      onClick={() => copy(`l-${g.id}`, link)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#d4af37]/40 text-[#f5d77f] text-xs"
                    >
                      {copied === `l-${g.id}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} Link
                    </button>
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#d4af37]/40 text-[#f5d77f] text-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Preview
                    </a>
                    <button
                      onClick={() => confirm(`Remove ${g.name}?`) && remove(g.id)}
                      className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-red-300/80 hover:text-red-300 text-xs"
                      aria-label={`Remove ${g.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {guests.length > 0 && (
            <button
              onClick={() => confirm('Remove all names from this list?') && setGuests([])}
              className="mt-6 text-xs text-red-300/70 hover:text-red-300 underline underline-offset-4"
            >
              Clear list
            </button>
          )}
        </section>

        <p className="mt-10 text-[11px] text-[#8f88a8] leading-relaxed">
          This list is saved in this browser only. Use “CSV” to keep a copy or move it to another device.
        </p>
      </div>
    </div>
  );
}
