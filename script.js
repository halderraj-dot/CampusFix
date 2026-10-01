const form = document.getElementById("issueForm");
const issuesList = document.getElementById("issuesList");

let issues = JSON.parse(localStorage.getItem("campusIssues")) || [];

function displayIssues() {
    if (issues.length === 0) {
        issuesList.innerHTML = "<p>No issues reported yet.</p>";
        return;
    }

    issuesList.innerHTML = "";

    issues.forEach((issue) => {
        const card = document.createElement("div");

        card.style.border = "1px solid #ddd";
        card.style.padding = "15px";
        card.style.marginBottom = "15px";
        card.style.borderRadius = "10px";

        card.innerHTML = `
            <h3>${issue.title}</h3>
            <p><strong>Category:</strong> ${issue.category}</p>
            <p><strong>Location:</strong> ${issue.location}</p>
            <p>${issue.description}</p>
            <p><strong>Status:</strong> 🟠 Reported</p>
        `;

        issuesList.appendChild(card);
    });
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
        description: description
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
