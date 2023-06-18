const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");

const Review = require("../models/review-model");
const Errors = require("../errors");

// TODO: Add pagination to all the "getAll" routes
exports.getAllReviews = async (req, res, next) => {
  const reviews = await Review.find({});

  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
  // res.send("getAllReviews");
};

exports.getSingleReview = async (req, res, next) => {
  const { reviewId } = req.params;

  // TODO: Create a static method to do this?
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new Errors.BadRequestError(`Invalid review id: ${reviewId}`);
  }

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new Errors.NotFoundError(`Review with ${reviewId} does not exist`);
  }

  res.status(StatusCodes.OK).json({ review });
};

exports.createReview = async (req, res, next) => {
  const review = await Review.create(req.body);

  res.status(StatusCodes.CREATED).json({ review });
};

exports.updateReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const { title: newTitle, rating: newRating, comment: newComment } = req.body;

  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new Errors.BadRequestError(`Invalid review id: ${reviewId}`);
  }

  // TODO: There must be a cleaner way to update documents? --> Research
  // Maybe just create a helper function, either a static method or instance method or a middleware or a utility function
  const updatedAttributes = {};
  if (newTitle) updatedAttributes.title = newTitle;
  if (newRating) updatedAttributes.rating = newRating;
  if (newComment) updatedAttributes.comment = newComment;

  const updatedReview = await Review.findByIdAndUpdate(
    reviewId,
    updatedAttributes,
    { runValidators: true, new: true }
  );

  res.status(StatusCodes.OK).json({ review: updatedReview });
};

// TODO: Ensure a review exists before deleting it
// Do this for other delete controllers as well
exports.deleteReview = async (req, res, next) => {
  const { reviewId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new Errors.BadRequestError(`Invalid review id: ${reviewId}`);
  }

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new Errors.BadRequestError(
      `Review does not exist with id: ${reviewId}`
    );
  }

  await Review.findByIdAndDelete(reviewId);

  res
    .status(StatusCodes.OK)
    .json({ msg: `Successfully deleted review with id: ${reviewId}` });
};
