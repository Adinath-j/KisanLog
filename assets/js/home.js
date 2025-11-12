// ✅ assets/js/home.js
document.addEventListener("DOMContentLoaded", () => {
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");

  const loginBtnNav = document.getElementById("loginBtnNav");
  const signupBtnNav = document.getElementById("signupBtnNav");
  const loginBtnHero = document.getElementById("loginBtnHero");
  const signupBtnHero = document.getElementById("signupBtnHero");
  const authContainers = document.querySelectorAll(".auth-buttons");

  // ✅ If user already logged in → hide login/signup and show dashboard button
  if (user) {
    [loginBtnNav, signupBtnNav, loginBtnHero, signupBtnHero].forEach(btn => {
      if (btn) btn.style.display = "none";
    });

    authContainers.forEach(container => {
      const dashBtn = document.createElement("button");
      dashBtn.textContent = "Go to Dashboard";
      dashBtn.classList.add("btn", "secondary");
      dashBtn.addEventListener("click", () => {
        window.location.href = "dashboard/index.html";
      });
      container.appendChild(dashBtn);
    });
  } else {
    // 🧩 Normal visitors: wire up login/signup navigation
    loginBtnNav?.addEventListener("click", () => {
      window.location.href = "login.html";
    });
    signupBtnNav?.addEventListener("click", () => {
      window.location.href = "register.html";
    });
    loginBtnHero?.addEventListener("click", () => {
      window.location.href = "login.html";
    });
    signupBtnHero?.addEventListener("click", () => {
      window.location.href = "register.html";
    });
  }

  // 🌿 Explore button scrolls to “Features” section smoothly
  const exploreBtn = document.getElementById("exploreBtn");
  exploreBtn?.addEventListener("click", () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      window.scrollTo({
        top: featuresSection.offsetTop - 60,
        behavior: "smooth",
      });
    }
  });

  // 📩 Contact button action
  const contactBtn = document.getElementById("contactBtn");
  contactBtn?.addEventListener("click", () => {
    alert("📩 Contact us at support@farmtrack.in");
  });
});
