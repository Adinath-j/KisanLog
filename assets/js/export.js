function exportToCSV() {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert("Error: jsPDF not loaded.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const cropAnalysis = getCropAnalysis();
  const totalExpenses = window.expenses.reduce((s, e) => s + e.amount, 0);
  const totalRevenue = window.yields.reduce((s, y) => s + y.totalRevenue, 0);
  const netProfit = totalRevenue - totalExpenses;

  doc.setFontSize(18);
  doc.text("Farm Input Expense Tracker Report", 105, 15, { align: "center" });

  doc.setFontSize(11);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 23, { align: "center" });

  doc.text(`Total Expenses: ₹${totalExpenses.toFixed(2)}`, 10, 35);
  doc.text(`Total Revenue: ₹${totalRevenue.toFixed(2)}`, 10, 42);
  doc.text(`Net Profit: ₹${netProfit.toFixed(2)}`, 10, 49);

  doc.autoTable({
    startY: 60,
    head: [["Crop", "Expenses", "Revenue", "Profit"]],
    body: cropAnalysis.map(c => [
      c.crop,
      `₹${c.expenses.toFixed(2)}`,
      `₹${c.revenue.toFixed(2)}`,
      `₹${c.profit.toFixed(2)}`
    ])
  });

  doc.save(`Farm_Expense_Report_${new Date().toISOString().split("T")[0]}.pdf`);
}
