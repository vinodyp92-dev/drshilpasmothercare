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
 * Apps Script Web Apps respond with 302 to googleusercontent.com.
 * Many runtimes convert that follow into GET and drop the body, which returns HTML.
 * We follow redirects manually and keep POST + body.
 *
 * @param {string} url
 * @param {string} body
 */
async function postAppsScript(url, body) {
  const headers = { 'Content-Type': 'text/plain;charset=utf-8' };
  let currentUrl = url;
  let res = await fetch(currentUrl, {
    method: 'POST',
    headers,
    body,
    redirect: 'manual'
  });

  let hops = 0;
  while (res.status >= 300 && res.status < 400 && hops < 5) {
    const location = res.headers.get('location');
    if (!location) break;
    currentUrl = new URL(location, currentUrl).toString();
    hops += 1;
    res = await fetch(currentUrl, {
      method: 'POST',
      headers,
      body,
      redirect: 'manual'
    });
  }

  // Final hop may already be 200; if still a redirect URL resolved, try follow once
  if (res.status >= 300 && res.status < 400) {
    const location = res.headers.get('location');
    if (location) {
      res = await fetch(new URL(location, currentUrl).toString(), {
        method: 'POST',
        headers,
        body,
        redirect: 'follow'
      });
    }
  }

  const text = await res.text();
  return { status: res.status, text };
}

function tryParseJson(text) {
  const trimmed = String(text || '').trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    // Some gateways wrap JSON; try to extract first {...} block
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
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
  const bodyPayload = { ...rest, action, secret };
  const body = JSON.stringify(bodyPayload);

  try {
    let { text } = await postAppsScript(url, body);
    let data = tryParseJson(text);

    // Fallback: GET query string (more reliable with Apps Script redirects)
    if (!data) {
      const params = new URLSearchParams();
      Object.entries(bodyPayload).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        params.set(key, String(value));
      });
      const getRes = await fetch(`${url}?${params.toString()}`, {
        method: 'GET',
        redirect: 'follow'
      });
      text = await getRes.text();
      data = tryParseJson(text);
    }

    if (!data || typeof data !== 'object') {
      return {
        status: 502,
        body: {
          ok: false,
          error:
            'Invalid response from booking service. Redeploy the Apps Script web app (Anyone) and confirm BOOKING_SCRIPT_URL.',
          code: 'BAD_GAS_RESPONSE'
        }
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
