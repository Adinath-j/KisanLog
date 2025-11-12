(function () {
  // Ensure global data arrays exist
  window.expenses = window.expenses || [];
  window.yields = window.yields || [];

  // 🔹 Toggle Expense Form
  function toggleExpenseForm() {
    const form = document.getElementById("expenseForm");
    const toggle = document.getElementById("expenseFormToggle");
    const text = document.getElementById("expenseFormText");

    if (form.style.display === "none" || form.style.display === "") {
      form.style.display = "block";
      toggle.textContent = "✖";
      text.textContent = "Cancel";
    } else {
      form.style.display = "none";
      toggle.textContent = "➕";
      text.textContent = "Add Expense";
    }
  }

  // 🔹 Add Expense
  function handleAddExpense() {
    const date = document.getElementById("expenseDate").value;
    const crop = document.getElementById("expenseCrop").value.trim();
    const category = document.getElementById("expenseCategory").value;
    const description = document.getElementById("expenseDescription").value.trim();
    const amount = parseFloat(document.getElementById("expenseAmount").value);

    if (!crop || isNaN(amount)) {
      alert("⚠️ Please fill in crop name and amount correctly.");
      return;
    }

    const expense = {
      id: Date.now(),
      date: date || new Date().toISOString().split("T")[0],
      crop,
      category,
      description,
      amount
    };

    window.expenses.push(expense);
    saveData();
    renderExpensesTable();
    updateDashboard();
    toggleExpenseForm();
  }

  // 🔹 Delete Expense
  function deleteExpense(id) {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    window.expenses = window.expenses.filter(e => e.id !== id);
    saveData();
    renderExpensesTable();
    updateDashboard();
  }

  // 🔹 Render Table
  function renderExpensesTable() {
    const tbody = document.getElementById("expensesTableBody");

    if (!tbody) return;

    if (window.expenses.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#999; padding:40px;">No expenses recorded yet</td></tr>`;
      return;
    }

    tbody.innerHTML = window.expenses
      .map(
        exp => `
        <tr>
          <td>${exp.date}</td>
          <td><strong>${exp.crop}</strong></td>
          <td><span class="category-badge">${exp.category}</span></td>
          <td>${exp.description || "-"}</td>
          <td style="text-align:right;">₹${exp.amount.toFixed(2)}</td>
          <td style="text-align:center;">
            <button class="delete-btn" onclick="deleteExpense(${exp.id})">🗑️</button>
          </td>
        </tr>`
      )
      .join("");
  }

  // 🔹 Save Data to LocalStorage
  function saveData() {
    localStorage.setItem("farmExpenses", JSON.stringify(window.expenses));
    localStorage.setItem("farmYields", JSON.stringify(window.yields));
  }

  // 🔹 Update Dashboard Values
  function updateDashboard() {
    if (!document.getElementById("totalExpenses")) return;

    const totalExpenses = window.expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalRevenue = window.yields.reduce((sum, y) => sum + y.totalRevenue, 0);
    const netProfit = totalRevenue - totalExpenses;

    document.getElementById("totalExpenses").textContent = `₹${totalExpenses.toFixed(2)}`;
    document.getElementById("totalRevenue").textContent = `₹${totalRevenue.toFixed(2)}`;
    document.getElementById("netProfit").textContent = `₹${netProfit.toFixed(2)}`;
  }

  // 🔹 Expose functions to global scope
  window.toggleExpenseForm = toggleExpenseForm;
  window.handleAddExpense = handleAddExpense;
  window.deleteExpense = deleteExpense;
  window.renderExpensesTable = renderExpensesTable;

  // 🔹 Initialize
  document.addEventListener("DOMContentLoaded", renderExpensesTable);
})();
