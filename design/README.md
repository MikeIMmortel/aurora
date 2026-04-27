# Aurora — Design Handoff

Een redesign van het Aurora dashboard, klaar om geïmplementeerd te worden in de bestaande codebase (`MikeIMmortel/aurora`).

## Wat zit hierin

```
design/
├── README.md          ← dit bestand
├── TOKENS.md          ← Tailwind v4 @theme tokens om in src/index.css te plakken
├── COMPONENTS.md      ← per component: doel, props, datasource hook, layout specs
├── PAGES.md           ← per route: layout + welke componenten waar
├── prototype/         ← werkende HTML/CSS/JSX referentie (open Aurora.html)
│   ├── Aurora.html
│   ├── styles.css
│   ├── app.jsx
│   ├── data.jsx
│   ├── trend-chart.jsx
│   └── tweaks-panel.jsx
└── IMPLEMENTATION.md  ← stap-voor-stap migratie checklist
```

## Belangrijk om te weten

De files in `prototype/` zijn **design referenties**, geen production code om direct te kopiëren. Ze tonen de bedoelde look-and-feel en gedrag. De taak voor Claude Code is om ze te **herbouwen in de bestaande codebase** (React 19 + Vite 7 + TS, Tailwind v4, HashRouter, Recharts, lucide-react) met behoud van:

- **Bestaande hooks** — `useMeasurements`, `useGoals`, `useDailyIntake`, `useNutritionSettings`
- **Bestaande types** — `Measurement` met `correctMeasurement()` toegepast
- **HashRouter** voor static hosting (GitHub Pages)
- **localStorage cache + `/api/data` Vite middleware** (file-backed Tailscale sync)
- **Hydratie via `await hydrateFromServer()`** in `main.tsx` voor render
- **Auto-deploy** GitHub Actions naar GitHub Pages

## Fidelity

**Hi-fi.** Pixel-perfect spec:
- Specifieke kleuren (hex via Tailwind v4 tokens)
- Specifieke fonts (Instrument Serif voor display, Geist voor UI, JetBrains Mono voor labels)
- Exacte spacing (CSS variabelen `--pad-card`, `--gap-grid`)
- Density modi (compact / regular / comfy)
- Light + dark theme

## Aesthetiek — "Editorial Health Journal"

Rustig, typografisch dashboard dat aanvoelt als een persoonlijk dagboek, niet een ziekenhuis­scherm.

- **Type**: Instrument Serif voor display cijfers (italic accent voor "journaal"), Geist voor UI, JetBrains Mono voor labels en data
- **Kleur licht**: warm off-white (`#f6f3ec`), inkt-zwart (`#1a1814`)
- **Kleur donker**: warm-zwart (`#131210`), zacht crème (`#f0ece2`)
- **Accent**: aurora-groen (`#4a8a3a` light / `#7fbc6c` dark) — gebruik spaarzaam
- **Waarschuwing**: warm rood-oranje (`#b85a2c`) voor "let op"
- **Layout**: 12-koloms grid, asymmetrisch — hero links groot, herstel rail rechts smal
- **Geen icon-soup** — alleen thema-toggle en sidebar nav krijgen iconen
- **Geen gauge-meters of overdreven gradients**

## Schermen / Routes

| Route | Bestaande pagina | Status in design |
|---|---|---|
| `/` | DashboardPage | **Volledig herontworpen** — Hero (gewicht + samenstelling), Herstel rail, Trend grafiek, Voeding (ring + macros + maaltijden), Energie week, Lichaamsmaten grid, Krachttraining placeholder |
| `/import` | ImportPage | Bestaand — alleen Tailwind tokens vervangen door nieuwe palette |
| `/compare` | ComparePage | Bestaand — kleuren / type updates |
| `/benchmark` | BenchmarkPage | Bestaand — kleuren / type updates (was de oorspronkelijke vraag — nu gegeneraliseerd naar dashboard-niveau) |
| `/goals` | GoalsPage | Bestaand — kleuren / type updates |
| `/nutrition` | NutritionPage | Bestaand — kleuren / type updates |
| `/body` | BodyPage | Bestaand — kleuren / type updates |

De redesign focust op `/` (Dashboard). De andere pages erven de nieuwe tokens automatisch zodra `src/index.css` is bijgewerkt.

## Volgorde van implementeren

Zie `IMPLEMENTATION.md` voor checklist. Globaal:

1. **Tokens** — `src/index.css` updaten met nieuwe `@theme` (zie `TOKENS.md`)
2. **Fonts** — Instrument Serif + Geist + JetBrains Mono toevoegen in `index.html` `<head>`
3. **Theme toggle** — light/dark toggle component + `data-theme` op `<html>`
4. **Density toggle** — optioneel — `data-density` op `<html>`
5. **Dashboard hero** — herbouw `DashboardPage` als grid van nieuwe componenten
6. **Trend chart** — vervang door Recharts versie of houd custom SVG (zie `COMPONENTS.md`)
7. **Macro ring + nutrition** — herbouw `NutritionTodaySummary`
8. **Strength training** — nieuw component, data placeholder tot oefeningen-tracker bestaat
9. **Andere pages** — laat ze automatisch erven van de tokens, polish per page

## Vragen?

Open `prototype/Aurora.html` lokaal in een browser om alles live te zien. Tweaks-panel (knopje rechtsonder) toont theme/density/accent/period in actie.
