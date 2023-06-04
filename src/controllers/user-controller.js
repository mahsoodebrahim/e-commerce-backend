const bcrypt = require("bcrypt");

const User = require("../models/user-model");
const { StatusCodes } = require("http-status-codes");

exports.getAllUsers = async (req, res) => {
  const users = await User.find({});

  res.status(StatusCodes.OK).json({ users });
};

exports.getCurrentUser = async (req, res) => {
  const authenticatedUserId = req.user.id;

  const user = await User.findById(authenticatedUserId).select("-password");

  res.status(StatusCodes.OK).json({ user });
};

exports.getSingleUser = async (req, res) => {
  const userId = req.params.userId;

  const user = await User.findById(userId).select("-password");

  res.status(StatusCodes.OK).json({ user });
};

exports.updateUser = async (req, res) => {
  const authenticatedUserId = req.user.id;
  const { email: updatedEmail, name: updatedName } = req.body;

  const updatedAttributes = {};
  if (updatedEmail) updatedAttributes.email = updatedEmail;
  if (updatedName) updatedAttributes.name = updatedName;

  const updatedUser = await User.findByIdAndUpdate(
    authenticatedUserId,
    updatedAttributes,
    { runValidators: true, new: true }
  ).select("-password");

  res
    .status(StatusCodes.OK)
    .json({ user: updatedUser, msg: "Successfully updated user" });
};

exports.updateUserPassword = async (req, res) => {
  const authenticatedUserId = req.user.id;

  const { password: updatedPassword } = req.body;

  // TODO: User must provide previous password before changing the password

  // TODO: Add method to user-model to hash password so that this log is not duplicated
  const hashedUpdatedPassword = bcrypt.hashSync(
    updatedPassword,
    +process.env.SALT_ROUNDS
  );

  const updatedUser = await User.findByIdAndUpdate(
    authenticatedUserId,
    { password: hashedUpdatedPassword },
    { runValidators: true, new: true }
  ).select("-password");

  res
    .status(StatusCodes.OK)
    .json({ user: updatedUser, msg: "Successfully updated user password" });
};
