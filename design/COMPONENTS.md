# Components — Per Component Spec

Alle componenten gebruiken bestaande hooks (`useMeasurements`, `useGoals`, `useDailyIntake`, `useNutritionSettings`). Metingen komen al **gecorrigeerd** uit `useMeasurements` (kledingcorrectie −2,3 kg toegepast door `correctMeasurement`).

Locaties hieronder zijn voorstellen — pas aan waar je bestaande componenten kunt vervangen.

---

## 1. `<Hero />` — gewicht + samenstelling

**Locatie**: `src/components/dashboard/Hero.tsx` (nieuw)
**Vervangt**: `StatsRow` + `StatCard` op de dashboard pagina

**Props**:
```ts
{
  latest: Measurement;       // gecorrigeerd
  weekAgo: Measurement | null;
  monthAgo: Measurement | null;
  height: number;            // cm — uit latest.height
}
```

**Layout**:
- Card, `p-[var(--pad-card)]`, `rounded-[14px]`, `bg-aurora-surface`, `border border-rule`
- Grid 2 kolommen `1.4fr / 1fr`, gap 32px, op mobile 1 kolom
- **Links**:
  - Label "Lichaamsgewicht" (mono, 10.5px, uppercase, tracking 0.14em, ink-3)
  - Hero number `latest.weight.toFixed(1)` (display, 112px, ink, tabular-nums) + "kg" unit (mono, 13px, uppercase, ink-3, baseline aligned)
  - Border-top divider (rule)
  - 3 deltas naast elkaar: 7d, 30d, BMI
    - Key: mono 10px uppercase ink-3
    - Value: display 22px, `text-positive` als gewichts-delta < 0, anders `text-negative`. BMI altijd ink.
- **Rechts** (border-left rule, padding-left 28px):
  - Label "Samenstelling"
  - 3 horizontal bars (Spier / Vet / Water):
    - Grid: `70px 1fr auto` → label / bar / value
    - Bar height 6px, `bg-aurora-black` (sunken), fill `bg-aurora-gold` (spier), `bg-negative` (vet), `bg-ink-3` (water)
    - Bar fill width = visuele schaal, niet 1:1 percentage (zie prototype: `musclePct * 1.6`, `fatPct * 2.5`, `waterPct` direct)
    - Value: display 18px + `<sub>%</sub>` mono 10px

**Berekeningen**:
```ts
const weightDelta7  = latest.weight - weekAgo.weight;
const weightDelta30 = latest.weight - monthAgo.weight;
const bmi = latest.weight / Math.pow(latest.height / 100, 2);
const musclePct = (latest.leanMass / latest.weight) * 100;
const fatPct = latest.bodyFatPercentage;
// Water % zit niet in Measurement type — toon alleen als beschikbaar of laat weg
```

---

## 2. `<RecoveryRail />` — herstel signalen

**Locatie**: `src/components/dashboard/RecoveryRail.tsx` (nieuw)
**Status**: **placeholder data** — Aurora trackt nog geen slaap/HRV. Bouw als component dat data accepteert maar zonder data leeg blijft (of toon "Nog niet gekoppeld").

**Props**:
```ts
{
  sleep?: { hours: number; target: number };
  rhr?: { value: number; delta: number };
  hrv?: { value: number; delta: number };
  steps?: { value: number; target: number };
}
```

**Layout**:
- Card, kolom 5/12 op desktop, kolom 12/12 op mobile
- Card title "Herstel" (display italic 22px), meta "Laatste 24u" (mono 10.5px ink-3)
- Lijst van rows, gescheiden door 1px rule lijn
- Per row:
  - Grid: `1fr auto` → key / value
  - Key: mono 10.5px uppercase ink-3 tracking 0.12em
  - Value: display 26px + small unit mono 10px ink-3
  - Optionele progress bar: 3px hoog, full-width, `bg-aurora-black` (sunken), fill `bg-aurora-gold`
  - Optionele sub-tekst: mono 10.5px ink-3 met `<span class="text-positive">` of `text-negative` voor delta

**Voor nu**: laat de hele card weg uit dashboard tot data beschikbaar is, of toon één row "Nog geen herstel-data gekoppeld".

---

## 3. `<TrendChart />` — 90-daagse compositie

**Locatie**: `src/components/dashboard/TrendChart.tsx` (nieuw)
**Vervangt**: niets — toevoeging op dashboard. `WeightChart` etc. blijven op `/compare`.

**Props**:
```ts
{
  measurements: Measurement[];   // gecorrigeerd
  period: '7d' | '30d' | '90d';
}
```

**Implementatie keuze**:

