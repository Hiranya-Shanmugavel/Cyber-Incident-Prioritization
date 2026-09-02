# Vercel Serverless API Entry Point
# This is a self-contained FastAPI app for Vercel's Python runtime.
# It uses in-memory data (no SQLite) because Vercel functions are stateless.

import sys
import os

# Add backend directory to Python path
backend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'backend')
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from datetime import datetime, timedelta

from normalization import normalize_alert
from scoring_engine import prioritize_alerts, score_single_incident, calculate_priority_score, get_priority_level, get_score_breakdown
from explanation import generate_explanation
from sample_data import SAMPLE_INCIDENTS

# ========================
# Initialize FastAPI
# ========================
app = FastAPI(
    title="ThreatPulse - Cyber Incident Prioritization API",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========================
# In-Memory Data Store
# (Vercel functions are stateless, so we score on every cold start)
# ========================
def _build_incident_store():
    """Score and rank all sample incidents for the in-memory store."""
    scored = prioritize_alerts(SAMPLE_INCIDENTS)
    # Add SLA deadlines
    for inc in scored:
        if not inc.get("sla_deadline"):
            level = inc.get("priority_level", "LOW")
            now = datetime.now()
            if level == "CRITICAL":
                delta = timedelta(minutes=15)
            elif level == "HIGH":
                delta = timedelta(hours=1)
            elif level == "MEDIUM":
                delta = timedelta(hours=4)
            else:
                delta = timedelta(hours=24)
            inc["sla_deadline"] = (now + delta).isoformat()
    return scored

INCIDENTS = _build_incident_store()

# ========================
# HEALTH CHECK
# ========================
@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

# ========================
# INCIDENTS
# ========================
@app.get("/api/incidents")
def list_incidents(status: Optional[str] = None, priority_level: Optional[str] = None):
    results = list(INCIDENTS)
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

# ========================
# DASHBOARD
# ========================
@app.get("/api/dashboard")
def dashboard():
    incidents = INCIDENTS
    critical_count = sum(1 for i in incidents if i.get("priority_level") == "CRITICAL")
    high_count = sum(1 for i in incidents if i.get("priority_level") == "HIGH")
    medium_count = sum(1 for i in incidents if i.get("priority_level") == "MEDIUM")
    low_count = sum(1 for i in incidents if i.get("priority_level") == "LOW")
    active = [i for i in incidents if i.get("status") not in ("Resolved", "Closed")]

    sorted_incidents = sorted(incidents, key=lambda x: x.get("priority_score", 0), reverse=True)
    for idx, inc in enumerate(sorted_incidents, start=1):
        inc["rank"] = idx

    avg_confidence = 0
    if incidents:
        avg_confidence = sum(i.get("confidence", 0) for i in incidents) / len(incidents)

    return {
        "critical_threats": critical_count,
        "active_incidents": len(active),
        "threat_detection_rate": round(avg_confidence * 100, 1),
        "average_response_time": "4.2m",
        "priority_queue": sorted_incidents,
        "threat_distribution": {
            "critical": critical_count,
            "high": high_count,
            "medium": medium_count,
            "low": low_count
        },
        "total_incidents": len(incidents)
    }

# ========================
# PRIORITIZE (POST)
# ========================
@app.post("/api/prioritize")
def prioritize(request: dict):
    alerts = request.get("alerts", [])
    if not alerts:
        raise HTTPException(status_code=400, detail="No alerts provided")
    try:
        ranked = prioritize_alerts(alerts)
    except (ValueError, KeyError, TypeError) as e:
        raise HTTPException(status_code=400, detail=f"Scoring error: {str(e)}")
    return ranked

# ========================
# SOAR ACTION (mock)
# ========================
@app.post("/api/incidents/{incident_id}/soar-action")
def soar_action(incident_id: str, action: dict):
    action_type = action.get("action_type", "Unknown")
    return {"status": "success", "message": f"Action '{action_type}' executed on {incident_id}"}

# ========================
# STATUS UPDATE (mock)
# ========================
@app.patch("/api/incidents/{incident_id}/status")
def update_status(incident_id: str, status: str):
    for inc in INCIDENTS:
        if inc.get("id") == incident_id:
            inc["status"] = status
            return {"id": incident_id, "status": status, "message": f"Status updated to {status}"}
    raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")
