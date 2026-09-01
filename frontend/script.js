// ======================================================
// THREATPULSE SECURITY DASHBOARD
// Complete Frontend with API Integration
// ======================================================

(function () {
    "use strict";

    // ================= CONFIGURATION =================
    const API_URL = "http://127.0.0.1:8000";
    const REFRESH_INTERVAL = 30000; // 30 seconds
    let currentFilter = "all";
    let allIncidents = [];
    let backendAvailable = false;

    // ================= DOM ELEMENTS =================
    const searchInput = document.getElementById("searchInput");
    const filterButton = document.getElementById("filterButton");
    const filterMenu = document.getElementById("filterMenu");
    const incidentList = document.getElementById("incidentList");
    const toast = document.getElementById("toast");
    const loadingOverlay = document.getElementById("loadingOverlay");
    const connectionBanner = document.getElementById("connectionBanner");

    // Stat elements
    const criticalCount = document.getElementById("criticalCount");
    const activeCount = document.getElementById("activeCount");
    const detectionRate = document.getElementById("detectionRate");
    const responseTime = document.getElementById("responseTime");
    const donutTotal = document.getElementById("donutTotal");
    const legendCritical = document.getElementById("legendCritical");
    const legendHigh = document.getElementById("legendHigh");
    const legendMedium = document.getElementById("legendMedium");
    const incidentBadge = document.getElementById("incidentBadge");
    const queueCount = document.getElementById("queueCount");

    // Modal elements
    const incidentModal = document.getElementById("incidentModal");
    const newIncidentModal = document.getElementById("newIncidentModal");

    // ================= DATE =================
    const dateElement = document.getElementById("currentDate");
    if (dateElement) {
        var today = new Date();
        dateElement.textContent = today.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    // ================= API FUNCTIONS =================

    function apiRequest(endpoint, options) {
        var opts = options || {};
        var url = API_URL + endpoint;
        return fetch(url, opts)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("HTTP " + response.status);
                }
                return response.json();
            });
    }

    function checkBackend() {
        return apiRequest("/api/health")
            .then(function () {
                backendAvailable = true;
                if (connectionBanner) {
                    connectionBanner.style.display = "none";
                }
                return true;
            })
            .catch(function () {
                backendAvailable = false;
                if (connectionBanner) {
                    connectionBanner.style.display = "flex";
                }
                return false;
            });
    }

    // ================= DASHBOARD DATA =================

    function loadDashboard() {
        if (loadingOverlay) {
            loadingOverlay.style.display = "flex";
        }

        checkBackend().then(function (isAvailable) {
            if (isAvailable) {
                loadFromAPI();
            } else {
                loadFallbackData();
            }
        });
    }

    function loadFromAPI() {
        apiRequest("/api/dashboard")
            .then(function (data) {
                updateStats(data);
                updateThreatDistribution(data.threat_distribution, data.total_incidents || data.active_incidents);
                allIncidents = data.priority_queue || [];
                renderIncidents(filterIncidents(allIncidents));
                hideLoading();
            })
            .catch(function (err) {
                console.error("Dashboard API error:", err);
                loadFallbackData();
            });
    }

    function loadFallbackData() {
        var fallback = {
            critical_threats: 24,
            active_incidents: 67,
            threat_detection_rate: 93.7,
            average_response_time: "4.2m",
            threat_distribution: { critical: 24, high: 28, medium: 15, low: 0 },
            total_incidents: 67
        };
        updateStats(fallback);
        updateThreatDistribution(fallback.threat_distribution, fallback.total_incidents);

        // Fallback incidents
        allIncidents = [
            { id: "INC001", type: "Credential Phishing Campaign", severity: 9, asset_importance: 9, affected_users: 500, data_sensitivity: 9, confidence: 0.95, business_impact: 9, status: "Open", priority_score: 98, priority_level: "CRITICAL", rank: 1, explanation: "Ranked high because of high severity, critical asset importance, highly sensitive data, high attack confidence, high business impact.", source: "login-secure-auth.com", description: "Suspicious login page targeting enterprise credentials", created_at: "2026-09-01T10:00:00" },
            { id: "INC002", type: "Malware Attachment Detected", severity: 8, asset_importance: 8, affected_users: 250, data_sensitivity: 8, confidence: 0.90, business_impact: 8, status: "Open", priority_score: 91, priority_level: "CRITICAL", rank: 2, explanation: "Ranked high because of high severity, critical asset importance, highly sensitive data, high attack confidence, high business impact.", source: "email-gateway", description: "Malicious executable detected in incoming email", created_at: "2026-09-01T10:05:00" },
            { id: "INC003", type: "Suspicious Domain Activity", severity: 8, asset_importance: 7, affected_users: 150, data_sensitivity: 7, confidence: 0.88, business_impact: 8, status: "Open", priority_score: 87, priority_level: "CRITICAL", rank: 3, explanation: "Ranked high because of high severity, high business impact.", source: "secure-payments.net", description: "Newly registered domain mimicking a trusted brand", created_at: "2026-09-01T10:10:00" },
            { id: "INC004", type: "Brute Force Attack", severity: 7, asset_importance: 7, affected_users: 80, data_sensitivity: 6, confidence: 0.85, business_impact: 7, status: "Open", priority_score: 72, priority_level: "HIGH", rank: 4, explanation: "Ranked high because of moderate risk factors.", source: "auth-server", description: "Multiple failed authentication attempts detected", created_at: "2026-09-01T10:15:00" }
        ];
        renderIncidents(allIncidents);
        hideLoading();
    }

    function updateStats(data) {
        if (criticalCount) criticalCount.textContent = data.critical_threats || 0;
        if (activeCount) activeCount.textContent = data.active_incidents || 0;
        if (detectionRate) detectionRate.textContent = (data.threat_detection_rate || 0) + "%";
        if (responseTime) responseTime.textContent = data.average_response_time || "--";
        if (incidentBadge) incidentBadge.textContent = data.active_incidents || 0;
    }

    function updateThreatDistribution(dist, total) {
        if (!dist) return;
        if (donutTotal) donutTotal.textContent = total || 0;
        if (legendCritical) legendCritical.textContent = dist.critical || 0;
        if (legendHigh) legendHigh.textContent = dist.high || 0;
        if (legendMedium) legendMedium.textContent = dist.medium || 0;

        // Update donut chart
        var donut = document.getElementById("donutChart");
        if (donut && total > 0) {
            var c = (dist.critical || 0) / total * 360;
            var h = (dist.high || 0) / total * 360;
            var m = (dist.medium || 0) / total * 360;
            donut.style.background = "radial-gradient(circle, var(--card) 57%, transparent 59%), " +
                "conic-gradient(var(--red) 0deg " + c + "deg, var(--orange) " + c + "deg " + (c + h) + "deg, #e2c05c " + (c + h) + "deg " + (c + h + m) + "deg, #3a4258 " + (c + h + m) + "deg 360deg)";
        }
    }

    function hideLoading() {
        if (loadingOverlay) {
            loadingOverlay.style.display = "none";
        }
    }

    // ================= RENDER INCIDENTS =================

    function getBadgeClass(level) {
        if (!level) return "medium-badge";
        switch (level.toUpperCase()) {
            case "CRITICAL": return "critical-badge";
            case "HIGH": return "high-badge";
            case "MEDIUM": return "medium-badge";
            case "LOW": return "low-badge";
            default: return "medium-badge";
        }
    }

    function getIncidentClass(level) {
        if (!level) return "medium";
        switch (level.toUpperCase()) {
            case "CRITICAL": return "critical";
            case "HIGH": return "high";
            case "MEDIUM": return "medium";
            case "LOW": return "low";
            default: return "medium";
        }
    }

    function formatTimeAgo(dateStr) {
        if (!dateStr) return "--";
        var created = new Date(dateStr);
        var now = new Date();
        var diff = Math.floor((now - created) / 60000);
        if (diff < 1) return "just now";
        if (diff < 60) return diff + " min ago";
        if (diff < 1440) return Math.floor(diff / 60) + " hr ago";
        return Math.floor(diff / 1440) + " day ago";
    }

    function renderIncidents(incidents) {
        if (!incidentList) return;
        incidentList.innerHTML = "";

        if (incidents.length === 0) {
            incidentList.innerHTML = '<div class="empty-state"><i class="fa-solid fa-shield-check"></i><p>No incidents match the current filter.</p></div>';
            if (queueCount) queueCount.innerHTML = "Showing <strong>0</strong> incidents";
            return;
        }

        incidents.forEach(function (incident, index) {
            var rank = incident.rank || (index + 1);
            var score = Math.round(incident.priority_score || 0);
            var level = incident.priority_level || "MEDIUM";
            var incClass = getIncidentClass(level);
            var badgeClass = getBadgeClass(level);

            // SLA Calculation
            var slaHtml = "";
            if (incident.sla_deadline) {
                var deadline = new Date(incident.sla_deadline);
                var now = new Date();
                var diffMs = deadline - now;
                var diffMins = Math.floor(diffMs / 60000);
                if (diffMs < 0) {
                    slaHtml = '<span class="sla-badge sla-critical"><i class="fa-solid fa-triangle-exclamation"></i> BREACHED</span>';
                } else if (diffMins < 5) {
                    slaHtml = '<span class="sla-badge sla-warning"><i class="fa-solid fa-clock"></i> WARNING (' + diffMins + 'm)</span>';
                } else {
                    slaHtml = '<span class="sla-badge sla-safe"><i class="fa-solid fa-check"></i> ' + diffMins + 'm left</span>';
                }
            }

            var div = document.createElement("div");
            div.className = "incident " + incClass;
            div.setAttribute("data-name", (incident.type || "").toLowerCase());
            div.setAttribute("data-id", incident.id || "");
            div.setAttribute("data-score", score);
            div.setAttribute("data-level", level);

            div.innerHTML =
                '<div class="rank">' + String(rank).padStart(2, "0") + '</div>' +
                '<div class="incident-main">' +
                    '<div class="incident-heading">' +
                        '<h3>' + (incident.type || "Unknown") + '</h3>' +
                        '<span class="severity ' + badgeClass + '">' + level + '</span>' +
                    '</div>' +
                    '<p>' + (incident.description || "No description available") + '</p>' +
                    '<div class="incident-meta">' +
                        '<span><i class="fa-solid fa-globe"></i> ' + (incident.source || "unknown") + '</span>' +
                        '<span><i class="fa-regular fa-clock"></i> ' + formatTimeAgo(incident.created_at) + '</span>' +
                        (slaHtml ? slaHtml : '') +
                        '<span><i class="fa-solid fa-user"></i> ' + (incident.affected_users || 0) + ' targets</span>' +
                    '</div>' +
                '</div>' +
                '<div class="risk-score">' +
                    '<div class="score-ring"><span>' + score + '</span></div>' +
                    '<small>RISK</small>' +
                '</div>' +
                '<button class="view-button" data-incident-id="' + (incident.id || "") + '">' +
                    'View <i class="fa-solid fa-arrow-right"></i>' +
                '</button>';

            incidentList.appendChild(div);
        });

        if (queueCount) {
            queueCount.innerHTML = "Showing <strong>" + incidents.length + "</strong> of <strong>" + allIncidents.length + "</strong> active incidents";
        }

        // Bind view buttons
        bindViewButtons();
    }

    // ================= FILTER =================

    function filterIncidents(incidents) {
        var query = searchInput ? searchInput.value.toLowerCase().trim() : "";

        return incidents.filter(function (inc) {
            // Filter by priority level
            var levelMatch = true;
            if (currentFilter !== "all") {
                levelMatch = (inc.priority_level || "").toUpperCase() === currentFilter.toUpperCase();
            }

            // Filter by search query
            var searchMatch = true;
            if (query) {
                var id = (inc.id || "").toLowerCase();
                var type = (inc.type || "").toLowerCase();
                var level = (inc.priority_level || "").toLowerCase();
                var desc = (inc.description || "").toLowerCase();
                searchMatch = id.indexOf(query) !== -1 ||
                    type.indexOf(query) !== -1 ||
                    level.indexOf(query) !== -1 ||
                    desc.indexOf(query) !== -1;
            }

            return levelMatch && searchMatch;
        });
    }

    // Filter button toggle
    if (filterButton && filterMenu) {
        filterButton.addEventListener("click", function (e) {
            e.stopPropagation();
            filterMenu.classList.toggle("show");
        });

        // Filter menu options
        var filterOptions = filterMenu.querySelectorAll("button");
        filterOptions.forEach(function (btn) {
            btn.addEventListener("click", function () {
                currentFilter = this.getAttribute("data-filter");

                // Update active state
                filterOptions.forEach(function (b) { b.classList.remove("active"); });
                this.classList.add("active");

                // Update button text
                if (currentFilter === "all") {
                    filterButton.innerHTML = '<i class="fa-solid fa-filter"></i> Filter';
                } else {
                    filterButton.innerHTML = '<i class="fa-solid fa-filter"></i> ' + currentFilter;
                }

                filterMenu.classList.remove("show");
                renderIncidents(filterIncidents(allIncidents));
            });
        });

        // Close menu when clicking outside
        document.addEventListener("click", function () {
            filterMenu.classList.remove("show");
        });
    }

    // Search input
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            renderIncidents(filterIncidents(allIncidents));
        });
    }

    // ================= VIEW INCIDENT MODAL =================

    function bindViewButtons() {
        var buttons = document.querySelectorAll(".view-button");
        buttons.forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                var incidentId = this.getAttribute("data-incident-id");
                openIncidentModal(incidentId);
            });
        });
    }

    function openIncidentModal(incidentId) {
        // Find incident in local data first
        var incident = null;
        for (var i = 0; i < allIncidents.length; i++) {
            if (allIncidents[i].id === incidentId) {
                incident = allIncidents[i];
                break;
            }
        }

        if (incident) {
            populateModal(incident);
        } else if (backendAvailable) {
            apiRequest("/api/incidents/" + incidentId)
                .then(function (data) {
                    populateModal(data);
                })
                .catch(function () {
                    showToast("Error", "Could not load incident details.", "error");
                });
        } else {
            showToast("Error", "Incident not found.", "error");
        }
    }

    function populateModal(inc) {
        if (!incidentModal) return;

        document.getElementById("modalTitle").textContent = inc.type || "Incident";
        document.getElementById("modalScore").textContent = Math.round(inc.priority_score || 0);
        document.getElementById("modalLevel").textContent = inc.priority_level || "--";
        document.getElementById("modalRank").textContent = "Rank #" + (inc.rank || "--");
        document.getElementById("modalId").textContent = inc.id || "--";
        document.getElementById("modalType").textContent = inc.type || "--";
        document.getElementById("modalStatus").textContent = inc.status || "--";
        document.getElementById("modalCreated").textContent = inc.created_at ? new Date(inc.created_at).toLocaleString() : "--";
        document.getElementById("modalSeverity").textContent = inc.severity + "/10";
        document.getElementById("modalAsset").textContent = inc.asset_importance + "/10";
        document.getElementById("modalUsers").textContent = inc.affected_users || 0;
        document.getElementById("modalSensitivity").textContent = inc.data_sensitivity + "/10";
        document.getElementById("modalConfidence").textContent = Math.round((inc.confidence || 0) * 100) + "%";
        document.getElementById("modalImpact").textContent = inc.business_impact + "/10";
        document.getElementById("modalExplanation").textContent = inc.explanation || inc.reason || "No explanation available.";
        document.getElementById("modalDescription").textContent = inc.description || "No description.";

        document.getElementById("modalSourceIp").textContent = inc.source_ip || "--";
        document.getElementById("modalGeo").textContent = inc.geo_location || "--";

        var mitreContainer = document.getElementById("modalMitreTags");
        if (mitreContainer) {
            mitreContainer.innerHTML = "";
            if (inc.mitre_tactics) {
                var tags = inc.mitre_tactics.split(",");
                tags.forEach(function(tag) {
                    var t = tag.trim();
                    if (t) {
                        var span = document.createElement("span");
                        span.className = "mitre-tag";
                        span.textContent = t;
                        mitreContainer.appendChild(span);
                    }
                });
            } else {
                mitreContainer.textContent = "--";
            }
        }

        var playbookContainer = document.getElementById("modalPlaybookList");
        if (playbookContainer) {
            playbookContainer.innerHTML = "";
            if (inc.remediation_playbook) {
                var steps = inc.remediation_playbook.split("\n");
                steps.forEach(function(step) {
                    var s = step.trim();
                    if (s) {
                        var li = document.createElement("li");
                        li.textContent = s;
                        playbookContainer.appendChild(li);
                    }
                });
            } else {
                playbookContainer.innerHTML = "<li>No automated playbook available.</li>";
            }
        }

        var badge = document.getElementById("modalBadge");
        badge.textContent = inc.priority_level || "--";
        badge.className = "severity " + getBadgeClass(inc.priority_level);

        var scoreRing = incidentModal.querySelector(".modal-score-ring");
        if (scoreRing) {
            scoreRing.className = "modal-score-ring " + getIncidentClass(inc.priority_level);
        }

        // Bind action buttons
        var actionBtns = incidentModal.querySelectorAll(".modal-action-btn");
        actionBtns.forEach(function (btn) {
            // Remove old listeners by cloning
            var newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener("click", function () {
                var action = this.getAttribute("data-action");
                handleIncidentAction(inc.id, action);
            });
        });

        incidentModal.classList.add("show");
    }

    function handleIncidentAction(incidentId, action) {
        if (backendAvailable) {
            apiRequest("/api/incidents/" + incidentId + "/status?status=" + action, {
                method: "PATCH"
            })
            .then(function () {
                showToast("Success", incidentId + " status updated to " + action + ".", "success");
                closeModal(incidentModal);
                loadDashboard();
            })
            .catch(function () {
                showToast("Action Recorded", incidentId + ": " + action + " (offline mode).", "info");
                closeModal(incidentModal);
            });
        } else {
            showToast("Action Recorded", incidentId + ": " + action + " initiated.", "info");
            closeModal(incidentModal);
        }
    }

    // Close modal
    function closeModal(modal) {
        if (modal) modal.classList.remove("show");
    }

    var modalCloseBtn = document.getElementById("modalClose");
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", function () {
            closeModal(incidentModal);
        });
    }

    var newIncidentCloseBtn = document.getElementById("newIncidentClose");
    if (newIncidentCloseBtn) {
        newIncidentCloseBtn.addEventListener("click", function () {
            closeModal(newIncidentModal);
        });
    }

    // Close modal on overlay click
    if (incidentModal) {
        incidentModal.addEventListener("click", function (e) {
            if (e.target === incidentModal) closeModal(incidentModal);
        });
    }
    if (newIncidentModal) {
        newIncidentModal.addEventListener("click", function (e) {
            if (e.target === newIncidentModal) closeModal(newIncidentModal);
        });
    }

    // Close on Escape
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            closeModal(incidentModal);
            closeModal(newIncidentModal);
        }
    });

    // ================= NEW INCIDENT =================

    var newIncidentBtn = document.getElementById("newIncidentBtn");
    if (newIncidentBtn) {
        newIncidentBtn.addEventListener("click", function () {
            if (newIncidentModal) newIncidentModal.classList.add("show");
        });
    }

    var submitIncidentBtn = document.getElementById("submitIncidentBtn");
    if (submitIncidentBtn) {
        submitIncidentBtn.addEventListener("click", function () {
            var form = document.getElementById("newIncidentForm");
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            var incidentData = {
                type: document.getElementById("formType").value,
                severity: parseFloat(document.getElementById("formSeverity").value),
                asset_importance: parseFloat(document.getElementById("formAsset").value),
                affected_users: parseInt(document.getElementById("formUsers").value),
                data_sensitivity: parseFloat(document.getElementById("formSensitivity").value),
                confidence: parseFloat(document.getElementById("formConfidence").value),
                business_impact: parseFloat(document.getElementById("formImpact").value),
                description: document.getElementById("formDescription").value || ""
            };

            if (backendAvailable) {
                apiRequest("/api/incidents", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(incidentData)
                })
                .then(function (result) {
                    showToast("Incident Created", result.id + " scored at " + Math.round(result.priority_score) + " (" + result.priority_level + ").", "success");
                    closeModal(newIncidentModal);
                    form.reset();
                    loadDashboard();
                })
                .catch(function (err) {
                    showToast("Error", "Failed to create incident: " + err.message, "error");
                });
            } else {
                showToast("Offline", "Cannot create incidents while backend is unavailable.", "error");
            }
        });
    }

    // ================= QUICK ACTIONS =================

    var exportReportBtn = document.getElementById("exportReportBtn");
    if (exportReportBtn) {
        exportReportBtn.addEventListener("click", function () {
            exportToCSV();
        });
    }

    var assignAnalystBtn = document.getElementById("assignAnalystBtn");
    if (assignAnalystBtn) {
        assignAnalystBtn.addEventListener("click", function () {
            showToast("Analyst Assigned", "Security analyst has been notified and assigned to critical incidents.", "success");
        });
    }

    var refreshDataBtn = document.getElementById("refreshDataBtn");
    if (refreshDataBtn) {
        refreshDataBtn.addEventListener("click", function () {
            showToast("Refreshing", "Fetching latest incident data...", "info");
            loadDashboard();
        });
    }

    var refreshQueueBtn = document.getElementById("refreshQueueBtn");
    if (refreshQueueBtn) {
        refreshQueueBtn.addEventListener("click", function () {
            loadDashboard();
        });
    }

    var viewFullQueueBtn = document.getElementById("viewFullQueueBtn");
    if (viewFullQueueBtn) {
        viewFullQueueBtn.addEventListener("click", function () {
            currentFilter = "all";
            renderIncidents(allIncidents);
            showToast("Full Queue", "Showing all " + allIncidents.length + " incidents.", "info");
        });
    }

    function exportToCSV() {
        if (allIncidents.length === 0) {
            showToast("No Data", "No incidents to export.", "error");
            return;
        }

        var headers = ["Rank", "ID", "Type", "Priority Score", "Priority Level", "Severity", "Status", "Affected Users", "Explanation"];
        var rows = allIncidents.map(function (inc) {
            return [
                inc.rank || "",
                inc.id || "",
                '"' + (inc.type || "") + '"',
                inc.priority_score || "",
                inc.priority_level || "",
                inc.severity || "",
                inc.status || "",
                inc.affected_users || "",
                '"' + (inc.explanation || inc.reason || "") + '"'
            ].join(",");
        });

        var csv = headers.join(",") + "\n" + rows.join("\n");
        var blob = new Blob([csv], { type: "text/csv" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "threat_pulse_report_" + new Date().toISOString().slice(0, 10) + ".csv";
        a.click();
        URL.revokeObjectURL(url);

        showToast("Export Complete", "Incident report downloaded as CSV.", "success");
    }

    // ================= TOAST =================

    function showToast(title, message, type) {
        if (!toast) return;

        var icon = document.getElementById("toastIcon");
        var titleEl = document.getElementById("toastTitle");
        var msgEl = document.getElementById("toastMessage");

        if (titleEl) titleEl.textContent = title;
        if (msgEl) msgEl.textContent = message;

        // Set icon based on type
        if (icon) {
            icon.className = "fa-solid";
            if (type === "error") {
                icon.classList.add("fa-circle-exclamation");
                toast.className = "toast error show";
            } else if (type === "info") {
                icon.classList.add("fa-circle-info");
                toast.className = "toast info show";
            } else {
                icon.classList.add("fa-circle-check");
                toast.className = "toast show";
            }
        } else {
            toast.classList.add("show");
        }

        clearTimeout(window._toastTimeout);
        window._toastTimeout = setTimeout(function () {
            toast.classList.remove("show");
        }, 4000);
    }

    // ================= SIDEBAR NAVIGATION =================

    var navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(function (link) {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            // Update active state
            navLinks.forEach(function (l) { l.classList.remove("active"); });
            this.classList.add("active");

            var section = this.getAttribute("data-section");
            handleNavigation(section);
        });
    });

    function handleNavigation(section) {
        switch (section) {
            case "dashboard":
                scrollToElement("dashboardSection");
                break;
            case "incidents":
                scrollToElement("incidentList");
                currentFilter = "all";
                renderIncidents(allIncidents);
                showToast("Incidents", "Showing all incidents.", "info");
                break;
            case "priority-queue":
                scrollToElement("priorityQueueSection");
                break;
            case "analytics":
                scrollToElement("analyticsSection");
                break;
            case "analysts":
                showToast("Analysts", "Analyst management panel coming soon.", "info");
                break;
            case "activity-logs":
                showToast("Activity Logs", "Activity log viewer coming soon.", "info");
                break;
            case "settings":
                showToast("Settings", "Settings panel coming soon.", "info");
                break;
        }
    }

    function scrollToElement(id) {
        var el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    // ================= LIVE MONITORING =================

    setInterval(function () {
        var liveDot = document.querySelector(".live-label span");
        if (liveDot) {
            liveDot.style.opacity = liveDot.style.opacity === "0.4" ? "1" : "0.4";
        }
    }, 900);

    // ================= KEYBOARD SHORTCUTS =================

    document.addEventListener("keydown", function (event) {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
            event.preventDefault();
            if (searchInput) searchInput.focus();
        }
    });

    // ================= NOTIFICATION BUTTON =================

    var notificationBtn = document.getElementById("notificationBtn");
    if (notificationBtn) {
        notificationBtn.addEventListener("click", function () {
            showToast("Notifications", "No new notifications.", "info");
        });
    }

    // ================= AUTO REFRESH =================

    setInterval(function () {
        if (backendAvailable) {
            loadFromAPI();
        }
    }, REFRESH_INTERVAL);

    // ================= INITIAL LOAD =================

    window.addEventListener("load", function () {
        console.log("ThreatPulse Security Dashboard initialized.");
        loadDashboard();
    });

    window.executeSoar = function(actionType) {
        var id = document.getElementById("modalId").textContent;
        apiRequest("/api/incidents/" + id + "/soar-action", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({action_type: actionType})
        }).then(function () {
            showToast("SOAR Action Executed", actionType + " applied to " + id, "success");
        }).catch(function () {
            showToast("SOAR Action Failed", actionType + " offline mode", "info");
        });
    };

})();
