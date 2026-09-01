# explanation.py


def generate_explanation(alert):
    """
    Generate a simple explanation for why
    an alert received its priority score.
    """

    reasons = []

    # Severity
    if alert["severity"] >= 8:
        reasons.append("high severity")

    # Asset importance
    if alert["asset_importance"] >= 8:
        reasons.append("critical asset importance")

    # Data sensitivity
    if alert["data_sensitivity"] >= 8:
        reasons.append("highly sensitive data")

    # Confidence
    if alert["confidence"] >= 8:
        reasons.append("high attack confidence")

    # Business impact
    if alert["business_impact"] >= 8:
        reasons.append("high business impact")

    # Affected users
    if alert["affected_users"] >= 7:
        reasons.append("large number of affected users")

    # If no major factors are detected
    if not reasons:
        return (
            "This alert has moderate or low scores "
            "across the main risk factors."
        )

    return "Ranked high because of " + ", ".join(reasons) + "."