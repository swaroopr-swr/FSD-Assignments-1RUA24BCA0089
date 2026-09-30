// models/Child.js
const mongoose = require("mongoose");

// A Child always belongs to exactly one parent User.
// The link is stored in parentId as the parent User's _id.
const childSchema = new mongoose.Schema(
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
    age: {
      type: Number,
      required: [true, "Age is required"], // assignment: age is required
      min: [0, "Age cannot be negative"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    // The relationship: which User this child belongs to.
    // parentId stores the parent user's MongoDB ObjectId.
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A child must belong to a parent user"],
    },
  },
  { timestamps: true }
);

// Explicitly maps to the "children" collection
module.exports = mongoose.model("Child", childSchema, "children");
