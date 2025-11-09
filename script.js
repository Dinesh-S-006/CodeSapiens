// ====================================================
//   Nandha Engineering College - Certificate Portal
//   Author: Dinesh S | Department Leaderboard Script
// ====================================================

// ===== Helper Functions =====
function safeId(dept, year) {
  return dept.replace(/\s+/g, "_") + "_" + year;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ===== Initialize Data =====
let data = JSON.parse(localStorage.getItem("studentData")) || {};

// ===== LOGIN PERSISTENCE =====
function checkLogin() {
  const loggedIn = localStorage.getItem("loggedIn");
  if (!loggedIn) {
    window.location.href = "login.html";
  } else {
    const username = localStorage.getItem("username") || "Leader";
    document.getElementById("welcome-msg").textContent = `Welcome, ${username}`;
  }
}

// Call checkLogin on page load
window.addEventListener("DOMContentLoaded", checkLogin);

// ===== Department Selection =====
function selectDept(dept) {
  const yearSection = document.getElementById("years");

  yearSection.innerHTML = `
    <div class="selected-dept">
      <h3>${dept} Department - Select Year</h3>
      <div class="year-buttons">
        <button onclick="showLeaderboard('${dept}', 1)">1st Year</button>
        <button onclick="showLeaderboard('${dept}', 2)">2nd Year</button>
        <button onclick="showLeaderboard('${dept}', 3)">3rd Year</button>
        <button onclick="showLeaderboard('${dept}', 4)">4th Year</button>
      </div>
    </div>
  `;

  document.getElementById("leaderboard").innerHTML = "";

  // Scroll smoothly to year selection
  setTimeout(() => {
    yearSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 200);
}

// ===== Show Leaderboard =====
function showLeaderboard(dept, year) {
  if (!data[dept]) data[dept] = {};
  if (!data[dept][year]) data[dept][year] = [];

  const students = data[dept][year].slice().sort((a, b) => (b.points || 0) - (a.points || 0));

  let tableRows = students.map((s, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(s.name)}</td>
      <td>${escapeHtml(s.reg)}</td>
      <td>${s.points || 0}</td>
      <td>${s.cert ? `<img src="${s.cert}" class="cert-img" width="80">` : 'No Certificate'}</td>
    </tr>`).join('');

  if (!tableRows) tableRows = `<tr><td colspan="5">No records yet</td></tr>`;

  const sid = safeId(dept, year);

  document.getElementById('leaderboard').innerHTML = `
    <div class="leaderboard-section">
      <div class="leaderboard-header">
        <h2>${dept} - ${year} Year Leaderboard</h2>
        <p>View student rankings and add new achievements.</p>
      </div>

      <div class="rank-box">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Register No</th>
              <th>Points</th>
              <th>Certificate</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>

      <div class="student-form">
        <h3>Add / Validate Student</h3>
        <form onsubmit="addStudent(event, '${dept}', ${year})">
          <label>Full Name</label>
          <input type="text" id="name_${sid}" placeholder="Enter full name" required>

          <label>Register Number</label>
          <input type="text" id="reg_${sid}" placeholder="Enter register number" required>

          <label>Participation Type</label>
          <select id="type_${sid}">
            <option value="1">Participant (1 Point)</option>
            <option value="2">Runner-Up (2 Points)</option>
            <option value="3">Winner (3 Points)</option>
          </select>

          <label>Upload Certificate</label>
          <input type="file" id="cert_${sid}" accept="image/*">

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  `;

  // Smooth scroll to leaderboard
  setTimeout(() => {
    document.getElementById("leaderboard").scrollIntoView({ behavior: "smooth", block: "start" });
  }, 200);
}

// ===== Add Student =====
function addStudent(event, dept, year) {
  event.preventDefault();

  const sid = safeId(dept, year);
  const name = document.getElementById(`name_${sid}`).value.trim();
  const reg = document.getElementById(`reg_${sid}`).value.trim();
  const points = parseInt(document.getElementById(`type_${sid}`).value);
  const certInput = document.getElementById(`cert_${sid}`);

  if (!name || !reg) {
    alert("⚠️ Please fill all fields before submitting.");
    return;
  }

  if (certInput.files && certInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      saveStudentData(dept, year, name, reg, points, e.target.result);
    };
    reader.readAsDataURL(certInput.files[0]);
  } else {
    saveStudentData(dept, year, name, reg, points, "");
  }
}

// ===== Save Student Data =====
function saveStudentData(dept, year, name, reg, points, certUrl) {
  if (!data[dept]) data[dept] = {};
  if (!data[dept][year]) data[dept][year] = [];

  data[dept][year].push({ name, reg, points, cert: certUrl });
  localStorage.setItem("studentData", JSON.stringify(data));

  showLeaderboard(dept, year);
}

// ===== LOGOUT =====
function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("username");
  window.location.href = "login.html";
}
