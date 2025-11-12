// Data storage
let expenses = [];
let yields = [];
let editingExpenseId = null;
let editingYieldId = null;

// Chart instances
let expensesTimeChart = null;
let categoryChart = null;
let cropComparisonChart = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setDefaultDates();
    updateDashboard();
    renderExpensesTable();
    renderYieldsTable();
    renderAnalysisTable();
});

// Set default dates
function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expenseDate').value = today;
    document.getElementById('yieldDate').value = today;
}

// Load data from localStorage
function loadData() {
    const savedExpenses = localStorage.getItem('farmExpenses');
    const savedYields = localStorage.getItem('farmYields');
    
    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
    }
    if (savedYields) {
        yields = JSON.parse(savedYields);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('farmExpenses', JSON.stringify(expenses));
    localStorage.setItem('farmYields', JSON.stringify(yields));
}

// Tab switching
function switchTab(tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    event.target.classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Update graphs if graphs tab is selected
    if (tabName === 'graphs') {
        setTimeout(() => {
            renderCharts();
        }, 100);
    }
}

// Toggle expense form
function toggleExpenseForm() {
    const form = document.getElementById('expenseForm');
    const toggle = document.getElementById('expenseFormToggle');
    const text = document.getElementById('expenseFormText');
    
    if (form.style.display === 'none') {
        form.style.display = 'block';
        toggle.textContent = '✖';
        text.textContent = 'Cancel';
        editingExpenseId = null;
        resetExpenseForm();
    } else {
        form.style.display = 'none';
        toggle.textContent = '➕';
        text.textContent = 'Add Expense';
        editingExpenseId = null;
        resetExpenseForm();
    }
}

// Toggle yield form
function toggleYieldForm() {
    const form = document.getElementById('yieldForm');
    const toggle = document.getElementById('yieldFormToggle');
    const text = document.getElementById('yieldFormText');
    
    if (form.style.display === 'none') {
        form.style.display = 'block';
        toggle.textContent = '✖';
        text.textContent = 'Cancel';
        editingYieldId = null;
        resetYieldForm();
    } else {
        form.style.display = 'none';
        toggle.textContent = '➕';
        text.textContent = 'Add Yield';
        editingYieldId = null;
        resetYieldForm();
    }
}

// Reset expense form
function resetExpenseForm() {
    document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('expenseCrop').value = '';
    document.getElementById('expenseCategory').value = 'Seeds';
    document.getElementById('expenseDescription').value = '';
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseFormTitle').textContent = 'Add New Expense';
    document.getElementById('expenseSubmitText').textContent = 'Add Expense';
}

// Reset yield form
function resetYieldForm() {
    document.getElementById('yieldDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('yieldCrop').value = '';
    document.getElementById('yieldQuantity').value = '';
    document.getElementById('yieldUnit').value = 'kg';
    document.getElementById('yieldPrice').value = '';
    document.getElementById('yieldFormTitle').textContent = 'Add New Yield';
    document.getElementById('yieldSubmitText').textContent = 'Add Yield';
}

// Handle add/update expense
function handleAddExpense() {
    const date = document.getElementById('expenseDate').value;
    const crop = document.getElementById('expenseCrop').value;
    const category = document.getElementById('expenseCategory').value;
    const description = document.getElementById('expenseDescription').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    
    if (!crop || !amount) {
        alert('Please fill in crop name and amount');
        return;
    }
    
    if (editingExpenseId) {
        // Update existing expense
        const index = expenses.findIndex(e => e.id === editingExpenseId);
        expenses[index] = { id: editingExpenseId, date, crop, category, description, amount };
        editingExpenseId = null;
    } else {
        // Add new expense
        const expense = {
            id: Date.now(),
            date,
            crop,
            category,
            description,
            amount
        };
        expenses.push(expense);
    }
    
    saveData();
    updateDashboard();
    renderExpensesTable();
    renderAnalysisTable();
    toggleExpenseForm();
}

// Handle add/update yield
function handleAddYield() {
    const date = document.getElementById('yieldDate').value;
    const crop = document.getElementById('yieldCrop').value;
    const quantity = parseFloat(document.getElementById('yieldQuantity').value);
    const unit = document.getElementById('yieldUnit').value;
    const pricePerUnit = parseFloat(document.getElementById('yieldPrice').value);
    
    if (!crop || !quantity || !pricePerUnit) {
        alert('Please fill in all required fields');
        return;
    }
    
    const totalRevenue = quantity * pricePerUnit;
    
    if (editingYieldId) {
        // Update existing yield
        const index = yields.findIndex(y => y.id === editingYieldId);
        yields[index] = { id: editingYieldId, date, crop, quantity, unit, pricePerUnit, totalRevenue };
        editingYieldId = null;
    } else {
        // Add new yield
        const yieldData = {
            id: Date.now(),
            date,
            crop,
            quantity,
            unit,
            pricePerUnit,
            totalRevenue
        };
        yields.push(yieldData);
    }
    
    saveData();
    updateDashboard();
    renderYieldsTable();
    renderAnalysisTable();
    toggleYieldForm();
}

// Edit expense
function editExpense(id) {
    const expense = expenses.find(e => e.id === id);
    if (!expense) return;
    
    editingExpenseId = id;
    document.getElementById('expenseDate').value = expense.date;
    document.getElementById('expenseCrop').value = expense.crop;
    document.getElementById('expenseCategory').value = expense.category;
    document.getElementById('expenseDescription').value = expense.description;
    document.getElementById('expenseAmount').value = expense.amount;
    
    document.getElementById('expenseForm').style.display = 'block';
    document.getElementById('expenseFormToggle').textContent = '✖';
    document.getElementById('expenseFormText').textContent = 'Cancel';
    document.getElementById('expenseFormTitle').textContent = 'Edit Expense';
    document.getElementById('expenseSubmitText').textContent = 'Update Expense';
}

// Delete expense
function deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        expenses = expenses.filter(e => e.id !== id);
        saveData();
        updateDashboard();
        renderExpensesTable();
        renderAnalysisTable();
    }
}

