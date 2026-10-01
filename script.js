const form = document.getElementById("issueForm");
const issuesList = document.getElementById("issuesList");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const categoryFilter = document.getElementById("categoryFilter");

let issues = JSON.parse(localStorage.getItem("campusIssues")) || [];


// ========================================
// SAVE ISSUES
// ========================================

function saveIssues() {
    localStorage.setItem(
        "campusIssues",
        JSON.stringify(issues)
    );
}


// ========================================
// UPDATE DASHBOARD
// ========================================

function updateDashboard() {

    const total = issues.length;

    const reported = issues.filter(
        issue => issue.status === "Reported"
    ).length;

    const progress = issues.filter(
        issue => issue.status === "In Progress"
    ).length;

    const fixed = issues.filter(
        issue => issue.status === "Fixed"
    ).length;

    document.getElementById("totalCount").textContent = total;
    document.getElementById("reportedCount").textContent = reported;
    document.getElementById("progressCount").textContent = progress;
    document.getElementById("fixedCount").textContent = fixed;
}


// ========================================
// DISPLAY ISSUES
// ========================================

function displayIssues() {

    const searchText = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const selectedStatus = statusFilter
        ? statusFilter.value
        : "All";

    const selectedCategory = categoryFilter
        ? categoryFilter.value
        : "All";


    const filteredIssues = issues.filter(issue => {

        const title = issue.title
            ? issue.title.toLowerCase()
            : "";

        const location = issue.location
            ? issue.location.toLowerCase()
            : "";

        const description = issue.description
            ? issue.description.toLowerCase()
            : "";


        const matchesSearch =
            title.includes(searchText) ||
            location.includes(searchText) ||
            description.includes(searchText);


        const matchesStatus =
            selectedStatus === "All" ||
            issue.status === selectedStatus;


        const matchesCategory =
            selectedCategory === "All" ||
            issue.category === selectedCategory;


        return (
            matchesSearch &&
            matchesStatus &&
            matchesCategory
        );
    });


    // ====================================
    // NO ISSUES
    // ====================================

    if (filteredIssues.length === 0) {

        issuesList.innerHTML = `
            <div class="empty-state">
                <h3>No issues found</h3>
                <p>There are no matching campus issues.</p>
            </div>
        `;

        updateDashboard();

        return;
    }


    // ====================================
    // CLEAR OLD CARDS
    // ====================================

    issuesList.innerHTML = "";


    // ====================================
    // CREATE ISSUE CARDS
    // ====================================

    filteredIssues.forEach(issue => {

        const originalIndex = issues.indexOf(issue);

        const card = document.createElement("div");

        card.className = "issue-card";


        card.innerHTML = `

            <h3>${issue.title}</h3>

            <p>
                <strong>Issue ID:</strong>
                ${issue.id}
            </p>

            <p>
                <strong>Category:</strong>
                ${issue.category}
            </p>

            <p>
    <strong>Priority:</strong>
    <span class="priority-badge priority-${issue.priority.toLowerCase()}">
        ${issue.priority}
    </span>
</p>

            <p>
                <strong>Location:</strong>
                ${issue.location}
            </p>

            <p>
                <strong>Description:</strong>
                ${issue.description}
            </p>

            <p>
                <strong>Reported:</strong>
                ${issue.date}
            </p>


            <label>
                <strong>Status:</strong>
            </label>

<p>
    <strong>Status:</strong>
    <span class="status-badge status-${issue.status
        .toLowerCase()
        .replace(" ", "-")}">
        ${issue.status}
    </span>
</p>

            <select
                class="status-select"
                data-index="${originalIndex}"
            >

                <option value="Reported"
                    ${issue.status === "Reported" ? "selected" : ""}>
                    🟠 Reported
                </option>

                <option value="In Progress"
                    ${issue.status === "In Progress" ? "selected" : ""}>
                    🔵 In Progress
                </option>

                <option value="Fixed"
                    ${issue.status === "Fixed" ? "selected" : ""}>
                    🟢 Fixed
                </option>

            </select>


            <div class="issue-actions">

                <button
                    type="button"
                    class="delete-btn"
                    data-index="${originalIndex}"
                >
                    🗑️ Delete Issue
                </button>

            </div>
        `;


        issuesList.appendChild(card);
    });


    // ====================================
    // STATUS CHANGE
    // ====================================

    document.querySelectorAll(".status-select")
        .forEach(select => {

            select.addEventListener("change", function () {

                const index = Number(this.dataset.index);

                if (issues[index]) {

                    issues[index].status = this.value;

                    saveIssues();

                    displayIssues();
                }
            });
        });


    // ====================================
    // DELETE ISSUE
    // ====================================

    document.querySelectorAll(".delete-btn")
        .forEach(button => {

            button.addEventListener("click", function () {

                const index = Number(this.dataset.index);

                if (!issues[index]) {
                    return;
                }


                const confirmDelete = confirm(
                    "Are you sure you want to delete this issue?"
                );


                if (!confirmDelete) {
                    return;
                }


                // Delete issue
                issues.splice(index, 1);


                // Save updated list
                saveIssues();


                // Refresh page content
                displayIssues();
            });
        });


    updateDashboard();
}


// ========================================
// REPORT NEW ISSUE
// ========================================

form.addEventListener("submit", function (event) {

    event.preventDefault();


    const title =
        document.getElementById("title").value.trim();


    const category =
        document.getElementById("category").value;


    const priority =
        document.getElementById("priority").value;


    const location =
        document.getElementById("location").value.trim();


    const description =
        document.getElementById("description").value.trim();


    // ====================================
    // CREATE UNIQUE ISSUE ID
    // ====================================

    const newIssue = {

        id:
            "CF-" +
            Date.now().toString().slice(-6),

        title: title,

        category: category,

        priority: priority,

        location: location,

        description: description,

        status: "Reported",

        date: new Date().toLocaleString()
    };


    // Add issue
    issues.push(newIssue);


    // Save
    saveIssues();


    // Clear form
    form.reset();


    // Show updated issues
    displayIssues();


    // Success message
    alert("✅ Your problem has been reported!");
});


// ========================================
// SEARCH
// ========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        displayIssues
    );
}


// ========================================
// STATUS FILTER
// ========================================

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        displayIssues
    );
}


// ========================================
// CATEGORY FILTER
// ========================================

if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        displayIssues
    );
}


// ========================================
// INITIAL LOAD
// ========================================

displayIssues();
