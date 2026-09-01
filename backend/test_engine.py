# test_engine.py
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from scoring_engine import prioritize_alerts

alerts = [
    {
        "id": "INC001",
        "type": "Credential Phishing Campaign",
        "severity": 8,
        "asset_importance": 9,
        "affected_users": 500,
        "data_sensitivity": 9,
        "confidence": 0.95,
        "business_impact": 9
    },
    {
        "id": "INC002",
        "type": "Malware Attachment Detected",
        "severity": 8,
        "asset_importance": 8,
        "affected_users": 1,
        "data_sensitivity": 10,
        "confidence": 0.90,
        "business_impact": 8
    },
    {
        "id": "INC003",
        "type": "Suspicious Domain Activity",
        "severity": 6,
        "asset_importance": 5,
        "affected_users": 5,
        "data_sensitivity": 5,
        "confidence": 60, # testing percentage 60%
        "business_impact": 5
    },
    {
        "id": "INC004",
        "type": "Port Scan",
        "severity": 2,
        "asset_importance": 3,
        "affected_users": 0,
        "data_sensitivity": 1,
        "confidence": 0.5,
        "business_impact": 1
    },
    {
        "id": "INC005",
        "type": "Data Exfiltration Attempt",
        "severity": 10,
        "asset_importance": 10,
        "affected_users": 1000,
        "data_sensitivity": 10,
        "confidence": 0.99,
        "business_impact": 10
    },
    {
        # Engineered tie with INC007
        "id": "INC006",
        "type": "Brute Force Login Attack",
        "severity": 7,
        "asset_importance": 7,
        "affected_users": 50,
        "data_sensitivity": 7,
        "confidence": 0.8,
        "business_impact": 7
    },
    {
        # Engineered tie with INC006 (same total score). But has lower severity and higher business impact
        # We'll make it so the score is mathematically identical.
        # WEIGHTS = Sev:0.25, Asset:0.20, Users:0.10, Data:0.15, Conf:0.15, Bus:0.15
        # INC006: 7*0.25 + 7*0.20 + (log10(51)*2.5)*0.10 + 7*0.15 + 8*0.15 + 7*0.15
        # Let's just make ALL values identical except Severity and Business impact swapped?
        # Actually Sev weight is 0.25, Bus Impact is 0.15. 
        # So Sev=7 (1.75) and Bus=7 (1.05) -> Total = 2.80
        # For INC007: Sev=6.4 (1.6) and Bus=8 (1.2) -> Total = 2.80
        # Asset, Users, Data, Conf are identical.
        # Tie-breaker should pick INC006 (Severity 7 > 6.4)
        "id": "INC007",
        "type": "Suspicious Email",
        "severity": 6.4,
        "asset_importance": 7,
        "affected_users": 50,
        "data_sensitivity": 7,
        "confidence": 0.8,
        "business_impact": 8
    }
]

def run_tests():
    print("\n===== RUNNING SCORING ENGINE TESTS =====")
    print()

    ranked_alerts = prioritize_alerts(alerts)

    print("===== PRIORITY QUEUE =====\n")

    for alert in ranked_alerts:
        print(f"Rank: #{alert['rank']}")
        print(f"ID: {alert['id']}")
        print(f"Incident: {alert['type']}")
        print(f"Priority Score: {alert['priority_score']}")
        print(f"Priority Level: {alert['priority_level']}")
        print(f"Explanation: {alert['explanation']}")
        print(f"Comparison: {alert.get('rank_explanation')}")
        print("-" * 60)

    # Assertions
    assert ranked_alerts[0]["id"] == "INC005", "Data Exfiltration should be rank 1"
    
    # Check the tie breaker between INC006 and INC007
    inc006 = next(a for a in ranked_alerts if a["id"] == "INC006")
    inc007 = next(a for a in ranked_alerts if a["id"] == "INC007")
    
    assert inc006["priority_score"] == inc007["priority_score"], "Scores should be equal to test tie-breaking"
    assert inc006["rank"] < inc007["rank"], "INC006 should rank higher due to higher severity"
    
    print("\n===== ALL TESTS PASSED =====")

if __name__ == "__main__":
    run_tests()