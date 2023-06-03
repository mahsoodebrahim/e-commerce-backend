const express = require("express");
const router = express.Router();

const userController = require("../controllers/user-controller");
const {
  isAuthenticated,
  isAuthorized,
} = require("../middleware/auth-middleware");

router.use(isAuthenticated); // Must be authenticated to access any of these routes

router.get("/", isAuthorized, userController.getAllUsers); // Only admin user should be able to access this route
router.get("/currentUser", userController.getCurrentUser);
router.get("/:userId", userController.getSingleUser);

router.patch("/updateUser", userController.updateUser);
router.patch("/updateUserPassword", userController.updateUserPassword);

module.exports = router;
