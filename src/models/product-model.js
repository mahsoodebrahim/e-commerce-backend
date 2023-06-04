const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a product name"],
    trim: true,
    maxlength: [100, "Name must not be more than 100 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please provide a price"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
    maxlength: [1000, "Description must be less than 1000 characters"],
  },
  image: {
    type: String,
    default: "/uploads/example.png",
  },
  inventory: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: [true, "Please provide a product category"],
    enum: ["office", "kitchen", "bedroom"],
  },
  company: {
    type: String,
    required: [true, "Please provide a company"],
    enum: {
      values: [
        "West Elm",
        "Maiden Home",
        "Burrow",
        "Wayfair",
        "Amazon",
        "Etsy",
      ],
      message: "{VALUE} is not a supported company",
    },
  },
  colors: {
    type: [String],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  freeShipping: {
    type: Boolean,
    default: false,
  },
  inventory: {
    type: Number,
    required: true,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Referencing the User model
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
