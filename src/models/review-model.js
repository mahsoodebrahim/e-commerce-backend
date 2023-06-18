const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [100, "Title must not be more than 100 characters"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide a rating"],
    },
    comment: {
      type: String,
      maxlength: [1000, "Comment must be less than 1000 characters"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Referencing the Product model
      required: [true, "Please provide the product id this review is for"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referencing the User model
      required: [true, "Please provide a user id associated with this review"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
