const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// User schema:
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"], // validators
    trim: true, // will remove any whitespace at beginning and end of string.
  },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email."],
    trim: true,
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minLength: 5,
    select: false, // do not send to output
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm password"],
    validate: {
      // on create & save:
      validator: function (element) {
        return element === this.password; // chicken === chicken
      },
      message: "Passwords not the same!",
    },
  },
});

// middleware pre-save
userSchema.pre("save", async function (next) {
  // if pw was not modified, continue to next middleware:
  if (!this.isModified("password")) return next();
  // async version: hash pw with cost of 12
  this.password = await bcrypt.hash(this.password, 12); // encrypt setting
  // delete un-encrypted field - do not persist this to database:
  this.passwordConfirm = undefined;
  next();
});

// decrypt password & compare input using bcrypt
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// create a model out of the schema:
const User = mongoose.model("User", userSchema);

module.exports = User;
