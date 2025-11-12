document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------
  // ✅ FARMER REGISTRATION
  // -------------------------------
  const registerForm = document.getElementById("register-form");

  if (registerForm) {
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();

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

      // Save user in localStorage
      const user = { fullName, email, mobile, location, password };
      localStorage.setItem("registeredUser", JSON.stringify(user));

      alert("✅ Registration successful! You can now log in.");
      window.location.replace("login.html");
    });
  }

  // -------------------------------
  // ✅ FARMER LOGIN
  // -------------------------------
  const loginForm = document.querySelector("form[onsubmit='loginUser(event)']");

  if (loginForm) {
    window.loginUser = (event) => {
      event.preventDefault();

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
        // ✅ Unified login key
        localStorage.setItem("loggedInUser", storedUser.fullName);
        window.location.replace("dashboard/index.html");
      } else {
        alert("Invalid email or password. Please try again.");
      }
    };
  }

  // -------------------------------
  // ✅ DASHBOARD SESSION CHECK
  // -------------------------------
  if (window.location.pathname.includes("dashboard/index.html")) {
    const user = localStorage.getItem("loggedInUser");

    if (!user) {
      alert("Please log in to access the dashboard.");
      window.location.replace("../login.html");
      return;
    }

    // Optional: dynamically add logout button
    const header = document.querySelector(".header");
    if (header && !document.querySelector(".logout-btn")) {
      const logoutBtn = document.createElement("button");
      logoutBtn.textContent = "🚪 Logout";
      logoutBtn.classList.add("export-btn", "logout-btn");
      logoutBtn.style.background = "#c62828";
      logoutBtn.style.marginLeft = "10px";
      logoutBtn.onclick = () => {
        localStorage.removeItem("loggedInUser");
        alert("Logged out successfully!");
        window.location.replace("../login.html");
      };
      header.appendChild(logoutBtn);
    }
  }
});
