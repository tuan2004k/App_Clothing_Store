const express = require('express');
const router = express.Router();
const categoryControllers = require('../Controllers/categoryControllers.js');

// Định nghĩa các route và gọi controller
router.post('/', categoryControllers.createCategory);
router.get('/', categoryControllers.getAllCategories);
router.get('/:MaDanhMuc', categoryControllers.getCategoryById);
router.put('/:MaDanhMuc', categoryControllers.updateCategory);
router.delete('/:MaDanhMuc', categoryControllers.deleteCategory);

module.exports = router;
