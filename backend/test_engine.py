# test_engine.py

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

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


def run_tests():
    print("\n===== RUNNING SCORING ENGINE TESTS =====")
    print()

    ranked_alerts = prioritize_alerts(alerts)

    print("===== PRIORITY QUEUE =====\n")

    for alert in ranked_alerts:
        print(f"Rank: {alert['rank']}")
        print(f"Incident: {alert['type']}")
        print(f"Priority Score: {alert['priority_score']}")
        print(f"Priority Level: {alert['priority_level']}")
        print(f"Explanation: {alert['explanation']}")
        print("-" * 40)

    # Assertions
    assert ranked_alerts[0]["rank"] == 1, "First alert should be rank 1"
    assert ranked_alerts[0]["priority_score"] > ranked_alerts[1]["priority_score"], \
        "First alert should have highest score"
    assert ranked_alerts[0]["priority_level"] == "CRITICAL", \
        "First alert should be CRITICAL"
    assert ranked_alerts[2]["priority_level"] in ("LOW", "MEDIUM"), \
        "Last alert should be LOW or MEDIUM"
    assert "explanation" in ranked_alerts[0], "Should have explanation field"

    print("\n===== ALL TESTS PASSED =====")


if __name__ == "__main__":
    run_tests()