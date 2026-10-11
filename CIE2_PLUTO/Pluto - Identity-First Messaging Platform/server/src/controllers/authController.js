import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { generatePlutoUsername, normalizeUsername } from "../utils/codes.js";
import { toPublicUser } from "../utils/serializers.js";

function signToken(userId) {
  return jwt.sign({ sub: userId.toString() }, process.env.JWT_SECRET || "dev-secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
}

async function createUniqueUsername() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const username = generatePlutoUsername();
    const exists = await User.exists({ username });

    if (!exists) return username;
  }

  const error = new Error("Could not generate a unique Pluto identity");
  error.status = 500;
  throw error;
}

export async function register(req, res, next) {
  try {
    const { password, avatar = "" } = req.body;

    if (!password || password.length < 6) {
      const error = new Error("Password must be at least 6 characters");
      error.status = 400;
      throw error;
    }

    const username = await createUniqueUsername();
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ username, passwordHash, avatar });

    res.status(201).json({
      token: signToken(user._id),
      user: toPublicUser(user)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const normalizedUsername = normalizeUsername(username);

    if (!normalizedUsername || !password) {
      const error = new Error("Pluto ID and password are required");
      error.status = 400;
      throw error;
    }

    const user = await User.findOne({ username: normalizedUsername });
    const passwordMatches = user ? await bcrypt.compare(password, user.passwordHash) : false;

    if (!user || !passwordMatches) {
      const error = new Error("Invalid Pluto ID or password");
      error.status = 401;
      throw error;
    }

    res.json({
      token: signToken(user._id),
      user: toPublicUser(user)
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res) {
  res.json({ user: toPublicUser(req.user) });
}
