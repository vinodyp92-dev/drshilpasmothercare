# Google Apps Script — client checklist (booking)

If the website books but the Sheet stays empty, or "Find appointments" finds nothing:

## 1. Paste the latest script
1. Open the Google Sheet used for bookings
2. Extensions → Apps Script
3. Replace ALL code with `google-apps-script/BookingApi.gs` from this repo
4. Set:
   ```
   var SCRIPT_SECRET = 'DRSHILPARANIGR';  // must match Vercel BOOKING_SCRIPT_SECRET
   ```
5. Save (Ctrl+S)

## 2. Deploy a NEW version (critical)
1. Deploy → Manage deployments → pencil (Edit)
2. Version: **New version**
3. Execute as: **Me**
4. Who has access: **Anyone** (not "Anyone with Google account")
5. Deploy
6. If the Web App URL changed, update Vercel `BOOKING_SCRIPT_URL` and redeploy the site

## 3. Quick test
1. Book on the website with a test mobile number
2. Check Sheet tab **Bookings** for a new row
3. On the site → Manage appointment → enter the same mobile → Find appointments

## 4. Common failures
| Symptom | Cause |
|--------|--------|
| No Sheet rows, WhatsApp still opens (old site) | Book write failed silently — update site + script |
| "Unauthorized" | SCRIPT_SECRET ≠ BOOKING_SCRIPT_SECRET |
| "Unknown action" | Old script still deployed — New version required |
| Login / HTML errors | Access is not **Anyone** |
| Find finds nothing | No rows written yet, or phone digits don't match |
