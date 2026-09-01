// ================= DATE =================

const dateElement = document.getElementById("currentDate");

const today = new Date();

if (dateElement) {
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

        incidents.forEach(incident => {

            const name =
                incident.dataset.name.toLowerCase();

            if (name.includes(query)) {

                incident.style.display = "flex";

            } else {

                incident.style.display = "none";

            }

        });

    });

}


// ================= FILTER =================

const filterButton =
    document.getElementById("filterButton");

let showingCritical = false;

if (filterButton) {

    filterButton.addEventListener("click", function () {

        showingCritical = !showingCritical;

        incidents.forEach(incident => {

            if (showingCritical) {

                if (
                    !incident.classList.contains("critical")
                ) {

                    incident.style.display = "none";

                } else {

                    incident.style.display = "flex";

                }

            } else {

                incident.style.display = "flex";

            }

        });

        filterButton.innerHTML = showingCritical
            ? '<i class="fa-solid fa-filter"></i> Critical'
            : '<i class="fa-solid fa-filter"></i> Filter';

    });

}


// ================= VIEW BUTTON =================

const viewButtons =
    document.querySelectorAll(".view-button");

const toast =
    document.getElementById("toast");


viewButtons.forEach(button => {

    button.addEventListener("click", function () {

        const incident =
            this.closest(".incident");

        const title =
            incident.querySelector("h3").textContent;

        showToast(
            "Incident selected",
            `${title} opened for investigation.`
        );

    });

});


// ================= QUICK ACTIONS =================

const actionButtons =
    document.querySelectorAll(".quick-actions button");


actionButtons.forEach(button => {

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

    if (!toast) return;

    toast.querySelector("strong").textContent =
        title;

    toast.querySelector("span").textContent =
        message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


// ================= LIVE SIMULATION =================

setInterval(() => {

    const liveDot =
        document.querySelector(".live-label span");

    if (liveDot) {

        liveDot.style.opacity =
            liveDot.style.opacity === "0.4"
                ? "1"
                : "0.4";

    }

}, 900);


// ================= KEYBOARD SEARCH =================

document.addEventListener("keydown", function(event) {

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


// ================= REFRESH =================

window.addEventListener("load", () => {

    console.log(
        "ThreatPulse Security Dashboard initialized."
    );

});