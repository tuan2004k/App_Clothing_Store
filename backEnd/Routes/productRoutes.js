const express = require('express');
const router = express.Router();
const productControllers = require('../Controllers/productControllers.js');


router.post('/', productControllers.addProduct);
router.get('/', productControllers.getAllProducts);
router.get('/:MaSanPham', productControllers.getProductById);
router.put('/:MaSanPham', productControllers.updateProduct);
router.delete('/:MaSanPham', productControllers.deleteProduct);
router.get('/DanhMuc/:MaDanhMuc', productControllers.getProductsByCategory);
router.get('/Gia', productControllers.getProductsByPrice);
router.post('/ChiTietSanPham', productControllers.addProductDetail);
router.get('/DanhMuc', productControllers.getAllCategories);

module.exports = router;
