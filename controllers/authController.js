const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: "success",
      token: token,
      data: {
        newUser
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "failed",
      data: {
        user
      }
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(201).json({
      status: "error",
      message: "Please provide email and password"
    });
  }

  const user = await User.findOne({ email }).select("+password");

  const correct = user.correctPasssword(password, user.password);

  if (!user || !correct) {
    return res.status(401).json({
      status: "error",
      message: "Invalid Username and Password."
    });
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token
  });

  //Check if email and password exists
};

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      status: "Not Logged In."
    });
  }
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      throw new Error("Invalid User.");
    }

    if (freshUser.changedPasswordAfter(decoded.iat)) {
      throw new Error("Password changed. Please login again.");
    }
  } catch (err) {
    return res.status(401).json({
      status: "error",
      invalid: "Invalid token."
    });
  }
  req.user = user
  next();
};
