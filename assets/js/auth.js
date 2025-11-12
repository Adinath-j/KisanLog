document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------
  // ✅ FARMER REGISTRATION LOGIC
  // -------------------------------
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const fullName = document.getElementById("fullName").value.trim();
      const email = document.getElementById("email").value.trim();
      const mobile = document.getElementById("mobile").value.trim();
      const location = document.getElementById("location").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
      }

      if (password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
      }

      const user = { fullName, email, mobile, location, password };
      localStorage.setItem("registeredUser", JSON.stringify(user));
      alert("✅ Registration successful! You can now log in.");
      window.location.replace("login.html");
    });
  }

  // -------------------------------
  // ✅ FARMER LOGIN LOGIC
  // -------------------------------
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;
      const storedUser = JSON.parse(localStorage.getItem("registeredUser"));

      if (!storedUser) {
        alert("No registered user found. Please register first.");
        window.location.replace("register.html");
        return;
      }

      if (email === storedUser.email && password === storedUser.password) {
        alert(`Welcome back, ${storedUser.fullName}!`);
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({ fullName: storedUser.fullName, email, isLoggedIn: true })
        );
        window.location.replace("dashboard/index.html");
      } else {
        alert("Invalid email or password.");
      }
    });
  }

  // -------------------------------
  // ✅ DASHBOARD SESSION CHECK
  // -------------------------------
  if (window.location.pathname.includes("dashboard/index.html")) {
    const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedUser || !loggedUser.isLoggedIn) {
      alert("Please log in to access the dashboard.");
      window.location.replace("../login.html");
      return;
    }

    // Display welcome text
    const welcomeText = document.getElementById("welcomeText");
    if (welcomeText) welcomeText.textContent = `Welcome, ${loggedUser.fullName}! 👋`;

    // Logout function
    window.logoutUser = function () {
      localStorage.removeItem("loggedInUser");
      alert("You have been logged out!");
      window.location.replace("../login.html");
    };

    // Home function (default to expenses)
    window.goHome = function () {
      const firstTab = document.querySelector(".tab[data-tab='expenses.html']");
      if (firstTab) firstTab.click();
    };
  }
});
