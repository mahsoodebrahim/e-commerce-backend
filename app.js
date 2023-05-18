require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./src/routes/authRoutes");

const app = express();

// Middleware
app.use(express.json()); // for parsing application/json

// Routing
app.use("/auth", authRoutes);

app.get("/", (req, res, next) => {
  res.status(200).json({ msg: "Hello World" });
});

const port = process.env.PORT || 3000;

app.listen(3000, async () => {
  await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);
  console.log(`Listening on port ${port}`);
});
