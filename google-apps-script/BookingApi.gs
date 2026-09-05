/**
 * Dr. Shilpa's MOTHER CARE — Appointment Sheet API
 *
 * SETUP (one-time):
 * 1. Create a Google Sheet named "Clinic Bookings".
 * 2. Extensions → Apps Script → paste this entire file → Save.
 * 3. Set SCRIPT_SECRET below to the same value as BOOKING_SCRIPT_SECRET (Vercel / .env.local).
 * 4. Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone   ← CRITICAL (NOT "Anyone with Google account")
 * 5. Copy the Web App URL into Vercel as BOOKING_SCRIPT_URL (no VITE_ prefix)
 *
 * If access is wrong, the site gets a Google login page and no Sheet rows are written.
 */

var SCRIPT_SECRET = 'CHANGE_ME_TO_A_LONG_RANDOM_SECRET';
var SHEET_NAME = 'Bookings';
var HEADERS = [
  'id',
  'created_at',
  'patient_name',
  'phone',
  'doctor_id',
  'doctor_name',
  'service',
  'date',
  'time',
  'status',
  'patient_type',
  'reason',
  'manage_token'
];

function doGet(e) {
  return handleRequest(e && e.parameter ? e.parameter : {});
}

function doPost(e) {
  var params = {};
  try {
    if (e && e.postData && e.postData.contents) {
      params = JSON.parse(e.postData.contents);
    }
  } catch (err) {
    return json_({ ok: false, error: 'Invalid JSON body' });
  }
  if (e && e.parameter) {
    Object.keys(e.parameter).forEach(function (k) {
      if (params[k] === undefined) params[k] = e.parameter[k];
    });
  }
  return handleRequest(params);
}

function handleRequest(params) {
  try {
    if (!params.secret || params.secret !== SCRIPT_SECRET) {
      return json_({ ok: false, error: 'Unauthorized' });
    }

    var action = String(params.action || '').toLowerCase();
    if (action === 'slots') return slots_(params);
    if (action === 'book') return book_(params);
    if (action === 'lookup') return lookup_(params);
    if (action === 'cancel') return cancel_(params);
    if (action === 'reschedule') return reschedule_(params);
    return json_({ ok: false, error: 'Unknown action' });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    throw new Error(
      'No spreadsheet bound. Open Apps Script from the Sheet (Extensions → Apps Script), not a standalone project.'
    );
  }
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  ensureHeaders_(sheet);
  return sheet;
}

function ensureHeaders_(sheet) {
  var lastCol = Math.max(sheet.getLastColumn(), HEADERS.length);
  var existing = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var needs = !existing[0] || String(existing[0]).toLowerCase() !== 'id';
  if (needs) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
  // Keep date + time columns as text
  sheet.getRange('H:I').setNumberFormat('@');
}

function readRows_(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  var values = sheet.getRange(2, 1, lastRow, HEADERS.length).getValues();
  return values.map(function (row, idx) {
    var obj = { _row: idx + 2 };
    HEADERS.forEach(function (h, i) {
      obj[h] = row[i];
    });
    return obj;
  });
}

function isActiveStatus_(status) {
  var s = String(status || '').toLowerCase();
  return s === 'confirmed' || s === 'pending' || s === 'rescheduled';
}

function normalizeTime_(t) {
  return formatSlotLabel_(t);
}

/** Always return site format: 04:30 PM (Sheets often stores times as Date/number). */
function formatSlotLabel_(v) {
  if (Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v.getTime())) {
    return normalizeClock_(
      Utilities.formatDate(v, Session.getScriptTimeZone(), 'hh:mm a')
    );
  }
  if (typeof v === 'number' && isFinite(v)) {
    var totalMinutes = Math.round(v * 24 * 60);
    var hour24 = Math.floor(totalMinutes / 60) % 24;
    var minute = totalMinutes % 60;
    return clockFromParts_(hour24, minute);
  }
  return normalizeClock_(String(v || ''));
}

