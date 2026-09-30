// routes/children.js
const express = require("express");
const router = express.Router();

const Child = require("../models/Child");
const User = require("../models/User");
const validateObjectId = require("../middleware/validateObjectId");

// GET /children/:id/edit -> form to edit a child's information
router.get("/:id/edit", validateObjectId("id"), async (req, res, next) => {
  try {
    const child = await Child.findById(req.params.id);
    if (!child) {
      if (req.headers.accept?.includes("application/json") || !req.accepts("html")) {
        return res.status(404).json({ message: "Child Not Found" });
      }
      return res.status(404).render("error", {
        title: "Child Not Found",
        message: "Child Not Found",
      });
    }

    const user = await User.findById(child.parentId);
    res.render("children/edit", {
      title: `Edit ${child.firstName}`,
      child,
      user,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
});

// GET /children/:id -> view single child
router.get("/:id", validateObjectId("id"), async (req, res, next) => {
  try {
    const child = await Child.findById(req.params.id);
    if (!child) {
      if (req.headers.accept?.includes("application/json") || !req.accepts("html")) {
        return res.status(404).json({ message: "Child Not Found" });
      }
      return res.status(404).render("error", {
        title: "Child Not Found",
        message: "Child Not Found",
      });
    }

    const user = await User.findById(child.parentId);

    if (req.headers.accept?.includes("application/json") || !req.accepts("html")) {
      return res.json({ child, user });
    }

    res.render("children/show", {
      title: `${child.firstName}`,
      user,
      child,
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /children/:id -> update child information (firstName, lastName, age, email)
router.patch("/:id", validateObjectId("id"), async (req, res, next) => {
  try {
    const { firstName, lastName, age, email } = req.body;

    const child = await Child.findById(req.params.id);
    if (!child) {
      if (req.headers.accept?.includes("application/json") || !req.accepts("html")) {
        return res.status(404).json({ message: "Child Not Found" });
      }
      return res.status(404).render("error", {
        title: "Child Not Found",
        message: "Child Not Found",
      });
    }

    // Apply updates
    if (firstName !== undefined) child.firstName = firstName;
    if (lastName !== undefined) child.lastName = lastName;
    if (age !== undefined) child.age = age === "" ? undefined : Number(age);
    if (email !== undefined) child.email = email;

    await child.save();

    if (req.accepts("html") && !req.headers.accept?.includes("application/json")) {
      return res.redirect(`/users/${child.parentId}`);
    }

    res.json({
      message: "Child updated successfully",
      child,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      if (req.accepts("html") && !req.headers.accept?.includes("application/json")) {
        const child = await Child.findById(req.params.id);
        const user = child ? await User.findById(child.parentId) : null;
        return res.status(400).render("children/edit", {
          title: `Edit ${req.body.firstName || "Child"}`,
          child: { ...req.body, _id: req.params.id, parentId: child ? child.parentId : null },
          user,
          errors,
        });
      }
      return res.status(400).json({ message: "Validation failed", errors });
    }
    next(err);
  }
});

// PUT /children/:id -> alias for PATCH
router.put("/:id", validateObjectId("id"), async (req, res, next) => {
  // Delegate to PATCH handler logic
  req.method = "PATCH";
  router.handle(req, res, next);
});

// DELETE /children/:id -> delete a child from MongoDB
router.delete("/:id", validateObjectId("id"), async (req, res, next) => {
  try {
    const child = await Child.findById(req.params.id);
    if (!child) {
      if (req.headers.accept?.includes("application/json") || !req.accepts("html")) {
        return res.status(404).json({ message: "Child Not Found" });
      }
      return res.status(404).render("error", {
        title: "Child Not Found",
        message: "Child Not Found",
      });
    }

    const parentId = child.parentId;
    await Child.findByIdAndDelete(req.params.id);

    if (req.accepts("html") && !req.headers.accept?.includes("application/json")) {
      return res.redirect(`/users/${parentId}`);
    }

    res.json({
      message: "Child deleted successfully",
      deletedChildId: req.params.id,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
