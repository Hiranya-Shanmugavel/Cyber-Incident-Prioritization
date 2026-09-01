# database.py

import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "cyber_incidents.db"
)


def get_connection():
    """Get a SQLite database connection."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def init_db():
    """Initialize the database and create tables."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS incidents (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            severity REAL NOT NULL,
            asset_importance REAL NOT NULL,
            affected_users INTEGER NOT NULL,
            data_sensitivity REAL NOT NULL,
            confidence REAL NOT NULL,
            business_impact REAL NOT NULL,
            status TEXT NOT NULL DEFAULT 'Open',
            source TEXT,
            description TEXT,
            mitre_tactics TEXT,
            source_ip TEXT,
            geo_location TEXT,
            remediation_playbook TEXT,
            sla_deadline TEXT,
            priority_score REAL,
            priority_level TEXT,
            rank INTEGER,
            explanation TEXT,
            created_at TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


def row_to_dict(row):
    """Convert a sqlite3.Row to a dictionary."""
    if row is None:
        return None
    return dict(row)


def get_all_incidents():
    """Get all incidents from the database."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM incidents
        ORDER BY priority_score DESC, created_at DESC
    """)
    rows = cursor.fetchall()
    conn.close()
    return [row_to_dict(row) for row in rows]


def get_incident_by_id(incident_id):
    """Get a single incident by ID."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM incidents WHERE id = ?", (incident_id,))
    row = cursor.fetchone()
    conn.close()
    return row_to_dict(row)


def insert_incident(incident):
    """Insert a new incident into the database."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT OR REPLACE INTO incidents
        (id, type, severity, asset_importance, affected_users,
         data_sensitivity, confidence, business_impact, status,
         source, description, mitre_tactics, source_ip, geo_location,
         remediation_playbook, sla_deadline, priority_score, priority_level,
         rank, explanation, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        incident["id"],
        incident["type"],
        incident["severity"],
        incident["asset_importance"],
        incident["affected_users"],
        incident["data_sensitivity"],
        incident["confidence"],
        incident["business_impact"],
        incident.get("status", "Open"),
        incident.get("source"),
        incident.get("description"),
        incident.get("mitre_tactics"),
        incident.get("source_ip"),
        incident.get("geo_location"),
        incident.get("remediation_playbook"),
        incident.get("sla_deadline"),
        incident.get("priority_score"),
        incident.get("priority_level"),
        incident.get("rank"),
        incident.get("explanation"),
        incident.get("created_at", datetime.now().isoformat())
    ))

    conn.commit()
    conn.close()


def update_incident_status(incident_id, status):
    """Update the status of an incident."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE incidents SET status = ? WHERE id = ?",
        (status, incident_id)
    )
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return affected > 0


def get_incident_count():
    """Get the total number of incidents."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as count FROM incidents")
    row = cursor.fetchone()
    conn.close()
    return row["count"] if row else 0


def get_next_id():
    """Generate the next incident ID."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM incidents ORDER BY id DESC LIMIT 1")
    row = cursor.fetchone()
    conn.close()

    if row is None:
        return "INC001"

    last_id = row["id"]
    # Extract number from INCxxx format
    try:
        num = int(last_id.replace("INC", ""))
        return f"INC{num + 1:03d}"
    except (ValueError, AttributeError):
        return f"INC{get_incident_count() + 1:03d}"


def seed_database(sample_incidents):
    """Seed the database with sample data if empty."""
    if get_incident_count() == 0:
        for incident in sample_incidents:
            insert_incident(incident)
        return True
    return False