// Edit yield
function editYield(id) {
    const yieldData = yields.find(y => y.id === id);
    if (!yieldData) return;
    
    editingYieldId = id;
    document.getElementById('yieldDate').value = yieldData.date;
    document.getElementById('yieldCrop').value = yieldData.crop;
    document.getElementById('yieldQuantity').value = yieldData.quantity;
    document.getElementById('yieldUnit').value = yieldData.unit;
    document.getElementById('yieldPrice').value = yieldData.pricePerUnit;
    
    document.getElementById('yieldForm').style.display = 'block';
    document.getElementById('yieldFormToggle').textContent = '✖';
    document.getElementById('yieldFormText').textContent = 'Cancel';
    document.getElementById('yieldFormTitle').textContent = 'Edit Yield';
    document.getElementById('yieldSubmitText').textContent = 'Update Yield';
}

// Delete yield
function deleteYield(id) {
    if (confirm('Are you sure you want to delete this yield record?')) {
        yields = yields.filter(y => y.id !== id);
        saveData();
        updateDashboard();
        renderYieldsTable();
        renderAnalysisTable();
    }
}

// Update dashboard stats
function updateDashboard() {
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalRevenue = yields.reduce((sum, y) => sum + y.totalRevenue, 0);
    const netProfit = totalRevenue - totalExpenses;
    
    document.getElementById('totalExpenses').textContent = `₹${totalExpenses.toFixed(2)}`;
    document.getElementById('totalRevenue').textContent = `₹${totalRevenue.toFixed(2)}`;
    document.getElementById('netProfit').textContent = `₹${netProfit.toFixed(2)}`;
    
    const profitCard = document.getElementById('profitCard');
    const profitLabel = document.getElementById('profitLabel');
    const profitValue = document.getElementById('netProfit');
    
    if (netProfit < 0) {
        profitCard.classList.add('negative');
        profitLabel.style.color = '#c62828';
        profitValue.style.color = '#b71c1c';
    } else {
        profitCard.classList.remove('negative');
        profitLabel.style.color = '#2e7d32';
        profitValue.style.color = '#1b5e20';
    }
}

