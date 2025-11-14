(function () {
  // Load data using SharedStorage for user-specific access
  let allData = window.SharedStorage.loadAll();
  window.expenses = allData.expenses;
  window.yields = allData.yields;

  // 🔹 Save data using SharedStorage
  function saveData() {
    window.SharedStorage.saveExpenses(window.expenses);
    window.SharedStorage.saveYields(window.yields);
  }

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

  // 🔹 Edit Expense
  function editExpense(id) {
    const tbody = document.getElementById("expensesTableBody");
    const expense = window.expenses.find(e => e.id === id);
    if (!expense || !tbody) return;

    // Replace row with editable inputs
    tbody.innerHTML = window.expenses
      .map(e => {
        if (e.id === id) {
          return `
          <tr>
            <td><input type="date" id="editDate" value="${e.date}" /></td>
            <td><input type="text" id="editCrop" value="${e.crop}" /></td>
            <td><input type="text" id="editCategory" value="${e.category}" /></td>
            <td><input type="text" id="editDescription" value="${e.description || ""}" /></td>
            <td><input type="number" id="editAmount" value="${e.amount}" /></td>
            <td style="text-align:center;">
              <button class="save-btn" onclick="saveEditedExpense(${e.id})">💾</button>
              <button class="cancel-btn" onclick="renderExpensesTable()">❌</button>
            </td>
          </tr>`;
        } else {
          return `
          <tr>
            <td>${e.date}</td>
            <td><strong>${e.crop}</strong></td>
            <td><span class="category-badge">${e.category}</span></td>
            <td>${e.description || "-"}</td>
            <td style="text-align:right;">₹${e.amount.toFixed(2)}</td>
            <td style="text-align:center;">
              <button class="edit-btn" onclick="editExpense(${e.id})">✏️</button>
              <button class="delete-btn" onclick="deleteExpense(${e.id})">🗑️</button>
            </td>
          </tr>`;
        }
      })
      .join("");
  }

  // 🔹 Save Edited Expense
  function saveEditedExpense(id) {
    const crop = document.getElementById("editCrop").value.trim();
    const category = document.getElementById("editCategory").value.trim();
    const description = document.getElementById("editDescription").value.trim();
    const amount = parseFloat(document.getElementById("editAmount").value);
    const date = document.getElementById("editDate").value;

    if (!crop || isNaN(amount)) {
      alert("⚠️ Please fill all fields correctly.");
      return;
    }

    const index = window.expenses.findIndex(e => e.id === id);
    if (index !== -1) {
      window.expenses[index] = { id, crop, category, description, amount, date };
      saveData();
      renderExpensesTable();
      updateDashboard();
    }
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
            <button class="edit-btn" onclick="editExpense(${exp.id})">✏️</button>
            <button class="delete-btn" onclick="deleteExpense(${exp.id})">🗑️</button>
          </td>
        </tr>`
      )
      .join("");
  }

  // 🔹 Save Data
  function saveData() {
    window.SharedStorage.saveExpenses(window.expenses);
    window.SharedStorage.saveYields(window.yields);
  }

  // 🔹 Update Dashboard
  function updateDashboard() {
    const totalExpenses = window.expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const totalRevenue = window.yields.reduce((sum, y) => sum + (parseFloat(y.totalRevenue) || 0), 0);
    const netProfit = totalRevenue - totalExpenses;

    // Update card values with proper formatting
    if (document.getElementById("totalExpenses"))
      document.getElementById("totalExpenses").textContent = `₹${totalExpenses.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    if (document.getElementById("totalRevenue"))
      document.getElementById("totalRevenue").textContent = `₹${totalRevenue.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    if (document.getElementById("netProfit"))
      document.getElementById("netProfit").textContent = `₹${netProfit.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    
    // Update profit card color and label
    const profitCard = document.getElementById("profitCard");
    const profitLabel = document.getElementById("profitLabel");
    if (profitCard && profitLabel) {
      if (netProfit >= 0) {
        profitCard.style.backgroundColor = "#c8e6c9";
        profitLabel.textContent = "📈 Net Profit";
        profitLabel.style.color = "#2e7d32";
      } else {
        profitCard.style.backgroundColor = "#ffcdd2";
        profitLabel.textContent = "📉 Net Loss";
        profitLabel.style.color = "#c62828";
      }
    }
  }

  // 🔹 Expose to global
  window.toggleExpenseForm = toggleExpenseForm;
  window.handleAddExpense = handleAddExpense;
  window.deleteExpense = deleteExpense;
  window.renderExpensesTable = renderExpensesTable;
  window.editExpense = editExpense;
  window.saveEditedExpense = saveEditedExpense;

  // 🔹 Initialize
  document.addEventListener("DOMContentLoaded", renderExpensesTable);
})();
