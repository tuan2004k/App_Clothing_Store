const express = require('express');
const router = express.Router();
const checkoutController = require('../Controllers/checkoutControllers');

// Routes cho Thanh Toán
router.get('/', checkoutController.getAllcheckouts); // Lấy tất cả thanh toán
router.get('/:MaThanhToan', checkoutController.getcheckoutById); // Lấy thanh toán theo ID
router.get('/donhang/:MaDonHang', checkoutController.getcheckoutsByOrder); // Lấy thanh toán theo đơn hàng
router.post('/', checkoutController.addNewCheckout); // Thêm thanh toán mới
router.put('/:MaThanhToan', checkoutController.updateCheckoutStatus); // Cập nhật trạng thái thanh toán
router.delete('/:MaThanhToan', checkoutController.deletecheckout); // Xóa thanh toán

module.exports = router;