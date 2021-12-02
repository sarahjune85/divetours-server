const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const ApiError = require("./../utils/apiError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // generate new jwt token:
  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token, // send token to client
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body; // destructure off body object

  // check if email and pw exist:
  if (!email || !password) {
    return next(new ApiError("Please provide email & password.", 400)); // finish login with return
  }
  // check if user exists & pw is correct:
  const user = await User.findOne({ email }).select("+password");

  // if user does not exist, or password is incorrect:
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new ApiError("Incorrect email or password.", 401)); // 401 - unauthorised
  }

  // if everything is OK, send the token:
  const token = signToken(user._id);
  // send response:
  res.status(200).json({
    status: "ok",
    token,
  });
});
