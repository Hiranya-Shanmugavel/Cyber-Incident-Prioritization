import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Activity, FileWarning, Globe, Crosshair } from 'lucide-react';
import { executeSoarAction } from '../services/api';

const IncidentModal = ({ incident, onClose }) => {
  const handleSoar = async (action) => {
    try {
      await executeSoarAction(incident.id, action);
      alert(`SOAR Action '${action}' executed successfully.`);
    } catch (e) {
      alert(`Error executing ${action}`);
    }
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'CRITICAL': return 'bg-red-500 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-black';
      default: return 'bg-green-500 text-white';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
          className="bg-card border border-gray-700 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-cardSecondary rounded-t-xl shrink-0">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getLevelColor(incident.priority_level)}`}>
                  {incident.priority_level}
                </span>
                <span className="text-sm text-gray-400">{incident.id}</span>
                <span className="text-sm text-gray-400">Rank #{incident.rank}</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-white">{incident.type}</h2>
            </div>
            <button onClick={onClose} className="p-2 bg-background rounded-lg text-gray-400 hover:text-white border border-gray-800 transition-colors">
              <X size={20} />
            </button>
          </div>
          
          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            <div className="bg-background p-4 rounded-lg border border-gray-800 text-sm text-gray-300">
              {incident.description}
            </div>

            {/* Intel Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-background p-4 rounded-lg border border-gray-800">
                <div className="text-xs text-gray-500 flex items-center gap-2 mb-2 uppercase tracking-wider"><Globe size={14}/> Source IP</div>
                <div className="font-mono text-white text-sm">{incident.source_ip || 'Internal'}</div>
                <div className="text-xs text-gray-500 mt-1">{incident.geo_location || '-'}</div>
              </div>
              
              <div className="bg-background p-4 rounded-lg border border-gray-800 lg:col-span-2">
                <div className="text-xs text-gray-500 flex items-center gap-2 mb-2 uppercase tracking-wider"><Crosshair size={14}/> MITRE ATT&CK</div>
                <div className="flex flex-wrap gap-2">
                  {incident.mitre_tactics ? incident.mitre_tactics.split(',').map(t => (
                    <span key={t} className="text-xs border border-orange-500/30 bg-orange-500/10 text-orange-400 px-2 py-1 rounded">
                      {t.trim()}
                    </span>
                  )) : <span className="text-sm text-gray-500">None detected</span>}
                </div>
              </div>

              <div className="bg-background p-4 rounded-lg border border-gray-800 flex flex-col justify-center items-center relative overflow-hidden">
                <div className="absolute inset-0 bg-red-500/5"></div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 relative z-10">Risk Score</div>
                <div className="text-3xl font-display font-bold text-red-500 relative z-10">{incident.priority_score?.toFixed(1)}</div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Metric label="Severity" val={incident.severity} max={10} />
              <Metric label="Asset Importance" val={incident.asset_importance} max={10} />
              <Metric label="Affected Users" val={incident.affected_users} max={1000} />
              <Metric label="Data Sensitivity" val={incident.data_sensitivity} max={10} />
            </div>

            {/* AI Blocks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="space-y-3">
                 <h4 className="font-bold text-white flex items-center gap-2"><FileWarning size={16} className="text-red-400"/> AI Explanation</h4>
                 <div className="bg-red-500/5 p-4 rounded-lg text-sm text-red-200/80 leading-relaxed border border-red-500/20 h-full">
                   {incident.explanation || 'No explanation generated.'}
                 </div>
               </div>
               <div className="space-y-3">
                 <h4 className="font-bold text-white flex items-center gap-2"><Shield size={16} className="text-purple-400"/> Remediation Playbook</h4>
                 <div className="bg-purple-500/5 p-4 rounded-lg text-sm text-purple-200/80 border border-purple-500/20 h-full">
                   {incident.remediation_playbook ? (
                     <ul className="space-y-2">
                       {incident.remediation_playbook.split('\n').map((step, i) => (
                         <li key={i} className="flex gap-2 items-start">
                           <span className="text-purple-400 font-bold mt-0.5">›</span>
                           <span>{step}</span>
                         </li>
                       ))}
                     </ul>
                   ) : 'No playbook attached.'}
                 </div>
               </div>
            </div>
          </div>
          
          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-800 bg-cardSecondary rounded-b-xl flex flex-wrap justify-between items-center gap-4 shrink-0">
            <div className="flex gap-3 items-center">
              <span className="text-xs text-gray-500 uppercase tracking-widest mr-2">SOAR</span>
              <button onClick={() => handleSoar('Block IP')} className="px-4 py-2 bg-background hover:bg-red-500/10 text-red-500 rounded-lg font-medium transition-colors border border-red-500/30 hover:border-red-500 text-sm flex items-center gap-2"><Shield size={16}/> Block IP</button>
              <button onClick={() => handleSoar('Isolate Host')} className="px-4 py-2 bg-background hover:bg-orange-500/10 text-orange-500 rounded-lg font-medium transition-colors border border-orange-500/30 hover:border-orange-500 text-sm flex items-center gap-2"><Activity size={16}/> Isolate Host</button>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleSoar('Escalate')} className="px-6 py-2 bg-background text-white rounded-lg font-medium hover:bg-gray-800 border border-gray-700 transition-colors">Escalate</button>
              <button onClick={onClose} className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">Acknowledge</button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const Metric = ({ label, val, max }) => (
  <div className="bg-background border border-gray-800 p-3 rounded-lg flex justify-between items-center">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="font-mono text-white text-sm">{val}<span className="text-gray-600">/{max}</span></span>
  </div>
);

export default IncidentModal;
