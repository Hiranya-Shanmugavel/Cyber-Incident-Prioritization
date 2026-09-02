# api/index.py
# Vercel Serverless API — Fully self-contained (no external backend imports)
# All scoring/ranking/explanation logic is inlined to avoid import path issues on Vercel.

import math
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

# ============================================================
# NORMALIZATION (inlined from backend/normalization.py)
# ============================================================

def normalize_affected_users(users):
    users = int(users)
    if users <= 0:
        return 0
    score = math.log10(users + 1) * 2.5
    return round(min(score, 10), 2)

def normalize_confidence(confidence):
    confidence = float(confidence)
    if 0 <= confidence <= 1:
        return round(confidence * 10, 2)
    elif 1 < confidence <= 10:
        return round(confidence, 2)
    elif 10 < confidence <= 100:
        return round(confidence / 10, 2)
    else:
        return 10.0

def normalize_alert(alert):
    normalized = alert.copy()
    normalized["severity"] = min(max(float(alert.get("severity", 0)), 0), 10)
    normalized["asset_importance"] = min(max(float(alert.get("asset_importance", 0)), 0), 10)
    normalized["data_sensitivity"] = min(max(float(alert.get("data_sensitivity", 0)), 0), 10)
    normalized["business_impact"] = min(max(float(alert.get("business_impact", 0)), 0), 10)
    normalized["affected_users"] = normalize_affected_users(alert.get("affected_users", 0))
    normalized["confidence"] = normalize_confidence(alert.get("confidence", 0))
    return normalized

# ============================================================
# SCORING ENGINE (inlined from backend/scoring_engine.py)
# ============================================================

WEIGHTS = {
    "severity": 0.25, "asset_importance": 0.20, "affected_users": 0.10,
    "data_sensitivity": 0.15, "confidence": 0.15, "business_impact": 0.15
}

def calculate_priority_score(alert):
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
    if score >= 90: return "CRITICAL"
    elif score >= 70: return "HIGH"
    elif score >= 40: return "MEDIUM"
    else: return "LOW"

def get_score_breakdown(n):
    return {
        "severity": round(n["severity"] * WEIGHTS["severity"] * 10, 2),
        "asset_importance": round(n["asset_importance"] * WEIGHTS["asset_importance"] * 10, 2),
        "affected_users": round(n["affected_users"] * WEIGHTS["affected_users"] * 10, 2),
        "data_sensitivity": round(n["data_sensitivity"] * WEIGHTS["data_sensitivity"] * 10, 2),
        "confidence": round(n["confidence"] * WEIGHTS["confidence"] * 10, 2),
        "business_impact": round(n["business_impact"] * WEIGHTS["business_impact"] * 10, 2),
    }

# ============================================================
# RANKING (inlined from backend/ranking.py)
# ============================================================

def rank_alerts(alerts):
    ranked = sorted(alerts, key=lambda a: (
        -a.get("priority_score", 0), -a.get("severity", 0),
        -a.get("business_impact", 0), -a.get("asset_importance", 0),
        -a.get("data_sensitivity", 0), -a.get("confidence", 0),
        -a.get("affected_users", 0), a.get("id", "")
    ))
    for rank, alert in enumerate(ranked, start=1):
        alert["rank"] = rank
    return ranked

# ============================================================
# EXPLANATION (inlined from backend/explanation.py)
# ============================================================

def generate_explanation(alert):
    reasons = []
    if alert.get("severity", 0) >= 8: reasons.append("high severity")
    if alert.get("asset_importance", 0) >= 8: reasons.append("critical asset importance")
    if alert.get("data_sensitivity", 0) >= 8: reasons.append("highly sensitive data")
    if alert.get("confidence", 0) >= 8: reasons.append("high attack confidence")
    if alert.get("business_impact", 0) >= 8: reasons.append("high business impact")
    if alert.get("affected_users", 0) >= 6: reasons.append("large number of affected users")
    if not reasons:
        return "This alert has moderate or low scores across the main risk factors."
    return "Ranked high because of " + ", ".join(reasons) + "."

