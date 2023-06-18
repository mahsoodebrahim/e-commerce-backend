const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/review-controller");
const { isAuthenticated } = require("../middleware/auth-middleware");

router.get("/", reviewController.getAllReviews);
router.get("/:reviewId", reviewController.getSingleReview);

router.post("/", isAuthenticated, reviewController.createReview);

router.patch("/:reviewId", isAuthenticated, reviewController.updateReview);

router.delete("/:reviewId", isAuthenticated, reviewController.deleteReview);

module.exports = router;
