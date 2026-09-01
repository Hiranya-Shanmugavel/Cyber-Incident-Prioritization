from scoring_engine import prioritize_alerts


alerts = [
    {
        "id": "INC001",
        "type": "Data Exfiltration",
        "severity": 10,
        "asset_importance": 10,
        "affected_users": 1000,
        "data_sensitivity": 10,
        "confidence": 0.95,
        "business_impact": 10
    },
    {
        "id": "INC002",
        "type": "Malware Detection",
        "severity": 8,
        "asset_importance": 8,
        "affected_users": 500,
        "data_sensitivity": 8,
        "confidence": 0.90,
        "business_impact": 8
    },
    {
        "id": "INC003",
        "type": "Port Scan",
        "severity": 4,
        "asset_importance": 4,
        "affected_users": 20,
        "data_sensitivity": 2,
        "confidence": 0.70,
        "business_impact": 3
    }
]


ranked_alerts = prioritize_alerts(alerts)

print("\n===== PRIORITY QUEUE =====\n")

for alert in ranked_alerts:
    print(f"Rank: {alert['rank']}")
    print(f"Incident: {alert['type']}")
    print(f"Priority Score: {alert['priority_score']}")
    print(f"Priority Level: {alert['priority_level']}")
    print(f"Reason: {alert['reason']}")
    print("-" * 40)