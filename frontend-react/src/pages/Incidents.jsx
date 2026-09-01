import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, AlertTriangle, ShieldCheck, Clock, Download } from 'lucide-react';
import { getIncidents } from '../services/api';
import IncidentModal from '../components/IncidentModal';

const Incidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    getIncidents().then(res => {
      setIncidents(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const filtered = incidents.filter(inc => 
    inc.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inc.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLevelColor = (level) => {
    switch(level) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-500 border border-red-500/30';
      case 'HIGH': return 'bg-orange-500/20 text-orange-500 border border-orange-500/30';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-500 border border-green-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">All Incidents</h2>
          <p className="text-sm text-gray-400">Complete historical and active threat log.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-card border border-gray-700 rounded-lg text-sm hover:text-white transition-colors">
          <Download size={16}/> Export CSV
        </button>
      </div>

      <div className="bg-card rounded-xl border border-gray-800 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-800 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search ID, Type..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-background border border-gray-700 rounded-lg py-2 pl-9 pr-4 text-sm w-64 focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-background border border-gray-700 rounded-lg text-sm text-gray-400 hover:text-white">
              <Filter size={16}/> Priority
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-background border border-gray-700 rounded-lg text-sm text-gray-400 hover:text-white">
              <Filter size={16}/> Status
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-cardSecondary text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider">ID</th>
                <th className="px-6 py-4 font-medium tracking-wider">Incident Type</th>
                <th className="px-6 py-4 font-medium tracking-wider">Priority Level</th>
                <th className="px-6 py-4 font-medium tracking-wider">Score</th>
                <th className="px-6 py-4 font-medium tracking-wider">Status</th>
                <th className="px-6 py-4 font-medium tracking-wider">Created At</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500 animate-pulse">Loading incidents...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No incidents found.</td></tr>
              ) : (
                filtered.map((inc, i) => (
                  <motion.tr 
                    key={inc.id} 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    onClick={() => setSelectedIncident(inc)}
                    className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4 font-mono text-gray-500 group-hover:text-gray-300">{inc.id}</td>
                    <td className="px-6 py-4 font-medium text-white">{inc.type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${getLevelColor(inc.priority_level)}`}>
                        {inc.priority_level}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-display font-bold text-gray-300">{inc.priority_score?.toFixed(1)}</td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 bg-background border border-gray-700 px-2 py-1 rounded text-xs">
                        {inc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">{new Date(inc.created_at).toLocaleString()}</td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {selectedIncident && (
        <IncidentModal incident={selectedIncident} onClose={() => setSelectedIncident(null)} />
      )}
    </div>
  );
};
export default Incidents;
