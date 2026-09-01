# 🛡️ ThreatPulse — Cyber Incident Prioritization Platform

> **An intelligent security operations platform that analyzes, scores, and prioritizes cyber incidents to help security teams respond to the most critical threats first.**

## 🚨 Problem Statement

Modern organizations receive a large number of security incidents every day. Manually analyzing and prioritizing these incidents can be time-consuming, inconsistent, and difficult to scale.

Security analysts need to quickly determine:

* Which incidents are most critical?
* Which incidents require immediate attention?
* What is the risk associated with each incident?
* Why was an incident given a particular priority?
* What action should be taken first?

**ThreatPulse** addresses this challenge by providing a centralized dashboard for cyber incident monitoring and prioritization.

---

## 💡 Our Solution

ThreatPulse is a web-based **Cyber Incident Prioritization Platform** that organizes security incidents and helps determine their priority using a backend-driven scoring and ranking system.

The platform provides:

1. 📊 A security incident dashboard
2. 🔎 Incident search and filtering
3. 📋 Detailed incident information
4. ⚙️ Backend-based incident processing
5. 📈 Risk/priority scoring
6. 🧠 Explanation of prioritization
7. 🎯 Ranking of incidents based on priority
8. 🚨 Recommended response/action information

The goal is to help security teams **focus first on the incidents that pose the greatest risk**.

---

# ✨ Key Features

### 📊 Security Dashboard

A centralized dashboard provides an overview of reported cyber incidents and allows analysts to quickly identify important threats.

### 🔎 Search & Filtering

Analysts can search incidents and filter critical incidents to quickly locate high-priority threats.

### 👁️ Incident Details

Selecting **View** opens the corresponding incident details page, providing more information about the selected security incident.

### ⚙️ Intelligent Prioritization

The backend processes incident information using a prioritization pipeline involving:

* Data normalization
* Risk/scoring calculations
* Incident ranking
* Explanation generation

### 📈 Risk & Priority Assessment

Incidents can be evaluated and ranked based on their calculated priority/risk characteristics.

### 🧠 Explainable Results

Instead of providing only a priority value, the platform can provide an explanation of why an incident received its priority.

### 🚨 Action-Oriented Response

The platform is designed to help analysts determine which incidents deserve immediate attention and support faster response decisions.

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │      Security       │
                         │       Analyst       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │  ThreatPulse       │
                         │  Security Dashboard │
                         │  HTML/CSS/JS        │
                         └──────────┬──────────┘
                                    │
                              View Incident
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Incident Details    │
                         │ React Application   │
                         └──────────┬──────────┘
                                    │
                               API Requests
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Flask Backend     │
                         │      REST API       │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
             ┌────────────┐ ┌────────────┐ ┌─────────────┐
             │Normalization│ │   Scoring  │ │   Ranking   │
             │   Engine   │ │   Engine   │ │   Engine    │
             └────────────┘ └────────────┘ └─────────────┘
                    │               │               │
                    └───────────────┼───────────────┘
                                    ▼
                         ┌─────────────────────┐
                         │ Explanation / Result│
                         └─────────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Incident Details UI │
                         └─────────────────────┘
```

---

# 🔄 Application Workflow

```text
Incident Report
      ↓
Incident Dashboard
      ↓
Search / Filter
      ↓
Select Incident
      ↓
View Incident Details
      ↓
Backend Processing
      ↓
Normalization
      ↓
Risk / Priority Scoring
      ↓
Incident Ranking
      ↓
Explanation Generation
      ↓
Priority & Recommended Response
```

---

# 🖥️ User Flow

### Step 1 — Open Dashboard

The user starts at the ThreatPulse security dashboard where available cyber incidents are displayed.

### Step 2 — Search or Filter

The analyst can search for a specific incident or filter the dashboard to focus on critical incidents.

### Step 3 — View an Incident

Clicking **View** opens the corresponding incident details.

Example:

```text
Dashboard
   ↓
View
   ↓
