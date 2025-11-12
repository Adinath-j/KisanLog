(function () {
  // Ensure shared arrays exist globally
  window.yields = JSON.parse(localStorage.getItem("farmYields") || "[]");
  window.expenses = JSON.parse(localStorage.getItem("farmExpenses") || "[]");

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

  // 🔹 Edit Yield
  function editYield(id) {
    const tbody = document.getElementById("yieldsTableBody");
    const y = window.yields.find((yld) => yld.id === id);
    if (!y || !tbody) return;

    tbody.innerHTML = window.yields
      .map((yld) => {
        if (yld.id === id) {
          return `
          <tr>
            <td><input type="date" id="editDate" value="${yld.date}" /></td>
            <td><input type="text" id="editCrop" value="${yld.crop}" /></td>
            <td><input type="number" id="editQuantity" value="${yld.quantity}" min="0" oninput="updateEditRevenue()" /></td>
            <td>
              <select id="editUnit">
                <option value="kg" ${yld.unit === "kg" ? "selected" : ""}>kg</option>
                <option value="tons" ${yld.unit === "tons" ? "selected" : ""}>tons</option>
                <option value="bags" ${yld.unit === "bags" ? "selected" : ""}>bags</option>
                <option value="liters" ${yld.unit === "liters" ? "selected" : ""}>liters</option>
                <option value="units" ${yld.unit === "units" ? "selected" : ""}>units</option>
              </select>
            </td>
            <td><input type="number" id="editPrice" value="${yld.pricePerUnit}" min="0" step="0.01" oninput="updateEditRevenue()" /></td>
            <td id="editTotal" style="text-align:right; color:#2e7d32;">₹${yld.totalRevenue.toFixed(2)}</td>
            <td style="text-align:center;">
              <button class="save-btn" onclick="saveEditedYield(${yld.id})">💾</button>
              <button class="cancel-btn" onclick="renderYieldsTable()">❌</button>
            </td>
          </tr>`;
        } else {
          return `
          <tr>
            <td>${yld.date}</td>
            <td><strong>${yld.crop}</strong></td>
            <td style="text-align:right;">${yld.quantity} ${yld.unit}</td>
            <td style="text-align:right;">₹${yld.pricePerUnit.toFixed(2)}</td>
            <td style="text-align:right; color:#2e7d32;">₹${yld.totalRevenue.toFixed(2)}</td>
            <td style="text-align:center;">
              <button class="edit-btn" onclick="editYield(${yld.id})">✏️</button>
              <button class="delete-btn" onclick="deleteYield(${yld.id})">🗑️</button>
            </td>
          </tr>`;
        }
      })
      .join("");
  }

  // 🔹 Auto-update Total Revenue while Editing
  function updateEditRevenue() {
    const qty = parseFloat(document.getElementById("editQuantity")?.value || 0);
    const price = parseFloat(document.getElementById("editPrice")?.value || 0);
    const total = qty * price;
    const totalCell = document.getElementById("editTotal");
    if (totalCell) totalCell.textContent = `₹${total.toFixed(2)}`;
  }

  // 🔹 Save Edited Yield
  function saveEditedYield(id) {
    const crop = document.getElementById("editCrop").value.trim();
    const quantity = parseFloat(document.getElementById("editQuantity").value);
    const unit = document.getElementById("editUnit").value;
    const pricePerUnit = parseFloat(document.getElementById("editPrice").value);
    const date = document.getElementById("editDate").value;

    if (!crop || isNaN(quantity) || isNaN(pricePerUnit)) {
      alert("⚠️ Please fill in all fields correctly.");
      return;
    }

    const totalRevenue = quantity * pricePerUnit;
    const index = window.yields.findIndex((y) => y.id === id);
    if (index !== -1) {
      window.yields[index] = { id, date, crop, quantity, unit, pricePerUnit, totalRevenue };
      saveData();
      renderYieldsTable();
      updateDashboard();
    }
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
            <button class="edit-btn" onclick="editYield(${yld.id})">✏️</button>
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
  window.editYield = editYield;
  window.saveEditedYield = saveEditedYield;
  window.updateEditRevenue = updateEditRevenue;
  window.renderYieldsTable = renderYieldsTable;

  // 🔹 Initialize on Load
  document.addEventListener("DOMContentLoaded", renderYieldsTable);
})();
