import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';


function App() {
  return (
    <div className="flex h-screen bg-background text-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/incidents" element={<div className="text-2xl font-display">Incidents Table (Coming Soon)</div>} />
            <Route path="*" element={<div className="text-center mt-20">Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
