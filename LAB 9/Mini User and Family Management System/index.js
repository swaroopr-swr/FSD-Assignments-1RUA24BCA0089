// index.js — application entry point

// 1. Load environment variables from .env into process.env (must be first)
require("dotenv").config();

// 2. Core imports
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");

// 3. Route modules
const userRoutes = require("./routes/users");
const childRoutes = require("./routes/children");

// 4. Create the app + read config from environment variables (never hard-coded)
const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;

// 5. View engine: EJS, templates live in /views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 6. Middleware
app.use(express.urlencoded({ extended: true })); // parse HTML form bodies -> req.body
app.use(express.json()); // parse JSON bodies (for curl/API testing)
// Lets HTML forms send PATCH/DELETE via ?_method=PATCH (browsers only do GET/POST)
app.use(methodOverride("_method"));
// Serve static assets (CSS) from /public
app.use(express.static(path.join(__dirname, "public")));

// 7. Home page -> redirect to the users list
app.get("/", (req, res) => res.redirect("/users"));

// 8. Mount routes
//    /users, /users/:id, /users/:id/children ... live in userRoutes
//    /children/:id (PATCH, DELETE) lives in childRoutes
app.use("/users", userRoutes);
app.use("/children", childRoutes);

// 9. 404 handler — any request that matched no route above lands here.
//    Renders the custom 404 page (assignment requirement).
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found",
    path: req.originalUrl,
  });
});

// 10. Central error handler — catches errors passed via next(err).
//     Keeps the app from crashing on DB/server errors.
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(err.status || 500).render("error", {
    title: "Something went wrong",
    message: err.message || "Internal server error",
  });
});

// 11. Connect to MongoDB, THEN start listening
if (!MONGODB_URL) {
  console.error("Error: MONGODB_URL is not defined in .env");
  console.error("Please set MONGODB_URL in your .env file.");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB successfully");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.error("Please verify your MONGODB_URL connection string in .env");
    process.exit(1);
  });
