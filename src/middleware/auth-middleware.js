const jwt = require("jsonwebtoken");

const Errors = require("../errors");

exports.isAuthenticated = (req, res, next) => {
  const authorizationHeader = req.get("Authorization");

  // Handle missing or invalid authorization header
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new Errors.UnauthorizedError("JWT not provided");
  }

  const token = authorizationHeader.slice(7); // Extract token without the "Bearer " prefix

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user information to the request object
    next();
  } catch (err) {
    let errMessage = err.message;

    if (err.name === "TokenExpiredError") {
      errMessage = "Expired JWT token";
    }

    throw new Errors.UnauthorizedError(errMessage);
  }
};
