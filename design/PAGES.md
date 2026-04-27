# Pages — Layout per Route

## `/` Dashboard (volledig herontworpen)

**Bestand**: `src/pages/DashboardPage.tsx` — vervang body van bestaande `DashboardPage` met onderstaande structuur.

```tsx
export function DashboardPage(props: DashboardPageProps) {
  const { measurements, getLatest, getPrevious } = props;
  const [period, setPeriod] = useState<'7d'|'30d'|'90d'>('90d');

  const latest = getLatest();
  const previous = getPrevious();
  const weekAgo = pickByDaysAgo(measurements, 7);
  const monthAgo = pickByDaysAgo(measurements, 30);

  if (!latest) return <EmptyState />;

  return (
    <div className="max-w-[1480px] mx-auto px-10 pt-8 pb-20 lg:px-6">
      {/* Header is in AppShell, dus hier alleen de page content */}

      <div className="grid grid-cols-12 gap-[var(--gap-grid)]">
        <Hero className="col-span-7"
              latest={latest} weekAgo={weekAgo} monthAgo={monthAgo}
              height={latest.height} />

        <RecoveryRail className="col-span-5" />

        <Card className="col-span-12">
          <CardHeader title="Trend" meta={`${period} · ${trendSummary(period)}`} />
          <TrendChart measurements={measurements} period={period} />
        </Card>

        <NutritionToday className="col-span-7" />
        <EnergyWeek    className="col-span-5" />

        <MeasurementsGrid className="col-span-12"
                          latest={latest} previous={previous} />

        <StrengthList className="col-span-12" sessions={[/* placeholder */]} />
      </div>

      <Footer />
    </div>
  );
}
```

**Responsief**: 
- `< 1100px` → col-7 / col-5 worden col-12, col-4 / col-3 worden col-6
- `< 720px` → alles col-12

**Note**: De `PeriodSwitcher` hoort in de header. Verplaats hem naar `AppShell` of de page-level toolbar zodat hij globaal beschikbaar is voor pages die er op reageren.

---

## `/import` Import (kleine polish)

Bestaande layout behouden. Alleen:
- Replace `bg-aurora-black` / `bg-aurora-surface` worden automatisch hot na tokens swap
- Card border-radius naar `rounded-[14px]`
- Kop typografie naar `font-display italic` 22px voor card titles
- PdfDropzone: gebruik nieuwe accent voor active state

---

## `/compare` Vergelijken (kleine polish)

Bestaande charts blijven (`WeightChart`, `BodyFatChart`, etc.). Update Recharts kleuren naar:
```ts
stroke="var(--color-aurora-gold)"
fill="var(--color-aurora-gold-light)"
```

CompareTable: replace gold dividers met `border-rule`, headers naar `font-mono uppercase tracking-[0.12em] text-ink-3`.

---

## `/benchmark` Benchmark

`BenchmarkCard` gebruikt al een card layout. Update:
- Card: `rounded-[14px] bg-aurora-surface border border-rule p-[var(--pad-card)]`
- Card title: `font-display italic text-[22px]`
- Stat values: `font-display text-[28px] tabular-nums`
- Labels: `font-mono uppercase tracking-[0.12em] text-[10.5px] text-ink-3`

---

## `/goals` Doelen

`GoalCard`: zelfde card-styling treatment als boven. `GoalForm`: input borders naar rule-2.

---

## `/nutrition` Voeding

Bestaande `TodayIntake`, `MacroCard`, `WeeklyReview`, `NutritionHistoryChart`, `ProteinSources`, `CustomQuickAdds`, `NutritionSettings` blijven werken. Polish:
- Voeg `<MacroRing />` toe als hero op deze page (was alleen in dashboard preview)
- Voeg `<KcalSpark />` toe boven `NutritionHistoryChart`

---

## `/body` Lichaam

3D viewer blijft. Achtergrond/canvas kleur naar `var(--color-bg)`. Geen verdere wijzigingen.

---

## AppShell update

`src/components/layout/AppShell.tsx`:

```tsx
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg text-ink">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />  {/* nieuwe header met theme toggle + period */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
```

---

## Sidebar update

`src/components/layout/Sidebar.tsx`:

Replace huidige aurora-gold/aurora-surface tokens — werken automatisch. Polish:
- Active state border accent blijft `border-aurora-gold` (= nu groen)
- Active background `bg-aurora-surface-hover`
- Voeg subtle `font-mono` voor labels (10.5px tracking 0.06em) **of** behoud body font — ontwerp keuze, beide werken

---

## Empty state

Wanneer `measurements.length === 0`:

```tsx
<div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">Nog geen metingen</p>
  <h2 className="font-display text-[38px]">Importeer je eerste <em className="text-aurora-gold">PDF</em></h2>
  <Link to="/import" className="mt-4 px-5 h-10 inline-flex items-center bg-ink text-bg rounded-full font-mono text-[11px] uppercase tracking-[0.06em]">
    Naar import
  </Link>
</div>
```
