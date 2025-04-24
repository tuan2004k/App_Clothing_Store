const express = require('express');
const router = express.Router();
const ordersControllers = require('../Controllers/ordersControllers.js'); // Gọi controller

// Định tuyến
router.get('/', ordersControllers.getAllOrders);
router.get('/:MaDonHang', ordersControllers.getOrderById);
router.get('/NguoiDung/:MaNguoiDung', ordersControllers.getOrdersByUser);
router.post('/', ordersControllers.createOrder);
router.put('/:MaDonHang', ordersControllers.updateOrderStatus);
router.delete('/:MaDonHang', ordersControllers.deleteOrder);

module.exports = router;
