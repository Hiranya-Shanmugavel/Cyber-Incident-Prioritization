# ranking.py
def rank_alerts(alerts):
    """
    Rank cybersecurity alerts from highest priority
    to lowest priority.

    Tie-breaking order:
    1. Priority score
    2. Confidence
    3. Business impact
    4. Severity
    """

    ranked_alerts = sorted(
        alerts,
        key=lambda alert: (
            alert["priority_score"],
            alert["confidence"],
            alert["business_impact"],
            alert["severity"]
        ),
        reverse=True
    )

    # Assign rank numbers
    for rank, alert in enumerate(ranked_alerts, start=1):
        alert["rank"] = rank

    return ranked_alerts