def generate_rank_comparison(higher, lower):
    if higher["priority_score"] > lower["priority_score"]:
        return (f"The {higher['type']} ranked above {lower['type']} because it has a higher "
                f"overall priority score ({higher['priority_score']} vs {lower['priority_score']}).")
    factors = [("severity","Severity"),("business_impact","Business Impact"),
               ("asset_importance","Asset Importance"),("data_sensitivity","Data Sensitivity"),
               ("confidence","Attack Confidence"),("affected_users","Affected Users")]
    for key, name in factors:
        if higher.get(key, 0) > lower.get(key, 0):
            return (f"Both incidents received a priority score of {higher['priority_score']}. "
                    f"The {higher['type']} ranked higher because its {name} score was higher, "
                    f"which is the tie-breaking factor.")
    return (f"Both incidents received a priority score of {higher['priority_score']} "
            f"and had identical risk factors. The {higher['type']} ranked higher "
            f"based on alphanumeric ID sorting.")

# ============================================================
# PRIORITIZE (combines all steps)
# ============================================================

def prioritize_alerts(alerts):
    processed = []
    for alert in alerts:
        n = normalize_alert(alert)
        ps = calculate_priority_score(n)
        r = alert.copy()
        r["priority_score"] = ps
        r["priority_level"] = get_priority_level(ps)
        r["score_breakdown"] = get_score_breakdown(n)
        r["explanation"] = generate_explanation(n)
        processed.append(r)
    ranked = rank_alerts(processed)
    for i in range(len(ranked)):
        if i < len(ranked) - 1:
            ranked[i]["rank_explanation"] = generate_rank_comparison(ranked[i], ranked[i+1])
        else:
            ranked[i]["rank_explanation"] = "This is the lowest ranked incident."
    return ranked

# ============================================================
# SAMPLE DATA (inlined from backend/sample_data.py)
# ============================================================

SAMPLE_INCIDENTS = [
    {"id":"INC001","type":"Credential Phishing Campaign","severity":9,"asset_importance":9,"affected_users":500,"data_sensitivity":9,"confidence":0.95,"business_impact":9,"status":"Open","source":"login-secure-auth.com","description":"Suspicious login page targeting enterprise credentials","mitre_tactics":"T1566, T1048","source_ip":"185.15.22.10","geo_location":"RU (Russia)","remediation_playbook":"1. Isolate the affected host.\n2. Block IP 185.15.22.10 on firewall.\n3. Force password reset for compromised accounts.","created_at":"2026-09-01T10:00:00"},
    {"id":"INC002","type":"Malware Attachment Detected","severity":8,"asset_importance":8,"affected_users":250,"data_sensitivity":8,"confidence":0.90,"business_impact":8,"status":"Open","source":"email-gateway","description":"Malicious executable detected in incoming email","mitre_tactics":"T1566.001, T1204.002","source_ip":"104.28.19.123","geo_location":"US (United States)","remediation_playbook":"1. Delete email from inboxes.\n2. Add hash to endpoint protection blocklist.\n3. Scan host for malicious processes.","created_at":"2026-09-01T10:05:00"},
    {"id":"INC003","type":"Suspicious Domain Activity","severity":8,"asset_importance":7,"affected_users":150,"data_sensitivity":7,"confidence":0.88,"business_impact":8,"status":"Open","source":"secure-payments.net","description":"Newly registered domain mimicking a trusted brand","created_at":"2026-09-01T10:10:00"},
    {"id":"INC004","type":"Brute Force Attack","severity":7,"asset_importance":7,"affected_users":80,"data_sensitivity":6,"confidence":0.85,"business_impact":7,"status":"Open","source":"auth-server","description":"Multiple failed authentication attempts detected","created_at":"2026-09-01T10:15:00"},
    {"id":"INC005","type":"Data Exfiltration Attempt","severity":10,"asset_importance":10,"affected_users":1000,"data_sensitivity":10,"confidence":0.97,"business_impact":10,"status":"Open","source":"database-server","description":"Unusual outbound data transfer from production database","created_at":"2026-09-01T09:30:00"},
    {"id":"INC006","type":"Ransomware Detection","severity":10,"asset_importance":9,"affected_users":800,"data_sensitivity":9,"confidence":0.93,"business_impact":10,"status":"Open","source":"endpoint-protection","description":"Ransomware encryption activity detected on file server","created_at":"2026-09-01T09:45:00"},
    {"id":"INC007","type":"Insider Threat Activity","severity":6,"asset_importance":7,"affected_users":30,"data_sensitivity":8,"confidence":0.72,"business_impact":6,"status":"Investigating","source":"user-behavior-analytics","description":"Abnormal access patterns from privileged user account","created_at":"2026-09-01T10:20:00"},
    {"id":"INC008","type":"DDoS Attack","severity":5,"asset_importance":5,"affected_users":2000,"data_sensitivity":3,"confidence":0.80,"business_impact":5,"status":"Open","source":"network-monitor","description":"Distributed denial of service targeting web application","created_at":"2026-09-01T10:25:00"},
]