INC-002
```

### Step 4 — Analyze the Incident

The backend processes the incident and determines its priority using the prioritization pipeline.

### Step 5 — Review the Result

The analyst can review the incident's relevant details, priority/risk information, explanation, and response information.

---

# 🧩 Project Structure

```text
Cyber-Incident-Prioritization/
│
├── Incident-Details/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── backend/
│   ├── data/
│   ├── routes/
│   ├── app.py
│   ├── explanation.py
│   ├── normalization.py
│   ├── ranking.py
│   ├── scoring_engine.py
│   ├── test_engine.py
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── Incident-Details/
│
└── README.md
```

---

# 🛠️ Technology Stack

## Frontend

* HTML5
* CSS3
* JavaScript
* React
* Vite

## Backend

* Python
* Flask
* Flask-CORS
* REST APIs

## Processing & Prioritization

* Data Normalization
* Risk/Score Calculation
* Incident Ranking
* Explainable Prioritization

## Development Tools

* Git
* GitHub
* Visual Studio Code
* npm
* Python

---

# ⚙️ Installation & Setup

## Prerequisites

Make sure the following are installed:

* Python 3.x
* Node.js and npm
* Git
* A modern web browser

---

## 1. Clone the Repository

```bash
git clone https://github.com/Hiranya-Shanmugavel/Cyber-Incident-Prioritization.git
```

Move into the project:

```bash
cd Cyber-Incident-Prioritization
```

---

# 🐍 2. Run the Flask Backend

Open a terminal and execute:

```bash
cd backend
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
python app.py
```

The Flask API will run on:

```text
http://127.0.0.1:5000
```

Keep this terminal running.

---

# ⚛️ 3. Run the Incident Details Application

Open a **second terminal**.

From the project root:

```bash
cd Incident-Details
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

Keep this terminal running as well.

---

# 🌐 4. Open the Application

Open the frontend dashboard in your browser.

The expected flow is:

```text
Security Dashboard
        ↓
      View
        ↓
Incident Details
        ↓
Backend Processing
        ↓
Priority / Risk / Explanation
```

---

# 🔌 Backend API

The Flask backend provides API functionality for incident processing.

Base URL:

```text
http://127.0.0.1:5000
```

The backend is responsible for processing incident information and supporting the prioritization workflow.

The API can be tested independently by accessing:

```text
http://127.0.0.1:5000
```

A successful response indicates that the Cyber Incident Prioritization API is running.

---

# 🎯 Example Incident Flow

Consider a phishing-related incident:

```text
Incident
   │
   ├── Incident Type
   ├── Severity
   ├── Impact
   └── Other Risk Factors
            │
            ▼
      Normalization
            │
            ▼
       Risk Scoring
            │
            ▼
       Prioritization
            │
            ▼
        Ranking
            │
            ▼
       Explanation
            │
            ▼
 Recommended Response
```

This allows security analysts to understand not only **what the priority is**, but also **why the incident received that priority**.

---

# 🚀 Why ThreatPulse?

Traditional incident handling can require analysts to manually inspect and compare numerous alerts.

ThreatPulse aims to improve this process by:

* ⏱️ Reducing manual prioritization effort
* 🎯 Focusing attention on high-risk incidents
* 📊 Providing structured incident information
* 🧠 Supporting explainable prioritization
* ⚡ Enabling faster security response
* 📈 Providing a scalable foundation for security operations

---

# 🔮 Future Enhancements

Potential future improvements include:

* 🤖 Machine-learning-based risk prediction
* 📧 Automated email/phishing analysis
* 🌐 URL and domain reputation analysis
* 🔗 Integration with threat intelligence feeds
* 🚨 Real-time incident alerts
* 📱 Mobile security analyst interface
* 📊 Advanced analytics and reporting
* 🔐 Role-based access control
* ☁️ Cloud deployment
* 🔄 Integration with SIEM/SOC platforms

---

# 🏆 Hackathon Impact

ThreatPulse is designed to address a practical cybersecurity challenge: **security teams need to identify and respond to the most important incidents quickly when faced with large volumes of alerts.**

By combining a user-friendly dashboard with automated scoring, ranking, and explainable prioritization, the platform provides a foundation for more efficient and consistent incident response.

---

# 👥 Team

**Project:** ThreatPulse — Cyber Incident Prioritization Platform

**Repository:**
`Cyber-Incident-Prioritization`

**Team Members:**

* Member 1 — Frontend / UI
* Member 2 — Incident Details / React
* Member 3 — Backend / API
* Member 4 — Scoring / Ranking / Processing

> Update the member names and individual contributions before submission.

---

# 📄 License

This project was developed as part of a hackathon and is intended for educational and demonstration purposes.
