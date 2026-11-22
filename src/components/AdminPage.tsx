import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Copy, Download, ExternalLink, FileSpreadsheet, Plus, Send, SkipForward, Trash2, Users } from 'lucide-react';
import Crest from './Crest';
import { buildInviteLink, toWhatsAppNumber } from '../lib/invite';
import { fileToGuests, textToGuests, type ImportedGuest } from '../lib/importGuests';

interface Guest {
  id: string;
  name: string;
  phone: string;
  sent: boolean;
}

const STORE_GUESTS = 'mdc-colours-guests';
const STORE_TEMPLATE = 'mdc-colours-template';
const STORE_MODE = 'mdc-colours-wa-mode';

/** How WhatsApp opens: 'auto' = wa.me (phones), 'web' = WhatsApp Web in one reused tab (computers) */
type SendMode = 'auto' | 'web';

const DEFAULT_TEMPLATE = `Dear {name},

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

export default function AdminPage() {
  const [guests, setGuests] = useState<Guest[]>(() => load(STORE_GUESTS, []));
  const [template, setTemplate] = useState<string>(() => load(STORE_TEMPLATE, DEFAULT_TEMPLATE));
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [mode, setMode] = useState<SendMode>(() => load(STORE_MODE, 'auto'));
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  // people skipped in this bulk-send session (go to the end of the queue)
  const [skipped, setSkipped] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => save(STORE_GUESTS, guests), [guests]);
  useEffect(() => save(STORE_TEMPLATE, template), [template]);
  useEffect(() => save(STORE_MODE, mode), [mode]);

  // Keep this page out of search engines
  useEffect(() => {
    document.title = 'Admin · Personal Invitations';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  /** Adds new names; for names already in the list, fills in a missing phone number */
  const mergeGuests = (parsed: ImportedGuest[]) => {
    const next = guests.map((g) => ({ ...g }));
    const byName = new Map(next.map((g) => [g.name.toLowerCase(), g]));
    let added = 0;
    let updated = 0;
    let duplicate = 0;
    parsed.forEach((p, i) => {
      const existing = byName.get(p.name.toLowerCase());
      if (existing) {
        if (!existing.phone && p.phone) { existing.phone = p.phone; updated++; }
        else duplicate++;
        return;
      }
      const g = { id: `${Date.now()}-${i}`, name: p.name, phone: p.phone, sent: false };
      byName.set(p.name.toLowerCase(), g);
      next.push(g);
      added++;
    });
    setGuests(next);
    const noPhone = parsed.filter((p) => !toWhatsAppNumber(p.phone)).length;
    const parts = [`${added} added`];
    if (updated) parts.push(`${updated} numbers filled in`);
    if (duplicate) parts.push(`${duplicate} already in the list`);
    if (noPhone) parts.push(`${noPhone} without a valid WhatsApp number`);
    setNotice({ ok: true, text: parts.join(' · ') });
  };

  const addGuests = () => {
    const parsed = textToGuests(input);
    if (!parsed.length) return;
    mergeGuests(parsed);
    setInput('');
  };

  const importFile = async (file: File | undefined) => {
    if (!file) return;
    setNotice({ ok: true, text: `Reading ${file.name}…` });
    try {
      const parsed = await fileToGuests(file);
      if (!parsed.length) {
        setNotice({ ok: false, text: 'No names found. Make sure the sheet has a "Name" column.' });
        return;
      }
      mergeGuests(parsed);
    } catch (err) {
      setNotice({ ok: false, text: err instanceof Error ? err.message : 'Could not read that file.' });
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
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
    if (mode === 'web') {
      return num
        ? `https://web.whatsapp.com/send?phone=${num}&text=${text}`
        : `https://web.whatsapp.com/send?text=${text}`;
    }
    return num ? `https://wa.me/${num}?text=${text}` : `https://wa.me/?text=${text}`;
  };
  // WhatsApp Web reuses one tab instead of opening a new tab per person
  const waTarget = mode === 'web' ? 'mdc-whatsapp' : '_blank';

  /** Bulk sending queue: everyone with a valid number who hasn't been sent yet, in list order */
  const queue = guests.filter((g) => !g.sent && toWhatsAppNumber(g.phone));
  const withNumber = guests.filter((g) => toWhatsAppNumber(g.phone)).length;
  const current = queue.find((g) => !skipped.includes(g.id)) ?? queue[0];

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
    a.download = 'personal-invitations.csv';
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
            <h1 className="font-cinzel text-xl sm:text-2xl font-semibold text-gold-gradient">Personal Invitations</h1>
          </div>
        </header>
        <p className="mt-4 text-sm text-[#d8ccb4] leading-relaxed">
          Add each guest's name (management, merit holders, Coloursmen…) to create a personal link. Their name
          appears on the opening screen of the invitation. The normal link (without a name) still works for everyone else.
        </p>

        {/* Add names */}
        <section className="mt-8 rounded-2xl border border-[#d4af37]/25 bg-[#0b1650]/60 p-4 sm:p-6">
          <h2 className="font-cinzel text-sm tracking-[0.2em] uppercase text-[#f5d77f]">Add names</h2>

          {/* Excel / CSV upload */}
          <div className="mt-3 rounded-xl border border-dashed border-[#d4af37]/40 bg-[#050b2a]/50 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gold-gradient text-[#120f04] font-cinzel text-xs font-bold tracking-[0.2em] uppercase"
            >
              <FileSpreadsheet className="w-4 h-4" /> Upload Excel / CSV
            </button>
            <p className="text-xs text-[#a9a08a] leading-relaxed">
              Columns like <span className="text-[#f3e5ab]"># · Name · WhatsApp No</span>. The “#” column is ignored and
              numbers like 0771234567 or 771234567 both work.
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.csv,.txt,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
              className="hidden"
              onChange={(e) => importFile(e.target.files?.[0])}
            />
          </div>
          {notice && (
            <p className={`mt-3 text-xs rounded-lg px-3 py-2 ${notice.ok ? 'bg-emerald-900/30 text-emerald-200 border border-emerald-400/20' : 'bg-red-900/30 text-red-200 border border-red-400/20'}`}>
              {notice.text}
            </p>
          )}

          <p className="mt-5 text-xs text-[#a9a08a]">
            Or type / paste names — one per line, with the number after a comma, e.g.{' '}
            <span className="text-[#f3e5ab]">Kasun Perera, 0771234567</span>. Rows copied from Excel work too.
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

        {/* Bulk send */}
        {withNumber > 0 && (
          <section className="mt-8 rounded-2xl border border-[#1fa855]/40 bg-[linear-gradient(180deg,rgba(31,168,85,0.12),rgba(11,22,80,0.6))] p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-cinzel text-sm tracking-[0.2em] uppercase text-[#7ff0a8]">Send to all on WhatsApp</h2>
              <div className="inline-flex rounded-full border border-white/15 p-0.5 text-xs">
                {(['auto', 'web'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-3 py-1.5 rounded-full ${mode === m ? 'bg-[#1fa855] text-white' : 'text-[#d8ccb4]'}`}
                  >
                    {m === 'auto' ? 'On phone' : 'On computer (WhatsApp Web)'}
                  </button>
                ))}
              </div>
            </div>

            {/* progress */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-[#d8ccb4]">
                <span>{withNumber - queue.length} of {withNumber} sent</span>
                <span>{queue.length} left</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-[#1fa855] transition-[width] duration-500"
                  style={{ width: `${((withNumber - queue.length) / withNumber) * 100}%` }}
                />
              </div>
            </div>

            {current ? (
              <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
                <a
                  href={whatsappUrl(current)}
                  target={waTarget}
                  rel="noreferrer"
                  onClick={() => {
                    update(current.id, { sent: true });
                    setSkipped((s) => s.filter((id) => id !== current.id));
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-[#1fa855] hover:bg-[#25c463] text-white font-semibold text-sm shadow-[0_8px_24px_rgba(31,168,85,0.35)]"
                >
                  <Send className="w-5 h-5" />
                  <span className="truncate">Send to {current.name}</span>
                </a>
                <button
                  onClick={() =>
                    setSkipped((s) => (s.includes(current.id) ? [...s.filter((id) => id !== current.id), current.id] : [...s, current.id]))
                  }
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border border-white/20 text-[#d8ccb4] text-xs"
                >
                  <SkipForward className="w-4 h-4" /> Skip for now
                </button>
              </div>
            ) : (
              <p className="mt-5 text-sm text-[#7ff0a8]">🎉 Everyone with a WhatsApp number has been sent their invitation.</p>
            )}

            <p className="mt-4 text-[11px] text-[#a9a08a] leading-relaxed">
              Tap the green button → WhatsApp opens with the message ready → press <b>Send</b> in WhatsApp → come back and
              tap again for the next person. WhatsApp doesn't allow fully automatic bulk sending from a normal account, so
              one tap each keeps your number safe. Sending to many people who haven't saved your number can get an
              account flagged — sending at a calm pace helps.
              {mode === 'web' && ' WhatsApp Web opens in one tab that is reused for each person.'}
            </p>
          </section>
        )}

        {/* Guest list */}
        <section className="mt-8">
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <h2 className="flex items-center gap-2 font-cinzel text-sm tracking-[0.2em] uppercase text-[#f5d77f]">
              <Users className="w-4 h-4" /> {guests.length} guests
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
                      target={waTarget}
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
