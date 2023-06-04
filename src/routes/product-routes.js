const express = require("express");
const router = express.Router();

const productController = require("../controllers/product-controller");

router.get("/", productController.getAllProducts);
router.get("/:productId/reviews", productController.getSingleProductReviews);
router.get("/:productId", productController.getSingleProduct);

router.post("/", productController.createProduct);
router.post("/uploadImage", productController.uploadImage);

router.patch("/:productId", productController.updateProduct);

router.delete("/:productId", productController.deleteProduct);

module.exports = router;
