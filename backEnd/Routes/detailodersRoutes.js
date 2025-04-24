const express = require("express");
const router = express.Router();
const detailOdersControllers = require("../Controllers/detailOdersControllers");

router.get("/:MaDonHang/details", detailOdersControllers.getOrderDetails);

router.post("/:MaDonHang/add-detail", detailOdersControllers.addOrderDetail);

router.put("/:MaDonHang/update-detail", detailOdersControllers.updateOrderDetail);

router.delete("/:MaDonHang/remove-detail", detailOdersControllers.removeOrderDetail);

router.delete("/:MaDonHang/clear-details", detailOdersControllers.clearOrderDetails);

module.exports = router;
