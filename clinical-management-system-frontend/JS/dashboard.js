
    /* ---------- JS (merged) ---------- */

    // SECTION SWITCHING
    function showSection(sectionName) {
      document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
      document.getElementById(sectionName).style.display = "block";
    }

    // Reference ranges database (simple mapping)
    const referenceRanges = {
      "Blood Test": "Hb: 13–17 g/dL (male) / 12–15 g/dL (female)",
      "X-Ray": "Interpretation: No acute bony abnormality",
      "Blood Sugar PPBS": "PPBS: < 200 mg/dL (normal: 140–200 mg/dL post-meal)",
      "Dengue NS1": "Negative (if positive, indicates infection)",
      "Malaria Parasite Test (MP)": "Negative (if positive, parasite seen)",
      "ECG": "Normal Sinus Rhythm",
      "Liver Function Test (LFT)": "Bilirubin: 0.3–1.2 mg/dL; ALT: < 40 U/L"
    };

    // TEST DATA
    let tests = [
      "Blood Test", "X-Ray", "Blood Sugar PPBS", "Dengue NS1",
      "Malaria Parasite Test (MP)", "ECG", "Liver Function Test (LFT)"
    ];

    // pendingTests stores objects
    let pendingTests = [
      { test: "Blood Test", patient: "Ram", priority: "High" },
      { test: "X-Ray", patient: "John", priority: "Medium" },
      { test: "Blood Sugar PPBS", patient: "Anu", priority: "Low" },
      { test: "X-Ray", patient: "Priya", priority: "Medium" }
    ];

    // completedTests stores objects with result & range & id & date
    let completedTests = [
      { test: "Blood Sugar PPBS", patient: "Alex", result: "150 mg/dL", range: referenceRanges["Blood Sugar PPBS"], date: "2025-11-19", id: "PAT1001" },
      { test: "Blood Test", patient: "Ramya", result: "12.8 g/dL", range: referenceRanges["Blood Test"], date: "2025-11-18", id: "PAT1002" },
      { test: "Dengue NS1", patient: "Surya", result: "Negative", range: referenceRanges["Dengue NS1"], date: "2025-11-17", id: "PAT1003" }
    ];

    // When the page loads
    window.onload = () => {
      loadTests();
      loadPending();
      loadCompleted();
    };

    // LOAD TEST LIST
    function loadTests() {
      let box = document.getElementById("testList");
      box.innerHTML = "";

      tests.forEach((t, index) => {
        let li = document.createElement("li");
        li.innerHTML = `${t} <button class="remove-btn" onclick="removeTest(${index})">Remove</button>`;
        box.appendChild(li);
      });
    }

    // ADD NEW TEST
    function addTest() {
      let newTest = document.getElementById("newTestName").value.trim();

      if (newTest === "") {
        alert("Enter a test name");
        return;
      }

      tests.push(newTest);
      document.getElementById("newTestName").value = "";
      loadTests();

      alert("Test added successfully!");
    }

    // REMOVE TEST
    function removeTest(index) {
      tests.splice(index, 1);
      loadTests();
    }

    // Helper: priority -> class
    function getPriorityClass(priority) {
      if (priority === "High") return "high";
      if (priority === "Medium") return "medium";
      return "low";
    }

    // LOAD PENDING TESTS - keep original indices even after sorting
    function loadPending() {
      let box = document.getElementById("pendingList");
      box.innerHTML = "";

      const order = { High: 1, Medium: 2, Low: 3 };

      // get indices sorted by priority
      const indices = pendingTests
        .map((v, i) => i)
        .sort((a, b) => order[pendingTests[a].priority] - order[pendingTests[b].priority]);

      indices.forEach(idx => {
        const pt = pendingTests[idx];
        let li = document.createElement("li");

        // layout: priority label, text, select, edit
        li.innerHTML = `
            <span class="priority ${getPriorityClass(pt.priority)}">${pt.priority}</span>
            <span style="flex:1">${pt.test} - ${pt.patient}</span>
            <select onchange="changePriority(${idx}, this.value)">
                <option ${pt.priority === "High" ? "selected" : ""}>High</option>
                <option ${pt.priority === "Medium" ? "selected" : ""}>Medium</option>
                <option ${pt.priority === "Low" ? "selected" : ""}>Low</option>
            </select>
            <button class="edit-btn" onclick="openEditForm(${idx})">Edit</button>
        `;
        box.appendChild(li);
      });
    }

    function changePriority(index, newPriority) {
      pendingTests[index].priority = newPriority;
      loadPending();
    }

    // LOAD COMPLETED TESTS
    function loadCompleted() {
      let box = document.getElementById("completedList");
      box.innerHTML = "";

      completedTests.forEach((ct, index) => {
        let li = document.createElement("li");
        li.innerHTML = `
            <span>${ct.test} - ${ct.patient}</span>
            <div style="display:flex;gap:8px">
              <button class="edit-btn" onclick="viewReport(${index})">View Report</button>
              <button class="edit-btn" onclick="downloadReport(${index})">Download</button>
            </div>
        `;
        box.appendChild(li);
      });
    }

    // Utility to create patient id
    function generateRandomID() {
      return "PAT" + Math.floor(Math.random() * 9000 + 1000);
    }

    // OPEN FORM WITH DETAILS - now also show reference range
    let editIndex = null;
    function openEditForm(index) {
      editIndex = index;
      let item = pendingTests[index];

      document.getElementById("editPatient").value = item.patient;
      document.getElementById("editTest").value = item.test;

      // prefill reference range for display in edit form
      const range = referenceRanges[item.test] || "Range not available";
      document.getElementById("editRange").value = range;
      document.getElementById("editResult").value = ""; // empty until lab tech enters result

      // set default status to In-Progress when opening
      document.getElementById("editStatus").value = "In-Progress";

      showSection("editForm");
    }

    // UPDATE STATUS FUNCTION (now handles result & range)
    function updateTest() {
      let patient = document.getElementById("editPatient").value;
      let test = document.getElementById("editTest").value;
      let status = document.getElementById("editStatus").value;
      let result = document.getElementById("editResult").value.trim();
      let range = document.getElementById("editRange").value;

      if (status === "Completed") {
        // require result before completing
        if (result === "") {
          if (!confirm("Result is empty. Do you still want to mark as Completed?")) {
            return;
          }
        }
        const id = generateRandomID();
        const date = new Date().toLocaleDateString();
        completedTests.push({ test, patient, result: result || "N/A", range, date, id });
        // remove from pending
        pendingTests.splice(editIndex, 1);
        loadCompleted();
      } else {
        // just update pending record fields
        pendingTests[editIndex].patient = patient;
        pendingTests[editIndex].test = test;
        // keep priority same
      }

      loadPending();
      cancelEdit();
    }

    // CANCEL EDIT FORM
    function cancelEdit() {
      document.getElementById("editForm").style.display = "none";
      showSection("pending");
    }

    // VIEW REPORT for a completed test
    let currentReportIndex = null;
    function viewReport(index) {
      currentReportIndex = index;
      let item = completedTests[index];

      document.getElementById("repPatientId").textContent = item.id || generateRandomID();
      document.getElementById("repPatient").textContent = item.patient;
      document.getElementById("repTest").textContent = item.test;
      document.getElementById("repResult").textContent = item.result || "N/A";
      document.getElementById("repRange").textContent = item.range || (referenceRanges[item.test] || "N/A");
      document.getElementById("repDate").textContent = item.date || new Date().toLocaleDateString();

      showSection("reportSection");
    }

    // Print/Download Report -> open new window with printable content
    function printReport() {
      const content = document.getElementById("reportBox").innerHTML;
      const win = window.open("", "_blank", "width=800,height=600");
      win.document.write(`
        <html><head><title>Lab Report</title>
        <style>
          body{font-family:Arial,sans-serif;padding:20px}
          .report-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dashed #eee}
          h2{color:#0F7173}
        </style>
        </head><body>
        <h2>Lab Test Report</h2>
        ${content}
        </body></html>`);
      win.document.close();
      win.focus();
      win.print();
      // win.close(); // optional: keep window so user can save
    }

    // Download report (single file) - alias to printReport to open print dialog
    function downloadReport(index) {
      viewReport(index);
      setTimeout(() => printReport(), 100); // small delay so section shows (not strictly necessary)
    }

    function closeReport() {
      // return to completed list
      showSection("completed");
    }

    // SHOW BILL - populate bill fields from current report
    function showBill() {
      const idx = currentReportIndex;
      if (idx === null || completedTests[idx] === undefined) {
        alert("No report selected");
        return;
      }
      const item = completedTests[idx];
      document.getElementById("billNo").textContent = "BILL" + Date.now();
      document.getElementById("billPatient").textContent = item.patient;
      document.getElementById("billPatientId").textContent = item.id || "";
      document.getElementById("billTest").textContent = item.test;
      // Example: price mapping by test (simple)
      const priceMap = {
        "Blood Test": 400,
        "X-Ray": 600,
        "Blood Sugar PPBS": 350,
        "Dengue NS1": 500,
        "Malaria Parasite Test (MP)": 450,
        "ECG": 300,
        "Liver Function Test (LFT)": 700
      };
      const amount = priceMap[item.test] || 500;
      document.getElementById("billAmount").textContent = amount;

      showSection("billSection");
    }

    // Print/Download Bill - opens printable window
    function printBill() {
      const content = document.getElementById("billBox").innerHTML;
      const win = window.open("", "_blank", "width=800,height=600");
      win.document.write(`
        <html><head><title>Bill</title>
        <style>
          body{font-family:Arial,sans-serif;padding:20px}
          .report-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dashed #eee}
          h2{color:#0F7173}
        </style>
        </head><body>
        <h2>Lab Test Bill</h2>
        ${content}
        </body></html>`);
      win.document.close();
      win.focus();
      win.print();
    }

    // Back button: show report again from bill
    function backToReport() {
      showSection("reportSection");
    }

    // Close bill -> go back to completed list
    function closeBill() {
      showSection("completed");
    }

    // Simple search for test list
    function searchTest() {
      let value = document.getElementById("searchInput").value.toLowerCase();
      let listItems = document.querySelectorAll("#testList li");

      listItems.forEach(li => {
        let text = li.textContent.toLowerCase();
        li.style.display = text.includes(value) ? "" : "none";
      });
    }

  function logout() {
  if (confirm("Are you sure you want to logout?")) {
    window.location.href = "index.html"; // redirect to login/page
  }
}
