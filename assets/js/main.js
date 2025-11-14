document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab");
  const tabContent = document.getElementById("tabContent");

  // Initialize data using SharedStorage (user-specific keys)
  const allData = window.SharedStorage.loadAll();
  window.expenses = allData.expenses;
  window.yields = allData.yields;

  // Default tab: Expenses
  loadTab("expenses.html", "../assets/js/expenses.js", "expenses");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelector(".tab.active")?.classList.remove("active");
      tab.classList.add("active");

      const tabName = tab.dataset.tab.replace(".html", "");
      const jsPath = `../assets/js/${tabName}.js`;
      loadTab(tab.dataset.tab, jsPath, tabName);
    });
  });

  // ---------------- MAIN TAB LOADER ----------------
  function loadTab(page, scriptPath, tabName) {
    fetch(page)
      .then((res) => res.text())
      .then((html) => {
        tabContent.innerHTML = html;

        // Remove any previous dynamic JS
        const oldScript = document.getElementById("dynamicTabScript");
        if (oldScript) oldScript.remove();

        // Load JS for the current tab
        const script = document.createElement("script");
        script.src = scriptPath;
        script.id = "dynamicTabScript";

        // Wait for JS to finish loading
        script.onload = () => {
          // Wait for DOM content (HTML injected above) to be ready
          requestAnimationFrame(() => {
            // Now that DOM + JS are both ready, render correct data
            renderTab(tabName);
          });
        };

        document.body.appendChild(script);
      })
      .catch((err) => {
        tabContent.innerHTML = `<p style="color:red;">Error loading tab: ${err}</p>`;
      });
  }

  // ---------------- RENDER TAB CONTENT ----------------
  function renderTab(tabName) {
    if (tabName === "expenses" && window.renderExpensesTable) {
      renderExpensesTable();
    } else if (tabName === "yields" && window.renderYieldsTable) {
      renderYieldsTable();
    } else if (tabName === "analysis" && window.renderAnalysisTable) {
      renderAnalysisTable();
    } else if (tabName === "graphs" && window.renderCharts) {
      renderCharts();
    }
  }
});
