import React, { useEffect, useState } from 'react';
import { getDashboard } from '../services/api';
import PriorityQueue from '../components/PriorityQueue';
import IncidentModal from '../components/IncidentModal';

const PriorityQueuePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const loadData = async () => {
    try {
      const res = await getDashboard();
      setData(res.data);
    } catch (err) {
      console.error(err);
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
    <div className="space-y-6 max-w-5xl mx-auto h-[85vh] flex flex-col">
      <div>
        <h2 className="text-2xl font-display font-bold text-white">Live Priority Queue</h2>
        <p className="text-sm text-gray-400">Real-time ranked list of active threats requiring attention.</p>
      </div>
      
      <div className="flex-1">
        <PriorityQueue 
          incidents={data?.priority_queue || []} 
          loading={loading}
          onSelect={setSelectedIncident}
        />
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
export default PriorityQueuePage;
