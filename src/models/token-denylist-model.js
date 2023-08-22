const mongoose = require("mongoose");

const tokenDenylistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Please provide a token"],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TokenDenylist", tokenDenylistSchema);
