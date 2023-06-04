const User = require("../models/user-model");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");

const Errors = require("../errors");

exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new Errors.BadRequestError(
      "Name, email, password not provided. Please ensure all required fields are provided."
    );
  }

  const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);

  const newUser = { name, email, password: hashedPassword };

  const createdUser = await User.create(newUser);

  res.status(StatusCodes.CREATED).json({
    msg: "User created successfully",
    user: createdUser, // TODO: remove this as the user data should not be sent back
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Errors.BadRequestError(
      "Email or password not provided. Please ensure all required fields are provided."
    );
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    throw new Errors.NotFoundError("Invalid email or password");
  }

  const isSamePassword = bcrypt.compareSync(password, user.password);

  if (!isSamePassword) {
    throw new Errors.NotFoundError(
      "Invalid email or password (Password error REMOVE THIS LATER, ONLY FOR TESTING)"
    );
  }

  const jwtData = { role: user.role, id: user._id };
  const token = jwt.sign(jwtData, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  res
    .status(StatusCodes.OK)
    .json({ msg: "Successfully logged in", token: token });
};

exports.logout = (req, res, next) => {
  res.send("logout");
};
