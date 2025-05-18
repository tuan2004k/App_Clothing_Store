const express = require('express');
const router = express.Router();
const AdminController = require('../Controllers/AdminDashBoardControllers');

// Routes cho AdminDashboard
router.get('/chart-data', AdminController.getChartData);
router.get('/revenue-over-time', AdminController.getRevenueOverTime);
router.get('/order-status', AdminController.getOrderStatus);
router.get('/average-rating-by-category', AdminController.getAverageRatingByCategory);

module.exports = router;