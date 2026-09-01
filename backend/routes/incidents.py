from flask import Blueprint, jsonify, request
import json
import os

from scoring_engine import prioritize_alerts

incident_bp = Blueprint("incidents", __name__)


def get_file_path():
    return os.path.join(
        os.path.dirname(__file__),
        "..",
        "data",
        "sample_alerts.json"
    )


@incident_bp.route("/api/incidents", methods=["GET"])
def get_incidents():

    file_path = get_file_path()

    with open(file_path, "r") as file:
        incidents = json.load(file)

    # If old/sample incidents don't have scoring fields,
    # return them as they are.
    return jsonify(incidents)


@incident_bp.route("/api/incidents/<int:incident_id>", methods=["GET"])
def get_incident(incident_id):

    file_path = get_file_path()

    with open(file_path, "r") as file:
        incidents = json.load(file)

    for incident in incidents:
        if incident["id"] == incident_id:
            return jsonify(incident)

    return jsonify({"error": "Incident not found"}), 404


@incident_bp.route("/api/incidents", methods=["POST"])
def create_incident():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    # Required basic incident fields
    required_fields = [
        "type",
        "source",
        "description"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "error": f"Missing required field: {field}"
            }), 400

    # Required scoring fields
    scoring_fields = [
        "severity",
        "asset_importance",
        "affected_users",
        "data_sensitivity",
        "confidence",
        "business_impact"
    ]

    for field in scoring_fields:
        if field not in data:
            return jsonify({
                "error": f"Missing scoring field: {field}"
            }), 400

    try:
        # Create alert for Person 3's scoring engine
        alert = {
            "type": data["type"],
            "source": data["source"],
            "description": data["description"],
            "severity": data["severity"],
            "asset_importance": data["asset_importance"],
            "affected_users": data["affected_users"],
            "data_sensitivity": data["data_sensitivity"],
            "confidence": data["confidence"],
            "business_impact": data["business_impact"]
        }

        # Send alert to scoring engine
        scored_alerts = prioritize_alerts([alert])

        scored_alert = scored_alerts[0]

    except (ValueError, KeyError, TypeError) as e:
        return jsonify({
            "error": f"Invalid scoring data: {str(e)}"
        }), 400

    # Read existing incidents
    file_path = get_file_path()

    with open(file_path, "r") as file:
        incidents = json.load(file)

    # Generate new ID
    new_id = max(
        [incident["id"] for incident in incidents],
        default=0
    ) + 1

    # Create final incident
    new_incident = {
        "id": new_id,
        "type": data["type"],
        "source": data["source"],
        "description": data["description"],

        # Original scoring inputs
        "severity": data["severity"],
        "asset_importance": data["asset_importance"],
        "affected_users": data["affected_users"],
        "data_sensitivity": data["data_sensitivity"],
        "confidence": data["confidence"],
        "business_impact": data["business_impact"],

        # Scoring engine outputs
        "priority_score": scored_alert["priority_score"],
        "priority_level": scored_alert["priority_level"],
        "rank": scored_alert["rank"],
        "reason": scored_alert["reason"],

        "status": data.get("status", "OPEN")
    }

    incidents.append(new_incident)

    # Save to JSON
    with open(file_path, "w") as file:
        json.dump(incidents, file, indent=4)

    return jsonify(new_incident), 201