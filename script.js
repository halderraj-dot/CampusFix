const form = document.getElementById("issueForm");
const issuesList = document.getElementById("issuesList");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const categoryFilter = document.getElementById("categoryFilter");

let issues =
    JSON.parse(localStorage.getItem("campusIssues")) || [];


// ========================================
// SAVE
// ========================================

function saveIssues() {

    localStorage.setItem(
        "campusIssues",
        JSON.stringify(issues)
    );
}


// ========================================
// DASHBOARD
// ========================================

function updateDashboard() {

    const total =
        issues.length;

    const reported =
        issues.filter(
            issue => issue.status === "Reported"
        ).length;

    const progress =
        issues.filter(
            issue => issue.status === "In Progress"
        ).length;

    const fixed =
        issues.filter(
            issue => issue.status === "Fixed"
        ).length;


    document.getElementById("totalCount")
        .textContent = total;

    document.getElementById("reportedCount")
        .textContent = reported;

    document.getElementById("progressCount")
        .textContent = progress;

    document.getElementById("fixedCount")
        .textContent = fixed;
}


// ========================================
// DISPLAY ISSUES
// ========================================

function displayIssues() {

    const searchText =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "All";


    const selectedCategory =
        categoryFilter
            ? categoryFilter.value
            : "All";


    const filteredIssues =
        issues.filter(issue => {

            const title =
                issue.title
                    ? issue.title.toLowerCase()
                    : "";


            const location =
                issue.location
                    ? issue.location.toLowerCase()
                    : "";


            const description =
                issue.description
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
    // EMPTY
    // ====================================

    if (filteredIssues.length === 0) {

        issuesList.innerHTML = `

            <div class="empty-state">

                <h3>
                    No issues found
                </h3>

                <p>
                    There are no matching campus issues.
                </p>

            </div>

        `;

        updateDashboard();

        return;
    }


    issuesList.innerHTML = "";


    // ====================================
    // CARDS
    // ====================================

    filteredIssues.forEach(issue => {

        const originalIndex =
            issues.indexOf(issue);


        const card =
            document.createElement("div");


        card.className =
            "issue-card";


        const priorityClass =
            issue.priority
                ? issue.priority.toLowerCase()
                : "low";


        const statusClass =
            issue.status
                ? issue.status
                    .toLowerCase()
                    .replace(" ", "-")
                : "reported";


        card.innerHTML = `

            <h3>
                ${issue.title}
            </h3>


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

                <span
                    class="priority-badge priority-${priorityClass}">

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


            <p>

                <strong>Status:</strong>

                <span
                    class="status-badge status-${statusClass}">

                    ${issue.status}

                </span>

            </p>


            <label>
                <strong>Update Status:</strong>
            </label>


            <select
                class="status-select"
                data-index="${originalIndex}">

                <option
                    value="Reported"
                    ${issue.status === "Reported"
                        ? "selected"
                        : ""}>

                    🟠 Reported

                </option>


                <option
                    value="In Progress"
                    ${issue.status === "In Progress"
                        ? "selected"
                        : ""}>

                    🔵 In Progress

                </option>


                <option
                    value="Fixed"
                    ${issue.status === "Fixed"
                        ? "selected"
                        : ""}>

                    ✅ Fixed

                </option>

            </select>


            <div class="issue-actions">

                <button
                    type="button"
                    class="delete-btn"
                    data-index="${originalIndex}">

                    🗑️ Delete Issue

                </button>

            </div>

        `;


        issuesList.appendChild(card);

    });


    // ====================================
    // STATUS CHANGE
    // ====================================

    document
        .querySelectorAll(".status-select")
        .forEach(select => {

            select.addEventListener(
                "change",
                function () {

                    const index =
                        Number(this.dataset.index);


                    if (!issues[index]) {
                        return;
                    }


                    issues[index].status =
                        this.value;


                    saveIssues();

                    displayIssues();

                }
            );

        });


    // ====================================
    // DELETE
    // ====================================

    document
        .querySelectorAll(".delete-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(this.dataset.index);


                    if (!issues[index]) {
                        return;
                    }


                    const confirmDelete =
                        confirm(
                            "Are you sure you want to delete this issue?"
                        );


                    if (!confirmDelete) {
                        return;
                    }


                    issues.splice(index, 1);

                    saveIssues();

                    displayIssues();

                }
            );

        });


    updateDashboard();
}


// ========================================
// SUBMIT ISSUE
// ========================================

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const title =
            document
                .getElementById("title")
                .value
                .trim();


        const category =
            document
                .getElementById("category")
                .value;


        const priority =
            document
                .getElementById("priority")
                .value;


        const location =
            document
                .getElementById("location")
                .value
                .trim();


        const description =
            document
                .getElementById("description")
                .value
                .trim();


        const newIssue = {

            id:
                "CF-" +
                Date.now()
                    .toString()
                    .slice(-6),

            title:

                title,

            category:

                category,

            priority:

                priority,

            location:

                location,

            description:

                description,

            status:

                "Reported",

            date:

                new Date()
                    .toLocaleString()

        };


        issues.push(newIssue);

        saveIssues();


        form.reset();

        displayIssues();


        alert(
            "✅ Your problem has been reported!"
        );


        document
            .getElementById("issuesList")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


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
// ========================================
// IMAGE PREVIEW
// ========================================

const imageInput = document.getElementById("image");
const imagePreview = document.getElementById("imagePreview");

if (imageInput) {

    imageInput.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) {

            imagePreview.innerHTML = "";
            imagePreview.style.display = "none";

            return;
        }

        if (!file.type.startsWith("image/")) {

            alert("Please select an image file.");

            this.value = "";

            imagePreview.innerHTML = "";
            imagePreview.style.display = "none";

            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {

            imagePreview.innerHTML = `
                <img
                    src="${event.target.result}"
                    alt="Selected problem photo"
                >
            `;

            imagePreview.style.display = "block";
        };

        reader.readAsDataURL(file);

    });

}
