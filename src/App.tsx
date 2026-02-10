import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Strategy } from './pages/Strategy';
import { Focus } from './pages/Focus';
import { Stats } from './pages/Stats';
import { AntiProcrastination } from './pages/AntiProcrastination';
import { Settings } from './pages/Settings';
import { useStore } from './store/useStore';
import { MorningRitual } from './components/MorningRitual';

function App() {
  const initializeDay = useStore(s => s.initializeDay);

  React.useEffect(() => {
    initializeDay();
  }, [initializeDay]);

  return (
    <BrowserRouter>
      <MorningRitual />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="strategy" element={<Strategy />} />
          <Route path="focus" element={<Focus />} />
          <Route path="stats" element={<Stats />} />
          <Route path="anti-procrastination" element={<AntiProcrastination />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
