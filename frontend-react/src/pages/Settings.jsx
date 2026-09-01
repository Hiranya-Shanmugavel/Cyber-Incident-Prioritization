import React from 'react';
import { Sliders, Save, RotateCcw } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-white">Scoring Engine Tuning</h2>
        <p className="text-sm text-gray-400">Adjust the ML weights for the risk prioritization algorithm.</p>
      </div>

      <div className="bg-card rounded-xl border border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
          <Sliders className="text-primary" />
          <h3 className="font-bold text-white">Algorithm Weights</h3>
          <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-1 rounded font-mono">Sum: 1.00</span>
        </div>

        <div className="space-y-6">
          <WeightSlider label="Severity Weight" value={0.25} desc="Base CVSS or scanner severity."/>
          <WeightSlider label="Asset Importance" value={0.20} desc="Criticality of the targeted server/database."/>
          <WeightSlider label="Data Sensitivity" value={0.15} desc="Classification of exposed data (e.g. PII/PCI)."/>
          <WeightSlider label="Confidence" value={0.15} desc="AI detection confidence."/>
          <WeightSlider label="Business Impact" value={0.15} desc="Estimated financial/operational disruption."/>
          <WeightSlider label="Affected Users" value={0.10} desc="Blast radius (logarithmic scale)."/>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 flex gap-4">
          <button className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors">
            <Save size={16}/> Apply New Weights
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-background border border-gray-700 text-gray-400 rounded-lg hover:text-white transition-colors">
            <RotateCcw size={16}/> Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

const WeightSlider = ({ label, value, desc }) => (
  <div>
    <div className="flex justify-between items-end mb-2">
      <div>
        <label className="text-sm font-bold text-white">{label}</label>
        <div className="text-xs text-gray-500">{desc}</div>
      </div>
      <div className="font-mono text-primary font-bold">{value.toFixed(2)}</div>
    </div>
    <input type="range" min="0" max="1" step="0.05" defaultValue={value} className="w-full accent-primary bg-gray-800" />
  </div>
);

export default Settings;
