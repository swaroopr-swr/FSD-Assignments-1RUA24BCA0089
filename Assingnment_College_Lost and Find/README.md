# Campus Lost & Found Management System — Phase 1

An official campus property office web application built with **Node.js, Express, EJS, and MongoDB Atlas (Mongoose)** following "The Property Office" editorial aesthetic (hang tags, filing slips, and rubber stamps).

---

## 1. Project Overview

The Campus Lost & Found system allows students to report misplaced items, browse discovered possessions, and trace items back to their rightful owners through verified student identities.

### Design Direction: "The Property Office"
- **Hang Tags**: Every lost or found item is styled like a physical paper tag with clipped corners, punched hole, string eyelet, reference number (`LF-XXXXXX`), category badge, and status stamp.
- **Filing Slips**: Underline-only inputs, ballot-style radio selections (`[✕]`), and ruled-line description pads.
- **Stamps**: Rubber-stamp badges for `LOST`, `FOUND`, `AVAILABLE`, and `RESOLVED`.
- **System Fonts**: Offline-compatible Georgia serif and Courier New monospace typography.

---

## 2. Authentication & Student Identity Design

**Sign-in by College Email (No Password):**
The assignment specifies no complex auth framework, but database ownership checks require knowing who is filing a report. 
- A student signs in with their registered college email address.
- The server writes an `httpOnly`, signed cookie storing the student's MongoDB `_id`.
- Every report filed derives `reportedBy` strictly from this server-verified cookie—**never** from form inputs or URL parameters.
- This design deliberately simplifies login while preventing students from spoofing or altering ownership records.

---

## 3. Database Models & Relational Architecture

The application connects exclusively to **MongoDB Atlas** using the database `campus_lost_found`.

- **Student**:
  - `fullName`: String (2–80 chars)
  - `email`: String (lowercase, unique index, validated format)
  - `department`: String
  - `contactNumber`: String (10 digits starting with 6–9)
  - `timestamps`: true

- **LostItem**:
  - `itemName`: String (2–80 chars)
  - `category`: Enum (Electronics, ID & Cards, Bags, Books & Stationery, Keys, Clothing, Bottles & Accessories, Other)
  - `description`: String (10–500 chars)
  - `lastSeenLocation`: String (2–100 chars)
  - `dateLost`: Date (must not be in the future)
  - `status`: String (`Lost`, `Resolved`; default `Lost`)
  - `reportedBy`: Mongoose ObjectId referencing `Student._id` (relational integrity, populated on demand)
  - `timestamps`: true

- **FoundItem**:
  - `itemName`, `category`, `description`
  - `foundLocation`: String (2–100 chars)
  - `dateFound`: Date (must not be in the future)
  - `status`: String (`Available`, `Returned`; default `Available`)
  - `reportedBy`: Mongoose ObjectId referencing `Student._id`
  - `timestamps`: true

---

## 4. Prerequisites & Environment Setup

- **Node.js**: v18 or higher (tested on Node.js v26)
- **MongoDB Atlas**: Free-tier M0 cluster or existing Atlas cluster
- **Dependencies**: `express`, `ejs`, `mongoose`, `dotenv`, `cookie-parser`, `nodemon` (dev)

### Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure `.env` with:
```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/campus_lost_found?retryWrites=true&w=majority
COOKIE_SECRET=your_secure_random_secret_here
```

> **Security Note:** `.env` is listed in `.gitignore` and must never be committed to Git.

---

## 5. How to Run the Application

Install dependencies:
```bash
npm install
```

Start the application:
```bash
# Production start
npm start

# Development mode with auto-reload
npm run dev
```

Open your browser at:
`http://localhost:3000`

---

## 6. Route Summary

| Method | Path | Description | Access |
|---|---|---|---|
| `GET` | `/` | Home: live document counts and latest 3 reports | Public |
| `GET` | `/report` | Chooser desk (Lost notice / Found receipt) | Public |
| `GET` | `/sign-in` | Student sign-in form | Public |
| `POST` | `/sign-in` | Sets signed student session cookie | Public |
| `POST` | `/sign-out` | Clears student session cookie | Public |
| `GET` | `/students/new` | Student registration profile form | Public |
| `POST` | `/students` | Creates student record & auto-logs in | Public |
| `GET` | `/students/:id` | Student profile dossier & filed items | Public |
| `GET` | `/lost-items` | Lost ledger with search (`?q=`) and category | Public |
| `GET` | `/lost-items/new` | Notice of Loss filing slip | Signed-in Only |
| `POST` | `/lost-items` | Files lost item with server-derived reporter | Signed-in Only |
| `GET` | `/lost-items/:id` | Case file detail sheet for lost item | Public |
| `GET` | `/found-items` | Found ledger with search (`?q=`) and category | Public |
| `GET` | `/found-items/new` | Notice of Discovery filing slip | Signed-in Only |
| `POST` | `/found-items` | Files found item with server-derived reporter | Signed-in Only |
| `GET` | `/found-items/:id` | Case file detail sheet for found item | Public |

---

## 7. Deliverables & Documentation

- `docs/phase1-explanation.md`: Architectural details, schema relationships, form submission flows, and a 2-minute demo walkthrough.
- `docs/phase1-test-checklist.md`: Comprehensive manual test checklist covering edge cases, validations, ID checking, and empty states.
