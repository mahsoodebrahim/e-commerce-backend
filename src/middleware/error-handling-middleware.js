const { StatusCodes } = require("http-status-codes");

exports.errorHandler = (err, req, res, next) => {
  let message = err.message || "Something went wrong, please try again later";
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  // 11000: This is the error code associated with a duplicate key error in MongoDB.
  if (err.code === 11000) {
    message = "User with that email already exists";
    statusCode = StatusCodes.CONFLICT;
  }

  res.status(statusCode).json({ errorMsg: message });
};
