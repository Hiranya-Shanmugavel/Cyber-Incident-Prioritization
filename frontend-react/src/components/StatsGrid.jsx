import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Activity, Target, Clock } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="bg-card rounded-xl border border-gray-800 p-5 flex items-start justify-between relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
    <div>
      <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-display font-bold text-white">{value ?? '-'}</h3>
    </div>
    <div className={`p-3 rounded-lg ${colorClass}`}>
      <Icon size={24} />
    </div>
  </motion.div>
);

const StatsGrid = ({ data, loading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Critical Threats" value={loading ? '...' : data?.critical_threats} icon={AlertTriangle} colorClass="bg-red-500/10 text-red-500" delay={0.1} />
      <StatCard title="Active Incidents" value={loading ? '...' : data?.active_incidents} icon={Activity} colorClass="bg-orange-500/10 text-orange-500" delay={0.2} />
      <StatCard title="Detection Rate" value={loading ? '...' : `${data?.threat_detection_rate}%`} icon={Target} colorClass="bg-green-500/10 text-green-500" delay={0.3} />
      <StatCard title="Avg Response Time" value={loading ? '...' : data?.average_response_time} icon={Clock} colorClass="bg-purple-500/10 text-purple-500" delay={0.4} />
    </div>
  );
};
export default StatsGrid;
