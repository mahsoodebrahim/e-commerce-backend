const express = require("express");
const router = express.Router();

const productController = require("../controllers/product-controller");
const imageUploadMiddlwr = require("../middleware/image-upload-middleware");
const {
  isAuthenticated,
  isAuthorized,
} = require("../middleware/auth-middleware");

router.get("/", productController.getAllProducts);
router.get("/:productId/reviews", productController.getSingleProductReviews);
router.get("/:productId", productController.getSingleProduct);

router.post(
  "/",
  isAuthenticated,
  isAuthorized,
  productController.createProduct
);
router.post(
  "/:productId/image",
  isAuthenticated,
  isAuthorized,
  imageUploadMiddlwr,
  productController.uploadImage
);

router.patch(
  "/:productId",
  isAuthenticated,
  isAuthorized,
  productController.updateProduct
);

router.delete(
  "/:productId",
  isAuthenticated,
  isAuthorized,
  productController.deleteProduct
);

module.exports = router;
