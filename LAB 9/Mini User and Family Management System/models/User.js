// models/User.js
const mongoose = require("mongoose");

// A schema defines the shape of a User document stored in MongoDB.
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"], // assignment: email is required
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Explicitly maps to the "users" collection
module.exports = mongoose.model("User", userSchema, "users");
