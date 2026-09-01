import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const factorDisplayNames = {
  severity: 'Severity',
  assetImportance: 'Asset Importance',
  affectedUsers: 'Affected Users Score',
  dataSensitivity: 'Data Sensitivity',
  attackConfidence: 'Attack Confidence',
  businessImpact: 'Business Impact'
};

export const FactorChart = ({ factors }) => {
  const chartData = [
    { name: factorDisplayNames.severity, value: factors.severity },
    { name: factorDisplayNames.assetImportance, value: factors.assetImportance },
    { name: factorDisplayNames.affectedUsers, value: factors.affectedUsers },
    { name: factorDisplayNames.dataSensitivity, value: factors.dataSensitivity },
    { name: factorDisplayNames.attackConfidence, value: factors.attackConfidence },
    { name: factorDisplayNames.businessImpact, value: factors.businessImpact }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="custom-recharts-tooltip">
          <div className="tooltip-factor-name">{data.payload.name}</div>
          <div className="tooltip-factor-score">
            Score: {data.value.toFixed(1)} / 10
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="soc-card chart-card-wrapper">
      <h2 className="section-title">Factor Analysis Chart</h2>
      <p className="section-subtitle">Visual impact spectrum across all six priority factors (0–10 scale).</p>
      
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
          >
            <defs>
              <linearGradient id="factorBarGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4F8CFF" />
                <stop offset="100%" stopColor="#7C5CFC" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" horizontal={false} stroke="rgba(255, 255, 255, 0.04)" />
            <XAxis type="number" domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} stroke="#686F7D" tickLine={false} axisLine={false} />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={140} 
              tick={{ fill: '#F7F8FA', fontSize: 13 }} 
              stroke="transparent"
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Bar dataKey="value" fill="url(#factorBarGrad)" radius={[0, 6, 6, 0]} barSize={16} animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
