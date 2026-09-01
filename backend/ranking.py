# ranking.py

def rank_alerts(alerts):
    """
    Rank cybersecurity alerts from highest priority to lowest priority.

    Tie-breaking order:
    1. Priority Score
    2. Severity
    3. Business Impact
    4. Asset Importance
    5. Data Sensitivity
    6. Attack Confidence
    7. Affected Users
    8. Incident ID (ascending for deterministic output)
    """

    ranked_alerts = sorted(
        alerts,
        key=lambda alert: (
            -alert.get("priority_score", 0),
            -alert.get("severity", 0),
            -alert.get("business_impact", 0),
            -alert.get("asset_importance", 0),
            -alert.get("data_sensitivity", 0),
            -alert.get("confidence", 0),
            -alert.get("affected_users", 0),
            alert.get("id", "")
        )
    )

    # Assign rank numbers
    for rank, alert in enumerate(ranked_alerts, start=1):
        alert["rank"] = rank

    return ranked_alerts