### Optie A — Recharts (consistent met rest van app)
```tsx
<ResponsiveContainer width="100%" height={240}>
  <LineChart data={slice} margin={{ top: 16, right: 36, bottom: 28, left: 36 }}>
    <CartesianGrid stroke="var(--color-rule)" vertical={false} />
    <XAxis dataKey="date" tickFormatter={fmtTick} stroke="var(--color-ink-4)"
           tick={{ fontFamily: 'var(--font-mono)', fontSize: 10 }} />
    <YAxis yAxisId="kg" orientation="left" domain={['dataMin - 0.5', 'dataMax + 0.5']}
           stroke="var(--color-ink-4)" tick={{ fontFamily: 'var(--font-mono)', fontSize: 10 }} />
    <YAxis yAxisId="pct" orientation="right" domain={['dataMin - 1', 'dataMax + 1']}
           stroke="var(--color-ink-4)" tick={{ fontFamily: 'var(--font-mono)', fontSize: 10 }} />
    <Tooltip content={<TrendTip />} />
    <Line yAxisId="kg"  dataKey="weight"     stroke="var(--color-ink)"          strokeWidth={1.5} dot={false} />
    <Line yAxisId="pct" dataKey="musclePct"  stroke="var(--color-aurora-gold)"  strokeWidth={1.5} dot={false} />
    <Line yAxisId="pct" dataKey="fatPct"     stroke="var(--color-negative)"     strokeWidth={1.5} dot={false} />
  </LineChart>
</ResponsiveContainer>
```

Voeg een custom `<TrendTip />` toe die de tooltip styled als de prototype card-tip (mono labels, display values).

### Optie B — Custom SVG (zie `prototype/trend-chart.jsx`)
Lichter, geen Recharts dependency op deze view. Kopieer de prototype implementatie en port naar TS.

**Voorkeur: Optie A** — Recharts is al in de bundle.

**Periode filtering**:
```ts
const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
const slice = measurements.slice(-days);
```

**Period switcher** is een aparte component op de dashboard pagina, niet in de chart zelf.

---

## 4. `<MacroRing />` — kcal van vandaag

**Locatie**: `src/components/nutrition/MacroRing.tsx` (nieuw, aanvulling op `MacroCard`)

**Props**: `{ eaten: number; target: number }`

**Layout**:
- 180×180px SVG, circle stroke
- `<circle cx=90 cy=90 r=72>` track met `stroke="var(--color-bg-sunken)"` width 10
- `<circle cx=90 cy=90 r=72>` fill met `stroke="var(--color-aurora-gold)"` width 10, strokeLinecap round
- `strokeDasharray = 2πr`, `strokeDashoffset = c - (eaten/target) * c`
- SVG roteert −90° zodat begin bovenaan is
- Center text:
  - Display 44px: `eaten`
  - Mono 10px uppercase ink-3: "kcal"
  - Mono 10.5px ink-3: "van {target}"

---

## 5. `<MacroBar />` — eiwit/koolhydr/vet/water row

**Locatie**: `src/components/nutrition/MacroBar.tsx` (nieuw, vervangt of vult `MacroCard` aan)

**Props**:
```ts
{
  name: string;
  variant: 'protein' | 'carbs' | 'fat' | 'water';
  eaten: number;
  target: number;
  unit: 'g' | 'L';
  decimals?: number;
}
```

**Layout**:
- Top row: name (mono 10.5px uppercase ink-2 tracking 0.1em) + value (display 18px) `<small>/ target unit</small>` (mono 10px ink-3)
- Bar: 4px hoog, `bg-bg-sunken`, fill kleur per variant:
  - protein → `bg-aurora-gold`
  - carbs → `bg-ink-2`
  - fat → `bg-negative`
  - water → `bg-aurora-gold` (zelfde als eiwit, beide "goed")

---

## 6. `<MealList />` — vandaag's maaltijden

**Locatie**: `src/components/nutrition/MealList.tsx` (nieuw, of vervangt deel van `TodayIntake`)

**Props**: `{ meals: Meal[] }` waar `Meal = { time, name, kcal, p, c, f }`

**Layout**:
- Per meal grid `56px 1fr auto`:
  - Time: mono 11px ink-3
  - Name: body 14px ink + `<small>` mono 10px ink-3 met "P {p}g · K {c}g · V {f}g"
  - Kcal: display 20px + mono `<sub>kcal</sub>`
- Border-top rule tussen rows

---

## 7. `<KcalSpark />` — week energie barchart

**Locatie**: `src/components/nutrition/KcalSpark.tsx` (nieuw)

**Props**: `{ values: number[]; labels: string[]; target: number }`

