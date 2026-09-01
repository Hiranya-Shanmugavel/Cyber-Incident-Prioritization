import math


def normalize_severity(severity):
    """
    Convert severity labels into a 0-10 numeric score.
    """

    severity_map = {
        "CRITICAL": 10,
        "HIGH": 8,
        "MEDIUM": 5,
        "LOW": 2
    }

    # If severity is already numeric
    if isinstance(severity, (int, float)):
        return min(max(float(severity), 0), 10)

    # If severity is a string
    severity_text = str(severity).strip().upper()

    if severity_text in severity_map:
        return severity_map[severity_text]

    raise ValueError(
        f"Invalid severity value: {severity}"
    )


def normalize_affected_users(users):
    """
    Convert the number of affected users
    into a score from 0 to 10.

    Uses logarithmic scaling so very large
    numbers do not dominate the priority score.
    """

    users = float(users)

    if users <= 0:
        return 0

    score = math.log10(users + 1) * 2.5

    return round(min(score, 10), 2)


def normalize_confidence(confidence):
    """
    Convert confidence into a 0-10 scale.

    Example:
    0.95 -> 9.5
    0.70 -> 7.0
    """

    confidence = float(confidence)

    # Confidence between 0 and 1
    if 0 <= confidence <= 1:
        return round(confidence * 10, 2)

    # Confidence already between 0 and 10
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

    # Convert severity label to numeric score
    normalized["severity"] = normalize_severity(
        alert["severity"]
    )

    # Normalize asset importance
    normalized["asset_importance"] = min(
        max(float(alert["asset_importance"]), 0),
        10
    )

    # Normalize data sensitivity
    normalized["data_sensitivity"] = min(
        max(float(alert["data_sensitivity"]), 0),
        10
    )

    # Normalize business impact
    normalized["business_impact"] = min(
        max(float(alert["business_impact"]), 0),
        10
    )

    # Normalize affected users
    normalized["affected_users"] = normalize_affected_users(
        alert["affected_users"]
    )

    # Normalize confidence
    normalized["confidence"] = normalize_confidence(
        alert["confidence"]
    )

    return normalized