function normalizeClock_(s) {
  var raw = String(s || '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
  var m = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/);
  if (!m) return raw;
  var hour = parseInt(m[1], 10);
  var minute = parseInt(m[2], 10);
  var period = m[3];
  if (!period) {
    // 24h style e.g. 16:30
    return clockFromParts_(hour, minute);
  }
  var hour12 = hour % 12 || 12;
  var hh = (hour12 < 10 ? '0' : '') + hour12;
  var mm = (minute < 10 ? '0' : '') + minute;
  return hh + ':' + mm + ' ' + period;
}

function clockFromParts_(hour24, minute) {
  var period = hour24 >= 12 ? 'PM' : 'AM';
  var hour12 = hour24 % 12 || 12;
  var hh = (hour12 < 10 ? '0' : '') + hour12;
  var mm = (minute < 10 ? '0' : '') + minute;
  return hh + ':' + mm + ' ' + period;
}

function cellDate_(v) {
  if (Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v.getTime())) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(v || '').trim();
}

function cellTime_(v) {
  return formatSlotLabel_(v);
}

function slots_(params) {
  var date = String(params.date || '');
  var doctorId = String(params.doctorId || params.doctor_id || '');
  if (!date) return json_({ ok: false, error: 'date required' });

  var sheet = getSheet_();
  var rows = readRows_(sheet);
  var taken = [];

  rows.forEach(function (r) {
    if (!isActiveStatus_(r.status)) return;
    if (cellDate_(r.date) !== date) return;
    if (doctorId && String(r.doctor_id) !== doctorId) return;
    taken.push(cellTime_(r.time));
  });

  // unique
  var uniq = [];
  taken.forEach(function (t) {
    if (t && uniq.indexOf(t) === -1) uniq.push(t);
  });

  return json_({ ok: true, date: date, doctorId: doctorId, taken: uniq });
}

function book_(params) {
  var patientName = String(params.patientName || params.patient_name || '').trim();
  var phone = String(params.phone || '').trim();
  var doctorId = String(params.doctorId || params.doctor_id || '').trim();
  var doctorName = String(params.doctorName || params.doctor_name || '').trim();
  var service = String(params.service || '').trim();
  var date = String(params.date || '').trim();
  var time = normalizeTime_(params.time);
  var patientType = String(params.patientType || params.patient_type || 'New Patient').trim();
  var reason = String(params.reason || '').trim();

  if (!patientName || !phone || !date || !time || !doctorId) {
    return json_({ ok: false, error: 'Missing required fields' });
  }

  var sheet = getSheet_();
  var rows = readRows_(sheet);
  var conflict = rows.some(function (r) {
    return (
      isActiveStatus_(r.status) &&
      cellDate_(r.date) === date &&
      String(r.doctor_id) === doctorId &&
      cellTime_(r.time) === time
    );
  });

  if (conflict) {
    return json_({ ok: false, error: 'Slot already taken', code: 'SLOT_TAKEN' });
  }

  var id = Utilities.getUuid().slice(0, 8).toUpperCase();
  var token = Utilities.getUuid().replace(/-/g, '');
  var now = new Date().toISOString();
  var row = sheet.getLastRow() + 1;
  var values = [
    id,
    now,
    patientName,
    phone,
    doctorId,
    doctorName,
    service,
    date,
    time,
    'confirmed',
    patientType,
    reason,
    token
  ];
  // Force date/time as plain text so Sheets does not convert to Date serials
  sheet.getRange(row, 1, row, HEADERS.length).setNumberFormat('@');
  sheet.getRange(row, 1, row, HEADERS.length).setValues([values]);

  return json_({
    ok: true,
    booking: {
      id: id,
      manageToken: token,
      date: date,
      time: time,
      status: 'confirmed',
      doctorId: doctorId,
      doctorName: doctorName,
      service: service,
      patientName: patientName,
      phone: phone
    }
  });
}

function findByIdAndToken_(rows, id, token) {
  id = String(id || '').toUpperCase();
  token = String(token || '');
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i].id).toUpperCase() === id && String(rows[i].manage_token) === token) {
      return rows[i];
    }
  }
  return null;
}

