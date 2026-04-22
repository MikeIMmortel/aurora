import type { Measurement } from '../types/measurement';
import MacroCard from '../components/nutrition/MacroCard';
import NutritionSettings from '../components/nutrition/NutritionSettings';
import ProteinSources from '../components/nutrition/ProteinSources';
import TodayIntake from '../components/nutrition/TodayIntake';
import NutritionHistoryChart from '../components/nutrition/NutritionHistoryChart';
import CustomQuickAdds from '../components/nutrition/CustomQuickAdds';
import WeeklyReview from '../components/nutrition/WeeklyReview';
import { useNutritionSettings } from '../hooks/useNutritionSettings';
import { useDailyIntake } from '../hooks/useDailyIntake';
import { BUILTIN_QUICK_ADDS, calculateDailyTargets } from '../lib/nutrition';
import { formatDate } from '../lib/utils';

interface Props {
  measurements: Measurement[];
}

export function NutritionPage({ measurements }: Props) {
  const { settings, update, addCustomQuickAdd, deleteCustomQuickAdd } = useNutritionSettings();
  const { intakes, todayIntake, addEntry, setProtein, setKcal, resetToday } = useDailyIntake();
  const latest = measurements[measurements.length - 1];

  if (!latest) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">
          Geen metingen gevonden. Importeer eerst een PDF om voedings-doelen te berekenen.
        </p>
      </div>
    );
  }

  const targets = calculateDailyTargets(latest, settings);
  const quickAdds = [...BUILTIN_QUICK_ADDS, ...settings.customQuickAdds];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-semibold">Voeding</h2>
        <p className="text-sm text-gray-400 mt-1">
          Berekend uit je meting van {formatDate(latest.date)} · vetvrije massa{' '}
          <span className="text-aurora-gold">{latest.leanMass.toFixed(1)} kg</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoTile
          label="BMR (Katch-McArdle)"
          value={`${targets.bmr}`}
          unit="kcal"
          sub="Verbruik in rust"
        />
        <InfoTile
          label="TDEE"
          value={`${targets.tdee}`}
          unit="kcal"
          sub="Totaal dagverbruik bij huidige activiteit"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MacroCard
          title="Trainingsdag"
          subtitle="Kracht- of looptraining gepland"
          macros={targets.trainingDay}
          accent
        />
        <MacroCard
          title="Rustdag"
          subtitle="Geen training · minder koolhydraten"
          macros={targets.restDay}
        />
      </div>

      <TodayIntake
        currentProtein={todayIntake.proteinG}
        proteinTarget={targets.trainingDay.proteinG}
        currentKcal={todayIntake.kcal ?? 0}
        kcalTarget={targets.trainingDay.kcal}
        quickAdds={quickAdds}
        onAddEntry={addEntry}
        onSetProtein={setProtein}
        onSetKcal={setKcal}
        onReset={resetToday}
      />

      <NutritionHistoryChart
        intakes={intakes}
        proteinTarget={targets.trainingDay.proteinG}
        kcalTarget={targets.trainingDay.kcal}
        days={14}
      />

      <WeeklyReview
        intakes={intakes}
        proteinTarget={targets.trainingDay.proteinG}
        kcalTarget={targets.trainingDay.kcal}
      />

      <CustomQuickAdds
        items={settings.customQuickAdds}
        onAdd={addCustomQuickAdd}
        onDelete={deleteCustomQuickAdd}
      />

      <NutritionSettings settings={settings} onChange={update} />

      <ProteinSources />

      <div className="rounded-2xl border border-aurora-border bg-aurora-surface p-5 text-xs text-gray-500 leading-relaxed">
        <p className="mb-2">
          <span className="text-gray-400 font-medium">Hoe dit wordt berekend:</span>{' '}
          BMR = 370 + 21,6 × vetvrije massa (Katch-McArdle, nauwkeuriger dan Harris-Benedict
          omdat je spiermassa bekend is). TDEE = BMR × activiteitsfactor. Doel bepaalt of er
          een tekort of overschot wordt opgeteld. Eiwit en vet zijn per kg lichaamsgewicht;
          koolhydraten vullen de rest van de kcal aan.
        </p>
        <p>
          Rustdagen zitten ~200 kcal lager dan trainingsdagen (minder koolhydraten nodig),
          eiwit blijft gelijk voor spierherstel. Bij een nieuwe meting past deze pagina zich
          automatisch aan.
        </p>
      </div>
    </div>
  );
}

function InfoTile({
  label,
  value,
  unit,
  sub,
}: {
  label: string;
  value: string;
  unit: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-aurora-border bg-aurora-surface p-4 flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wider text-gray-500">{label}</span>
      <span className="text-2xl font-bold">
        {value}
        <span className="text-sm text-gray-400 ml-1">{unit}</span>
      </span>
      <span className="text-xs text-gray-500">{sub}</span>
    </div>
  );
}
