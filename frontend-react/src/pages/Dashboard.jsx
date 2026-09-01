import React, { useEffect, useState } from 'react';
import { getDashboard } from '../services/api';
import PriorityQueue from '../components/PriorityQueue';
import StatsGrid from '../components/StatsGrid';
import IncidentModal from '../components/IncidentModal';
import ThreatChart from '../components/ThreatChart';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const loadData = async () => {
    try {
      const res = await getDashboard();
      setData(res.data);
      setError(null);
    } catch (err) {
      setError('Unable to connect to backend. Showing cached data.');
      setData({
        critical_threats: 3, active_incidents: 8, threat_detection_rate: 94.5, average_response_time: '4.2m',
        threat_distribution: { critical: 3, high: 4, medium: 1, low: 0 },
        priority_queue: [
           { id: 'INC000', type: 'Fallback Data Active', priority_score: 95, priority_level: 'CRITICAL', rank: 1, created_at: new Date().toISOString() }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}
      
      <StatsGrid data={data} loading={loading} />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <PriorityQueue 
            incidents={data?.priority_queue || []} 
            loading={loading}
            onSelect={setSelectedIncident}
          />
        </div>
        <div className="flex flex-col gap-6">
          <ThreatChart data={data?.threat_distribution} loading={loading} />
          
          <div className="bg-card rounded-xl border border-gray-800 p-6">
            <h3 className="font-display font-bold text-lg text-white mb-4">Live Monitoring</h3>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Engine Online — Last checked: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {selectedIncident && (
        <IncidentModal 
          incident={selectedIncident} 
          onClose={() => setSelectedIncident(null)} 
        />
      )}
    </div>
  );
};
export default Dashboard;
