# Implementation Checklist

Stapsgewijs plan voor Claude Code. Werk in branch `design/aurora-redesign`.

## Setup

- [ ] `git checkout -b design/aurora-redesign`
- [ ] Map `design/` blijft in repo (deze handoff is via PR komen)

## Phase 1 — Tokens & fonts (≈30 min)

- [ ] Vervang `src/index.css` met de versie uit `TOKENS.md`
- [ ] Voeg Google Fonts links toe in `index.html` `<head>` (Instrument Serif, Geist, JetBrains Mono)
- [ ] Verwijder oude Inter/Playfair imports als die ergens stonden
- [ ] **Sanity check**: `npm run dev`, kijk of de bestaande pages nog werken — alleen kleur/font wijzigt, layout blijft

## Phase 2 — Theme + density toggle (≈45 min)

- [ ] Nieuwe component `src/components/layout/ThemeToggle.tsx`
- [ ] Persist via localStorage key `aurora-theme` (apart van bestaande Aurora data)
- [ ] Plaats in `Header.tsx` rechts
- [ ] Test: light/dark switch werkt op alle pages
- [ ] (Optioneel) Density toggle in Tweaks-stijl, alleen op `/` route

## Phase 3 — Header redesign (≈30 min)

- [ ] Vervang `src/components/layout/Header.tsx` body met spec uit `COMPONENTS.md` §11
- [ ] Voeg `<PeriodSwitcher />` toe — state hoog op DashboardPage óf in een context
- [ ] Border-bottom rule-2, geen logo image — alleen typografische "Aurora · 001"

## Phase 4 — Dashboard hero (≈90 min)

- [ ] `src/components/dashboard/Hero.tsx`
- [ ] `src/components/dashboard/RecoveryRail.tsx` (placeholder of skip tot data er is)
- [ ] Vervang oude `StatsRow` / `ProgressSummary` calls in `DashboardPage`
- [ ] Verify: gewicht-delta kleur klopt (afnemen = positief = groen)
- [ ] BMI berekening klopt met `latest.height`

## Phase 5 — Trend chart (≈60 min)

- [ ] `src/components/dashboard/TrendChart.tsx` met Recharts (Optie A)
- [ ] Custom `<TrendTip />` tooltip
- [ ] Period filtering werkt (7d/30d/90d)
- [ ] Card meta-regel toont delta-summary

## Phase 6 — Voeding redesign (≈90 min)

- [ ] `<MacroRing />` met SVG circle (zie `COMPONENTS.md` §4)
- [ ] `<MacroBar />` (vervangt of vult `MacroCard` aan)
- [ ] `<MealList />` (uit `TodayIntake` losweken of bij houden)
- [ ] `<KcalSpark />` op de Energie-week card
- [ ] Verify intakes komen uit `useDailyIntake` hook

## Phase 7 — Measurements grid (≈45 min)

- [ ] `src/components/dashboard/MeasurementsGrid.tsx`
- [ ] Mappen: `circumferences.belly|arm|upperLeg` + 3 skinfolds (chest/suprailiac/triceps)
- [ ] Delta-kleur logica: per maat juiste richting (zie tabel in `COMPONENTS.md` §8)
- [ ] Previous meting via `getPrevious()`

## Phase 8 — Strength placeholder (≈30 min)

- [ ] `src/components/strength/StrengthList.tsx`
- [ ] Voor nu: hardcoded mock data of empty-state met "Coming soon"
- [ ] Pin in dashboard onder measurements grid

## Phase 9 — Andere pages polish (≈90 min)

- [ ] `/import` — card border-radius + accent kleuren
- [ ] `/compare` — Recharts kleuren naar nieuwe accent
- [ ] `/benchmark` — `BenchmarkCard` styling update
- [ ] `/goals` — `GoalCard` styling update
- [ ] `/nutrition` — voeg `<MacroRing />` + `<KcalSpark />` toe als hero
- [ ] `/body` — canvas bg naar `var(--color-bg)`

## Phase 10 — Finale (≈30 min)

- [ ] Test light + dark mode op alle 7 routes
- [ ] Test responsive (1920 / 1280 / 800 / 375 viewport)
- [ ] Lighthouse check — fonts moeten met `display=swap` laden
- [ ] Hydratie: `await hydrateFromServer()` blijft eerste call in `main.tsx`
- [ ] HashRouter werkt nog op `/aurora/#/` GitHub Pages URL
- [ ] PR mergen naar `main`, GitHub Actions deploy controleren

## Niet doen

- ❌ HashRouter vervangen door BrowserRouter — breekt GitHub Pages
- ❌ `correctMeasurement()` weghalen — alle UI rekent op gecorrigeerde waardes
- ❌ Vite middleware in `vite.config.ts` aanraken — blijft file-backed Tailscale sync
- ❌ pdf.js / Three.js / Recharts deps weghalen — nog steeds nodig
- ❌ De `aurora-gold` Tailwind class wereldwijd find-and-replace'en — token-mapping doet het werk

## Estimated total: ~8 uur

Snel doable in 1-2 sessies met Claude Code.
