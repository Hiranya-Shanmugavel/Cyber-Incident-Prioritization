import React from 'react';
import { mockIncident } from '../data/mockIncident';
import { IncidentHeader } from '../components/IncidentHeader';
import { QuickSummaryRow } from '../components/QuickSummaryRow';
import { IncidentInfo } from '../components/IncidentInfo';
import { FactorBreakdown } from '../components/FactorBreakdown';
import { FactorChart } from '../components/FactorChart';
import { WhyRanked } from '../components/WhyRanked';
import { IncidentComparison } from '../components/IncidentComparison';

export const IncidentDetails = ({ incidentData = mockIncident, onBackToQueue }) => {
  const handleBack = () => {
    if (onBackToQueue) {
      onBackToQueue();
    } else {
      console.log('Navigating back to priority queue...');
    }
  };

  return (
    <div className="soc-details-page">
      <div className="soc-container">
        {/* 1. Incident Header */}
        <IncidentHeader incident={incidentData} onBack={handleBack} />

        {/* 2. Quick Incident Summary */}
        <QuickSummaryRow incident={incidentData} />

        {/* 12-Column Main Analysis Section */}
        <div className="main-analysis-grid">
          {/* Left 6 Columns */}
          <div className="col-left">
            {/* 3. Incident Details Metadata */}
            <IncidentInfo incident={incidentData} />

            {/* 4. Priority Factors */}
            <FactorBreakdown factors={incidentData.factors} />
          </div>

          {/* Right 6 Columns */}
          <div className="col-right">
            {/* 5. Factor Analysis Chart */}
            <FactorChart factors={incidentData.factors} />

            {/* 6. Ranking Explanation */}
            <WhyRanked rank={incidentData.rank} reasons={incidentData.reasons} />
          </div>
        </div>

        {/* 7, 8 & 9. Incident Comparison, Comparison Chart & Why #1 Outranks #2 */}
        <IncidentComparison
          currentIncident={incidentData}
          nextIncident={incidentData.nextIncident}
          comparisonReason={incidentData.comparisonReason}
        />
      </div>
    </div>
  );
};

export default IncidentDetails;