// Render expenses table
function renderExpensesTable() {
    const tbody = document.getElementById('expensesTableBody');
    
    if (expenses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999; padding: 40px;">No expenses recorded yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = expenses.map(exp => `
        <tr>
            <td>${exp.date}</td>
            <td><strong>${exp.crop}</strong></td>
            <td><span class="category-badge">${exp.category}</span></td>
            <td style="color: #666;">${exp.description}</td>
            <td style="text-align: right; font-weight: 600;">₹${exp.amount.toFixed(2)}</td>
            <td>
                <div class="action-btns">
                    <button class="edit-btn" onclick="editExpense(${exp.id})">✏️</button>
                    <button class="delete-btn" onclick="deleteExpense(${exp.id})">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Render yields table
function renderYieldsTable() {
    const tbody = document.getElementById('yieldsTableBody');
    
    if (yields.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999; padding: 40px;">No yield records yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = yields.map(yld => `
        <tr>
            <td>${yld.date}</td>
            <td><strong>${yld.crop}</strong></td>
            <td style="text-align: right;">${yld.quantity} ${yld.unit}</td>
            <td style="text-align: right;">₹${yld.pricePerUnit.toFixed(2)}</td>
            <td style="text-align: right; font-weight: 600; color: #2e7d32;">₹${yld.totalRevenue.toFixed(2)}</td>
            <td>
                <div class="action-btns">
                    <button class="edit-btn" onclick="editYield(${yld.id})">✏️</button>
                    <button class="delete-btn" onclick="deleteYield(${yld.id})">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Render analysis table
function renderAnalysisTable() {
    const tbody = document.getElementById('analysisTableBody');
    const cropData = getCropAnalysis();
    
    if (cropData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999; padding: 40px;">No data available for analysis</td></tr>';
        return;
    }
    
    tbody.innerHTML = cropData.map(crop => {
        const margin = crop.revenue > 0 ? ((crop.profit / crop.revenue) * 100) : 0;
        const profitColor = crop.profit >= 0 ? '#2e7d32' : '#d32f2f';
        const marginColor = margin >= 0 ? '#2e7d32' : '#d32f2f';
        
        return `
            <tr>
                <td><strong>${crop.crop}</strong></td>
                <td style="text-align: right; color: #d32f2f;">₹${crop.expenses.toFixed(2)}</td>
                <td style="text-align: right; color: #1976d2;">₹${crop.revenue.toFixed(2)}</td>
                <td style="text-align: right; font-weight: 600; color: ${profitColor};">₹${crop.profit.toFixed(2)}</td>
                <td style="text-align: right; font-weight: 600; color: ${marginColor};">${margin.toFixed(1)}%</td>
            </tr>
        `;
    }).join('');
}

// Get crop analysis data
function getCropAnalysis() {
    const cropData = {};
    
    expenses.forEach(exp => {
        if (!cropData[exp.crop]) {
            cropData[exp.crop] = { crop: exp.crop, expenses: 0, revenue: 0, profit: 0 };
        }
        cropData[exp.crop].expenses += exp.amount;
    });
    
    yields.forEach(yld => {
        if (!cropData[yld.crop]) {
            cropData[yld.crop] = { crop: yld.crop, expenses: 0, revenue: 0, profit: 0 };
        }
        cropData[yld.crop].revenue += yld.totalRevenue;
    });
    
    Object.keys(cropData).forEach(crop => {
        cropData[crop].profit = cropData[crop].revenue - cropData[crop].expenses;
    });
    
    return Object.values(cropData);
}

// Get expenses by category
function getExpensesByCategory() {
    const categoryData = {};
    expenses.forEach(exp => {
        if (!categoryData[exp.category]) {
            categoryData[exp.category] = 0;
        }
        categoryData[exp.category] += exp.amount;
    });
    return categoryData;
}

// Get expenses over time
function getExpensesOverTime() {
    const timeData = {};
    expenses.forEach(exp => {
        const month = exp.date.substring(0, 7);
        if (!timeData[month]) {
            timeData[month] = 0;
        }
        timeData[month] += exp.amount;
    });
    return timeData;
}

// Render charts
function renderCharts() {
    renderExpensesTimeChart();
    renderCategoryChart();
    renderCropComparisonChart();
}

// Render expenses over time chart
function renderExpensesTimeChart() {
    const ctx = document.getElementById('expensesTimeChart');
    const timeData = getExpensesOverTime();
    
    if (expensesTimeChart) {
        expensesTimeChart.destroy();
    }
    
    expensesTimeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Object.keys(timeData).sort(),
            datasets: [{
                label: 'Expenses',
                data: Object.keys(timeData).sort().map(month => timeData[month]),
                borderColor: '#2e7d32',
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value;
                        }
                    }
                }
            }
        }
    });
}

// Render category chart
function renderCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    const categoryData = getExpensesByCategory();
    
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    categoryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                label: 'Amount',
                data: Object.values(categoryData),
                backgroundColor: '#2e7d32',
                borderColor: '#1b5e20',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value;
                        }
                    }
                }
            }
        }
    });
}

// Render crop comparison chart
function renderCropComparisonChart() {
    const ctx = document.getElementById('cropComparisonChart');
    const cropData = getCropAnalysis();
    
    if (cropComparisonChart) {
        cropComparisonChart.destroy();
    }
    
    cropComparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: cropData.map(c => c.crop),
            datasets: [
                {
                    label: 'Expenses',
                    data: cropData.map(c => c.expenses),
                    backgroundColor: '#ef5350',
                    borderColor: '#d32f2f',
                    borderWidth: 1
                },
                {
                    label: 'Revenue',
                    data: cropData.map(c => c.revenue),
                    backgroundColor: '#42a5f5',
                    borderColor: '#1976d2',
                    borderWidth: 1
                },
                {
                    label: 'Profit',
                    data: cropData.map(c => c.profit),
                    backgroundColor: '#66bb6a',
                    borderColor: '#2e7d32',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return '₹' + value;
                        }
                    }
                }
            }
        }
    });
}

