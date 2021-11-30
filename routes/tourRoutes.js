const express = require('express');
// const tourController = require('./../controllers/tourController');
// alternative import:
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkID,
  checkBody,
} = require('./../controllers/tourController');

// ROUTES
// custom router for each resource using middleware:
// when URL hits target, runs router - 'mounting' a router.

const router = express.Router();

///////////// MIDDLEWARE STACK: order is important.
// middleware function:
// router.param('id', checkID); // not used for MongoDB, just testing

//chain requests to send back to mounted router:
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
