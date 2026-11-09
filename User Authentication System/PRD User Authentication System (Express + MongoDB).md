# PRD: User Authentication System (Express + MongoDB)

*Agent-ready build brief. Hand this whole document to Claude Code, Cursor or any coding agent.*

## 1. Overview

A RESTful API that lets users register, log in and access protected resources using JWT bearer tokens. Two roles exist: `student` (default) and `admin`. Built as a course practical.

**Goal:** a modular, secure, testable auth backend that follows the lab sequence: user model, registration, bcrypt hashing, login + JWT, auth middleware, protected route, roles.

**Non-goals:** frontend, email verification, password reset, refresh tokens, OAuth, rate limiting (listed under Future Work).

## 2. Tech Stack

| Concern | Choice |
| --- | --- |
| Runtime / framework | Node.js 18+, Express.js |
| Database | MongoDB via Mongoose |
| Auth | jsonwebtoken (JWT, HS256) |
| Hashing | bcrypt (use bcryptjs if native install fails on your machine) |
| Config | dotenv |
| Dev | nodemon |

## 3. Functional Requirements

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| FR-1 | Config via `.env` | Server reads `PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`; exits with a clear error if `MONGO_URI` or `JWT_SECRET` is missing |
| FR-2 | MongoDB connection | Mongoose connects on startup; failure logs the error and exits |
| FR-3 | User model | Fields `name`, `email` (unique, required, lowercase), `password` (required, hashed), `role` (enum `student`/`admin`, default `student`), timestamps |
| FR-4 | Register | `POST /api/auth/register` hashes password with bcrypt, saves user, returns 201 with user (no password) |
| FR-5 | Login | `POST /api/auth/login` verifies email and `bcrypt.compare`, returns a signed JWT containing user id and role |
| FR-6 | `protect` middleware | Reads `Authorization: Bearer <token>`, verifies it, attaches the user to `req.user`; 401 if missing, invalid or expired |
| FR-7 | `authorize(...roles)` middleware | 403 if `req.user.role` is not in the allowed list |
| FR-8 | Profile route | `GET /api/users/profile` (protected) returns the current user |
| FR-9 | Admin route | `GET /api/admin/dashboard` accessible only to `admin`; students get 403 |

## 4. API Contract

| Method | Path | Auth | Body | Success | Errors |
| --- | --- | --- | --- | --- | --- |
| POST | `/api/auth/register` | none | `name, email, password` | 201 `{ success, user }` | 400 validation, 409 duplicate email |
| POST | `/api/auth/login` | none | `email, password` | 200 `{ success, token, user }` | 400 missing fields, 401 invalid credentials |
| GET | `/api/users/profile` | Bearer | none | 200 `{ success, user }` | 401 |
| GET | `/api/admin/dashboard` | Bearer + admin | none | 200 `{ success, message, user }` | 401, 403 |

JWT payload: `{ id, role }`. Error shape everywhere: `{ success: false, message }`.

## 5. Non-Functional and Security Requirements

- Passwords never returned in any response and never logged.
- bcrypt salt rounds: 10.
- Login returns the same message for unknown email and wrong password (`Invalid email or password`) to prevent user enumeration.
- Registration must **not** accept a `role` from the client. Admins are promoted manually in the database (see section 9).
- `protect` re-fetches the user from MongoDB so deleted users and role changes take effect immediately.
- `.env` is git-ignored; ship a `.env.example`.
- Central error-handling middleware; no stack traces in responses.

## 6. Folder Structure

```
auth-system/
├── server.js
├── package.json
├── .env.example
├── .gitignore
├── config/
│   └── db.js
├── models/
│   └── User.js
├── controllers/
│   ├── authController.js
│   └── userController.js
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
└── routes/
    ├── authRoutes.js
    └── userRoutes.js
```

## 7. Build Order (matches the lab sequence)

1. `npm init`, install dependencies, create folders, `.env`.
2. `config/db.js` and `server.js` skeleton; confirm the DB connects.
3. `models/User.js`.
4. `authController.register` + route; test in Postman.
5. Confirm the password is stored as a bcrypt hash.
6. `authController.login` with JWT.
7. `authMiddleware` (`protect`, `authorize`).
8. `userRoutes`: profile, then admin dashboard.
9. Promote one user to admin and test all role cases.

## 8. Reference Implementation

### Setup

