import React from 'react';
import { 
  Globe, 
  HardDrive, 
  Server, 
  Users, 
  Database, 
  Shield 
} from 'lucide-react';

export const IncidentInfo = ({ incident }) => {
  const metadataRows = [
    { label: 'Source IP', value: incident.sourceIp, icon: Globe },
    { label: 'Destination IP', value: incident.destinationIp, icon: Globe },
    { label: 'Target Asset', value: incident.targetAsset, icon: HardDrive },
    { label: 'Asset Type', value: incident.assetType, icon: Server },
    { label: 'Affected Users', value: incident.affectedUsers.toLocaleString(), icon: Users },
    { label: 'Data Category', value: incident.dataCategory, icon: Database },
    { label: 'Detection Source', value: incident.detectionSource, icon: Shield },
    { label: 'Current Status', value: incident.status, isStatus: true }
  ];

  return (
    <div className="soc-card">
      <h2 className="section-title">Incident Information</h2>
      <p className="section-subtitle">Core technical parameters and system environment metadata.</p>
      
      <div className="metadata-grid-list">
        {metadataRows.map((row, idx) => {
          const Icon = row.icon;
          return (
            <div className="metadata-item-row" key={idx}>
              <div className="metadata-item-left">
                {Icon && <Icon size={16} className="metadata-icon" />}
                <span className="metadata-label">{row.label}</span>
              </div>
              <span className="metadata-val">
                {row.isStatus ? (
                  <span className="open-status-badge">{row.value}</span>
                ) : (
                  row.value
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
