# scoring_engine.py

from normalization import normalize_alert
from ranking import rank_alerts
from explanation import generate_explanation


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
    Expects normalized values (0-10 scale).
    """
    score = (
        alert["severity"] * WEIGHTS["severity"]
        + alert["asset_importance"] * WEIGHTS["asset_importance"]
        + alert["affected_users"] * WEIGHTS["affected_users"]
        + alert["data_sensitivity"] * WEIGHTS["data_sensitivity"]
        + alert["confidence"] * WEIGHTS["confidence"]
        + alert["business_impact"] * WEIGHTS["business_impact"]
    )
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


def score_single_incident(alert):
    """
    Score a single incident and return it with
    priority_score, priority_level, rank, and explanation.
    """
    normalized = normalize_alert(alert)
    priority_score = calculate_priority_score(normalized)

    result = alert.copy()
    result["priority_score"] = priority_score
    result["priority_level"] = get_priority_level(priority_score)
    result["rank"] = 1
    result["explanation"] = generate_explanation(normalized)

    return result


def prioritize_alerts(alerts):
    """
    Main function.
    Input: List of cybersecurity alerts
    Output: Ranked list of alerts with scores and explanations
    """
    processed_alerts = []

    for alert in alerts:
        normalized_alert = normalize_alert(alert)
        priority_score = calculate_priority_score(normalized_alert)

        result = alert.copy()
        result["priority_score"] = priority_score
        result["priority_level"] = get_priority_level(priority_score)
        # Generate explanation using NORMALIZED values
        result["explanation"] = generate_explanation(normalized_alert)

        processed_alerts.append(result)

    ranked_alerts = rank_alerts(processed_alerts)

    return ranked_alerts