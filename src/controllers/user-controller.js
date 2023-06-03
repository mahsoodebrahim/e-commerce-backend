const User = require("../models/user-model");
const { StatusCodes } = require("http-status-codes");

exports.getAllUsers = async (req, res) => {
  const users = await User.find({});

  res.status(StatusCodes.OK).json({ users });
};

exports.getCurrentUser = (req, res) => {
  res.send("getCurrentUser");
};

exports.getSingleUser = (req, res) => {
  res.send("getSingleUser");
};

exports.updateUser = (req, res) => {
  res.send("updateUser");
};

exports.updateUserPassword = (req, res) => {
  res.send("updateUserPassword");
};
