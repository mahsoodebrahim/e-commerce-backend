const express = require("express");

const authRoutes = require("./src/routes/authRoutes");

const app = express();

app.use("/auth", authRoutes);

app.get("/", (req, res, next) => {
  res.status(200).json({ msg: "Hello World" });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
