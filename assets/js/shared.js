// ✅ assets/js/shared.js
// A single global object to manage user-specific farm data
(function () {
  if (window.SharedStorage) return; // prevent redefinition

  // 🧩 Private helper: generate a unique key per user
  function userKey(email, suffix) {
    if (!email) return null;
    return `farmData_${encodeURIComponent(email.toLowerCase())}_${suffix}`;
  }

  // 🧩 Get the currently logged-in user (stored during login)
  function getLoggedUser() {
    try {
      return JSON.parse(localStorage.getItem("loggedInUser")) || null;
    } catch {
      return null;
    }
  }

  // ------------------ EXPENSES ------------------
  function loadExpenses() {
    const user = getLoggedUser();
    if (!user?.email) return [];
    const key = userKey(user.email, "expenses");
    return JSON.parse(localStorage.getItem(key) || "[]");
  }

  function saveExpenses(expenses) {
    const user = getLoggedUser();
    if (!user?.email) return;
    const key = userKey(user.email, "expenses");
    localStorage.setItem(key, JSON.stringify(expenses || []));
  }

  // ------------------ YIELDS ------------------
  function loadYields() {
    const user = getLoggedUser();
    if (!user?.email) return [];
    const key = userKey(user.email, "yields");
    return JSON.parse(localStorage.getItem(key) || "[]");
  }

  function saveYields(yields) {
    const user = getLoggedUser();
    if (!user?.email) return;
    const key = userKey(user.email, "yields");
    localStorage.setItem(key, JSON.stringify(yields || []));
  }

  // ------------------ UTILITIES ------------------
  function loadAll() {
    return { expenses: loadExpenses(), yields: loadYields() };
  }

  function saveAll(expenses, yields) {
    saveExpenses(expenses || []);
    saveYields(yields || []);
  }

  function clearUserData() {
    const user = getLoggedUser();
    if (!user?.email) return;
    localStorage.removeItem(userKey(user.email, "expenses"));
    localStorage.removeItem(userKey(user.email, "yields"));
  }

  // ------------------ CROP ANALYSIS ------------------
  function getCropAnalysis() {
    const user = getLoggedUser();
    if (!user?.email) return [];

    const expenses = loadExpenses();
    const yields = loadYields();

    const analysis = {};

    // Aggregate Expenses
    expenses.forEach(e => {
      const crop = e.crop?.trim().toLowerCase() || "unknown";
      if (!analysis[crop]) {
        analysis[crop] = { crop: e.crop, expenses: 0, revenue: 0, profit: 0 };
      }
      analysis[crop].expenses += Number(e.amount) || 0;
    });

    // Aggregate Yields (Revenue)
    yields.forEach(y => {
      const crop = y.crop?.trim().toLowerCase() || "unknown";
      if (!analysis[crop]) {
        analysis[crop] = { crop: y.crop, expenses: 0, revenue: 0, profit: 0 };
      }
      analysis[crop].revenue += Number(y.totalRevenue) || 0;
    });

    // Compute Profit
    Object.values(analysis).forEach(c => {
      c.profit = c.revenue - c.expenses;
    });

    return Object.values(analysis);
  }

  // ✅ Make accessible globally
  window.getCropAnalysis = getCropAnalysis;

  // ✅ Expose SharedStorage globally
  window.SharedStorage = {
    getLoggedUser,
    loadExpenses,
    saveExpenses,
    loadYields,
    saveYields,
    loadAll,
    saveAll,
    clearUserData,
    getCropAnalysis
  };
})();
