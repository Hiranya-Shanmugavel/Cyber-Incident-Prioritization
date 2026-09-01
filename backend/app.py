from flask import Flask
from flask_cors import CORS

from routes.incidents import incident_bp

app = Flask(__name__)

CORS(app)

app.register_blueprint(incident_bp)


@app.route("/")
def home():
    return {
        "message": "Cyber Incident Prioritization API is running"
    }


if __name__ == "__main__":
    app.run(debug=True)