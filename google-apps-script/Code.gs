/**
 * Billionaire's Night – RSVP collector
 *
 * Paste this into Extensions → Apps Script of the RSVP spreadsheet,
 * then Deploy → New deployment → Web app
 *   Execute as: Me
 *   Who has access: Anyone
 * After editing, Deploy → Manage deployments → Edit → Version: New version.
 */

const SPREADSHEET_ID = '1jVtWX7GysUAfTn31eCq51VSQzr6RaePBbOqkO4gY-PU';
const SHEET_NAME = 'RSVP';

const HEADERS = [
  'Submitted Date',
  'Submitted Time',
  'Full Name',
  'Branch',
  'Mobile Number',
  'Attending',
  'Dietary Preference',
];

const DIETARY_LABELS = {
  standard: 'Standard Gala Buffet',
  vegetarian: 'Vegetarian',
  halal: 'Halal Option',
};

function getSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // Create (or repair) the header row
  const width = Math.max(sheet.getLastColumn(), HEADERS.length);
  const current = sheet.getRange(1, 1, 1, width).getValues()[0];
  const expected = HEADERS.concat(new Array(width - HEADERS.length).fill(''));
  if (current.join('|') !== expected.join('|')) {
    sheet.getRange(1, 1, 1, width).clear();
    sheet
      .getRange(1, 1, 1, HEADERS.length)
      .setValues([HEADERS])
      .setFontWeight('bold')
      .setBackground('#d4af37')
      .setFontColor('#120f04')
      .setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    sheet.setColumnWidths(1, HEADERS.length, 170);
    // Store date, time and phone as text so Sheets doesn't reformat them
    sheet.getRange('A:B').setNumberFormat('@');
    sheet.getRange('E:E').setNumberFormat('@');
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (!data.fullName || !String(data.fullName).trim()) {
      return json_({ ok: false, error: 'Full name is required' });
    }

    const sheet = getSheet_();
    const now = new Date();
    const tz = 'Asia/Colombo';
    const attending = data.attending !== 'no';

    sheet.appendRow([
      Utilities.formatDate(now, tz, 'dd/MM/yyyy'),
      Utilities.formatDate(now, tz, 'hh:mm a'),
      String(data.fullName).trim(),
      data.branch || '',
      data.phone ? String(data.phone) : '',
      attending ? 'Yes' : 'No',
      attending ? DIETARY_LABELS[data.dietary] || data.dietary || '' : '',
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Visit the /exec URL in a browser to check the deployment and create the sheet
function doGet() {
  getSheet_();
  return json_({ ok: true, message: 'RSVP endpoint is live' });
}
