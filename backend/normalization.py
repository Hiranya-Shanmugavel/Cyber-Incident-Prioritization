# normalization.py

import math


def normalize_affected_users(users):
    """
    Convert the number of affected users
    into a score from 0 to 10.
    Uses logarithmic scaling.
    """
    users = int(users)
    if users <= 0:
        return 0
    score = math.log10(users + 1) * 2.5
    return round(min(score, 10), 2)


def normalize_confidence(confidence):
    """
    Convert confidence into a 0-10 scale.
    """
    confidence = float(confidence)
    if 0 <= confidence <= 1:
        return round(confidence * 10, 2)
    if 1 < confidence <= 10:
        return round(confidence, 2)
    raise ValueError(
        "Confidence must be between 0 and 1 "
        "or between 0 and 10."
    )


def normalize_alert(alert):
    """
    Normalize all alert values.
    Returns a new dictionary with all scoring
    factors converted to the 0-10 scale.
    """
    normalized = alert.copy()

    normalized["severity"] = min(
        max(float(alert["severity"]), 0), 10
    )
    normalized["asset_importance"] = min(
        max(float(alert["asset_importance"]), 0), 10
    )
    normalized["data_sensitivity"] = min(
        max(float(alert["data_sensitivity"]), 0), 10
    )
    normalized["business_impact"] = min(
        max(float(alert["business_impact"]), 0), 10
    )
    normalized["affected_users"] = normalize_affected_users(
        alert["affected_users"]
    )
    normalized["confidence"] = normalize_confidence(
        alert["confidence"]
    )

    return normalized