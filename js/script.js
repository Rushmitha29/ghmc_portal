/* =========================================================
   GHMC COMPLAINT MANAGEMENT SYSTEM
   SHARED DATA FILE (js/script.js)

   WHAT: This file stores and retrieves our "database" using the
         browser's localStorage. Since this is a beginner
         HTML+CSS+JS project (no real backend/database), we use
         localStorage to remember data even after the page reloads.

   WHY:  Every page (login, register, dashboards, etc.) needs to
         read/write the SAME list of users and complaints. Instead
         of repeating this code on every page, we write it once
         here and link this file in every HTML page.

   SYLLABUS CONCEPT: JSON Syntax, JSON Parsing, JSON Serialization
   ---------------------------------------------------------------
   localStorage can only store TEXT (strings). Our data is in the
   form of JavaScript objects/arrays. So:
     - JSON.stringify(object)  -> converts object to JSON text
                                   (this is called "Serialization")
     - JSON.parse(jsonText)    -> converts JSON text back to a
                                   JavaScript object (this is
                                   called "Parsing")
   ========================================================= */

/* ---------- KEYS used in localStorage ---------- */
const USERS_KEY = "ghmc_users";
const COMPLAINTS_KEY = "ghmc_complaints";
const SESSION_KEY = "ghmc_currentUser";
const COUNTER_KEY = "ghmc_complaintCounter";

/* =========================================================
   USER FUNCTIONS
   ========================================================= */

// Get the list of all registered users (returns a JS array)
function getUsers() {
  var data = localStorage.getItem(USERS_KEY); // read as TEXT
  if (data === null) {
    return []; // no users saved yet
  }
  return JSON.parse(data); // JSON Parsing: text -> JS array
}

// Save the list of users back to localStorage
function saveUsers(usersArray) {
  var jsonText = JSON.stringify(usersArray); // JSON Serialization: JS array -> text
  localStorage.setItem(USERS_KEY, jsonText);
}

// Add one new user (used by register.html)
function addUser(user) {
  var users = getUsers();
  users.push(user);
  saveUsers(users);
}

// Find a user by username + password + role (used by login.html)
function findUser(username, password, role) {
  var users = getUsers();
  for (var i = 0; i < users.length; i++) {
    if (
      users[i].username === username &&
      users[i].password === password &&
      users[i].role === role
    ) {
      return users[i];
    }
  }
  return null; // not found
}

// Check if a username is already taken
function isUsernameTaken(username) {
  var users = getUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].username === username) {
      return true;
    }
  }
  return false;
}

/* ---------- SESSION (who is currently logged in) ---------- */

function setCurrentUser(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function getCurrentUser() {
  var data = localStorage.getItem(SESSION_KEY);
  if (data === null) return null;
  return JSON.parse(data);
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "login.html";
}

// Call this at the top of every dashboard page to block access
// if nobody is logged in, or if the wrong role tries to open it.
function requireRole(expectedRole) {
  var user = getCurrentUser();
  if (user === null || user.role !== expectedRole) {
    window.location.href = "login.html";
  }
  return user;
}

/* =========================================================
   COMPLAINT FUNCTIONS
   ========================================================= */

function getComplaints() {
  var data = localStorage.getItem(COMPLAINTS_KEY);
  if (data === null) return [];
  return JSON.parse(data);
}

function saveComplaints(complaintsArray) {
  var jsonText = JSON.stringify(complaintsArray);
  localStorage.setItem(COMPLAINTS_KEY, jsonText);
}

function addComplaint(complaint) {
  var complaints = getComplaints();
  complaints.push(complaint);
  saveComplaints(complaints);
}

// Generates IDs like GHMC20260001, GHMC20260002, ...
function generateComplaintId() {
  var counter = localStorage.getItem(COUNTER_KEY);
  if (counter === null) {
    counter = 1;
  } else {
    counter = parseInt(counter) + 1;
  }
  localStorage.setItem(COUNTER_KEY, counter);

  var year = new Date().getFullYear();
  var paddedNumber = String(counter).padStart(4, "0"); // e.g. 0001
  return "GHMC" + year + paddedNumber;
}

// Find one complaint by its ID
function getComplaintById(id) {
  var complaints = getComplaints();
  for (var i = 0; i < complaints.length; i++) {
    if (complaints[i].id === id) return complaints[i];
  }
  return null;
}

// Update one complaint (find by id, replace its data, save again)
function updateComplaint(updatedComplaint) {
  var complaints = getComplaints();
  for (var i = 0; i < complaints.length; i++) {
    if (complaints[i].id === updatedComplaint.id) {
      complaints[i] = updatedComplaint;
    }
  }
  saveComplaints(complaints);
}

// Small helper: turns "Under Review" into "Under-Review" so it can
// be used as a CSS class name for badge colors (see style.css)
function statusToClass(status) {
  return status.split(" ").join("-");
}

/* =========================================================
   DEMO DATA (runs once, so admin/staff accounts always exist)
   WHAT: Creates one Admin login and one Field Staff login so you
         don't need a "register" flow for them.
   WHERE: This function runs automatically at the bottom of this
          file, on every page load, but only adds data once.
   ========================================================= */
function seedDemoData() {
  var users = getUsers();
  var alreadySeeded = false;
  for (var i = 0; i < users.length; i++) {
    if (users[i].username === "admin") alreadySeeded = true;
  }

  if (!alreadySeeded) {
    users.push({
      name: "GHMC Administrator",
      username: "admin",
      password: "admin123",
      role: "admin"
    });
    users.push({
      name: "Ravi Kumar",
      username: "staff1",
      password: "staff123",
      role: "staff"
    });
    saveUsers(users);
  }
}
seedDemoData();

/* =========================================================
   SMALL UI HELPER: show a success/error alert box
   Every page has a <div id="alertBox" class="alert"></div>
   somewhere, and calls showAlert("alertBox", "message", "success")
   ========================================================= */
function showAlert(elementId, message, type) {
  var box = document.getElementById(elementId);
  if (!box) return;
  box.textContent = message;
  box.className = "alert show alert-" + type; // type = "success" or "error"
}
