# Campus Lost & Found — Phase 1 Application

Complete, standalone implementation of **Phase 1** of the Campus Lost & Found Management System, built with **Node.js, Express.js, EJS, and MongoDB Atlas (Mongoose)** following "The Property Office" design philosophy.

---

## 1. Phase 1 Features

- **The Property Office Interface:**
  - Physical hang tag components with eyelets, strings, reference numbers (`LF-XXXXXX`), category tags, and angled rubber status stamps (`LOST`, `FOUND`, `AVAILABLE`, `RESOLVED`).
  - Filing slips with underline inputs, numbered sections, ballot-style category selector radios (`[✕]`), and ruled-line description sheets.
  - Case file detail pages with main property sheet and reporter side card.
  - Empty drawer states with serif copy and contextual action buttons.
  - Offline-ready system typography (Georgia serif & Courier New monospace).

- **Student Identity & Session:**
  - Student profile creation (`/students/new`) with strict phone and email validation.
  - Signed cookie session via `cookie-parser` (`studentId`), identifying the acting student across requests.
  - Automatic sign-in upon registration; sign-in and sign-out by college email.
  - Student dossier page (`/students/:id`) showing student details and all items reported by them.

- **Lost & Found Ledgers:**
  - Filing slips for lost items (`/lost-items/new`) and found items (`/found-items/new`).
  - Search by keyword (`?q=`) across item name and location with regular expression escaping.
  - Filtering by category (`?category=`) across 8 predefined campus categories.
  - Clear filter reset and dynamic result counts ("X TAGS FOUND").

- **Security & Integrity:**
  - Ownership enforcement: `reportedBy` is derived server-side strictly from the verified session cookie; any body parameters attempting to forge `reportedBy` or `status` are discarded.
  - Strict 24-hex ObjectId validation (`isValidObjectId`) protecting all `:id` routes against casting crashes.
  - Centralized 404 and 500 error handlers with user-friendly error views.

---

## 2. Technology Stack & Dependencies

- **Runtime:** Node.js (v18+)
- **Web Framework:** Express.js 4.x
- **Template Engine:** EJS 3.x
- **Database:** MongoDB Atlas via Mongoose 8.x
- **Session & Cookies:** `cookie-parser` (signed cookies)
- **Environment Management:** `dotenv`
- **Development Tooling:** `nodemon`

*Note: In accordance with project requirements, no heavy frontend frameworks (React, Tailwind, Bootstrap) are used. The application renders pure semantic HTML and modular CSS.*

---

## 3. MongoDB Atlas Configuration

MongoDB Atlas is the mandatory application database. Follow these steps to configure your database connection:

1. **Atlas Cluster:** Log in to [MongoDB Atlas](https://cloud.mongodb.com/) and ensure a cluster is created (e.g., free tier `Cluster0`).
2. **Database User:** Under **Security > Database Access**, create a user with `Read and write to any database` privileges.
3. **Network Access:** Under **Security > Network Access**, add your current public IP address to allow connections.
4. **Connection String:** Click **Connect > Drivers > Node.js** to obtain your connection URI:
   ```
   mongodb+srv://<username>:<password>@<cluster-host>.mongodb.net/campus_lost_found?retryWrites=true&w=majority
   ```
5. **Database Name:** The connection string specifies `campus_lost_found` as the target database name.
6. **Local Configuration:** Place your connection string into `Phase-1/.env`:
   ```bash
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>.mongodb.net/campus_lost_found?retryWrites=true&w=majority
   PORT=3000
   COOKIE_SECRET=replace_with_a_secure_random_secret_phrase
   ```
   *(Ensure special characters in the database password are URL-encoded).*

---

## 4. Installation & Execution

From this directory (`campus-lost-found-management-system/Phase-1`):

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your MongoDB Atlas credentials

# 3. Start the application
npm start

# Or start in development mode with auto-reload
npm run dev
```

Open your browser at:
`http://localhost:3000`

---

## 5. Verified Route Matrix

| Method | Path | Function | Access Level |
|---|---|---|---|
| `GET` | `/` | Home overview: live counts and latest 3 lost & found reports | Public |
| `GET` | `/report` | Chooser desk to file lost or found notice | Public |
| `GET` | `/sign-in` | Student sign-in form | Public |
| `POST` | `/sign-in` | Validates email & sets signed session cookie | Public |
| `POST` | `/sign-out` | Clears signed session cookie | Public |
| `GET` | `/students/new` | New student registration form | Public |
| `POST` | `/students` | Creates student record & signs in | Public |
| `GET` | `/students/:id` | Student dossier & dual lost/found item ledgers | Public |
| `GET` | `/lost-items` | Lost items ledger with search & category filters | Public |
| `GET` | `/lost-items/new` | Notice of Loss filing slip | Signed-in Only |
| `POST` | `/lost-items` | Records lost item with server-verified reporter | Signed-in Only |
| `GET` | `/lost-items/:id` | Case file detail sheet for lost item | Public |
| `GET` | `/found-items` | Found items ledger with search & category filters | Public |
| `GET` | `/found-items/new` | Notice of Discovery filing slip | Signed-in Only |
| `POST` | `/found-items` | Records found item with server-verified reporter | Signed-in Only |
| `GET` | `/found-items/:id` | Case file detail sheet for found item | Public |

---

## 6. Current Limitations & Architectural Boundary

Phase 1 is intentionally scoped to core recording, cataloging, and student identification:
1. **Passwordless Sign-In:** The assignment specifies no complex auth framework, but database ownership requires identifying who files reports. Sign-in is performed via registered college email stored in an `httpOnly`, signed cookie. This is a deliberate, documented simplification.
2. **Claims & Returns (Phase 2):** In Phase 1, found items remain in status `Available`. Claim submissions, claim verification ledgers, approve/reject rubber stamps, and atomic transition to `Returned` are explicitly reserved for Phase 2.
3. **No Direct Item Editing:** To preserve archival audit history, filed property slips cannot be modified or deleted directly by students in Phase 1.

---

## 7. Phase 1 Evaluation Deliverables

- [`docs/phase1-explanation.md`](./docs/phase1-explanation.md): Deep architectural breakdown, data model relationships, form submission lifecycles, and a 2-minute live demo script.
- [`docs/phase1-test-checklist.md`](./docs/phase1-test-checklist.md): 14-point test execution matrix covering field validations, bad ID resilience, and empty states.
- [`../demo-screenshots/`](../demo-screenshots/): 8 live captures of the running application demonstrating student profiles, form validation, case files, hang tags, and live Atlas statistics.
