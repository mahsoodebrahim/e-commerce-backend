const { NotFoundError } = require("../errors");

const notFoundHandler = (req, res, next) => {
  throw new NotFoundError("Not Found");
};

module.exports = notFoundHandler;