# ============================================================
# BUILD IN-MEMORY STORE
# ============================================================

def _build_store():
    scored = prioritize_alerts(SAMPLE_INCIDENTS)
    for inc in scored:
        if not inc.get("sla_deadline"):
            level = inc.get("priority_level", "LOW")
            now = datetime.now()
            if level == "CRITICAL": delta = timedelta(minutes=15)
            elif level == "HIGH": delta = timedelta(hours=1)
            elif level == "MEDIUM": delta = timedelta(hours=4)
            else: delta = timedelta(hours=24)
            inc["sla_deadline"] = (now + delta).isoformat()
    return scored

INCIDENTS = _build_store()

# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(title="ThreatPulse API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/incidents")
def list_incidents(status: Optional[str] = None, priority_level: Optional[str] = None):
    results = [i.copy() for i in INCIDENTS]
    if status:
        results = [i for i in results if i.get("status", "").lower() == status.lower()]
    if priority_level:
        results = [i for i in results if i.get("priority_level", "").upper() == priority_level.upper()]
    for idx, inc in enumerate(results, start=1):
        inc["rank"] = idx
    return results

@app.get("/api/incidents/{incident_id}")
def get_incident(incident_id: str):
    for inc in INCIDENTS:
        if inc.get("id") == incident_id:
            return inc
    raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")

@app.get("/api/dashboard")
def dashboard():
    incidents = INCIDENTS
    critical = sum(1 for i in incidents if i.get("priority_level") == "CRITICAL")
    high = sum(1 for i in incidents if i.get("priority_level") == "HIGH")
    medium = sum(1 for i in incidents if i.get("priority_level") == "MEDIUM")
    low = sum(1 for i in incidents if i.get("priority_level") == "LOW")
    active = [i for i in incidents if i.get("status") not in ("Resolved", "Closed")]
    sorted_inc = sorted(incidents, key=lambda x: x.get("priority_score", 0), reverse=True)
    for idx, inc in enumerate(sorted_inc, start=1):
        inc["rank"] = idx
    avg_conf = sum(i.get("confidence", 0) for i in incidents) / max(len(incidents), 1)
    return {
        "critical_threats": critical, "active_incidents": len(active),
        "threat_detection_rate": round(avg_conf * 100, 1), "average_response_time": "4.2m",
        "priority_queue": sorted_inc,
        "threat_distribution": {"critical": critical, "high": high, "medium": medium, "low": low},
        "total_incidents": len(incidents)
    }

@app.post("/api/prioritize")
def prioritize_endpoint(request: dict):
    alerts = request.get("alerts", [])
    if not alerts:
        raise HTTPException(status_code=400, detail="No alerts provided")
    return prioritize_alerts(alerts)

@app.post("/api/incidents/{incident_id}/soar-action")
def soar_action(incident_id: str, action: dict):
    return {"status": "success", "message": f"Action '{action.get('action_type', 'Unknown')}' executed on {incident_id}"}

@app.patch("/api/incidents/{incident_id}/status")
def update_status(incident_id: str, status: str):
    for inc in INCIDENTS:
        if inc.get("id") == incident_id:
            inc["status"] = status
            return {"id": incident_id, "status": status, "message": f"Status updated to {status}"}
    raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")
