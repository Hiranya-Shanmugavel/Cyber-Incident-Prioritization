import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const getLevelColor = (level) => {
  switch(level) {
    case 'CRITICAL': return 'bg-red-500 text-white';
    case 'HIGH': return 'bg-orange-500 text-white';
    case 'MEDIUM': return 'bg-yellow-500 text-black';
    default: return 'bg-green-500 text-white';
  }
};

const getSlaBadge = (deadline) => {
  if (!deadline) return null;
  const t = new Date(deadline).getTime() - new Date().getTime();
  const mins = Math.floor(t / 60000);
  if (mins < 0) return <span className="text-[10px] bg-red-500/20 text-red-500 px-2 rounded font-bold">SLA BREACHED</span>;
  if (mins < 60) return <span className="text-[10px] bg-orange-500/20 text-orange-500 px-2 rounded font-bold">{mins}m left</span>;
  return <span className="text-[10px] bg-green-500/20 text-green-500 px-2 rounded font-bold">{Math.floor(mins/60)}h left</span>;
};

const PriorityQueue = ({ incidents, loading, onSelect }) => {
  if (loading) return <div className="bg-card rounded-xl border border-gray-800 p-6 h-96 animate-pulse"></div>;

  return (
    <div className="bg-card rounded-xl border border-gray-800 flex flex-col h-[600px]">
      <div className="p-5 border-b border-gray-800 flex justify-between items-center shrink-0">
        <h3 className="font-display font-bold text-lg text-white">Priority Queue</h3>
        <span className="text-xs text-gray-400 bg-background px-2 py-1 rounded-md">{incidents.length} items</span>
      </div>
      <div className="flex-1 p-2 space-y-2 overflow-y-auto">
        {incidents.map((inc, i) => (
          <motion.div 
            key={inc.id}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            onClick={() => onSelect(inc)}
            className="flex items-center gap-4 p-4 rounded-lg bg-background hover:bg-gray-800/50 cursor-pointer border border-transparent hover:border-gray-700 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-gray-800 flex flex-col items-center justify-center">
              <span className="text-[10px] text-gray-500 leading-none">Rank</span>
              <span className="font-bold text-white leading-none">#{inc.rank}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-white truncate">{inc.type}</h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getLevelColor(inc.priority_level)}`}>
                  {inc.priority_level}
                </span>
                {getSlaBadge(inc.sla_deadline)}
              </div>
              <div className="text-xs text-gray-500 flex gap-4 truncate">
                <span>{inc.id}</span>
                <span className="truncate">{inc.description}</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-xl font-display font-bold text-red-500">{inc.priority_score?.toFixed(1)}</div>
            </div>
            
            <ChevronRight className="text-gray-600" size={20} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default PriorityQueue;
