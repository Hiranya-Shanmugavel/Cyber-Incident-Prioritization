import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { mockIncident } from '../data/mockIncident';
import { IncidentHeader } from '../components/IncidentHeader';
import { QuickSummaryRow } from '../components/QuickSummaryRow';
import { IncidentInfo } from '../components/IncidentInfo';
import { FactorBreakdown } from '../components/FactorBreakdown';
import { FactorChart } from '../components/FactorChart';
import { WhyRanked } from '../components/WhyRanked';
import { IncidentComparison } from '../components/IncidentComparison';

export const IncidentDetails = ({ onBackToQueue }) => {
  const { id } = useParams();

  const [incidentData, setIncidentData] = useState(null);
  const [allIncidents, setAllIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadIncident = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch the selected incident
        const incidentResponse = await fetch(
          `http://127.0.0.1:5000/api/incidents/${id}`
        );

        if (!incidentResponse.ok) {
          throw new Error('Incident not found');
        }

        const incident = await incidentResponse.json();

        // Fetch the complete ranked priority queue
        const queueResponse = await fetch(
          'http://127.0.0.1:5000/api/incidents'
        );

        if (!queueResponse.ok) {
          throw new Error('Unable to load priority queue');
        }

        const queue = await queueResponse.json();

        console.log('Backend incident:', incident);
        console.log('Backend priority queue:', queue);

        setIncidentData(incident);
        setAllIncidents(queue);

      } catch (err) {
        console.error('Failed to load incident:', err);
        setError('Unable to load incident from backend.');
      } finally {
        setLoading(false);
      }
    };

    loadIncident();
  }, [id]);

  if (loading) {
    return (
      <div className="soc-details-page">
        <div className="soc-container">
          <h2>Loading incident...</h2>
        </div>
      </div>
    );
  }

  if (error || !incidentData) {
    return (
      <div className="soc-details-page">
        <div className="soc-container">
          <h2>{error || 'Incident not found'}</h2>

          <button onClick={onBackToQueue}>
            ← Back to Priority Queue
          </button>
        </div>
      </div>
    );
  }

  /*
   * Find the current incident inside the complete
   * backend priority queue.
   */
  const currentFromQueue = allIncidents.find(
    (incident) => Number(incident.id) === Number(incidentData.id)
  );

  const currentIncident = currentFromQueue || incidentData;

  /*
   * Find the next incident according to the backend rank.
   *
   * Example:
   * Current = Rank #3
   * Next = Rank #4
   */
  const nextBackendIncident = allIncidents.find(
    (incident) => Number(incident.rank) === Number(currentIncident.rank) + 1
  );

  /*
   * Convert backend data into the format expected
   * by the React components.
   */
  const normalizedIncident = {
    ...mockIncident,

    id: `INC-${String(currentIncident.id).padStart(3, '0')}`,

    type: currentIncident.type,

    rank: currentIncident.rank,

    score: Number(currentIncident.priority_score ?? 0),

    priority: currentIncident.priority_level,

    status: currentIncident.status,

    affectedUsers: Number(currentIncident.affected_users ?? 0),

    detectionSource: currentIncident.source,

    factors: {
      severity:
        typeof currentIncident.severity === 'number'
          ? Number(currentIncident.severity)
          : ({
              LOW: 2,
              MEDIUM: 5,
              HIGH: 8,
              CRITICAL: 10
            }[currentIncident.severity] ?? 5),

      assetImportance: Number(
        currentIncident.asset_importance ?? 0
      ),

      affectedUsers: Number(
        currentIncident.affected_users ?? 0
      ),

      dataSensitivity: Number(
        currentIncident.data_sensitivity ?? 0
      ),

      attackConfidence: Number(
        currentIncident.confidence ?? 0
      ),

      businessImpact: Number(
        currentIncident.business_impact ?? 0
      )
    },

    reasons: currentIncident.reason
      ? [currentIncident.reason]
      : mockIncident.reasons
  };

  /*
   * Normalize the NEXT incident from backend.
   * No mockIncident.nextIncident is used here.
   */
  const normalizedNextIncident = nextBackendIncident
    ? {
        id: `INC-${String(nextBackendIncident.id).padStart(3, '0')}`,

        type: nextBackendIncident.type,

        rank: nextBackendIncident.rank,

        score: Number(nextBackendIncident.priority_score ?? 0),

        priority: nextBackendIncident.priority_level,

        status: nextBackendIncident.status,

        affectedUsers: Number(
          nextBackendIncident.affected_users ?? 0
        ),

        factors: {
          severity:
            typeof nextBackendIncident.severity === 'number'
              ? Number(nextBackendIncident.severity)
              : ({
                  LOW: 2,
                  MEDIUM: 5,
                  HIGH: 8,
                  CRITICAL: 10
                }[nextBackendIncident.severity] ?? 5),

          assetImportance: Number(
            nextBackendIncident.asset_importance ?? 0
          ),

          affectedUsers: Number(
            nextBackendIncident.affected_users ?? 0
          ),

          dataSensitivity: Number(
            nextBackendIncident.data_sensitivity ?? 0
          ),

          attackConfidence: Number(
            nextBackendIncident.confidence ?? 0
          ),

          businessImpact: Number(
            nextBackendIncident.business_impact ?? 0
          )
        }
      }
    : null;

  /*
   * Generate comparison explanation from the actual
   * backend scores.
   */
  let comparisonReason = '';

  if (normalizedNextIncident) {
    if (normalizedIncident.score >= normalizedNextIncident.score) {
      comparisonReason =
        `${normalizedIncident.type} is ranked above ${normalizedNextIncident.type} because its backend priority score is higher (${normalizedIncident.score} vs ${normalizedNextIncident.score}).`;
    } else {
      comparisonReason =
        `${normalizedNextIncident.type} has a higher backend priority score (${normalizedNextIncident.score}) than ${normalizedIncident.type} (${normalizedIncident.score}).`;
    }
  }

  return (
    <div className="soc-details-page">
      <div className="soc-container">

        {/* Incident Header */}
        <IncidentHeader
          incident={normalizedIncident}
          onBack={onBackToQueue}
        />

        {/* Quick Incident Summary */}
        <QuickSummaryRow
          incident={normalizedIncident}
        />

        {/* Main Analysis */}
        <div className="main-analysis-grid">

          {/* LEFT */}
          <div className="col-left">

            <IncidentInfo
              incident={normalizedIncident}
            />

            <FactorBreakdown
              factors={normalizedIncident.factors}
            />

          </div>

          {/* RIGHT */}
          <div className="col-right">

            <FactorChart
              factors={normalizedIncident.factors}
            />

            <WhyRanked
              rank={normalizedIncident.rank}
              reasons={normalizedIncident.reasons}
            />

          </div>

        </div>

        {/* Backend-based comparison */}
        <IncidentComparison
          currentIncident={normalizedIncident}
          nextIncident={normalizedNextIncident}
          comparisonReason={comparisonReason}
        />

      </div>
    </div>
  );
};

export default IncidentDetails;