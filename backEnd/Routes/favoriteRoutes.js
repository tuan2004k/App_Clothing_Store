const express = require('express');
const router = express.Router();
const favoriteController = require('../Controllers/favoriteControllers');

// Routes cho Yêu Thích
router.get('/', favoriteController.getAllFavorites); // Lấy tất cả yêu thích
router.get('/NguoiDung/:MaNguoiDung', favoriteController.getFavoritesByUser); // Lấy yêu thích theo người dùng
router.post('/', favoriteController.addFavorite); // Thêm yêu thích
router.delete('/:MaYeuThich', favoriteController.deleteFavorite); // Xóa yêu thích

module.exports = router;