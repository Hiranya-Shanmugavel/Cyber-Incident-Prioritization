import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createIncident } from '../services/api';

const NewIncidentModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: '', severity: 5, asset_importance: 5, affected_users: 10,
    data_sensitivity: 5, confidence: 0.5, business_impact: 5, description: ''
  });
  const [loading, setLoading] = useState(false);

  // Live mock score calculation for visual effect
  const liveScore = Math.min(100, (
    (formData.severity * 2.5) + (formData.asset_importance * 2) + 
    (Math.log10(formData.affected_users || 1) * 2.5 * 1) + 
    (formData.data_sensitivity * 1.5) + (formData.confidence * 10 * 1.5) + 
    (formData.business_impact * 1.5)
  ));
  
  const getLevel = (score) => {
    if(score >= 80) return 'CRITICAL';
    if(score >= 60) return 'HIGH';
    if(score >= 40) return 'MEDIUM';
    return 'LOW';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createIncident(formData);
      onSuccess();
    } catch (err) {
      alert("Failed to create incident.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          className="bg-card border border-gray-700 rounded-xl w-full max-w-4xl shadow-2xl flex overflow-hidden"
        >
          {/* Left: Form */}
          <div className="flex-1 p-6 border-r border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold">Report New Incident</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Incident Type</label>
                <input required type="text" className="w-full bg-background border border-gray-700 rounded-lg p-2 text-sm text-white" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} placeholder="e.g. Ransomware Detected"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Severity (0-10)</label>
                  <input type="range" min="0" max="10" step="0.5" className="w-full accent-primary" value={formData.severity} onChange={e => setFormData({...formData, severity: Number(e.target.value)})}/>
                  <div className="text-right text-xs text-gray-500">{formData.severity}</div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Asset Importance (0-10)</label>
                  <input type="range" min="0" max="10" step="0.5" className="w-full accent-primary" value={formData.asset_importance} onChange={e => setFormData({...formData, asset_importance: Number(e.target.value)})}/>
                  <div className="text-right text-xs text-gray-500">{formData.asset_importance}</div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Data Sensitivity (0-10)</label>
                  <input type="range" min="0" max="10" step="0.5" className="w-full accent-primary" value={formData.data_sensitivity} onChange={e => setFormData({...formData, data_sensitivity: Number(e.target.value)})}/>
                  <div className="text-right text-xs text-gray-500">{formData.data_sensitivity}</div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">AI Confidence (0-1.0)</label>
                  <input type="range" min="0" max="1" step="0.05" className="w-full accent-primary" value={formData.confidence} onChange={e => setFormData({...formData, confidence: Number(e.target.value)})}/>
                  <div className="text-right text-xs text-gray-500">{formData.confidence}</div>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Affected Users</label>
                <input type="number" className="w-full bg-background border border-gray-700 rounded-lg p-2 text-sm text-white" value={formData.affected_users} onChange={e => setFormData({...formData, affected_users: Number(e.target.value)})}/>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-700 rounded-lg text-sm hover:bg-gray-800">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white font-bold rounded-lg text-sm hover:bg-primary/90 flex-1">{loading ? 'Submitting...' : 'Submit to Scoring Engine'}</button>
              </div>
            </form>
          </div>
          
          {/* Right: Live Preview */}
          <div className="w-64 bg-cardSecondary p-6 flex flex-col items-center justify-center border-l border-gray-800">
            <h3 className="text-sm font-bold text-gray-400 mb-6 uppercase tracking-wider">Live Risk Preview</h3>
            
            <div className="relative w-40 h-40 flex items-center justify-center bg-background rounded-full border border-gray-800 mb-4 shadow-[0_0_30px_rgba(255,0,0,0.1)]">
              <div className="text-center">
                <div className="text-4xl font-display font-bold text-white">{liveScore.toFixed(0)}</div>
                <div className="text-xs text-gray-500">/ 100</div>
              </div>
            </div>
            
            <div className="text-center mt-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                liveScore >= 80 ? 'bg-red-500/20 text-red-500' :
                liveScore >= 60 ? 'bg-orange-500/20 text-orange-500' :
                liveScore >= 40 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'
              }`}>{getLevel(liveScore)}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default NewIncidentModal;
