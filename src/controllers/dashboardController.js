const asyncHandler = require('../utils/asyncHandler');
const dashboardService = require('../services/dashboardService');

const getStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getDashboardStats(req.query);
  res.status(200).json({
    success: true,
    message: 'Dashboard stats fetched successfully',
    data: stats,
  });
});

module.exports = {
  getStats,
};
