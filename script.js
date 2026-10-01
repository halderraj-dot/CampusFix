const form = document.getElementById("issueForm");
const issuesList = document.getElementById("issuesList");

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

    if (issues.length === 0) {
        issuesList.innerHTML = "<p>No issues reported yet.</p>";
        updateDashboard();
        return;
    }

    issuesList.innerHTML = "";

    issues.forEach((issue, index) => {

        const card = document.createElement("div");

        card.className = "issue-card";

        card.innerHTML = `
            <h3>${issue.title}</h3>

            <p>
                <strong>Category:</strong>
                ${issue.category}
            </p>

            <p>
                <strong>Location:</strong>
                ${issue.location}
            </p>

            <p>
                ${issue.description}
            </p>

            <label>
                <strong>Status:</strong>
            </label>

            <select class="status-select" data-index="${index}">
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

            <button class="delete-btn" data-index="${index}">
                🗑️ Delete Issue
            </button>
        `;

        issuesList.appendChild(card);
    });

    document.querySelectorAll(".status-select").forEach(select => {

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

    document.querySelectorAll(".delete-btn").forEach(button => {

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

    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const location = document.getElementById("location").value;
    const description = document.getElementById("description").value;

    const newIssue = {
        title: title,
        category: category,
        location: location,
        description: description,
        status: "Reported"
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

displayIssues();
