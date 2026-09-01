# scoring_engine.py

from normalization import normalize_alert
from ranking import rank_alerts
from explanation import generate_explanation, generate_rank_comparison

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
    Convert numerical score into a priority level based on requested thresholds:
    90-100 -> CRITICAL
    70-89  -> HIGH
    40-69  -> MEDIUM
    0-39   -> LOW
    """
    if score >= 90:
        return "CRITICAL"
    elif score >= 70:
        return "HIGH"
    elif score >= 40:
        return "MEDIUM"
    else:
        return "LOW"

def get_score_breakdown(normalized_alert):
    """Return the individual component contributions to the final score out of 100"""
    return {
        "severity": round(normalized_alert["severity"] * WEIGHTS["severity"] * 10, 2),
        "asset_importance": round(normalized_alert["asset_importance"] * WEIGHTS["asset_importance"] * 10, 2),
        "affected_users": round(normalized_alert["affected_users"] * WEIGHTS["affected_users"] * 10, 2),
        "data_sensitivity": round(normalized_alert["data_sensitivity"] * WEIGHTS["data_sensitivity"] * 10, 2),
        "confidence": round(normalized_alert["confidence"] * WEIGHTS["confidence"] * 10, 2),
        "business_impact": round(normalized_alert["business_impact"] * WEIGHTS["business_impact"] * 10, 2)
    }

def score_single_incident(alert):
    """
    Score a single incident and return it with priority details.
    """
    normalized = normalize_alert(alert)
    priority_score = calculate_priority_score(normalized)

    result = alert.copy()
    result["priority_score"] = priority_score
    result["priority_level"] = get_priority_level(priority_score)
    result["score_breakdown"] = get_score_breakdown(normalized)
    result["rank"] = 1
    result["explanation"] = generate_explanation(normalized)
    result["rank_explanation"] = "This incident stands alone (no comparison)."

    return result

def prioritize_alerts(alerts):
    """
    Main function.
    Input: List of cybersecurity alerts
    Output: Ranked list of alerts with scores, explanations, and rank comparisons.
    """
    processed_alerts = []

    for alert in alerts:
        normalized_alert = normalize_alert(alert)
        priority_score = calculate_priority_score(normalized_alert)

        result = alert.copy()
        result["priority_score"] = priority_score
        result["priority_level"] = get_priority_level(priority_score)
        result["score_breakdown"] = get_score_breakdown(normalized_alert)
        result["explanation"] = generate_explanation(normalized_alert)

        processed_alerts.append(result)

    ranked_alerts = rank_alerts(processed_alerts)
    
    # Generate comparative explanations
    for i in range(len(ranked_alerts)):
        if i < len(ranked_alerts) - 1:
            # Compare with the one directly below it
            ranked_alerts[i]["rank_explanation"] = generate_rank_comparison(ranked_alerts[i], ranked_alerts[i+1])
        else:
            ranked_alerts[i]["rank_explanation"] = "This is the lowest ranked incident."

    return ranked_alerts