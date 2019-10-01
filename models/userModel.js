const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tell your name."],
    validate: [validator.isAlpha, "Strings only"]
  },
  email: {
    type: String,
    required: [true, "Tell your email."],
    validate: [validator.isEmail, "Incorrect Email"],
    unique: true,
    lowercase: true
  },
  photo: {
    type: String
  },
  password: {
    type: String,
    required: [true, "Please provide a password."],
    minLength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please provide a password."],
    minLength: 8,
    validate: {
      validator: function(value) {
        return value === this.password;
      },
      message: "Not met"
    }
  },
  passwordChangedAt: Date
});

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPasssword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return this.passwordChangedAt < JWTTimestamp;
  } else {

    //false means not changed.
    
    return false;
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
