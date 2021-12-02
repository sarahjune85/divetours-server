// const fs = require("fs");
const Tour = require("./../models/tourModel");
const catchAsync = require("./../utils/catchAsync");

//GET all tours: exports. to export functions
exports.getAllTours = catchAsync(async (req, res, next) => {
  // BUILD query:
  // query filter - filter out page/sort/limit/fields:
  const queryObj = { ...req.query }; // destructure object
  const excludedFields = ["page", "sort", "limit", "fields"]; // array of fields to exclude
  excludedFields.forEach((field) => delete queryObj[field]); // delete em
  // console.log(req.query, queryObj); //example

  // ADVANCED filtering:
  let queryStr = JSON.stringify(queryObj); // let to allow mutate
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // regexp
  console.log(JSON.parse(queryStr));
  // { duration: 'easy', page: '2', sort: '1' }

  let query = Tour.find(JSON.parse(queryStr)); // stored query obj in mutatable variable

  // SORTING:
  // if sort param exists, sort by:
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" "); // multiple query fields
    console.log(sortBy);
    query = query.sort(req.query.sort);
  }

  // FIELD limiting:
  // limit fields returned by selection:
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  } else {
    query = query.select("-__v"); //exclude __v field
  }

  // EXECUTE query:
  const tours = await query;

  // SEND RESPONSE
  res.status(200).json({
    status: "OK",
    results: tours.length,
    data: { tours },
  });
});

//GET single tour:
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id); // mongoose method
  // Tour.findOne({ _id: req.params.id })
  res.status(200).json({
    status: "OK",
    data: { tour },
  });
});

//POST - use async for create method
exports.createTour = catchAsync(async (req, res, next) => {
  // call create method on model and save to new variable on promise return:
  const newTour = await Tour.create(req.body);

  // 201 = created
  res.status(201).json({
    status: "OK!",
    data: {
      tour: newTour,
    },
  });
});

//PATCH
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // return modified doc rather than original - mongoose
    runValidators: true, // validates update against schema - mongoose
  });
  res.status(200).json({
    status: "OK",
    data: {
      tour,
    },
  });
});

//DELETE
exports.deleteTour = catchAsync(async (req, res, next) => {
  // no need to send back data with delete ops:
  await Tour.findByIdAndDelete(req.params.id);

  // 204 response on success = no content
  res.status(204).json({
    status: "OK",
    data: null,
  });
});
