const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cart-controller");
const {
  isAuthenticated,
  isAuthorized,
} = require("../middleware/auth-middleware");

router.use(isAuthenticated);

router.get("/", cartController.getCart);
router.get("/:cartId", cartController.getCartWithId);

router.post("/", cartController.createCart);
router.post("/products/:productId", cartController.addProductToCart);

router.patch("/products/:productId", cartController.updateProductQuantity);

router.delete("/products/:productId", cartController.removeProductFromCart);
router.delete("/:cartId", cartController.clearCart);

module.exports = router;
