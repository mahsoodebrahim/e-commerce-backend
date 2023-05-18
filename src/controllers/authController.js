const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");

exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.send("Did not provide name or email or password");
  }

  const isExistingUser = await User.findOne({ email: email });
  if (isExistingUser) {
    return res.send("User already exists");
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);
    let newUser = { name, email, password: hashedPassword };
    newUser = await User.create(newUser);

    res.status(StatusCodes.CREATED).json({
      msg: "User created successfully",
      user: newUser, // TODO: remove this as the user data should not be sent back
    });
  } catch (error) {
    if (error.code === 11000) {
      // 11000: This is the error code associated with a duplicate key error in MongoDB.
      res.json({ msg: "User with that email already exists" });
    } else {
      res.json({ msg: "Unable to register user", error: error });
    }
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send("Did not provide email or password");
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Invalid email or password" });
  }

  const isSamePassword = bcrypt.compareSync(password, user.password);

  if (!isSamePassword) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "password" });
  }

  const jwtData = { role: user.role, email };
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
