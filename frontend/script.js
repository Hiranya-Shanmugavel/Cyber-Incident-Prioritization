```javascript
// ======================================================
// THREATPULSE SECURITY DASHBOARD
// ======================================================


// ================= DATE =================

const dateElement = document.getElementById("currentDate");

if (dateElement) {
    const today = new Date();

    dateElement.textContent = today.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


// ================= SEARCH =================

const searchInput = document.getElementById("searchInput");
const incidents = document.querySelectorAll(".incident");

if (searchInput) {

    searchInput.addEventListener("input", function () {

        const query = this.value.toLowerCase().trim();

        incidents.forEach(function (incident) {

            const name = incident.dataset.name
                ? incident.dataset.name.toLowerCase()
                : "";

            if (name.includes(query)) {
                incident.style.display = "flex";
            } else {
                incident.style.display = "none";
            }

        });

    });

}


// ================= FILTER =================

const filterButton = document.getElementById("filterButton");

let showingCritical = false;

if (filterButton) {

    filterButton.addEventListener("click", function () {

        showingCritical = !showingCritical;

        incidents.forEach(function (incident) {

            if (showingCritical) {

                if (incident.classList.contains("critical")) {
                    incident.style.display = "flex";
                } else {
                    incident.style.display = "none";
                }

            } else {

                incident.style.display = "flex";

            }

        });

        if (showingCritical) {

            filterButton.innerHTML =
                '<i class="fa-solid fa-filter"></i> Critical';

        } else {

            filterButton.innerHTML =
                '<i class="fa-solid fa-filter"></i> Filter';

        }

    });

}


```javascript
// ================= VIEW INCIDENT =================

// Person 2's React application
const PERSON_2_URL = "http://localhost:5173";

// Dashboard incident ID → Person 2 incident ID
const incidentRoutes = {
    "credential-phishing": "INC-002",
    "malware-attachment": "INC-003",
    "suspicious-domain": "INC-004",
    "brute-force": "INC-005"
};


// Find all View buttons
const viewButtons = document.querySelectorAll(".view-button");

console.log("View buttons found:", viewButtons.length);


// Add click event to each View button
viewButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        // Get data-incident-id from the HTML button
        const dashboardIncidentId =
            this.getAttribute("data-incident-id");

        console.log(
            "Dashboard Incident:",
            dashboardIncidentId
        );


        // Find the corresponding Person 2 incident ID
        const person2IncidentId =
            incidentRoutes[dashboardIncidentId];


        // Check whether the incident exists
        if (!person2IncidentId) {

            console.error(
                "Incident route not found for:",
                dashboardIncidentId
            );

            alert(
                "Incident route not found: " +
                dashboardIncidentId
            );

            return;
        }


        // Create Person 2's incident URL
        const targetUrl =
            PERSON_2_URL +
            "/incident/" +
            person2IncidentId;


        console.log(
            "Redirecting to:",
            targetUrl
        );


        // Redirect to Person 2's incident details page
        window.location.assign(targetUrl);

    });

});
```



// ================= QUICK ACTIONS =================

const actionButtons =
    document.querySelectorAll(".quick-actions button");

const toast =
    document.getElementById("toast");


actionButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const action =
            this.textContent.trim();

        showToast(
            "Action completed",
            `${action} initiated successfully.`
        );

    });

});


// ================= TOAST =================

function showToast(title, message) {

    if (!toast) {
        return;
    }


    const titleElement =
        toast.querySelector("strong");

    const messageElement =
        toast.querySelector("span");


    if (titleElement) {

        titleElement.textContent =
            title;

    }


    if (messageElement) {

        messageElement.textContent =
            message;

    }


    toast.classList.add("show");


    setTimeout(function () {

        toast.classList.remove("show");

    }, 3000);

}


// ================= LIVE MONITORING =================

setInterval(function () {

    const liveDot =
        document.querySelector(".live-label span");


    if (liveDot) {

        if (liveDot.style.opacity === "0.4") {

            liveDot.style.opacity = "1";

        } else {

            liveDot.style.opacity = "0.4";

        }

    }

}, 900);


// ================= KEYBOARD SEARCH =================

document.addEventListener("keydown", function (event) {

    if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
    ) {

        event.preventDefault();


        if (searchInput) {

            searchInput.focus();

        }

    }

});


// ================= PAGE LOAD =================

window.addEventListener("load", function () {

    console.log(
        "ThreatPulse Security Dashboard initialized."
    );

    console.log(
        "View buttons found:",
        viewButtons.length
    );

});
```

```
