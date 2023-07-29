const CustomError = require("./custom-error");
const { StatusCodes } = require("http-status-codes");

class InternalServerError extends CustomError {
  constructor(message) {
    super(message, StatusCodes.InternalServerError);
  }
}

module.exports = InternalServerError;
