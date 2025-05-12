const express = require('express');
const router = express.Router();
const feedbackController = require('../Controllers/feedbackControllers');

// Routes cho Đánh Giá
router.get('/', feedbackController.getAllfeedbacks); // Lấy tất cả đánh giá
router.get('/SanPham/:MaSanPham', feedbackController.getfeedbacksByProduct); // Lấy đánh giá theo sản phẩm
router.post('/', feedbackController.addfeedback); // Thêm đánh giá
router.put('/:MaDanhGia', feedbackController.updatefeedback); // Cập nhật đánh giá
router.delete('/:MaDanhGia', feedbackController.deletefeedback); // Xóa đánh giá

module.exports = router;