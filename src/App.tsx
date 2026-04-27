import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { ImportPage } from './pages/ImportPage';
import { ComparePage } from './pages/ComparePage';
import { GoalsPage } from './pages/GoalsPage';
import { NutritionPage } from './pages/NutritionPage';
import { BenchmarkPage } from './pages/BenchmarkPage';
import { useMeasurements } from './hooks/useMeasurements';
import { useGoals } from './hooks/useGoals';

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
          <Route path="/benchmark" element={<BenchmarkPage measurements={measurementState.measurements} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </HashRouter>
  );
}
