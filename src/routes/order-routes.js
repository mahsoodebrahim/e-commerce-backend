const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order-controller");
const {
  isAuthenticated,
  isAuthorized,
} = require("../middleware/auth-middleware");

router.use(isAuthenticated);

router.get("/", isAuthorized, orderController.getAllOrders);
router.get("/currentUserOrders", orderController.getCurrentUserOrders);
router.get("/:id", orderController.getSingleOrder);

router.post("/", orderController.createOrder);

router.patch("/:id", orderController.updateOrder);

module.exports = router;
