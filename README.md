# Aurora

Persoonlijke fitness- en voedings-tracker. Leest 7-plooise metingen in via PDF,
berekent energie- en macro-targets uit je vetvrije massa, en logt dagelijks
eiwit + kcal met één tap.

## Features

- **Dashboard** — laatste meting + vandaag's voedings-voortgang
- **Import** — parse Aurora-meet-PDFs automatisch
- **Vergelijken** — grafieken van gewicht, vetpercentage, omtrek, huidplooien
- **Doelen** — track naar streefwaardes
- **Voeding** — BMR/TDEE uit Katch-McArdle, dagelijkse intake-logger met
  quick-adds, 14-dagen chart met streak-teller, wekelijkse review
- **Lichaam** — 3D body-viewer (lazy-loaded)
- **Backup** — export alle data als JSON

Alle data blijft in je browser (localStorage). Geen server, geen cloud,
geen tracking.

## Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- React Router 7 (HashRouter voor static hosting)
- Recharts
- Three.js / react-three-fiber
- pdf.js

## Lokaal draaien

```bash
npm install
npm run dev
```

Open http://127.0.0.1:5173.

## Build

```bash
npm run build
```

Output staat in `dist/`. Kan op iedere static host (GitHub Pages, Netlify,
Vercel, Cloudflare Pages).

## Deployment

Elke push naar `main` triggert automatisch een GitHub Pages deployment via
de workflow in `.github/workflows/deploy.yml`.

## Licentie

Persoonlijk project — niet voor productie van derden.
