/**
 * Turns spreadsheet rows (Excel upload, CSV upload or text pasted from Excel)
 * into { name, phone } guests.
 *
 * Works with or without a header row. With headers like
 * "# | Name | WhatsApp No" the columns are picked by title; without headers,
 * the name is the first cell with letters and the phone is the first cell
 * that looks like a phone number. A "#" / serial-number column is ignored.
 */
import { cleanName } from './invite';

export interface ImportedGuest {
  name: string;
  phone: string;
}

type Cell = string | number | boolean | Date | null | undefined | unknown;

const NAME_HEADER = /name|නම/i;
const PHONE_HEADER = /whats\s*app|phone|mobile|tel|contact|number|no\.?$|අංකය/i;

const text = (c: Cell) => (c == null ? '' : String(c).trim());
const hasLetters = (s: string) => /\p{L}/u.test(s);
/** 9–15 digits once spaces/dashes/+ are removed (Excel often drops the leading 0) */
const looksLikePhone = (s: string) => {
  const d = s.replace(/[\s\-+().]/g, '');
  return /^\d{9,15}$/.test(d);
};

/** Excel stores 0771234567 as the number 771234567 — keep it readable as 0771234567 */
function formatPhone(c: Cell): string {
  const s = text(c);
  if (typeof c === 'number' && /^\d{9}$/.test(s)) return '0' + s;
  return s;
}

export function rowsToGuests(rows: Cell[][]): ImportedGuest[] {
  const clean = rows.filter((r) => r && r.some((c) => text(c) !== ''));
  if (!clean.length) return [];

  // Look for a header row within the first few rows
  let nameCol = -1;
  let phoneCol = -1;
  let start = 0;
  for (let i = 0; i < Math.min(5, clean.length); i++) {
    const cells = clean[i].map(text);
    const n = cells.findIndex((c) => NAME_HEADER.test(c) && !looksLikePhone(c));
    if (n !== -1) {
      nameCol = n;
      phoneCol = cells.findIndex((c, j) => j !== n && PHONE_HEADER.test(c) && c !== '#');
      start = i + 1;
      break;
    }
  }

  const out: ImportedGuest[] = [];
  for (const row of clean.slice(start)) {
    const cells = row.map(text);
    let name = nameCol !== -1 ? cells[nameCol] ?? '' : '';
    let phoneIdx = phoneCol;

    // No header (or empty cell): first cell with letters is the name
    if (!name || !hasLetters(name)) {
      const idx = cells.findIndex((c) => hasLetters(c) && !looksLikePhone(c));
      name = idx !== -1 ? cells[idx] : '';
    }
    if (phoneIdx === -1 || !looksLikePhone(cells[phoneIdx] ?? '')) {
      phoneIdx = cells.findIndex((c) => looksLikePhone(c));
    }

    const cleaned = cleanName(name);
    if (!cleaned) continue;
    out.push({ name: cleaned, phone: phoneIdx !== -1 ? formatPhone(row[phoneIdx]) : '' });
  }
  return out;
}

/** Text pasted from Excel (tab separated) or typed "Name, 0771234567" lines */
export function textToGuests(input: string): ImportedGuest[] {
  const rows = input
    .split(/\r?\n/)
    .map((line) => (line.includes('\t') ? line.split('\t') : line.split(/[,;]/)));
  return rowsToGuests(rows);
}

/** Minimal CSV parser (handles quoted fields with commas) */
function parseCsv(src: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  const delim = src.split(/\r?\n/, 1)[0].includes(';') && !src.split(/\r?\n/, 1)[0].includes(',') ? ';' : ',';
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === delim || ch === '\t') { row.push(field); field = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += ch;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

/** Reads an uploaded .xlsx or .csv file */
export async function fileToGuests(file: File): Promise<ImportedGuest[]> {
  const lower = file.name.toLowerCase();
  if (lower.endsWith('.csv') || lower.endsWith('.txt') || file.type === 'text/csv') {
    return rowsToGuests(parseCsv((await file.text()).replace(/^﻿/, '')));
  }
  if (lower.endsWith('.xls')) {
    throw new Error('Old .xls files are not supported — in Excel use "Save As" → "Excel Workbook (.xlsx)" or CSV.');
  }
  // Loaded only when needed so the invitation page stays light
  const { readSheet } = await import('read-excel-file/browser');
  const rows = await readSheet(file);
  return rowsToGuests(rows as Cell[][]);
}
