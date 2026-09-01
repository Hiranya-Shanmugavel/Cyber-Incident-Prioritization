# sample_data.py

"""
Sample cybersecurity incidents for initial database seeding.
"""

SAMPLE_INCIDENTS = [
    {
        "id": "INC001",
        "type": "Credential Phishing Campaign",
        "severity": 9,
        "asset_importance": 9,
        "affected_users": 500,
        "data_sensitivity": 9,
        "confidence": 0.95,
        "business_impact": 9,
        "status": "Open",
        "source": "login-secure-auth.com",
        "description": "Suspicious login page targeting enterprise credentials",
        "mitre_tactics": "T1566, T1048",
        "source_ip": "185.15.22.10",
        "geo_location": "RU (Russia)",
        "remediation_playbook": "1. Isolate the affected host.\n2. Block IP 185.15.22.10 on firewall.\n3. Force password reset for compromised accounts.",
        "created_at": "2026-09-01T10:00:00"
    },
    {
        "id": "INC002",
        "type": "Malware Attachment Detected",
        "severity": 8,
        "asset_importance": 8,
        "affected_users": 250,
        "data_sensitivity": 8,
        "confidence": 0.90,
        "business_impact": 8,
        "status": "Open",
        "source": "email-gateway",
        "description": "Malicious executable detected in incoming email",
        "mitre_tactics": "T1566.001, T1204.002",
        "source_ip": "104.28.19.123",
        "geo_location": "US (United States)",
        "remediation_playbook": "1. Delete email from inboxes.\n2. Add hash to endpoint protection blocklist.\n3. Scan host for malicious processes.",
        "created_at": "2026-09-01T10:05:00"
    },
    {
        "id": "INC003",
        "type": "Suspicious Domain Activity",
        "severity": 8,
        "asset_importance": 7,
        "affected_users": 150,
        "data_sensitivity": 7,
        "confidence": 0.88,
        "business_impact": 8,
        "status": "Open",
        "source": "secure-payments.net",
        "description": "Newly registered domain mimicking a trusted brand",
        "created_at": "2026-09-01T10:10:00"
    },
    {
        "id": "INC004",
        "type": "Brute Force Attack",
        "severity": 7,
        "asset_importance": 7,
        "affected_users": 80,
        "data_sensitivity": 6,
        "confidence": 0.85,
        "business_impact": 7,
        "status": "Open",
        "source": "auth-server",
        "description": "Multiple failed authentication attempts detected",
        "created_at": "2026-09-01T10:15:00"
    },
    {
        "id": "INC005",
        "type": "Data Exfiltration Attempt",
        "severity": 10,
        "asset_importance": 10,
        "affected_users": 1000,
        "data_sensitivity": 10,
        "confidence": 0.97,
        "business_impact": 10,
        "status": "Open",
        "source": "database-server",
        "description": "Unusual outbound data transfer from production database",
        "created_at": "2026-09-01T09:30:00"
    },
    {
        "id": "INC006",
        "type": "Ransomware Detection",
        "severity": 10,
        "asset_importance": 9,
        "affected_users": 800,
        "data_sensitivity": 9,
        "confidence": 0.93,
        "business_impact": 10,
        "status": "Open",
        "source": "endpoint-protection",
        "description": "Ransomware encryption activity detected on file server",
        "created_at": "2026-09-01T09:45:00"
    },
    {
        "id": "INC007",
        "type": "Insider Threat Activity",
        "severity": 6,
        "asset_importance": 7,
        "affected_users": 30,
        "data_sensitivity": 8,
        "confidence": 0.72,
        "business_impact": 6,
        "status": "Investigating",
        "source": "user-behavior-analytics",
        "description": "Abnormal access patterns from privileged user account",
        "created_at": "2026-09-01T10:20:00"
    },
    {
        "id": "INC008",
        "type": "DDoS Attack",
        "severity": 5,
        "asset_importance": 5,
        "affected_users": 2000,
        "data_sensitivity": 3,
        "confidence": 0.80,
        "business_impact": 5,
        "status": "Open",
        "source": "network-monitor",
        "description": "Distributed denial of service targeting web application",
        "created_at": "2026-09-01T10:25:00"
    }
]