```bash
mkdir auth-system && cd auth-system
npm init -y
npm install express mongoose jsonwebtoken bcrypt dotenv
npm install -D nodemon
```

In `package.json` add:

```json
"scripts": { "start": "node server.js", "dev": "nodemon server.js" }
```

### `.env.example` (copy to `.env`)

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/auth_system
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=1d
```

Generate a secret: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

### `config/db.js`

```js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### `models/User.js`

```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    password: { type: String, required: [true, 'Password is required'] },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
  },
  { timestamps: true }
);

// Never leak the password hash when a document is serialized
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
```

### `controllers/authController.js`

```js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    // role is intentionally NOT read from req.body
    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({ success: true, user }); // toJSON strips password
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    const ok = user && (await bcrypt.compare(password, user.password));
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({ success: true, token: signToken(user), user });
  } catch (err) {
    next(err);
  }
};
```

### `controllers/userController.js`

```js
// GET /api/users/profile
exports.getProfile = (req, res) => {
  res.json({ success: true, user: req.user });
};

// GET /api/admin/dashboard
exports.adminDashboard = (req, res) => {
  res.json({ success: true, message: `Welcome to the admin dashboard, ${req.user.name}`, user: req.user });
};
```

### `middleware/authMiddleware.js`

```js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Not authorized, invalid token';
    res.status(401).json({ success: false, message });
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Forbidden: insufficient permissions' });
  }
  next();
};
```

### `middleware/errorMiddleware.js`

```js
exports.notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
};

exports.errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join(', ');
    return res.status(400).json({ success: false, message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }
  res.status(500).json({ success: false, message: 'Server error' });
};
```

### `routes/authRoutes.js`

```js
const router = require('express').Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

module.exports = router;
```

### `routes/userRoutes.js`

```js
const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const { getProfile, adminDashboard } = require('../controllers/userController');

const userRouter = express.Router();
userRouter.get('/profile', protect, getProfile);

const adminRouter = express.Router();
adminRouter.get('/dashboard', protect, authorize('admin'), adminDashboard);

module.exports = { userRouter, adminRouter };
```

### `server.js`

```js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { userRouter, adminRouter } = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error('Missing MONGO_URI or JWT_SECRET in .env');
  process.exit(1);
}

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.json({ success: true, message: 'Auth API running' }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`Server on port ${PORT}`)));
```

### `.gitignore`

```
node_modules
.env
```

## 9. Testing Guide (cURL; the same requests work in Postman)

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Asha","email":"asha@test.com","password":"secret123"}'

# 2. Login (copy the token from the response)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"asha@test.com","password":"secret123"}'

# 3. Profile (protected)
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer <TOKEN>"

# 4. Admin dashboard as student -> expect 403
curl http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer <TOKEN>"
```

**Make an admin:** in `mongosh`:

```js
use auth_system
db.users.updateOne({ email: "asha@test.com" }, { $set: { role: "admin" } })
```

Log in again (the JWT holds the role) and call the admin dashboard: expect 200.

### Test matrix

| # | Case | Expected |
| --- | --- | --- |
| 1 | Register valid user | 201, no `password` field |
| 2 | Register same email twice | 409 |
| 3 | Register missing fields | 400 |
| 4 | Check MongoDB document | `password` starts with `$2b$` |
| 5 | Login correct credentials | 200 + token |
| 6 | Login wrong password / unknown email | 401, same message |
| 7 | Profile with no token | 401 |
| 8 | Profile with tampered or expired token | 401 |
| 9 | Profile with valid token | 200 |
| 10 | Admin dashboard as student | 403 |
| 11 | Admin dashboard as admin | 200 |

## 10. Definition of Done

- All 11 test cases pass.
- No password or hash appears in any API response.
- Secrets live only in `.env`, which is git-ignored.
- Code matches the folder structure in section 6.
- README lists setup steps and endpoints.

## 11. Future Work

- Refresh tokens and logout/blacklist
- Password reset and email verification
- Rate limiting on login (`express-rate-limit`), `helmet`, CORS
- Input validation with `joi` or `express-validator`
- Automated tests with Jest + Supertest
- Admin-only endpoint to change user roles

## 12. Notes for the Implementing Agent

- Implement exactly the contract in section 4; do not add endpoints.
- Keep controllers thin and the routes declarative.
- If `bcrypt` fails to build, switch to `bcryptjs` (same API, change the import only).
- Ask before adding any dependency not listed in section 2.
