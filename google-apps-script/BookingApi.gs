/**
 * Dr. Shilpa's MOTHER CARE — Appointment Sheet API
 *
 * SETUP (required for booking to write rows):
 * 1. Open YOUR Google Sheet → Extensions → Apps Script
 * 2. Delete any old code, paste this ENTIRE file, Save
 * 3. Set SCRIPT_SECRET to the SAME value as Vercel BOOKING_SCRIPT_SECRET
 * 4. Deploy → Manage deployments → Edit (or New deployment)
 *    - Execute as: Me
 *    - Who has access: Anyone  (NOT "Anyone with Google account")
 * 5. Deploy → copy Web App URL into Vercel BOOKING_SCRIPT_URL
 * 6. After EVERY code change: Deploy → Manage deployments → New version
 *
 * Sheet tab "Bookings" is created automatically.
 */

var SCRIPT_SECRET = 'CHANGE_ME_TO_A_LONG_RANDOM_SECRET';
/** Optional: if script is not container-bound to the Sheet, paste the Sheet ID here. */
var SPREADSHEET_ID = '';
var SHEET_NAME = 'Bookings';
var API_VERSION = 3;

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
    if (!params.secret || String(params.secret) !== String(SCRIPT_SECRET)) {
      return json_({ ok: false, error: 'Unauthorized — SCRIPT_SECRET does not match BOOKING_SCRIPT_SECRET' });
    }

    var action = String(params.action || '').toLowerCase();
    if (action === 'health') {
      return json_({
        ok: true,
        healthy: true,
        sheet: SHEET_NAME,
        hasSpreadsheet: Boolean(getSpreadsheet_())
      });
    }
    if (action === 'slots') return slots_(params);
    if (action === 'book') return book_(params);
    if (action === 'lookup') return lookup_(params);
    if (action === 'list') return listByPhone_(params);
    if (action === 'cancel') return cancel_(params);
    if (action === 'reschedule') return reschedule_(params);
    return json_({ ok: false, error: 'Unknown action: ' + action });
  } catch (err) {
    return json_({
      ok: false,
      error: String(err && err.message ? err.message : err),
      code: 'SCRIPT_ERROR'
    });
  }
}

