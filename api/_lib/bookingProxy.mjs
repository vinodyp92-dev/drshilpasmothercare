/**
 * Shared Google Apps Script proxy (server-only).
 * Env: BOOKING_SCRIPT_URL, BOOKING_SCRIPT_SECRET (no VITE_ prefix).
 */

const ALLOWED_ACTIONS = new Set([
  'status',
  'slots',
  'book',
  'lookup',
  'cancel',
  'reschedule'
]);

export function getBookingConfig() {
  const url = (process.env.BOOKING_SCRIPT_URL || '').trim();
  const secret = (process.env.BOOKING_SCRIPT_SECRET || '').trim();
  return { url, secret, enabled: Boolean(url && secret) };
}

/**
 * @param {Record<string, unknown>} payload
 * @returns {Promise<{ status: number, body: Record<string, unknown> }>}
 */
export async function handleBookingRequest(payload = {}) {
  const action = String(payload.action || '').toLowerCase();
  const { url, secret, enabled } = getBookingConfig();

  if (action === 'status') {
    return { status: 200, body: { ok: true, enabled } };
  }

  if (!ALLOWED_ACTIONS.has(action)) {
    return { status: 400, body: { ok: false, error: 'Unknown action' } };
  }

  if (!enabled) {
    return {
      status: 503,
      body: { ok: false, error: 'Booking sync is not configured', code: 'NOT_CONFIGURED' }
    };
  }

  // Never trust a client-supplied secret — always inject server secret
  const { secret: _ignored, ...rest } = payload;
  const body = JSON.stringify({ ...rest, action, secret });

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body,
      redirect: 'follow'
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return {
        status: 502,
        body: { ok: false, error: 'Invalid response from booking service' }
      };
    }
    return { status: 200, body: data };
  } catch {
    return {
      status: 502,
      body: { ok: false, error: 'Could not reach booking service' }
    };
  }
}