function exportToCSV() {
    // Ensure jsPDF is properly loaded
    if (!window.jspdf || !window.jspdf.jsPDF) {
        alert('Error: jsPDF library not loaded. Please check your script imports.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    // Basic data calculations
    const cropAnalysis = getCropAnalysis();
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalRevenue = yields.reduce((sum, y) => sum + y.totalRevenue, 0);
    const netProfit = totalRevenue - totalExpenses;

    // Basic layout variables
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    let yPos = 15;

    // Header
    doc.setFontSize(18);
    doc.setTextColor(46, 125, 50); // green
    doc.text("Farm Input Expense Tracker Report", pageWidth / 2, yPos, { align: "center" });

    // Subheader
    yPos += 8;
    doc.setFontSize(11);
    doc.setTextColor(60);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: "center" });

    // Summary section
    yPos += 12;
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Summary", margin, yPos);
    doc.setFontSize(11);
    yPos += 7;
    doc.text(`Total Expenses: ₹${totalExpenses.toFixed(2)}`, margin + 5, yPos);
    yPos += 6;
    doc.text(`Total Revenue: ₹${totalRevenue.toFixed(2)}`, margin + 5, yPos);
    yPos += 6;
    doc.text(`Net Profit: ₹${netProfit.toFixed(2)}`, margin + 5, yPos);

    // Crop Analysis Table
    yPos += 10;
    doc.setFontSize(13);
    doc.text("Crop Analysis", margin, yPos);
    yPos += 5;

    if (cropAnalysis.length > 0) {
        doc.autoTable({
            startY: yPos,
            head: [['Crop', 'Total Expenses', 'Total Revenue', 'Net Profit']],
            body: cropAnalysis.map(c => [
                c.crop,
                `₹${c.expenses.toFixed(2)}`,
                `₹${c.revenue.toFixed(2)}`,
                `₹${c.profit.toFixed(2)}`
            ]),
            theme: 'grid',
            headStyles: { fillColor: [102, 187, 106], textColor: 255 },
            margin: { left: margin },
            styles: { fontSize: 10, cellPadding: 2 }
        });
        yPos = doc.lastAutoTable.finalY + 10;
    } else {
        doc.setFontSize(10);
        doc.text("No crop data available.", margin, yPos);
        yPos += 10;
    }

    // Detailed Expenses Table
    if (yPos > 250) {
        doc.addPage();
        yPos = 20;
    }
    doc.setFontSize(13);
    doc.text("Expense Records", margin, yPos);
    yPos += 5;

    if (expenses.length > 0) {
        doc.autoTable({
            startY: yPos,
            head: [['Date', 'Crop', 'Category', 'Description', 'Amount']],
            body: expenses.map(exp => [
                exp.date,
                exp.crop,
                exp.category,
                exp.description || '-',
                `₹${exp.amount.toFixed(2)}`
            ]),
            theme: 'grid',
            headStyles: { fillColor: [239, 83, 80], textColor: 255 },
            margin: { left: margin },
            styles: { fontSize: 9, cellPadding: 2 }
        });
        yPos = doc.lastAutoTable.finalY + 10;
    } else {
        doc.setFontSize(10);
        doc.text("No expenses recorded.", margin, yPos);
        yPos += 10;
    }

    // Yield Records Table
    if (yPos > 250) {
        doc.addPage();
        yPos = 20;
    }
    doc.setFontSize(13);
    doc.text("Yield Records", margin, yPos);
    yPos += 5;

    if (yields.length > 0) {
        doc.autoTable({
            startY: yPos,
            head: [['Date', 'Crop', 'Quantity', 'Unit', 'Price/Unit', 'Total Revenue']],
            body: yields.map(yld => [
                yld.date,
                yld.crop,
                yld.quantity.toFixed(2),
                yld.unit,
                `₹${yld.pricePerUnit.toFixed(2)}`,
                `₹${yld.totalRevenue.toFixed(2)}`
            ]),
            theme: 'grid',
            headStyles: { fillColor: [33, 150, 243], textColor: 255 },
            margin: { left: margin },
            styles: { fontSize: 9, cellPadding: 2 }
        });
    } else {
        doc.setFontSize(10);
        doc.text("No yield records available.", margin, yPos);
    }

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(100);
    const pages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
        doc.setPage(i);
        doc.text(
            `Page ${i} of ${pages}`,
            pageWidth - margin,
            doc.internal.pageSize.getHeight() - 10,
            { align: "right" }
        );
    }

    // Save the PDF
    doc.save(`Farm_Expense_Report_${new Date().toISOString().split("T")[0]}.pdf`);
}
