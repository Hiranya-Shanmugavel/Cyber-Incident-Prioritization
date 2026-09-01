import React from 'react';
import { motion } from 'framer-motion';

const getLevelColor = (level) => {
  switch(level) {
    case 'CRITICAL': return 'bg-red-500 text-white';
    case 'HIGH': return 'bg-orange-500 text-white';
    case 'MEDIUM': return 'bg-yellow-500 text-black';
    default: return 'bg-green-500 text-white';
  }
};

const PriorityQueue = ({ incidents, loading, onSelect }) => {
  if (loading) return <div className="bg-card rounded-xl border border-gray-800 p-6 h-96 animate-pulse"></div>;

  return (
    <div className="bg-card rounded-xl border border-gray-800 flex flex-col h-full min-h-[600px]">
      <div className="p-5 border-b border-gray-800 flex justify-between items-center shrink-0">
        <h3 className="font-display font-bold text-lg text-white">Priority Queue</h3>
        <span className="text-xs text-gray-400 bg-background px-2 py-1 rounded-md">{incidents.length} items</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-[10px] uppercase tracking-widest text-gray-500 bg-background sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 font-semibold">Rank</th>
              <th className="px-6 py-4 font-semibold">Incident</th>
              <th className="px-6 py-4 font-semibold text-center">Score</th>
              <th className="px-6 py-4 font-semibold text-center">Priority</th>
              <th className="px-6 py-4 font-semibold text-right">Why Ranked</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((inc, i) => (
              <motion.tr 
                key={inc.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-bold text-white text-lg">#{inc.rank}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-200">{inc.type}</div>
                  <div className="text-xs text-gray-500">{inc.id}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="font-mono font-bold text-primary text-lg">{inc.priority_score?.toFixed(1)}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${getLevelColor(inc.priority_level)}`}>
                    {inc.priority_level}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onSelect(inc)}
                    className="text-xs font-bold text-primary hover:text-white bg-primary/10 hover:bg-primary transition-colors px-3 py-1.5 rounded-lg border border-primary/20"
                  >
                    View Explanation
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default PriorityQueue;
