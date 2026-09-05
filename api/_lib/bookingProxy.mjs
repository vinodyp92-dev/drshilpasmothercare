/**
 * Shared Google Apps Script proxy (server-only).
 * Env: BOOKING_SCRIPT_URL, BOOKING_SCRIPT_SECRET (no VITE_ prefix).
 *
 * Apps Script deploy MUST be:
 *   Execute as: Me
 *   Who has access: Anyone   ← not "Anyone with Google account"
 * Otherwise Google returns a login HTML page and Sheet sync fails.
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

function looksLikeGoogleLoginHtml(text) {
  const t = String(text || '').toLowerCase();
  return (
    t.includes('<!doctype html') ||
    t.includes('<html') ||
    t.includes('accounts.google.com') ||
    t.includes('sign in') ||
    t.includes('signin')
  );
}

function tryParseJson(text) {
  const trimmed = String(text || '').trim();
  if (!trimmed) return null;
  if (looksLikeGoogleLoginHtml(trimmed)) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
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

function gasAccessError() {
  return {
    status: 502,
    body: {
      ok: false,
      error:
        'Google Sheet script is blocking access. In Apps Script: Deploy → Manage deployments → Edit → Who has access: Anyone (not “Anyone with Google account”) → Deploy. Then update BOOKING_SCRIPT_URL if the URL changed.',
      code: 'GAS_ACCESS_DENIED'
    }
  };
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

  const { secret: _ignored, ...rest } = payload;
  const bodyPayload = { ...rest, action, secret };
  const body = JSON.stringify(bodyPayload);

  try {
    // Prefer GET — more reliable with Apps Script redirects for anonymous access
    const params = new URLSearchParams();
    Object.entries(bodyPayload).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      params.set(key, String(value));
    });
    const getRes = await fetch(`${url}?${params.toString()}`, {
      method: 'GET',
      redirect: 'follow'
    });
    let text = await getRes.text();

    if (looksLikeGoogleLoginHtml(text)) {
      return gasAccessError();
    }

    let data = tryParseJson(text);

    if (!data) {
      const posted = await postAppsScript(url, body);
      text = posted.text;
      if (looksLikeGoogleLoginHtml(text)) {
        return gasAccessError();
      }
      data = tryParseJson(text);
    }

    if (!data || typeof data !== 'object') {
      return {
        status: 502,
        body: {
          ok: false,
          error:
            'Invalid response from booking service. Confirm SCRIPT_SECRET matches BOOKING_SCRIPT_SECRET and redeploy the web app as Anyone.',
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
