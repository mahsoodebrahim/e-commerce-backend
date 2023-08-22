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

// Not Found middleware
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

module.exports = app;
