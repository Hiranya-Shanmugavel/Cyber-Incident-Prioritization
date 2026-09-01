# explanation.py

def generate_explanation(alert):
    """
    Generate a simple explanation for why an alert received its priority score.
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
        return "This alert has moderate or low scores across the main risk factors."

    return "Ranked high because of " + ", ".join(reasons) + "."

def generate_rank_comparison(higher_alert, lower_alert):
    """
    Explain why higher_alert outranks lower_alert.
    Both should be fully scored alerts with raw or normalized values.
    """
    if higher_alert["priority_score"] > lower_alert["priority_score"]:
        return (
            f"The {higher_alert['type']} ranked above {lower_alert['type']} "
            f"because it has a higher overall priority score "
            f"({higher_alert['priority_score']} vs {lower_alert['priority_score']})."
        )
    
    # If scores are equal, find the tie-breaking factor
    factors = [
        ("severity", "Severity"),
        ("business_impact", "Business Impact"),
        ("asset_importance", "Asset Importance"),
        ("data_sensitivity", "Data Sensitivity"),
        ("confidence", "Attack Confidence"),
        ("affected_users", "Affected Users")
    ]
    
    for key, name in factors:
        val1 = higher_alert.get(key, 0)
        val2 = lower_alert.get(key, 0)
        if val1 > val2:
            return (
                f"Both incidents received a priority score of {higher_alert['priority_score']}. "
                f"The {higher_alert['type']} ranked higher because its {name} score was higher, "
                f"which is the tie-breaking factor."
            )
            
    return (
        f"Both incidents received a priority score of {higher_alert['priority_score']} "
        f"and had identical risk factors. The {higher_alert['type']} ranked higher "
        f"based on alphanumeric ID sorting."
    )