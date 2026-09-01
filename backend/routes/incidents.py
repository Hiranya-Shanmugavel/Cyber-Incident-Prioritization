from flask import Blueprint, jsonify, request
import json
import os

incident_bp = Blueprint("incidents", __name__)


@incident_bp.route("/api/incidents", methods=["GET"])
def get_incidents():
    file_path = os.path.join(
        os.path.dirname(__file__),
        "..",
        "data",
        "sample_alerts.json"
    )

    with open(file_path, "r") as file:
        incidents = json.load(file)

    return jsonify(incidents)


@incident_bp.route("/api/incidents/<int:incident_id>", methods=["GET"])
def get_incident(incident_id):
    file_path = os.path.join(
        os.path.dirname(__file__),
        "..",
        "data",
        "sample_alerts.json"
    )

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
        return jsonify({"error": "Request body is required"}), 400

    required_fields = ["type", "source", "description"]

    for field in required_fields:
        if field not in data:
            return jsonify({
                "error": f"Missing required field: {field}"
            }), 400

    file_path = os.path.join(
        os.path.dirname(__file__),
        "..",
        "data",
        "sample_alerts.json"
    )

    with open(file_path, "r") as file:
        incidents = json.load(file)

    new_id = max(
        [incident["id"] for incident in incidents],
        default=0
    ) + 1

    new_incident = {
        "id": new_id,
        "type": data["type"],
        "source": data["source"],
        "description": data["description"],
        "severity": data.get("severity", "MEDIUM"),
        "status": data.get("status", "OPEN")
    }

    incidents.append(new_incident)

    with open(file_path, "w") as file:
        json.dump(incidents, file, indent=4)

    return jsonify(new_incident), 201