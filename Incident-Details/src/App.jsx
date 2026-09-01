import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import IncidentDetails from './pages/IncidentDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root URL / directly to /incident/INC-002 */}
        <Route path="/" element={<Navigate to="/incident/INC-002" replace />} />
        
        {/* Person 2 Incident Details Route */}
        <Route 
          path="/incident/:id" 
          element={<IncidentDetailsWrapper />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

const IncidentDetailsWrapper = () => {
  const navigate = useNavigate();
  return <IncidentDetails onBackToQueue={() => navigate('/')} />;
};

export default App;
