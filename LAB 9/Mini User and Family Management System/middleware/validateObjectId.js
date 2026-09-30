// middleware/validateObjectId.js
const mongoose = require("mongoose");

/**
 * Guards routes that take an :id (or another named param).
 * If the param is not a valid MongoDB ObjectId, we stop early with a
 * clean 400 response instead of letting Mongoose throw a CastError.
 *
 * Supports both browser HTML rendering and API JSON responses.
 *
 * Usage: router.get("/:id", validateObjectId(), handler)
 *        router.get("/:id/children/:childId", validateObjectId("id", "childId"), handler)
 */
function validateObjectId(...paramNames) {
  // default to checking "id" if no names were passed
  const names = paramNames.length ? paramNames : ["id"];

  return (req, res, next) => {
    for (const name of names) {
      const value = req.params[name];
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        const isJson =
          req.headers.accept?.includes("application/json") ||
          req.is("application/json") ||
          !req.accepts("html");

        if (isJson) {
          return res.status(400).json({
            message: `"${value}" is not a valid MongoDB ID.`,
          });
        }

        return res.status(400).render("error", {
          title: "Invalid ID",
          message: `"${value}" is not a valid MongoDB ID.`,
        });
      }
    }
    next();
  };
}

module.exports = validateObjectId;
