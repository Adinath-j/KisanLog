// ------------------------- LOGIN / SIGNUP LOGIC -------------------------
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");

  const loginBtnNav = document.getElementById("loginBtnNav");
  const signupBtnNav = document.getElementById("signupBtnNav");
  const loginBtnHero = document.getElementById("loginBtnHero");
  const signupBtnHero = document.getElementById("signupBtnHero");
  const authContainers = document.querySelectorAll(".auth-buttons");

  if (user) {
    [loginBtnNav, signupBtnNav, loginBtnHero, signupBtnHero].forEach(
      btn => btn && (btn.style.display = "none")
    );

    authContainers.forEach(container => {
      const dashBtn = document.createElement("button");
      dashBtn.textContent = "Go to Dashboard";
      dashBtn.classList.add("btn", "secondary");
      dashBtn.onclick = () => (window.location.href = "dashboard/index.html");
      container.appendChild(dashBtn);
    });
  } else {
    loginBtnNav.onclick = () => (window.location.href = "login.html");
    signupBtnNav.onclick = () => (window.location.href = "register.html");
    loginBtnHero.onclick = () => (window.location.href = "login.html");
    signupBtnHero.onclick = () => (window.location.href = "register.html");
  }

  document.getElementById("contactBtn").onclick = () =>
    alert("📩 Contact us at support@farmtrack.in");
});

// ------------------------- NAVBAR SCROLL EFFECT -------------------------
window.addEventListener("scroll", () => {
  document.querySelector(".navbar")
    .classList.toggle("scrolled", window.scrollY > 50);
});
