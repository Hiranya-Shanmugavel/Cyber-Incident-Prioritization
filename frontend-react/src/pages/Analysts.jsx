import React from 'react';
import { Users, Mail, Phone, Shield } from 'lucide-react';

const analysts = [
  { name: 'H. Shanmugavel', role: 'L2 Analyst', status: 'Online', load: 3, avatar: 'HS', color: 'bg-primary/20 text-primary' },
  { name: 'Sarah Jenkins', role: 'SOC Lead', status: 'In Meeting', load: 1, avatar: 'SJ', color: 'bg-purple-500/20 text-purple-500' },
  { name: 'Mike Chen', role: 'L1 Analyst', status: 'Online', load: 5, avatar: 'MC', color: 'bg-green-500/20 text-green-500' },
  { name: 'Elena Rodriguez', role: 'Threat Hunter', status: 'Offline', load: 0, avatar: 'ER', color: 'bg-gray-500/20 text-gray-400' },
  { name: 'David Kim', role: 'L2 Analyst', status: 'Online', load: 2, avatar: 'DK', color: 'bg-orange-500/20 text-orange-500' },
  { name: 'Auto-Responder', role: 'SOAR Bot', status: 'Active', load: 12, avatar: '🤖', color: 'bg-red-500/20 text-red-500' },
];

const Analysts = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-end mb-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <Users className="text-primary"/> SOC Analysts
        </h2>
        <p className="text-sm text-gray-400">Manage team workload and shift assignments.</p>
      </div>
      <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">
        + Add Analyst
      </button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {analysts.map((a, i) => (
        <div key={i} className="bg-card border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${a.color}`}>
              {a.avatar}
            </div>
            <div className="text-right">
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                a.status === 'Online' || a.status === 'Active' ? 'bg-green-500/10 text-green-500' :
                a.status === 'Offline' ? 'bg-gray-500/10 text-gray-400' : 'bg-yellow-500/10 text-yellow-500'
              }`}>
                {a.status}
              </span>
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-white">{a.name}</h3>
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-1">
            <Shield size={12}/> {a.role}
          </div>
          
          <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
            <div className="flex gap-2 text-gray-400">
              <button className="p-1.5 bg-background border border-gray-700 rounded-lg hover:text-white"><Mail size={14}/></button>
              <button className="p-1.5 bg-background border border-gray-700 rounded-lg hover:text-white"><Phone size={14}/></button>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Active Load</div>
              <div className="font-mono text-white font-bold">{a.load} <span className="text-gray-600 text-xs font-sans font-normal">incidents</span></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
export default Analysts;
