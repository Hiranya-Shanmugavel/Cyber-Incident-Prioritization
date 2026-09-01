import React from 'react';

const factorDisplayNames = {
  severity: 'Severity',
  assetImportance: 'Asset Importance',
  affectedUsers: 'Affected Users Score',
  dataSensitivity: 'Data Sensitivity',
  attackConfidence: 'Attack Confidence',
  businessImpact: 'Business Impact'
};

export const FactorBreakdown = ({ factors }) => {
  return (
    <div className="soc-card">
      <h2 className="section-title">Priority Factors</h2>
      <p className="section-subtitle">Evaluated scoring criteria across six core dimensions (0–10 scale).</p>
      
      <div className="factors-list-container">
        {Object.entries(factors).map(([key, val]) => {
          const percentage = (val / 10) * 100;
          return (
            <div className="factor-item-block" key={key}>
              <div className="factor-meta-header">
                <span className="factor-name-label">{factorDisplayNames[key] || key}</span>
                <span className="factor-score-num">{val.toFixed(1)} / 10</span>
              </div>
              <div className="factor-progress-track">
                <div 
                  className="factor-progress-bar" 
                  style={{ width: `${percentage}%` }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
