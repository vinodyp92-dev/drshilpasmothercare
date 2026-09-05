import { handleBookingRequest } from './_lib/bookingProxy.mjs';

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  try {
    let payload = {};
    if (req.method === 'GET') {
      payload = { action: req.query?.action || 'status', ...req.query };
    } else if (typeof req.body === 'object' && req.body !== null) {
      payload = req.body;
    } else {
      payload = await readJsonBody(req);
    }

    const result = await handleBookingRequest(payload);
    res.status(result.status).json(result.body);
  } catch {
    res.status(400).json({ ok: false, error: 'Invalid request body' });
  }
}
