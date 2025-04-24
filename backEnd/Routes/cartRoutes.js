const express = require("express");
const router = express.Router();
const cartControllers = require("../Controllers/cartControllers");

router.get("/:MaNguoiDung", cartControllers.getCart);
router.post("/add", cartControllers.addToCart);
router.put("/update", cartControllers.updateCart);
router.delete("/remove", cartControllers.removeFromCart);
router.delete("/clear/:MaNguoiDung", cartControllers.clearCart);
router.post("/checkout", cartControllers.checkout);

module.exports = router;
