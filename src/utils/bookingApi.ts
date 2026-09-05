import { BOOKING_TIME_PREFERENCES } from './clinicHours';

export interface BookingRecord {
  id: string;
  date: string;
  time: string;
  status: string;
  doctorId: string;
  doctorName: string;
  service: string;
  patientName: string;
  phone: string;
  manageToken?: string;
}

export interface BookAppointmentInput {
  patientName: string;
  phone: string;
  doctorId: string;
  doctorName: string;
  service: string;
  date: string;
  time: string;
  patientType: string;
  reason?: string;
}

type ApiOk<T> = { ok: true } & T;
type ApiErr = { ok: false; error?: string; code?: string };

const BOOKING_API_PATH = '/api/booking';

/** Cached after refreshBookingSyncStatus() — secrets never live in the browser. */
let syncEnabledCache: boolean | null = null;

export function isBookingSyncEnabled(): boolean {
  return syncEnabledCache === true;
}

export async function refreshBookingSyncStatus(): Promise<boolean> {
  try {
    const res = await fetch(BOOKING_API_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'status' })
    });
    const data = (await res.json()) as { ok?: boolean; enabled?: boolean };
    syncEnabledCache = Boolean(data?.ok && data?.enabled);
  } catch {
    syncEnabledCache = false;
  }
  return syncEnabledCache;
}

/** Canonical slot label matching clinicHours: 04:30 PM */
export function normalizeTime(t: string): string {
  const raw = String(t || '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
  const m12 = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/);
  if (m12) {
    const hour12 = parseInt(m12[1], 10) % 12 || 12;
    return `${String(hour12).padStart(2, '0')}:${m12[2]} ${m12[3]}`;
  }
  const m24 = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (m24) {
    const hour24 = parseInt(m24[1], 10);
    const minute = m24[2];
    const period = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 || 12;
    return `${String(hour12).padStart(2, '0')}:${minute} ${period}`;
  }
  return raw;
}

async function callApi<T>(
  action: string,
  payload: Record<string, unknown> = {}
): Promise<ApiOk<T> | ApiErr> {
  try {
    const res = await fetch(BOOKING_API_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...payload })
    });
    const data = (await res.json()) as ApiOk<T> | ApiErr;
    if (!data || typeof data !== 'object') {
      return { ok: false, error: 'Invalid response from booking service' };
    }
    return data;
  } catch {
    return { ok: false, error: 'Could not reach booking service' };
  }
}

export async function fetchTakenSlots(
  date: string,
  doctorId: string
): Promise<{ taken: string[]; error?: string }> {
  const result = await callApi<{ taken: string[] }>('slots', { date, doctorId });
  if (!result.ok) {
    return { taken: [], error: result.error || 'Could not load slots' };
  }
  return { taken: (result.taken || []).map(normalizeTime) };
}

export function availableTimesForDate(
  allTimes: readonly string[],
  taken: string[]
): string[] {
  const takenSet = new Set(taken.map(normalizeTime));
  return allTimes.filter((t) => !takenSet.has(normalizeTime(t)));
}

export async function createBooking(
  input: BookAppointmentInput
): Promise<ApiOk<{ booking: BookingRecord }> | ApiErr> {
  return callApi<{ booking: BookingRecord }>('book', {
    patientName: input.patientName,
    phone: input.phone,
    doctorId: input.doctorId,
    doctorName: input.doctorName,
    service: input.service,
    date: input.date,
    time: normalizeTime(input.time),
    patientType: input.patientType,
    reason: input.reason || ''
  });
}

export async function lookupBooking(
  id: string,
  manageToken: string,
  phone?: string
): Promise<ApiOk<{ booking: BookingRecord }> | ApiErr> {
  return callApi<{ booking: BookingRecord }>('lookup', {
    id,
    manageToken,
    phone: phone || ''
  });
}

export async function listBookingsByPhone(
  phone: string
): Promise<ApiOk<{ bookings: BookingRecord[] }> | ApiErr> {
  return callApi<{ bookings: BookingRecord[] }>('list', { phone });
}

export async function cancelBooking(
  id: string,
  manageToken: string,
  phone: string
): Promise<ApiOk<{ booking: BookingRecord }> | ApiErr> {
  return callApi<{ booking: BookingRecord }>('cancel', {
    id,
    manageToken,
    phone
  });
}

export async function rescheduleBooking(
  id: string,
  manageToken: string,
  phone: string,
  date: string,
  time: string
): Promise<ApiOk<{ booking: BookingRecord }> | ApiErr> {
  return callApi<{ booking: BookingRecord }>('reschedule', {
    id,
    manageToken,
    phone,
    date,
    time: normalizeTime(time)
  });
}

export function buildManageUrl(bookingId: string, manageToken: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  return `${origin}${path}#manage=${encodeURIComponent(bookingId)}.${encodeURIComponent(manageToken)}`;
}

export function parseManageHash(hash: string): { id: string; token: string } | null {
  const raw = hash.replace(/^#/, '');
  if (!raw.startsWith('manage=')) return null;
  const value = decodeURIComponent(raw.slice('manage='.length));
  const dot = value.indexOf('.');
  if (dot <= 0) return null;
  return { id: value.slice(0, dot), token: value.slice(dot + 1) };
}

export { BOOKING_TIME_PREFERENCES };
