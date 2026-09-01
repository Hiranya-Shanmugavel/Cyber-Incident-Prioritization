import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ThreatChart = ({ data, loading }) => {
  if (loading || !data) return <div className="bg-card rounded-xl border border-gray-800 p-6 h-64 animate-pulse"></div>;

  const chartData = [
    { name: 'CRITICAL', value: data.critical || 0, color: '#ef4444' },
    { name: 'HIGH', value: data.high || 0, color: '#f97316' },
    { name: 'MEDIUM', value: data.medium || 0, color: '#eab308' },
    { name: 'LOW', value: data.low || 0, color: '#22c55e' }
  ].filter(d => d.value > 0);

  return (
    <div className="bg-card rounded-xl border border-gray-800 p-6 flex flex-col h-[350px]">
      <h3 className="font-display font-bold text-lg text-white mb-4">Threat Distribution</h3>
      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#111827', borderColor: '#1f2937', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default ThreatChart;
