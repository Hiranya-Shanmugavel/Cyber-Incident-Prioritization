# app.py

import sys
import os

# Ensure backend directory is in Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from datetime import datetime
from typing import List, Optional

from models import IncidentCreate, IncidentResponse, PrioritizeRequest, DashboardStats
from database import init_db, get_all_incidents, get_incident_by_id, insert_incident, update_incident_status, get_next_id, seed_database
from scoring_engine import prioritize_alerts, score_single_incident
from sample_data import SAMPLE_INCIDENTS


# Initialize FastAPI
app = FastAPI(
    title="Cyber Incident Prioritization API",
    description="API for evaluating and scoring cybersecurity threats",
    version="2.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount frontend static files
frontend_dir = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "..",
    "frontend-react/dist"
)
if os.path.isdir(frontend_dir):
    app.mount("/frontend", StaticFiles(directory=frontend_dir), name="frontend-react/dist")


@app.on_event("startup")
def startup():
    """Initialize database and seed sample data on startup."""
    init_db()

    # Score sample incidents before seeding
    scored_incidents = prioritize_alerts(SAMPLE_INCIDENTS)
    seed_database(scored_incidents)


# ========================
# HEALTH CHECK
# ========================

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}


from fastapi.responses import RedirectResponse

@app.get("/")
def read_root():
    """Redirect to the React frontend."""
    return RedirectResponse(url="/frontend/index.html")


# ========================
# INCIDENTS
# ========================

@app.get("/api/incidents")
def list_incidents(status: Optional[str] = None, priority_level: Optional[str] = None):
    """Get all incidents, optionally filtered by status or priority level."""
    incidents = get_all_incidents()

    if status:
        incidents = [i for i in incidents if i.get("status", "").lower() == status.lower()]

    if priority_level:
        incidents = [i for i in incidents if i.get("priority_level", "").upper() == priority_level.upper()]

    # Re-rank the filtered list
    for idx, incident in enumerate(incidents, start=1):
        incident["rank"] = idx

    return incidents


@app.get("/api/incidents/{incident_id}")
def get_incident(incident_id: str):
    """Get a specific incident by ID."""
    incident = get_incident_by_id(incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")
    return incident


@app.post("/api/incidents", status_code=201)
def create_incident(data: IncidentCreate):
    """Create a new incident and score it."""
    alert = data.model_dump()

    # Generate ID if not provided
    if not alert.get("id"):
        alert["id"] = get_next_id()

    # Add timestamp
    alert["created_at"] = datetime.now().isoformat()

    try:
        scored = score_single_incident(alert)
    except (ValueError, KeyError, TypeError) as e:
        raise HTTPException(status_code=400, detail=f"Scoring error: {str(e)}")

    if not scored.get("sla_deadline"):
        from datetime import timedelta
        level = scored.get("priority_level", "LOW")
        now = datetime.now()
        if level == "CRITICAL": delta = timedelta(minutes=15)
        elif level == "HIGH": delta = timedelta(hours=1)
        elif level == "MEDIUM": delta = timedelta(hours=4)
        else: delta = timedelta(hours=24)
        scored["sla_deadline"] = (now + delta).isoformat()

    insert_incident(scored)

    return scored


@app.patch("/api/incidents/{incident_id}/status")
def update_status(incident_id: str, status: str):
    """Update incident status (Investigate, Escalate, Resolve)."""
    incident = get_incident_by_id(incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")

    valid_statuses = ["Open", "Investigating", "Escalated", "Resolved", "Closed"]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )

    update_incident_status(incident_id, status)
    return {"id": incident_id, "status": status, "message": f"Incident {incident_id} status updated to {status}"}


@app.post("/api/incidents/{incident_id}/soar-action")
def execute_soar_action(incident_id: str, action: dict):
    """Execute SOAR action for an incident."""
    incident = get_incident_by_id(incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    # Simulate action success
    action_type = action.get("action_type", "Unknown")
    return {"status": "success", "message": f"Action '{action_type}' successfully executed on {incident_id}"}


# ========================
# PRIORITIZE
# ========================

@app.post("/api/prioritize")
def prioritize(request: PrioritizeRequest):
    """Accept cybersecurity alerts and return scored, ranked results."""
    alerts = [alert.model_dump() for alert in request.alerts]

    if not alerts:
        raise HTTPException(status_code=400, detail="No alerts provided")

    try:
        ranked = prioritize_alerts(alerts)
    except (ValueError, KeyError, TypeError) as e:
        raise HTTPException(status_code=400, detail=f"Scoring error: {str(e)}")

    return ranked


# ========================
# DASHBOARD
# ========================

@app.get("/api/dashboard")
def dashboard():
    """Return dashboard statistics."""
    incidents = get_all_incidents()

    # Count by priority level
    critical_count = sum(1 for i in incidents if i.get("priority_level") == "CRITICAL")
    high_count = sum(1 for i in incidents if i.get("priority_level") == "HIGH")
    medium_count = sum(1 for i in incidents if i.get("priority_level") == "MEDIUM")
    low_count = sum(1 for i in incidents if i.get("priority_level") == "LOW")

    # Active incidents (not resolved/closed)
    active = [i for i in incidents if i.get("status") not in ("Resolved", "Closed")]

    # Priority queue (top incidents sorted by score)
    sorted_incidents = sorted(
        incidents,
        key=lambda x: x.get("priority_score", 0),
        reverse=True
    )
    for idx, inc in enumerate(sorted_incidents, start=1):
        inc["rank"] = idx

    # Calculate detection rate (simulated based on confidence)
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

@app.exception_handler(404)
async def custom_404_handler(request, exc):
    if request.url.path.startswith('/api') or request.url.path.startswith('/docs'):
        from fastapi.responses import JSONResponse
        return JSONResponse({'detail': 'Not Found'}, status_code=404)
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url='/frontend/index.html#' + request.url.path)
