import React from 'react';
import { Brain } from 'lucide-react';

const AiExplanation = () => (
  <div className="space-y-6 max-w-4xl">
    <div>
      <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
        <Brain className="text-primary"/> AI Decision Explanation
      </h2>
      <p className="text-sm text-gray-400">Understand the ML scoring engine's rationale and weight distribution.</p>
    </div>
    <div className="bg-card border border-gray-800 rounded-xl p-8 flex flex-col items-center justify-center h-64 text-gray-500 text-center">
      <p className="mb-2">Select an incident from the Priority Queue to view its AI reasoning trace.</p>
      <p className="text-xs text-gray-600">Calculates Priority Score = (Severity * 0.25) + (Asset * 0.20) + ...</p>
    </div>
  </div>
);
export default AiExplanation;
