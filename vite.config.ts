import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { handleBookingRequest } from './api/_lib/bookingProxy.mjs';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load all env keys (not only VITE_) so local BOOKING_* secrets work
  const env = loadEnv(mode, process.cwd(), '');
  if (env.BOOKING_SCRIPT_URL) process.env.BOOKING_SCRIPT_URL = env.BOOKING_SCRIPT_URL;
  if (env.BOOKING_SCRIPT_SECRET) {
    process.env.BOOKING_SCRIPT_SECRET = env.BOOKING_SCRIPT_SECRET;
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'local-booking-api',
        configureServer(server) {
          server.middlewares.use('/api/booking', async (req, res, next) => {
            if (req.method === 'OPTIONS') {
              res.statusCode = 204;
              res.end();
              return;
            }
            if (req.method !== 'POST' && req.method !== 'GET') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }));
              return;
            }

            try {
              let payload = {};
              if (req.method === 'GET') {
                const url = new URL(req.url || '', 'http://localhost');
                payload = Object.fromEntries(url.searchParams.entries());
                if (!payload.action) payload.action = 'status';
              } else {
                const chunks = [];
                for await (const chunk of req) chunks.push(chunk);
                const raw = Buffer.concat(chunks).toString('utf8');
                payload = raw ? JSON.parse(raw) : {};
              }

              const result = await handleBookingRequest(payload);
              res.statusCode = result.status;
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Cache-Control', 'no-store');
              res.end(JSON.stringify(result.body));
            } catch {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: false, error: 'Invalid request body' }));
            }
          });
        }
      }
    ],
    server: {
      port: 3000,
      host: '0.0.0.0'
    }
  };
});
