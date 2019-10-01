const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const userRouter = require("./routes/userRoutes");
const tourRouter = require("./routes/tourRoutes");

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);


app.all("*", function(req, res, next) {
  res.status(404).json({
    status: "fail",
    message: `404 Not found ${req.url}`
  });
})

//Routes

//Starting App

module.exports = app;
