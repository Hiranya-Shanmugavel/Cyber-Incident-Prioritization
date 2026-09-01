# scoring_engine.py

from normalization import normalize_alert
from ranking import rank_alerts
from explanation import generate_explanation


# Scoring weights
WEIGHTS = {
    "severity": 0.25,
    "asset_importance": 0.20,
    "affected_users": 0.10,
    "data_sensitivity": 0.15,
    "confidence": 0.15,
    "business_impact": 0.15
}


def calculate_priority_score(alert):
    """
    Calculate the priority score for one cybersecurity alert.
    """

    score = (
        alert["severity"] * WEIGHTS["severity"]
        + alert["asset_importance"] * WEIGHTS["asset_importance"]
        + alert["affected_users"] * WEIGHTS["affected_users"]
        + alert["data_sensitivity"] * WEIGHTS["data_sensitivity"]
        + alert["confidence"] * WEIGHTS["confidence"]
        + alert["business_impact"] * WEIGHTS["business_impact"]
    )

    # Convert score from 0-10 scale to 0-100 scale
    return round(score * 10, 2)


def get_priority_level(score):
    """
    Convert numerical score into a priority level.
    """

    if score >= 80:
        return "CRITICAL"
    elif score >= 60:
        return "HIGH"
    elif score >= 40:
        return "MEDIUM"
    else:
        return "LOW"


def prioritize_alerts(alerts):
    """
    Main function.

    Input:
        List of cybersecurity alerts

    Output:
        Ranked list of alerts
    """

    processed_alerts = []

    # Process every alert
    for alert in alerts:

        # Step 1: Normalize the alert values
        normalized_alert = normalize_alert(alert)

        # Step 2: Calculate priority score
        priority_score = calculate_priority_score(normalized_alert)

        # Create result using NORMALIZED values
        result = normalized_alert.copy()

        result["priority_score"] = priority_score
        result["priority_level"] = get_priority_level(priority_score)

        processed_alerts.append(result)

    # Step 3: Rank all alerts
    ranked_alerts = rank_alerts(processed_alerts)

    # Step 4: Generate explanations
    for alert in ranked_alerts:
        alert["reason"] = generate_explanation(alert)

    return ranked_alerts