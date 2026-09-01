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
import { ShieldAlert } from 'lucide-react';

const factorDisplayNames = {
  severity: 'Severity',
  assetImportance: 'Asset Importance',
  affectedUsers: 'Affected Users',
  dataSensitivity: 'Data Sensitivity',
  attackConfidence: 'Attack Confidence',
  businessImpact: 'Business Impact'
};

export const IncidentComparison = ({ currentIncident, nextIncident, comparisonReason }) => {
  if (!nextIncident) return null;

  const factorKeys = [
    'severity',
    'assetImportance',
    'affectedUsers',
    'dataSensitivity',
    'attackConfidence',
    'businessImpact'
  ];

  const currentLabel = `#${currentIncident.rank} ${currentIncident.type}`;
  const nextLabel = `#${nextIncident.rank} ${nextIncident.type}`;

  const chartData = factorKeys.map((key) => ({
    name: factorDisplayNames[key],
    [currentLabel]: currentIncident.factors[key],
    [nextLabel]: nextIncident.factors[key]
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const val1 = payload.find(p => p.dataKey === currentLabel)?.value ?? 0;
      const val2 = payload.find(p => p.dataKey === nextLabel)?.value ?? 0;
      const diff = (val1 - val2).toFixed(1);

      return (
        <div className="apple-comparison-tooltip">
          <div className="tooltip-category">{label}</div>
          <div className="tooltip-row">
            <div className="tooltip-badge-row">
              <span className="dot dot-primary" style={{ backgroundColor: '#4F8CFF' }} />
              <span className="tooltip-name">{currentLabel}</span>
            </div>
            <span className="tooltip-val" style={{ color: '#4F8CFF' }}>{val1.toFixed(1)}</span>
          </div>
          <div className="tooltip-row">
            <div className="tooltip-badge-row">
              <span className="dot dot-secondary" style={{ backgroundColor: '#7B8190' }} />
              <span className="tooltip-name">{nextLabel}</span>
            </div>
            <span className="tooltip-val" style={{ color: '#7B8190' }}>{val2.toFixed(1)}</span>
          </div>
          {diff > 0 && (
            <div className="tooltip-diff-row">
              <span>#1 Advantage:</span>
              <span className="diff-tag">+{diff}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="soc-card">
      <h2 className="section-title">Incident Comparison</h2>
      <p className="section-subtitle">
        Analyzing why #{currentIncident.rank} outranks #{nextIncident.rank} in the priority queue.
      </p>

      {/* #1 vs #2 Premium Score Cards */}
      <div className="comparison-hero-cards">
        <div className="score-card-item rank-1-highlight">
          <div>
            <div className="score-card-rank">Rank #{currentIncident.rank}</div>
            <div className="score-card-title">{currentIncident.type}</div>
          </div>
          <div className="score-card-num rank-1-color">{currentIncident.score}</div>
        </div>

        <div className="vs-badge-divider">VS</div>

        <div className="score-card-item">
          <div>
            <div className="score-card-rank" style={{ color: '#A1A7B3' }}>Rank #{nextIncident.rank}</div>
            <div className="score-card-title">{nextIncident.type}</div>
          </div>
          <div className="score-card-num">{nextIncident.score}</div>
        </div>
      </div>

      {/* Grouped Comparison Chart */}
      <div className="comparison-chart-container">
        <div className="chart-title-area">
          <div>
            <h3 className="chart-title-text">Incident Factor Comparison</h3>
            <p className="chart-subtitle-text">Priority factor comparison across the top two ranked incidents</p>
          </div>
          <div className="custom-chart-legend">
            <div className="legend-row-item">
              <span className="legend-dot-indicator rank-1" />
              <span>{currentLabel}</span>
            </div>
            <div className="legend-row-item">
              <span className="legend-dot-indicator rank-2" />
              <span>{nextLabel}</span>
            </div>
          </div>
        </div>

        <div className="chart-body-wrapper">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 25 }}
              barGap={6}
            >
              <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(255, 255, 255, 0.04)" />
              <XAxis 
                dataKey="name" 
                stroke="#686F7D" 
                interval={0} 
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#F7F8FA', fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis 
                domain={[0, 10]} 
                ticks={[0, 2, 4, 6, 8, 10]} 
                stroke="#686F7D"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#686F7D', fontSize: 12, fontFamily: 'var(--font-mono)' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} />
              <Bar dataKey={currentLabel} fill="#4F8CFF" radius={[6, 6, 0, 0]} barSize={20} animationDuration={800} />
              <Bar dataKey={nextLabel} fill="#7B8190" radius={[6, 6, 0, 0]} barSize={20} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Why #1 Outranks #2 Explanation Panel */}
      <div className="outranks-callout-panel">
        <div className="outranks-panel-header">
          <ShieldAlert size={18} />
          <span>Why #1 Outranks #2</span>
        </div>
        <p className="outranks-panel-text">{comparisonReason}</p>
      </div>
    </div>
  );
};
