const mongoose = require("mongoose");

const itemSchema = require("./item-schema");

const orderSchema = new mongoose.Schema(
  {
    items: [itemSchema],
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
