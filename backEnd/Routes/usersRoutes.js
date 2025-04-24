const express = require('express');
const router = express.Router();
const usersControllers = require('../Controllers/usersControllers'); // Gọi controller

// Định tuyến
router.post('/register', usersControllers.registerUser);
router.post('/login', usersControllers.loginUser);
router.get('/', usersControllers.getAllUsers);
router.get('/:MaNguoiDung', usersControllers.getUserById);
router.put('/:MaNguoiDung', usersControllers.updateUser);
router.delete('/:MaNguoiDung', usersControllers.deleteUser);

module.exports = router;
