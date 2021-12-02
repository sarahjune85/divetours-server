const express = require("express");
// const userController = require('./../controllers/userController');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require("./../controllers/userController");
const authController = require("./../controllers/authController");

// ROUTES
// custom router for each resource using middleware:
// when URL hits target, runs UserRouter - 'mounting' a router.

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

//chain requests to send back to mounted router:
router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
