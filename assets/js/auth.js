// assets/js/auth.js
document.addEventListener("DOMContentLoaded", () => {
  // Helper: read array of registered users
  function getRegisteredUsers() {
    return JSON.parse(localStorage.getItem("registeredUsers") || "[]");
  }
  function saveRegisteredUsers(arr) {
    localStorage.setItem("registeredUsers", JSON.stringify(arr));
  }

  // Register form
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fullName = document.getElementById("fullName").value.trim();
      const email = document.getElementById("email").value.trim().toLowerCase();
      const mobile = document.getElementById("mobile").value.trim();
      const location = document.getElementById("location").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (password !== confirmPassword) { alert("Passwords do not match."); return; }
      if (password.length < 8) { alert("Password must be at least 8 characters."); return; }
      if (!email) { alert("Please provide an email."); return; }

      const users = getRegisteredUsers();
      if (users.some(u => u.email === email)) {
        alert("This email is already registered. Please login.");
        window.location.replace("login.html");
        return;
      }

      const newUser = { fullName, email, mobile, location, password };
      users.push(newUser);
      saveRegisteredUsers(users);
      alert("Registration successful — please login.");
      window.location.replace("login.html");
    });
  }

  // Login form
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim().toLowerCase();
      const password = document.getElementById("loginPassword").value;
      const users = getRegisteredUsers();
      const matched = users.find(u => u.email === email && u.password === password);

      if (!matched) {
        alert("Invalid email or password. Please try again.");
        return;
      }

      // Persist logged-in user object (used across app)
      const logged = { fullName: matched.fullName, email: matched.email, isLoggedIn: true };
      localStorage.setItem("loggedInUser", JSON.stringify(logged));

      // Optional: migrate any global data to this user's keys (only if global data exists)
      migrateGlobalDataToUser(matched.email);

      window.location.replace("dashboard/index.html");
    });
  }

  // Dashboard session check + show welcome text
  if (window.location.pathname.includes("dashboard/index.html")) {
    const loggedUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
    if (!loggedUser || !loggedUser.isLoggedIn) {
      window.location.replace("../login.html");
      return;
    }
    const welcomeText = document.getElementById("welcomeText");
    if (welcomeText) welcomeText.textContent = `Welcome, ${loggedUser.fullName}! 👋`;

    window.logoutUser = function () {
      localStorage.removeItem("loggedInUser");
      window.location.replace("../login.html");
    };
  }

  // -----------------------------
  // Migration helper (optional)
  // -----------------------------
  // If you previously had global keys 'farmExpenses' and 'farmYields' and want to migrate them
  // into the currently logging-in user's namespaced storage, this moves the data and clears globals.
  function migrateGlobalDataToUser(email) {
    try {
      const globalExpenses = JSON.parse(localStorage.getItem("farmExpenses") || "null");
      const globalYields = JSON.parse(localStorage.getItem("farmYields") || "null");
      if (!globalExpenses && !globalYields) return; // nothing to migrate

      const keyExp = makeUserKey(email, "expenses");
      const keyYld = makeUserKey(email, "yields");

      // If per-user keys are empty, migrate global to them (but don't override existing per-user data)
      if (!localStorage.getItem(keyExp) && globalExpenses) {
        localStorage.setItem(keyExp, JSON.stringify(globalExpenses));
      }
      if (!localStorage.getItem(keyYld) && globalYields) {
        localStorage.setItem(keyYld, JSON.stringify(globalYields));
      }

      // Remove the old global keys to avoid multiple migrations
      localStorage.removeItem("farmExpenses");
      localStorage.removeItem("farmYields");
    } catch (err) {
      console.warn("Migration error:", err);
    }
  }

  function makeUserKey(email, suffix) {
    const safe = encodeURIComponent(email.toLowerCase());
    return `farmData_${safe}_${suffix}`;
  }
});
