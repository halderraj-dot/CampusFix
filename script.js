const form = document.getElementById("issueForm");
const issuesList = document.getElementById("issuesList");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const categoryFilter = document.getElementById("categoryFilter");

let issues = JSON.parse(localStorage.getItem("campusIssues")) || [];

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

function displayIssues() {

    const searchText = searchInput
        ? searchInput.value.toLowerCase()
        : "";

    const selectedStatus = statusFilter
        ? statusFilter.value
        : "All";

    const selectedCategory = categoryFilter
        ? categoryFilter.value
        : "All";

    const filteredIssues = issues.filter(issue => {

        const matchesSearch =
            issue.title.toLowerCase().includes(searchText) ||
            issue.location.toLowerCase().includes(searchText) ||
            issue.description.toLowerCase().includes(searchText);

        const matchesStatus =
            selectedStatus === "All" ||
            issue.status === selectedStatus;

        const matchesCategory =
            selectedCategory === "All" ||
            issue.category === selectedCategory;

        return matchesSearch &&
               matchesStatus &&
               matchesCategory;
    });

    if (filteredIssues.length === 0) {

        issuesList.innerHTML =
            "<p>No matching issues found.</p>";

        updateDashboard();
        return;
    }

    issuesList.innerHTML = "";

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
                ${issue.priority}
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

            <br><br>

            <button
                class="delete-btn"
                data-index="${originalIndex}"
            >
                🗑️ Delete Issue
            </button>
        `;

        issuesList.appendChild(card);
    });

    document.querySelectorAll(".status-select")
        .forEach(select => {

            select.addEventListener("change", function() {

                const index = this.dataset.index;

                issues[index].status = this.value;

                localStorage.setItem(
                    "campusIssues",
                    JSON.stringify(issues)
                );

                displayIssues();
            });
        });

    document.querySelectorAll(".delete-btn")
        .forEach(button => {

            button.addEventListener("click", function() {

                const index = this.dataset.index;

                issues.splice(index, 1);

                localStorage.setItem(
                    "campusIssues",
                    JSON.stringify(issues)
                );

                displayIssues();
            });
        });

    updateDashboard();
}


form.addEventListener("submit", function(event) {

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

    const newIssue = {

        id: "CF-" +
            String(issues.length + 1).padStart(3, "0"),

        title: title,

        category: category,

        priority: priority,

        location: location,

        description: description,

        status: "Reported",

        date: new Date().toLocaleString()
    };

    issues.push(newIssue);

    localStorage.setItem(
        "campusIssues",
        JSON.stringify(issues)
    );

    form.reset();

    displayIssues();

    alert("✅ Your problem has been reported!");
});


if (searchInput) {
    searchInput.addEventListener(
        "input",
        displayIssues
    );
}

if (statusFilter) {
    statusFilter.addEventListener(
        "change",
        displayIssues
    );
}

if (categoryFilter) {
    categoryFilter.addEventListener(
        "change",
        displayIssues
    );
}


displayIssues();
