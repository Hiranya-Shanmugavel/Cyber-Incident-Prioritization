import React from 'react';
import { History, Shield, User, Server, AlertTriangle } from 'lucide-react';

const logs = [
  { id: 'LOG-099', time: '10 mins ago', user: 'H. Shanmugavel', action: 'Executed SOAR Playbook: Block IP', target: 'INC-042', type: 'system', icon: Shield, color: 'text-primary bg-primary/10 border-primary/20' },
  { id: 'LOG-098', time: '1 hr ago', user: 'Auto-Responder', action: 'Automatically isolated host based on risk score', target: 'INC-039', type: 'automated', icon: Server, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' },
  { id: 'LOG-097', time: '2 hrs ago', user: 'Sarah Jenkins', action: 'Escalated incident to Tier 3', target: 'INC-035', type: 'user', icon: User, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
  { id: 'LOG-096', time: '3 hrs ago', user: 'System', action: 'New Critical Threat Detected', target: 'Auth Server', type: 'alert', icon: AlertTriangle, color: 'text-red-500 bg-red-500/10 border-red-500/20' },
  { id: 'LOG-095', time: '4 hrs ago', user: 'Mike Chen', action: 'Marked incident as Resolved', target: 'INC-022', type: 'user', icon: User, color: 'text-green-500 bg-green-500/10 border-green-500/20' },
];

const ActivityLogs = () => (
  <div className="space-y-6 max-w-5xl mx-auto">
    <div className="flex justify-between items-end mb-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <History className="text-primary"/> Activity Logs
        </h2>
        <p className="text-sm text-gray-400">System, incident, and analyst activity audit trail.</p>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-background border border-gray-700 text-gray-300 rounded-lg text-sm hover:text-white">Filter</button>
        <button className="px-4 py-2 bg-background border border-gray-700 text-gray-300 rounded-lg text-sm hover:text-white">Export CSV</button>
      </div>
    </div>
    
    <div className="bg-card border border-gray-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-800 bg-cardSecondary text-xs font-bold text-gray-500 uppercase tracking-wider grid grid-cols-12 gap-4">
        <div className="col-span-2">Time</div>
        <div className="col-span-3">User / System</div>
        <div className="col-span-5">Action Logged</div>
        <div className="col-span-2 text-right">Target</div>
      </div>
      <div className="divide-y divide-gray-800">
        {logs.map((log) => (
          <div key={log.id} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-800/30 transition-colors">
            <div className="col-span-2 text-sm text-gray-400">{log.time}</div>
            <div className="col-span-3 flex items-center gap-3">
              <div className={`p-1.5 rounded border ${log.color}`}>
                <log.icon size={14}/>
              </div>
              <span className="text-sm font-medium text-white">{log.user}</span>
            </div>
            <div className="col-span-5 text-sm text-gray-300">{log.action}</div>
            <div className="col-span-2 text-right text-sm font-mono text-gray-500">{log.target}</div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-800 text-center">
        <button className="text-sm text-primary hover:underline">Load More Logs</button>
      </div>
    </div>
  </div>
);
export default ActivityLogs;
