const FinancialRecord = require('../models/FinancialRecord');

const buildDateMatch = (query) => {
  const match = { isDeleted: false };

  if (query.startDate || query.endDate) {
    match.date = {};
    if (query.startDate) match.date.$gte = query.startDate;
    if (query.endDate) match.date.$lte = query.endDate;
  }

  return match;
};

const getDashboardStats = async (query) => {
  const match = buildDateMatch(query);

  const [totals, categoryTotals, recentActivity, monthlyTrends] = await Promise.all([
    FinancialRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$type',
          total: { $sum: { $toDouble: '$amount' } },
        },
      },
    ]),
    FinancialRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          total: { $sum: { $toDouble: '$amount' } },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id.category',
          type: '$_id.type',
          total: 1,
        },
      },
      { $sort: { total: -1 } },
    ]),
    FinancialRecord.find(match)
      .select('amount type category date notes createdBy')
      .populate('createdBy', 'name email role')
      .sort({ date: -1, createdAt: -1 })
      .limit(5),
    FinancialRecord.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          income: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, { $toDouble: '$amount' }, 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ['$type', 'expense'] }, { $toDouble: '$amount' }, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          income: 1,
          expense: 1,
          net: { $subtract: ['$income', '$expense'] },
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]),
  ]);

  const totalIncome = totals.find((item) => item._id === 'income')?.total || 0;
  const totalExpenses = totals.find((item) => item._id === 'expense')?.total || 0;

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    categoryWiseTotals: categoryTotals,
    recentActivity,
    monthlyTrends,
  };
};

module.exports = {
  getDashboardStats,
};