**Layout**:
- 80px hoge bar chart, 7 bars, gap 4px
- Bars: `bg-bg-sunken`, laatste bar (vandaag) `bg-aurora-gold`
- Hover: `bg-ink-2` (of `bg-aurora-gold-dark` voor today)
- Hover tooltip via `data-v` attr met `::after` pseudo-element
- Doellijn: dashed border-top op hoogte `target/max * 100%`
- Labels onder: mono 9.5px ink-3, last one accent

---

## 8. `<MeasurementsGrid />` — omtrek tegels

**Locatie**: `src/components/dashboard/MeasurementsGrid.tsx` (nieuw)
**Datasource**: `useMeasurements().getLatest()` + `getPrevious()` voor delta

**Props**: `{ latest: Measurement; previous: Measurement | null }`

**Layout**:
- 3-kolom grid (2-kolom op mobile), 1px gap met rule kleur als achtergrond → cellen `bg-aurora-surface`
- Per cell padding 16px 18px, kolom flex:
  - Label (mono 10px uppercase ink-3 tracking 0.12em)
  - Row: value (display 28px tabular-nums) + delta (mono 10.5px)
  - Delta kleur: `text-positive` als delta-richting goed is voor die maat (zie tabel hieronder), anders `text-negative`

**Welke maten tonen** (uit `latest.circumferences` + `latest.skinfolds`):
| Label | Bron | Goed = |
|---|---|---|
| Buik | `circumferences.belly` | decrease |
| Arm | `circumferences.arm` | increase |
| Bovenbeen | `circumferences.upperLeg` | increase |
| Borst | `skinfolds.chest` (mm) | decrease |
| Suprailiac | `skinfolds.suprailiac` | decrease |
| Triceps | `skinfolds.triceps` | decrease |

---

## 9. `<StrengthList />` — placeholder krachttraining

**Locatie**: `src/components/strength/StrengthList.tsx` (nieuw)
**Status**: **placeholder** — Aurora heeft nog geen kracht-tracker. Toon de card met empty state of mock data.

**Props**: `{ sessions: StrengthSession[] }`

```ts
type StrengthSession = {
  date: string;
  name: string;        // "Push" / "Pull" / "Legs"
  duration: number;    // minuten
  volume: number;      // kg totaal
  prs: number;
  lifts: string[];     // ["Bench 92.5×5", ...]
};
```

**Layout**:
- Per row grid `80px 1fr auto auto`:
  - Date: display italic 22px voor dag-nummer + mono 10.5px voor maand-afkorting (uppercase)
  - Name + lifts: body 14px name, `<small>` mono 10px ellipsis voor lifts joined `·`
  - Volume: stat label + display 18px (kg → ton via `volume/1000.toFixed(1) + 't'`)
  - PR badge: pill `bg-aurora-gold-light` `text-aurora-gold-dark` mono 10px "1 PR" / "—"

---

## 10. `<PeriodSwitcher />` & `<ThemeToggle />`

**Locatie**: `src/components/layout/PeriodSwitcher.tsx`, `src/components/layout/ThemeToggle.tsx`

### PeriodSwitcher
- Inline-flex pill container, `border border-rule-2 rounded-full p-[3px] bg-aurora-surface`
- Buttons: mono 11px uppercase tracking 0.06em, padding 5px 12px, rounded-full
- Active: `bg-ink text-bg`
- Inactive: `text-ink-3 hover:text-ink`

### ThemeToggle
- 32×32 round button, `border border-rule-2 bg-aurora-surface`, ink-2 hover ink
- Toggelt `data-theme` attribute op `<html>` (persist in localStorage)
- Icon: lucide `Moon` (in light) / `Sun` (in dark), 14px

```tsx
const [theme, setTheme] = useState<'light' | 'dark'>(() =>
  (localStorage.getItem('aurora-theme') as 'light'|'dark') ?? 'light'
);
useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('aurora-theme', theme);
}, [theme]);
```

---

## 11. `<Header />` (redesign)

**Locatie**: `src/components/layout/Header.tsx` (vervang)

**Layout**:
- Grid `1fr auto 1fr` op desktop, `1fr 1fr` op mobile (center weg)
- Border-bottom rule-2, padding-bottom 20px, margin-bottom 28px
- **Links**:
  - "Aurora · 001" mono 11px uppercase ink-3 tracking 0.14em
  - "Lichaams<em>journaal</em>" display 38px, italic em → `text-aurora-gold`
- **Center** (alleen desktop):
  - Datum "27 · 04 · 2026" mono 11px uppercase ink-3
  - Dag "Maandag, 27 april" display italic 16px ink-2
- **Rechts**:
  - PeriodSwitcher
  - ThemeToggle
