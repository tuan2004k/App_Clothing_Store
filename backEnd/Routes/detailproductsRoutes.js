const express = require('express');
const router = express.Router();
const detailProductControllers = require('../Controllers/detailProductControllers');

// Định ngCĩa các route
router.post('/', detailProductControllers.createProductDetail);
router.get('/', detailProductControllers.getAllProductDetails);
router.get('/:MaSanPham', detailProductControllers.getProductDetailsByProductId);
router.put('/:MaChiTietSanPham', detailProductControllers.updateProductDetail);
router.delete('/:MaChiTietSanPham', detailProductControllers.deleteProductDetail);

module.exports = router;
