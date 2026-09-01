# models.py

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class IncidentCreate(BaseModel):
    """Schema for creating a new incident."""
    id: Optional[str] = None
    type: str = Field(..., description="Type of cyber incident")
    severity: float = Field(..., ge=0, le=10, description="Severity score 0-10")
    asset_importance: float = Field(..., ge=0, le=10, description="Asset importance 0-10")
    affected_users: int = Field(..., ge=0, description="Number of affected users")
    data_sensitivity: float = Field(..., ge=0, le=10, description="Data sensitivity 0-10")
    confidence: float = Field(..., ge=0, le=1, description="Attack confidence 0-1")
    business_impact: float = Field(..., ge=0, le=10, description="Business impact 0-10")
    status: str = Field(default="Open", description="Incident status")
    source: Optional[str] = None
    description: Optional[str] = None
    mitre_tactics: Optional[str] = None
    source_ip: Optional[str] = None
    geo_location: Optional[str] = None
    remediation_playbook: Optional[str] = None
    sla_deadline: Optional[str] = None


class IncidentResponse(BaseModel):
    """Schema for incident API responses."""
    id: str
    type: str
    severity: float
    asset_importance: float
    affected_users: int
    data_sensitivity: float
    confidence: float
    business_impact: float
    status: str
    created_at: str
    priority_score: Optional[float] = None
    priority_level: Optional[str] = None
    rank: Optional[int] = None
    explanation: Optional[str] = None
    source: Optional[str] = None
    description: Optional[str] = None
    mitre_tactics: Optional[str] = None
    source_ip: Optional[str] = None
    geo_location: Optional[str] = None
    remediation_playbook: Optional[str] = None
    sla_deadline: Optional[str] = None


class PrioritizeRequest(BaseModel):
    """Schema for batch prioritization request."""
    alerts: List[IncidentCreate]


class DashboardStats(BaseModel):
    """Schema for dashboard statistics."""
    critical_threats: int
    active_incidents: int
    threat_detection_rate: float
    average_response_time: str
    priority_queue: list
    threat_distribution: dict
