const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/ordersControllers.js'); // Sửa tên controller cho rõ ràng

// Định tuyến
// Lấy tất cả đơn hàng
router.get('/', orderController.getAllOrders);

// Lấy đơn hàng theo MaDonHang
router.get('/:MaDonHang', orderController.getOrderById);

// Lấy danh sách đơn hàng theo MaNguoiDung
router.get('/user/:MaNguoiDung', orderController.getOrdersByUser);

// Tạo đơn hàng mới
router.post('/', orderController.createOrder);

// Cập nhật trạng thái đơn hàng
router.put('/:MaDonHang/status', orderController.updateOrderStatus);

// Xóa đơn hàng
router.delete('/:MaDonHang', orderController.deleteOrder);

// Lấy chi tiết đơn hàng theo MaDonHang
router.get('/:MaDonHang/details', orderController.getOrderDetails);

module.exports = router;