import React from 'react';
import { Target, Users, ShieldCheck } from 'lucide-react';

export const QuickSummaryRow = ({ incident }) => {
  return (
    <div className="summary-cards-grid">
      <div className="summary-metric-card">
        <div className="summary-icon-wrapper">
          <Target size={22} />
        </div>
        <div>
          <div className="summary-metric-label">Target Asset</div>
          <div className="summary-metric-value">{incident.targetAsset}</div>
        </div>
      </div>

      <div className="summary-metric-card">
        <div className="summary-icon-wrapper">
          <Users size={22} />
        </div>
        <div>
          <div className="summary-metric-label">Affected Users</div>
          <div className="summary-metric-value">{incident.affectedUsers.toLocaleString()}</div>
        </div>
      </div>

      <div className="summary-metric-card">
        <div className="summary-icon-wrapper">
          <ShieldCheck size={22} />
        </div>
        <div>
          <div className="summary-metric-label">Attack Confidence</div>
          <div className="summary-metric-value">{incident.factors.attackConfidence} / 10</div>
        </div>
      </div>
    </div>
  );
};
