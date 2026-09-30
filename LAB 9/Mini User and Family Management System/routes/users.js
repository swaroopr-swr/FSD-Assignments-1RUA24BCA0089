// routes/users.js
const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Child = require("../models/Child");
const validateObjectId = require("../middleware/validateObjectId");

// Helper to check if client expects JSON
function wantsJson(req) {
  return (
    req.headers.accept?.includes("application/json") ||
    req.is("application/json") ||
    !req.accepts("html")
  );
}

/*
  IMPORTANT ordering note:
  Express matches routes top-to-bottom. Specific string routes like
  "/search/:name" and "/new" MUST be declared BEFORE the generic "/:id",
  otherwise "search" or "new" would be treated as an :id value.
*/

// GET /users -> list all users (bonus + landing page)
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    // Populate children count for each user in view
    const userIds = users.map((u) => u._id);
    const counts = await Child.aggregate([
      { $match: { parentId: { $in: userIds } } },
      { $group: { _id: "$parentId", count: { $sum: 1 } } },
    ]);
    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });

    if (wantsJson(req)) {
      return res.json({ users, countMap });
    }

    res.render("users/index", {
      title: "All Users",
      users,
      countMap,
      searchTerm: "",
    });
  } catch (err) {
    next(err);
  }
});

// GET /users/new -> form to create a user
router.get("/new", (req, res) => {
  res.render("users/new", { title: "New User", errors: null, values: {} });
});

// GET /users/search/:name -> search users by first name (bonus)
router.get("/search/:name", async (req, res, next) => {
  try {
    const { name } = req.params;
    // case-insensitive "contains" match on firstName
    const users = await User.find({
      firstName: { $regex: name, $options: "i" },
    }).sort({ firstName: 1 });

    const userIds = users.map((u) => u._id);
    const counts = await Child.aggregate([
      { $match: { parentId: { $in: userIds } } },
      { $group: { _id: "$parentId", count: { $sum: 1 } } },
    ]);
    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });

    if (wantsJson(req)) {
      return res.json({
        searchTerm: name,
        count: users.length,
        users,
      });
    }

    res.render("users/index", {
      title: `Search results for "${name}"`,
      users,
      countMap,
      searchTerm: name,
    });
  } catch (err) {
    next(err);
  }
});

// POST /users -> create a new user
router.post("/", async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const user = await User.create({ firstName, lastName, email, phone });

    // Browser form -> go to the new profile. API/curl (JSON) -> send JSON.
    if (!wantsJson(req)) {
      return res.redirect(`/users/${user._id}`);
    }
    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    // Validation error -> re-render the form with messages (browser)
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      if (!wantsJson(req)) {
        return res.status(400).render("users/new", {
          title: "New User",
          errors,
          values: req.body,
        });
      }
      return res.status(400).json({ message: "Validation failed", errors });
    }
    next(err);
  }
});

// GET /users/:id/children/count -> return the number of children belonging to the user (bonus)
router.get("/:id/children/count", validateObjectId("id"), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      if (wantsJson(req)) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(404).render("404", {
        title: "User Not Found",
        path: req.originalUrl,
      });
    }
    const count = await Child.countDocuments({ parentId: user._id });
    res.json({ userId: user._id, userName: `${user.firstName} ${user.lastName || ""}`.trim(), count });
  } catch (err) {
    next(err);
  }
});

// GET /users/:id/children -> list only children belonging to the specified user
router.get("/:id/children", validateObjectId("id"), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      if (wantsJson(req)) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(404).render("404", {
        title: "User Not Found",
        path: req.originalUrl,
      });
    }
    // The relationship in action: filter children by parentId.
    const children = await Child.find({ parentId: user._id }).sort({ firstName: 1 });

    if (wantsJson(req)) {
      return res.json({ user, count: children.length, children });
    }

    res.render("children/list", {
      title: `${user.firstName}'s Children`,
      user,
      children,
    });
  } catch (err) {
    next(err);
  }
});

/*
  MAIN THINKING CHALLENGE:
  GET /users/:id/children/:childId
  Display the child ONLY when that child actually belongs to the requested user.
  We compare child.parentId against the :id in the URL.
*/
router.get(
  "/:id/children/:childId",
  validateObjectId("id", "childId"),
  async (req, res, next) => {
    try {
      const { id, childId } = req.params;

      const user = await User.findById(id);
      if (!user) {
        if (wantsJson(req)) {
          return res.status(404).json({ message: "User not found" });
        }
        return res.status(404).render("404", {
          title: "User Not Found",
          path: req.originalUrl,
        });
      }

      const child = await Child.findById(childId);
      // Not found at all, OR found but belongs to a different parent ->
      // treat both as "not found for this user" (don't leak other families).
      if (!child || child.parentId.toString() !== user._id.toString()) {
        if (wantsJson(req)) {
          return res.status(404).json({
            message: "Child Not Found for this user",
          });
        }
        return res.status(404).render("error", {
          title: "Child Not Found",
          message: "Child Not Found for this user.",
        });
      }

      if (wantsJson(req)) {
        return res.json({ user, child });
      }

      res.render("children/show", {
        title: `${child.firstName}`,
        user,
        child,
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /users/:id/children-new -> form to add a child to this user
router.get("/:id/children-new", validateObjectId("id"), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      if (wantsJson(req)) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(404).render("404", {
        title: "User Not Found",
        path: req.originalUrl,
      });
    }
    res.render("children/new", {
      title: "Add Child",
      user,
      errors: null,
      values: {},
    });
  } catch (err) {
    next(err);
  }
});

// POST /users/:id/children -> create a child for an EXISTING user
router.post("/:id/children", validateObjectId("id"), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      // A child can only be created for an existing user (validation rule).
      if (wantsJson(req)) {
        return res.status(404).json({ message: "A child can only be created for an existing user" });
      }
      return res.status(404).render("404", {
        title: "User Not Found",
        path: req.originalUrl,
      });
    }

    const { firstName, lastName, age, email } = req.body;
    const child = await Child.create({
      firstName,
      lastName,
      age: age === "" ? undefined : Number(age),
      email,
      parentId: user._id, // stamp the relationship
    });

    if (!wantsJson(req)) {
      return res.redirect(`/users/${user._id}`);
    }
    res.status(201).json({ message: "Child added successfully", child });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      if (!wantsJson(req)) {
        const user = await User.findById(req.params.id);
        return res.status(400).render("children/new", {
          title: "Add Child",
          user,
          errors,
          values: req.body,
        });
      }
      return res.status(400).json({ message: "Validation failed", errors });
    }
    next(err);
  }
});

// GET /users/:id -> user profile page (children loaded dynamically)
router.get("/:id", validateObjectId("id"), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      // Custom 404 page for a non-existent user (assignment requirement).
      if (wantsJson(req)) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(404).render("404", {
        title: "User Not Found",
        path: req.originalUrl,
      });
    }
    // Load children dynamically from MongoDB by parentId (never hard-coded).
    const children = await Child.find({ parentId: user._id }).sort({ firstName: 1 });

    if (wantsJson(req)) {
      return res.json({ user, children });
    }

    res.render("users/profile", {
      title: `${user.firstName} ${user.lastName || ""}`.trim(),
      user,
      children,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
