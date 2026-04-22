import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { ImportPage } from './pages/ImportPage';
import { ComparePage } from './pages/ComparePage';
import { GoalsPage } from './pages/GoalsPage';
import { NutritionPage } from './pages/NutritionPage';
import { useMeasurements } from './hooks/useMeasurements';
import { useGoals } from './hooks/useGoals';

// Lazy-load 3D pagina (~600KB Three.js bundel)
const LazyBodyPage = lazy(() =>
  import('./pages/BodyPage').then((m) => ({ default: m.BodyPage })),
);

function BodyLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-aurora-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">3D model laden...</p>
      </div>
    </div>
  );
}

export default function App() {
  const measurementState = useMeasurements();
  const goalState = useGoals();

  return (
    <HashRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<DashboardPage {...measurementState} {...goalState} />} />
          <Route path="/import" element={<ImportPage {...measurementState} />} />
          <Route path="/compare" element={<ComparePage measurements={measurementState.measurements} />} />
          <Route path="/goals" element={<GoalsPage {...goalState} measurements={measurementState.measurements} getFirst={measurementState.getFirst} getLatest={measurementState.getLatest} />} />
          <Route path="/nutrition" element={<NutritionPage measurements={measurementState.measurements} />} />
          <Route
            path="/body"
            element={
              <Suspense fallback={<BodyLoader />}>
                <LazyBodyPage measurements={measurementState.measurements} />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </HashRouter>
  );
}
