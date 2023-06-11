const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/review-controller");
// const {
//   isAuthenticated,
//   isAuthorized,
// } = require("../middleware/auth-middleware");

router.get("/", reviewController.getAllReviews);
router.get("/:reviewId", reviewController.getSingleReview);

router.post("/", reviewController.createReview);

router.patch("/:productId", reviewController.updateReview);

router.delete("/:productId", reviewController.deleteReview);

module.exports = router;
