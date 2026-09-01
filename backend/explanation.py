# explanation.py


def generate_explanation(alert):
    """
    Generate a simple explanation for why
    an alert received its priority score.

    Expects NORMALIZED alert values (all on 0-10 scale).
    """
    reasons = []

    if alert.get("severity", 0) >= 8:
        reasons.append("high severity")

    if alert.get("asset_importance", 0) >= 8:
        reasons.append("critical asset importance")

    if alert.get("data_sensitivity", 0) >= 8:
        reasons.append("highly sensitive data")

    if alert.get("confidence", 0) >= 8:
        reasons.append("high attack confidence")

    if alert.get("business_impact", 0) >= 8:
        reasons.append("high business impact")

    if alert.get("affected_users", 0) >= 6:
        reasons.append("large number of affected users")

    if not reasons:
        return (
            "This alert has moderate or low scores "
            "across the main risk factors."
        )

    return "Ranked high because of " + ", ".join(reasons) + "."