const express = require('express');
const userController = require('./../controllers/userController');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('./../controllers/userController');

// ROUTES
// custom router for each resource using middleware:
// when URL hits target, runs UserRouter - 'mounting' a router.

const router = express.Router();

//chain requests to send back to mounted router:
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
