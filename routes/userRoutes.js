const express = require('express');

const userController = require("../controllers/userController")
const userRouter = express.Router();
const authController = require("../controllers/authController")


userRouter.post('/signup', authController.signup)
userRouter.post('/login',authController.login)
userRouter
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

userRouter
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);


  module.exports = userRouter