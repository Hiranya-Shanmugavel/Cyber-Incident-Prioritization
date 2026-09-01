import React from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { PriorityBadge } from './PriorityBadge';

export const IncidentHeader = ({ incident, onBack }) => {
  return (
    <div className="hero-card">
      <div className="hero-ambient-glow" />
      
      <div className="hero-top-nav">
        <button className="back-link-btn" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to Priority Queue</span>
        </button>
        
        <div className="hero-meta-group">
          <span className="hero-status-pill">
            <span className="critical-dot" />
            Status: <strong style={{ color: '#F7F8FA' }}>{incident.status}</strong>
          </span>
          <span className="hero-time-pill">
            <Clock size={14} />
            Detected {incident.detectedTime}
          </span>
        </div>
      </div>

      <div className="hero-body">
        <div className="hero-info">
          <div className="rank-tag-row">
            <span className="rank-badge-text">Rank #{incident.rank}</span>
            <span className="incident-id-code">{incident.id}</span>
          </div>
          <h1 className="hero-title-text">{incident.type}</h1>
        </div>

        <div className="hero-score-wrapper">
          <div className="score-display-box">
            <span className="score-tag-title">Priority Score</span>
            <div className="score-num-group">
              <span className="score-main-num">{incident.score}</span>
              <span className="score-max-num">/100</span>
            </div>
          </div>
          <PriorityBadge priority={incident.priority} />
        </div>
      </div>
    </div>
  );
};
