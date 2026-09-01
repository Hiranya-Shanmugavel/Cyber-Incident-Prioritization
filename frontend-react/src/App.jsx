import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Incidents from './pages/Incidents';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import PriorityQueuePage from './pages/PriorityQueuePage';
import LiveMonitoring from './pages/LiveMonitoring';
import AiExplanation from './pages/AiExplanation';
import Analysts from './pages/Analysts';
import ActivityLogs from './pages/ActivityLogs';
import NewIncidentModal from './components/NewIncidentModal';

import { useAuth } from './context/AuthContext';
import Login from './pages/Login';

function App() {
  const { user } = useAuth();
  const [showNew, setShowNew] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setShowNew(true);
    window.addEventListener('openNewIncident', handleOpen);
    return () => window.removeEventListener('openNewIncident', handleOpen);
  }, []);

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex h-screen bg-background text-gray-100 overflow-hidden">
      <Sidebar isMobileOpen={isMobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header setMobileOpen={setMobileOpen} />
        <main className="flex-1 overflow-y-auto p-6 relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/queue" element={<PriorityQueuePage />} />
            <Route path="/live" element={<LiveMonitoring />} />
            <Route path="/ai-explanation" element={<AiExplanation />} />
            <Route path="/analysts" element={<Analysts />} />
            <Route path="/activity-logs" element={<ActivityLogs />} />
            <Route path="*" element={<div className="text-center mt-20 text-gray-500">Page Not Found</div>} />
          </Routes>
        </main>
      </div>
      {showNew && <NewIncidentModal onClose={() => setShowNew(false)} onSuccess={() => {setShowNew(false); window.location.reload();}} />}
    </div>
  );
}

export default App;
