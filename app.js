require("dotenv").config();
const express = require("express");
require("express-async-errors");
const mongoose = require("mongoose");

const errorHandler = require("./src/middleware/error-handling-middleware");
const notFoundHandler = require("./src/middleware/not-found-middleware");

const authRoutes = require("./src/routes/auth-routes");
const userRoutes = require("./src/routes/user-routes");
const productRoutes = require("./src/routes/product-routes");
const reviewRoutes = require("./src/routes/review-routes");
const cartRoutes = require("./src/routes/cart-routes");
const orderRoutes = require("./src/routes/order-routes");

const app = express();

// Middleware
app.use(express.static("src/uploads")); // Serving static files
app.use(express.json()); // for parsing application/json

// Routing
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/reviews", reviewRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

app.get("/", (req, res, next) => {
  const error = new Error("THIS IS THE ERROR MESSAGE");
  error.statusCode = 500;
  next(error);
});

app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(3000, async () => {
  await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);
  console.log(`Listening on port ${port}`);
});
