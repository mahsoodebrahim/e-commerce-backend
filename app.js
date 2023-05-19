require("dotenv").config();
const express = require("express");
require("express-async-errors");
const mongoose = require("mongoose");

const { errorHandler } = require("./src/middleware/error-handling-middleware");

const authRoutes = require("./src/routes/auth-routes");

const app = express();

// Middleware
app.use(express.json()); // for parsing application/json

// Routing
app.use("/auth", authRoutes);

app.get("/", (req, res, next) => {
  const error = new Error("THIS IS THE ERROR MESSAGE");
  error.statusCode = 500;
  next(error);
});

// Error handling middleware
app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(3000, async () => {
  await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);
  console.log(`Listening on port ${port}`);
});
