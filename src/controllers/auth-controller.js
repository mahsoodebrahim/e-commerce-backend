const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const UrlSafeString = require("url-safe-string"),
  tagGenerator = new UrlSafeString();

const User = require("../models/user-model");
const TokenDenylist = require("../models/token-denylist-model");
const Errors = require("../errors");
const authUtils = require("../utils/auth-utils");

exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new Errors.BadRequestError(
      "Name, email, password not provided. Please ensure all required fields are provided."
    );
  }

  const emailConfirmationToken = tagGenerator.generate(
    randomstring.generate(10)
  ); // Generate a random URL-safe string of length 10
  const hashedEmailConfirmationToken = bcrypt.hashSync(
    emailConfirmationToken,
    +process.env.SALT_ROUNDS
  ); // Hash the random string using bcrypt
  const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);

  const newUser = {
    name,
    email,
    password: hashedPassword,
    emailConfirmationToken: hashedEmailConfirmationToken,
  };

  const createdUser = await User.create(newUser);

  const encodedHashedEmailConfirmationToken = encodeURIComponent(
    hashedEmailConfirmationToken
  ); // Encode the hashed string to make it safe for URL usage

  await authUtils.sendConfirmationEmail(
    email,
    encodedHashedEmailConfirmationToken
  );

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

exports.logout = async (req, res, next) => {
  const token = req.get("Authorization").slice(7);

  // Add the token to the blacklist
  await TokenDenylist.create({ token: token });

  res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
};

exports.verify = async (req, res, next) => {
  const hashedConfirmationToken = req.query.id;

  if (!hashedConfirmationToken) {
    throw new Errors.BadRequestError("Query parameter (id) not provided");
  }

  // Decode the hashed query parameter
  const decodedHashedConfirmationToken = decodeURIComponent(
    hashedConfirmationToken
  );

  const userWithThisConfirmationToken = await User.findOne({
    emailConfirmationToken: decodedHashedConfirmationToken,
  });

  if (!userWithThisConfirmationToken) {
    throw new Errors.BadRequestError("Invalid query parameter (id) provided");
  }

  // At this point the user is registered, the 'emailConfirmationToken' property is
  // removed as it is no longer needed and the 'active' property is set to true
  userWithThisConfirmationToken.emailConfirmationToken = undefined;
  userWithThisConfirmationToken.active = true;

  await userWithThisConfirmationToken.save();

  res.json({
    message: "User successfully registered!",
  });
};
