# Mini User & Family Management System

A full-stack web application and REST API built with **Node.js**, **Express.js**, **EJS**, **MongoDB**, and **Mongoose**.

---

## 📖 Overview

The **Mini User & Family Management System** allows users to create parent profiles and associate multiple children with a specific user. Every child document permanently stores the MongoDB `_id` of its parent (`parentId`), creating a strict relational link in MongoDB.

The application features a modern, dark-mode glassmorphic user interface, comprehensive input validation, safe ObjectId handling, dynamic EJS rendering, and custom 404/error handling.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Backend Framework**: Express.js (v5)
- **View Engine**: EJS (Embedded JavaScript)
- **Database**: MongoDB & Mongoose ODM
- **Form Method Override**: `method-override` (supports `PATCH` and `DELETE` through HTML forms)
- **Styling**: Modern Vanilla CSS with Glassmorphism, Google Fonts (Outfit & Inter), and FontAwesome icons

---

## 🗄️ Database Design

The system connects to the **`familymanagement`** database with two dedicated collections:

### 1. `User` Schema (`users` collection)
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `firstName` | `String` | Required, Trimmed | Parent's first name |
| `lastName` | `String` | Trimmed | Parent's last name |
| `email` | `String` | Required, Trimmed, Lowercase | Primary contact email |
| `phone` | `String` | Trimmed | Contact phone number |
| `createdAt` / `updatedAt` | `Date` | Automatic timestamps | Document metadata |

### 2. `Child` Schema (`children` collection)
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `firstName` | `String` | Required, Trimmed | Child's first name |
| `lastName` | `String` | Trimmed | Child's last name |
| `age` | `Number` | Required, Min: 0 | Child's age |
| `email` | `String` | Trimmed, Lowercase | Optional email address |
| `parentId` | `ObjectId` | Required, `ref: "User"` | MongoDB `_id` of the parent User document |
| `createdAt` / `updatedAt` | `Date` | Automatic timestamps | Document metadata |

---

## 🛣️ API & Web Routes

### User Routes (`/users`)
| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/users` | Directory of all users with search & child count |
| `GET` | `/users/new` | Render the new user registration form |
| `POST` | `/users` | Create a new parent user document in MongoDB |
| `GET` | `/users/:id` | View user profile with dynamically loaded children |
| `GET` | `/users/search/:name` | *(Bonus)* Search users by first name |
| `GET` | `/users/:id/children` | List/return only children belonging to this user |
| `GET` | `/users/:id/children-new` | Render the form to add a child to this user |
| `POST` | `/users/:id/children` | Create a child linked to `parentId: user._id` |
| `GET` | `/users/:id/children/count` | *(Bonus)* JSON endpoint returning children count |
| `GET` | `/users/:id/children/:childId` | *(Main Thinking Challenge)* Display child only if `child.parentId === user._id` |

### Child Routes (`/children`)
| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/children/:id` | View single child details |
| `GET` | `/children/:id/edit` | Render form to edit child information |
| `PATCH` | `/children/:id` | Update child information (`firstName`, `lastName`, `age`, `email`) |
| `PUT` | `/children/:id` | Alias for `PATCH /children/:id` |
| `DELETE` | `/children/:id` | Delete child document permanently from MongoDB |

---

## 🧠 Main Thinking Challenge

**Route**: `GET /users/:id/children/:childId`

Validates that a child is displayed **only if** `child.parentId.toString() === user._id.toString()`.
- If Danish requests Danish's child (Aarav), access is granted (`200 OK`).
- If Danish requests Sonu's child (Rahul), the system returns `404 "Child Not Found for this user."` preventing cross-family data leakage.

---

## 🛡️ Validation & Error Handling

1. **User Validation**: `email` and `firstName` are required; invalid form submissions re-render with clear alert boxes.
2. **Child Validation**: `age` and `firstName` are required (`age >= 0`). Children can only be created for existing users.
3. **Invalid ObjectIds**: Protected by `validateObjectId` middleware to prevent server `CastError` crashes.
4. **Empty State**: When an existing user has no children, displays: `"No children found for this user."` with a direct call-to-action button.
5. **Custom 404 & Error Pages**: Clean visual feedback for non-existent users, missing children, or invalid routes.

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- Local MongoDB or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### 2. Installation
```bash
# Clone the repository
git clone <repo-url>
cd "Mini User and Family Management System"

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
MONGODB_URL=mongodb://127.0.0.1:27017/familymanagement
PORT=3000
```

To connect to **MongoDB Atlas**, update `MONGODB_URL`:
```env
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/familymanagement?retryWrites=true&w=majority
```

### 4. Running the Application
```bash
# Start the server
npm start

# Or with nodemon live-reload
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
Mini User and Family Management System/
├── .env                              # Environment variables (ignored by git)
├── .env.example                      # Template for environment configuration
├── .gitignore                        # Git ignore rules
├── package.json                      # Project dependencies & scripts
├── index.js                          # Express entrypoint & MongoDB connection
├── README.md                         # Documentation
├── middleware/
│   └── validateObjectId.js           # Safe ObjectId validator middleware
├── models/
│   ├── User.js                       # User model & schema
│   └── Child.js                      # Child model & schema
├── routes/
│   ├── users.js                      # User CRUD, Profile, Filter & Thinking Challenge
│   └── children.js                   # Child PATCH, DELETE & Edit handlers
├── views/
│   ├── partials/
│   │   ├── header.ejs                # Navigation, branding & meta tags
│   │   └── footer.ejs                # Footer template
│   ├── users/
│   │   ├── index.ejs                 # All users directory & search
│   │   ├── new.ejs                   # New user creation form
│   │   └── profile.ejs               # User profile with linked children & empty states
│   ├── children/
│   │   ├── list.ejs                  # Filtered children list
│   │   ├── show.ejs                  # Verified child detail view
│   │   ├── new.ejs                   # Add child form
│   │   └── edit.ejs                  # Edit child form (PATCH)
│   ├── 404.ejs & 404.html            # Custom 404 error page
│   └── error.ejs                     # General & invalid ID error page
└── public/
    ├── css/style.css                 # Glassmorphic dark theme design system
    └── style.css                     # Stylesheet entrypoint
```
