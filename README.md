# Mother Care Speciality Clinic

Static React clinic website with **WhatsApp booking** — no server or database required. Deploy on **Vercel** (free tier works).

## Features

- Marketing site: services, doctors, reviews, location, health tools, symptom navigator
- **WhatsApp appointment requests** — patient fills form → opens WhatsApp with pre-filled message to reception
- Hero image slideshow, mobile-friendly UI

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

Output: `dist/` (static files only)

## Deploy to Vercel (recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import repo
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy

### Custom domain (`drshilpasmothercare.in`)

1. Vercel project → **Settings → Domains** → add `drshilpasmothercare.in` and `www.drshilpasmothercare.in`
2. In **Hosting Raja** DNS, either:
   - Set nameservers to Vercel (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`), **or**
   - Add **A** `@` → `76.76.21.21` and **CNAME** `www` → `cname.vercel-dns.com`
3. SSL is automatic once DNS verifies

## Push to your empty GitHub repo

From this folder in PowerShell (replace `YOUR_USERNAME` and `YOUR_REPO`):

```powershell
cd D:\doctor_booking\auracare-medical-specialty-clinic_0.0.4
git init
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git add .
git commit -m "Initial commit: static clinic site with WhatsApp booking"
git push -u origin main
```

If the remote already has a README, use `git pull origin main --rebase` first, then push.

## Update clinic details

Edit **`src/context/ClinicConfigContext.tsx`**:

- Clinic name, address, phone, email
- **`receptionistWhatsapp`** — number that receives booking messages
- **`doctorWhatsapp`** — doctor direct line
- Opening hours

Edit **`src/data/clinicData.ts`** for doctors, services, reviews.

Replace hero slideshow images in **`src/components/Hero.tsx`** (`HERO_SLIDES`).

## How booking works

1. Patient opens **Book Visit** section
2. Enters name, phone, preferred date/time, service
3. Clicks **Send appointment request on WhatsApp**
4. WhatsApp opens with a formatted message to reception
5. **Reception confirms** the slot manually in chat

No online database — manage appointments in WhatsApp / your diary.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server |
| `npm run build` | Production static build |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript check |
