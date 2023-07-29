const mongoose = require("mongoose");

const itemSchema = require("./item-schema");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referencing the User model
      required: [true, "Please provide a user id associated with this review"],
    },
    products: [itemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