function getSpreadsheet_() {
  if (SPREADSHEET_ID && String(SPREADSHEET_ID).trim()) {
    return SpreadsheetApp.openById(String(SPREADSHEET_ID).trim());
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getSheet_() {
  var ss = getSpreadsheet_();
  if (!ss) {
    throw new Error(
      'No spreadsheet bound. Open Apps Script from the Sheet (Extensions → Apps Script), or set SPREADSHEET_ID.'
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
  var width = HEADERS.length;
  var first = sheet.getRange(1, 1, 1, width).getValues()[0];
  var needs = !first[0] || String(first[0]).toLowerCase() !== 'id';
  if (needs) {
    sheet.getRange(1, 1, 1, width).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
}

/** Digits only, last 10 (Indian mobile). */
function normalizePhone_(p) {
  var d = String(p || '').replace(/\D/g, '');
  if (d.length >= 10) return d.slice(-10);
  return d;
}

function phoneMatches_(stored, input) {
  var a = normalizePhone_(stored);
  var b = normalizePhone_(input);
  if (!a || !b) return false;
  return a === b;
}

function isActiveStatus_(status) {
  var s = String(status || '').toLowerCase().trim();
  return s === 'confirmed' || s === 'pending' || s === 'rescheduled';
}

function normalizeTime_(t) {
  return formatSlotLabel_(t);
}

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
  if (!period) return clockFromParts_(hour, minute);
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

/** Read rows by scanning column A for real ids (avoids inflated getLastRow). */
function readRows_(sheet) {
  var last = sheet.getLastRow();
  if (last < 2) return [];
  var scanTo = Math.min(Math.max(last, 2), 5000);
  var values = sheet.getRange(2, 1, scanTo, HEADERS.length).getValues();
  var rows = [];
  for (var i = 0; i < values.length; i++) {
    var id = String(values[i][0] || '').trim();
    if (!id) continue;
    var obj = { _row: i + 2 };
    HEADERS.forEach(function (h, col) {
      obj[h] = values[i][col];
    });
    rows.push(obj);
  }
  return rows;
}

function slots_(params) {
  var date = String(params.date || '');
  var doctorId = String(params.doctorId || params.doctor_id || '');
  if (!date) return json_({ ok: false, error: 'date required' });

  var rows = readRows_(getSheet_());
  var taken = [];
  rows.forEach(function (r) {
    if (!isActiveStatus_(r.status)) return;
    if (cellDate_(r.date) !== date) return;
    if (doctorId && String(r.doctor_id) !== doctorId) return;
    var t = cellTime_(r.time);
    if (t && taken.indexOf(t) === -1) taken.push(t);
  });

  return json_({ ok: true, date: date, doctorId: doctorId, taken: taken });
}

/**
 * Book using appendRow only — most reliable write path in Apps Script.
 * Avoids merged-cell / setValues row-count errors.
 */
function book_(params) {
  var patientName = String(params.patientName || params.patient_name || '').trim();
  var phone = normalizePhone_(params.phone || '');
  var doctorId = String(params.doctorId || params.doctor_id || '').trim();
  var doctorName = String(params.doctorName || params.doctor_name || '').trim();
  var service = String(params.service || '').trim();
  var date = String(params.date || '').trim();
  var time = normalizeTime_(params.time);
  var patientType = String(params.patientType || params.patient_type || 'New Patient').trim();
  var reason = String(params.reason || '').trim();

  if (!patientName || phone.length < 10 || !date || !time || !doctorId) {
    return json_({
      ok: false,
      error: 'Missing required fields (name, 10-digit phone, date, time, doctor)'
    });
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

  // Plain append — never use setValues on a computed multi-row range
  sheet.appendRow([
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
  ]);

  // Best-effort: force date/time cells on the row we just wrote to plain text
  try {
    var written = sheet.getLastRow();
    // Verify the id landed on that row; if getLastRow is inflated, find by id
    var checkId = String(sheet.getRange(written, 1).getValue() || '');
    if (checkId !== id) {
      var found = readRows_(sheet).filter(function (r) {
        return String(r.id) === id;
      })[0];
      if (found) written = found._row;
    }
    sheet.getRange(written, 8, written, 9).setNumberFormat('@');
    sheet.getRange(written, 8).setValue(date);
    sheet.getRange(written, 9).setValue(time);
    sheet.getRange(written, 4).setNumberFormat('@').setValue(phone);
  } catch (formatErr) {
    // Row is already appended — formatting failure must not fail the booking
  }

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

function lookup_(params) {
  var id = String(params.id || params.bookingId || '').trim();
  var token = String(params.manageToken || params.token || '').trim();
  var phone = String(params.phone || '').trim();
  if (!id || !token) return json_({ ok: false, error: 'id and manageToken required' });

  var row = findByIdAndToken_(readRows_(getSheet_()), id, token);
  if (!row) return json_({ ok: false, error: 'Booking not found' });
  if (phone && !phoneMatches_(row.phone, phone)) {
    return json_({ ok: false, error: 'Phone does not match' });
  }

  return json_({
    ok: true,
    booking: Object.assign(publicBooking_(row), {
      manageToken: String(row.manage_token || '')
    })
  });
}

function listByPhone_(params) {
  var phone = normalizePhone_(params.phone || '');
  if (phone.length < 10) {
    return json_({ ok: false, error: 'Enter a valid 10-digit mobile number' });
  }

  var rows = readRows_(getSheet_());
  var bookings = [];
  rows.forEach(function (r) {
    if (!isActiveStatus_(r.status)) return;
    if (!phoneMatches_(r.phone, phone)) return;
    bookings.push(
      Object.assign(publicBooking_(r), {
        manageToken: String(r.manage_token || '')
      })
    );
  });

  bookings.sort(function (a, b) {
    var ka = String(a.date) + ' ' + String(a.time);
    var kb = String(b.date) + ' ' + String(b.time);
    return ka < kb ? -1 : ka > kb ? 1 : 0;
  });

  return json_({ ok: true, phone: phone, count: bookings.length, bookings: bookings });
}

function cancel_(params) {
  var id = String(params.id || params.bookingId || '').trim();
  var token = String(params.manageToken || params.token || '').trim();
  var phone = normalizePhone_(params.phone || '');
  if (!id || !token || phone.length < 10) {
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
  return json_({
    ok: true,
    booking: publicBooking_(Object.assign({}, row, { status: 'cancelled' }))
  });
}

function reschedule_(params) {
  var id = String(params.id || params.bookingId || '').trim();
  var token = String(params.manageToken || params.token || '').trim();
  var phone = normalizePhone_(params.phone || '');
  var date = String(params.date || '').trim();
  var time = normalizeTime_(params.time);
  if (!id || !token || phone.length < 10 || !date || !time) {
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

  sheet.getRange(row._row, 8).setNumberFormat('@').setValue(date);
  sheet.getRange(row._row, 9).setNumberFormat('@').setValue(time);
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
    phone: normalizePhone_(row.phone)
  };
}

function json_(obj) {
  obj = obj || {};
  if (obj.apiVersion === undefined) obj.apiVersion = API_VERSION;
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
