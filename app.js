////////// APP CONFIG

const express = require("express");
const morgan = require("morgan"); // http request logger
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

// initialise express app:
const app = express();

// MIDDLEWARES: order is important- define before routes.
// 'use', adds to middleware.

// can also be === development
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// displays incoming requests in console ala Rails
app.use(express.json()); // don't need body-parser any more, added to express - json parser.
app.use(express.static(`${__dirname}/public`));

// define a middleware function (3rd argument is a middleware giveaway):
app.use((req, res, next) => {
  console.log("Hello from middleware!");
  next(); // next middleware in stack.
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// mounting routers after importing them, apply router middlewares with use.
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// if not handled by the above routes:
app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl}`);
  err.status = "fail";
  err.statusCode = 404;
  next(err); // passed into next(), which goes to middleware func below.
});

// Error handling middleware: 4 args
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // internal server error
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
