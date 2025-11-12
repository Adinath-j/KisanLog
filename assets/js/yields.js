(function () {
  // Ensure shared arrays exist globally
  window.yields = window.yields || [];
  window.expenses = window.expenses || [];

  // 🔹 Toggle Yield Form
  function toggleYieldForm() {
    const form = document.getElementById("yieldForm");
    const toggle = document.getElementById("yieldFormToggle");
    const text = document.getElementById("yieldFormText");

    if (form.style.display === "none" || form.style.display === "") {
      form.style.display = "block";
      toggle.textContent = "✖";
      text.textContent = "Cancel";
    } else {
      form.style.display = "none";
      toggle.textContent = "➕";
      text.textContent = "Add Yield";
    }
  }

  // 🔹 Add Yield Record
  function handleAddYield() {
    const date = document.getElementById("yieldDate").value;
    const crop = document.getElementById("yieldCrop").value.trim();
    const quantity = parseFloat(document.getElementById("yieldQuantity").value);
    const unit = document.getElementById("yieldUnit").value;
    const pricePerUnit = parseFloat(document.getElementById("yieldPrice").value);

    if (!crop || isNaN(quantity) || isNaN(pricePerUnit)) {
      alert("⚠️ Please fill in all required fields properly.");
      return;
    }

    const totalRevenue = quantity * pricePerUnit;
    const yieldData = {
      id: Date.now(),
      date: date || new Date().toISOString().split("T")[0],
      crop,
      quantity,
      unit,
      pricePerUnit,
      totalRevenue,
    };

    window.yields.push(yieldData);
    saveData();
    renderYieldsTable();
    updateDashboard();
    toggleYieldForm();
  }

  // 🔹 Delete Yield
  function deleteYield(id) {
    if (!confirm("Are you sure you want to delete this yield record?")) return;

    window.yields = window.yields.filter((y) => y.id !== id);
    saveData();
    renderYieldsTable();
    updateDashboard();
  }

  // 🔹 Render Yield Table
  function renderYieldsTable() {
    const tbody = document.getElementById("yieldsTableBody");
    if (!tbody) return;

    if (window.yields.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#999; padding:40px;">No yield records yet</td></tr>`;
      return;
    }

    tbody.innerHTML = window.yields
      .map(
        (yld) => `
        <tr>
          <td>${yld.date}</td>
          <td><strong>${yld.crop}</strong></td>
          <td style="text-align:right;">${yld.quantity} ${yld.unit}</td>
          <td style="text-align:right;">₹${yld.pricePerUnit.toFixed(2)}</td>
          <td style="text-align:right; color:#2e7d32;">₹${yld.totalRevenue.toFixed(2)}</td>
          <td style="text-align:center;">
            <button class="delete-btn" onclick="deleteYield(${yld.id})">🗑️</button>
          </td>
        </tr>`
      )
      .join("");
  }

  // 🔹 Save Data to LocalStorage
  function saveData() {
    localStorage.setItem("farmYields", JSON.stringify(window.yields));
    localStorage.setItem("farmExpenses", JSON.stringify(window.expenses));
  }

  // 🔹 Update Dashboard Summary
  function updateDashboard() {
    if (!document.getElementById("totalRevenue")) return;

    const totalExpenses = window.expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalRevenue = window.yields.reduce((sum, y) => sum + y.totalRevenue, 0);
    const netProfit = totalRevenue - totalExpenses;

    document.getElementById("totalExpenses").textContent = `₹${totalExpenses.toFixed(2)}`;
    document.getElementById("totalRevenue").textContent = `₹${totalRevenue.toFixed(2)}`;
    document.getElementById("netProfit").textContent = `₹${netProfit.toFixed(2)}`;
  }

  // 🔹 Expose Functions Globally
  window.toggleYieldForm = toggleYieldForm;
  window.handleAddYield = handleAddYield;
  window.deleteYield = deleteYield;
  window.renderYieldsTable = renderYieldsTable;

  // 🔹 Initialize when page loads
  document.addEventListener("DOMContentLoaded", renderYieldsTable);
})();
