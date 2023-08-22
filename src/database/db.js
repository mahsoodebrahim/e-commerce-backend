const mongoose = require("mongoose");

exports.connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);
    console.log("Connected to the database!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};