function phoneMatches_(stored, input) {
  var a = String(stored || '').replace(/\D/g, '');
  var b = String(input || '').replace(/\D/g, '');
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.length >= 10 && b.length >= 10) {
    return a.slice(-10) === b.slice(-10);
  }
  return a.slice(-4) === b.slice(-4);
}

function lookup_(params) {
  var id = String(params.id || params.bookingId || '').trim();
  var token = String(params.manageToken || params.token || '').trim();
  var phone = String(params.phone || '').trim();
  if (!id || !token) return json_({ ok: false, error: 'id and manageToken required' });

  var sheet = getSheet_();
  var row = findByIdAndToken_(readRows_(sheet), id, token);
  if (!row) return json_({ ok: false, error: 'Booking not found' });
  if (phone && !phoneMatches_(row.phone, phone)) {
    return json_({ ok: false, error: 'Phone does not match' });
  }

  return json_({
    ok: true,
    booking: publicBooking_(row)
  });
}

function cancel_(params) {
  var id = String(params.id || params.bookingId || '').trim();
  var token = String(params.manageToken || params.token || '').trim();
  var phone = String(params.phone || '').trim();
  if (!id || !token || !phone) {
    return json_({ ok: false, error: 'id, manageToken, and phone required' });
  }

  var sheet = getSheet_();
  var row = findByIdAndToken_(readRows_(sheet), id, token);
  if (!row) return json_({ ok: false, error: 'Booking not found' });
  if (!phoneMatches_(row.phone, phone)) {
    return json_({ ok: false, error: 'Phone does not match' });
  }
  if (!isActiveStatus_(row.status)) {
    return json_({ ok: false, error: 'Booking is already inactive' });
  }

  sheet.getRange(row._row, 10).setValue('cancelled');
  return json_({ ok: true, booking: publicBooking_(Object.assign({}, row, { status: 'cancelled' })) });
}

function reschedule_(params) {
  var id = String(params.id || params.bookingId || '').trim();
  var token = String(params.manageToken || params.token || '').trim();
  var phone = String(params.phone || '').trim();
  var date = String(params.date || '').trim();
  var time = normalizeTime_(params.time);
  if (!id || !token || !phone || !date || !time) {
    return json_({ ok: false, error: 'Missing required fields' });
  }

  var sheet = getSheet_();
  var rows = readRows_(sheet);
  var row = findByIdAndToken_(rows, id, token);
  if (!row) return json_({ ok: false, error: 'Booking not found' });
  if (!phoneMatches_(row.phone, phone)) {
    return json_({ ok: false, error: 'Phone does not match' });
  }
  if (!isActiveStatus_(row.status)) {
    return json_({ ok: false, error: 'Booking is already inactive' });
  }

  var doctorId = String(row.doctor_id);
  var conflict = rows.some(function (r) {
    if (String(r.id).toUpperCase() === String(row.id).toUpperCase()) return false;
    return (
      isActiveStatus_(r.status) &&
      cellDate_(r.date) === date &&
      String(r.doctor_id) === doctorId &&
      cellTime_(r.time) === time
    );
  });
  if (conflict) {
    return json_({ ok: false, error: 'Slot already taken', code: 'SLOT_TAKEN' });
  }

  sheet.getRange(row._row, 8).setNumberFormat('@');
  sheet.getRange(row._row, 9).setNumberFormat('@');
  sheet.getRange(row._row, 8).setValue(date);
  sheet.getRange(row._row, 9).setValue(time);
  sheet.getRange(row._row, 10).setValue('rescheduled');

  return json_({
    ok: true,
    booking: publicBooking_(
      Object.assign({}, row, { date: date, time: time, status: 'rescheduled' })
    )
  });
}

function publicBooking_(row) {
  return {
    id: String(row.id),
    date: cellDate_(row.date),
    time: cellTime_(row.time),
    status: String(row.status),
    doctorId: String(row.doctor_id),
    doctorName: String(row.doctor_name),
    service: String(row.service),
    patientName: String(row.patient_name),
    phone: String(row.phone)
  };
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
