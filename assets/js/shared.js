window.getCropAnalysis = function () {
  const cropData = {};
  (window.expenses || []).forEach(exp => {
    if (!cropData[exp.crop]) cropData[exp.crop] = { crop: exp.crop, expenses: 0, revenue: 0, profit: 0 };
    cropData[exp.crop].expenses += exp.amount;
  });
  (window.yields || []).forEach(yld => {
    if (!cropData[yld.crop]) cropData[yld.crop] = { crop: yld.crop, expenses: 0, revenue: 0, profit: 0 };
    cropData[yld.crop].revenue += yld.totalRevenue;
  });
  Object.keys(cropData).forEach(c => {
    cropData[c].profit = cropData[c].revenue - cropData[c].expenses;
  });
  return Object.values(cropData);
};
