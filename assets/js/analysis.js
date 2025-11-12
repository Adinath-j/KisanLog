function renderAnalysisTable() {
  const tbody = document.getElementById("analysisTableBody");
  const cropData = getCropAnalysis();

  if (cropData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#999; padding:40px;">No data available for analysis</td></tr>`;
    return;
  }

  tbody.innerHTML = cropData
    .map(crop => {
      const margin = crop.revenue > 0 ? ((crop.profit / crop.revenue) * 100).toFixed(1) : 0;
      const profitColor = crop.profit >= 0 ? "#2e7d32" : "#d32f2f";
      const marginColor = margin >= 0 ? "#2e7d32" : "#d32f2f";
      return `
        <tr>
          <td><strong>${crop.crop}</strong></td>
          <td style="text-align:right; color:#d32f2f;">₹${crop.expenses.toFixed(2)}</td>
          <td style="text-align:right; color:#1976d2;">₹${crop.revenue.toFixed(2)}</td>
          <td style="text-align:right; font-weight:600; color:${profitColor};">₹${crop.profit.toFixed(2)}</td>
          <td style="text-align:right; font-weight:600; color:${marginColor};">${margin}%</td>
        </tr>`;
    })
    .join("");
}

function getCropAnalysis() {
  const cropData = {};
  window.expenses.forEach(exp => {
    if (!cropData[exp.crop]) cropData[exp.crop] = { crop: exp.crop, expenses: 0, revenue: 0, profit: 0 };
    cropData[exp.crop].expenses += exp.amount;
  });
  window.yields.forEach(yld => {
    if (!cropData[yld.crop]) cropData[yld.crop] = { crop: yld.crop, expenses: 0, revenue: 0, profit: 0 };
    cropData[yld.crop].revenue += yld.totalRevenue;
  });
  Object.keys(cropData).forEach(c => (cropData[c].profit = cropData[c].revenue - cropData[c].expenses));
  return Object.values(cropData);
}
window.renderAnalysisTable = renderAnalysisTable;
document.addEventListener("DOMContentLoaded", renderAnalysisTable);
