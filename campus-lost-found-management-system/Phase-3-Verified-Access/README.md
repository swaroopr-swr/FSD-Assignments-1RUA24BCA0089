# Campus Lost & Found Management System — Phase 2

A complete, full-stack campus property office application built with **Node.js, Express.js, EJS, and MongoDB Atlas (Mongoose)** following "The Property Office" editorial design direction (physical hang tags with strings and eyelets, filing slips with ruled lines, and authentic rubber stamps).

Phase 2 introduces the complete **ownership resolution and claims lifecycle**, adding secure claim lodgement, privacy-first case sheets, finder ledger review, ordered atomic transitions to `Returned`, duplicate prevention, and automated end-to-end testing.

---

## 1. Prerequisites

* **Node.js:** v18.0.0 or later (v20+ recommended; built and tested on v26)
* **npm:** v9.0.0 or later
* **MongoDB:** MongoDB Atlas database cluster or local MongoDB instance (v5.0+)
* **Web Browser:** Any modern web browser (Chrome, Firefox, Safari, Edge)

---

## 2. Environment Variables & Configuration

Create a `.env` file in the application directory by copying `.env.example`:

```bash
cp .env.example .env
```

Configure the following variables in `.env`:

| Variable Name | Required | Default / Example Value | Description |
|---|---|---|---|
| `PORT` | No | `3000` | Port on which the Express web server listens. |
| `MONGODB_URI` | **Yes** | `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/campus_lost_found?retryWrites=true&w=majority` | Production/Development MongoDB connection string. |
| `MONGODB_URI_TEST` | **Yes** (for tests) | `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/campus_lost_found_test?retryWrites=true&w=majority` | **Isolated test database URI**. Must NOT equal `MONGODB_URI`. All test runs purge and verify against this URI. |
| `COOKIE_SECRET` | **Yes** | `property_office_cookie_secret_key_2026_campus_lost_found` | Cryptographic secret key used to sign HTTP session cookies. |

---

## 3. Installation, Execution & Automated Testing

### Installation
```bash
# Navigate to the Phase 2 directory
cd Phase-2

# Install dependencies
npm install
```

> [!NOTE]
> **Zero Bloat Policy:** In Phase 2, exactly **one** new runtime package was added: `method-override` (to enable HTML forms to send RESTful `PATCH` requests). No external testing frameworks (like Mocha or Jest) were added—the test suite runs 100% on Node's built-in `node:test` runner and built-in `fetch`.

### Running the Application
```bash
npm start
```
The server will connect to MongoDB Atlas, ensure compound indexes exist, and start listening at:
`http://localhost:3000`

### Running the Automated Test Suite
```bash
npm test
```
The test suite in `tests/phase2.test.js`:
1. Verifies that `MONGODB_URI_TEST` is defined and strictly different from `MONGODB_URI`.
2. Connects to the test database and wipes all collections.
3. Automatically spawns an isolated instance of the application on an ephemeral port.
4. Executes all 16 end-to-end integration tests using Node's native `test` and `fetch`.
5. Outputs a comprehensive pass/fail summary and shuts down cleanly.

---

## 4. Full Route Map & HTTP Methods

| HTTP Method | Route URL | Purpose / Action | Access Control |
|---|---|---|---|
| `GET` | `/` | Home desk showing live stats and latest tags | Public |
| `GET` | `/report` | Chooser desk (select Lost Report or Discovery Notice) | Public |
| `GET` | `/sign-in` | Sign-in filing form | Public |
| `POST` | `/sign-in` | Authenticates student via email and sets signed cookie | Public |
| `POST` | `/sign-out` | Clears signed session cookie and redirects home | Authenticated |
| `GET` | `/students/new` | Registration slip for new student identity dossier | Public |
| `POST` | `/students` | Registers new student profile and signs student in | Public |
| `GET` | `/students/:id` | Student profile dossier showing all items filed by them | Public |
| `GET` | `/lost-items` | Lost items ledger with search & category filter | Public |
| `GET` | `/lost-items/new` | Filing slip to lodge a lost article report | Authenticated |
| `POST` | `/lost-items` | Validates and creates lost item report | Authenticated |
| `GET` | `/lost-items/:id` | Detailed property case sheet for a lost item | Public |
| `GET` | `/found-items` | Found items repository with search, category & status filter | Public |
| `GET` | `/found-items/new` | Notice of discovery filing form | Authenticated |
| `POST` | `/found-items` | Validates and creates found item in custody | Authenticated |
| `GET` | `/found-items/:id` | Found item case sheet (renders finder ledger, claim form, or user claim based on viewer) | Public / Role-filtered |
| `POST` | `/found-items/:id/claims` | Submits ownership claim slip with proof description | Authenticated (Non-finder) |
| `PATCH` | `/found-items/:id/status` | Transitions item status to `Returned` (assignment route) | Authenticated (Finder only) |
| `PATCH` | `/claims/:id/status` | Approves or rejects a claim slip via `method-override` | Authenticated (Finder only) |
| `GET` | `/my-claims` | Personal student dashboard with status tabs (`?status=`) | Authenticated |

---

## 5. How Forms Submit PATCH Requests (`method-override`)

Standard HTML5 forms natively support only two HTTP methods: `GET` and `POST`. Browsers cannot submit `PATCH`, `PUT`, or `DELETE` directly from a `<form>` element.

To adhere to REST principles while maintaining a pure server-rendered application without client-side JavaScript frameworks, Phase 2 integrates the `method-override` middleware.

Forms include the `_method=PATCH` query parameter in the form action URL:
```html
<!-- Approve Claim Stamp Button -->
<form method="POST" action="/claims/<%= claim._id %>/status?_method=PATCH" onsubmit="return confirm('Approving marks this item Returned and cannot be undone. Confirm approval?');">
  <input type="hidden" name="status" value="Approved">
  <button type="submit" class="btn btn-approve btn-sm">Approve</button>
</form>

<!-- Reject Claim Stamp Button -->
<form method="POST" action="/claims/<%= claim._id %>/status?_method=PATCH">
  <input type="hidden" name="status" value="Rejected">
  <button type="submit" class="btn btn-reject btn-sm">Reject</button>
</form>
```

In `index.js`, Express parses the incoming request body and then inspects the `_method` query parameter:
```javascript
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
```
The server transparently re-routes the request from `POST` to the matching `router.patch(...)` handler, allowing full RESTful state transitions while preserving standard browser form ergonomics.

---

## 6. Data Architecture & Relational Strategy (All Four Models)

The system is designed with four normalized Mongoose schemas linked by relational `ObjectId` references:

```
┌────────────────┐             ┌────────────────┐
│    Student     │ ◄────────── │    LostItem    │
│  (_id, email,  │ reportedBy  │  (_id, status) │
│   fullName)    │             └────────────────┘
└───────┬────────┘
        │ reportedBy
        ▼
┌────────────────┐             ┌────────────────┐
│   FoundItem    │ ◄────────── │     Claim      │
│  (_id, status: │  foundItem  │ (_id, reason,  │
│ Available /    │             │ status,        │
│   Returned)    │ ──────────► │ reviewedAt)    │
└────────────────┘  claimedBy  └────────────────┘
```

1. **`Student` (`models/Student.js`):** Central identity dossier. Uniquely identified by `email`. Stores `fullName`, `department`, `contactNumber`.
2. **`LostItem` (`models/LostItem.js`):** Represents an item reported lost. Contains `reportedBy` referencing the `Student` ObjectId.
3. **`FoundItem` (`models/FoundItem.js`):** Represents discovered property in campus custody. Contains `status` (`Available` or `Returned`) and `reportedBy` referencing the finder's `Student` ObjectId.
4. **`Claim` (`models/Claim.js`):** Represents an ownership claim slip filed by a student for a found item.
   * `foundItem`: ObjectId reference to `FoundItem`.
   * `claimedBy`: ObjectId reference to `Student`.
   * `reason`: String describing proof of ownership (10–500 chars).
   * `status`: Enum (`Pending`, `Approved`, `Rejected`), default `Pending`.
   * `reviewedAt`: Date recorded upon decision.
   * **Compound Unique Index:** `{ foundItem: 1, claimedBy: 1 }` prevents concurrent or duplicate claim lodgements by the same student for the same item.

---

## 7. Business Rules Enforcement Directory

Every business rule is enforced strictly on the server; client-side hiding in EJS is never treated as a security boundary:

| Business Rule | Where Enforced (File & Function) | Behavior / Error Code |
|---|---|---|
| **Session Authentication Guard** | [`middleware/currentStudent.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/middleware/currentStudent.js) `requireAuth()` | Missing session redirects to `/sign-in` with flash notice (HTTP 302). |
| **Strict Hexadecimal ID Validation** | [`utils/validators.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/utils/validators.js) `isValidObjectId()` | Non-24-hex IDs immediately render clean 404 page; prevents `CastError`. |
| **Relationship Check (Item Existence)** | [`routes/foundItems.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/routes/foundItems.js) `POST /:id/claims` | Validates item exists before saving claim; renders 404 if missing. |
| **State Check (No Claims on Returned Items)** | [`routes/foundItems.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/routes/foundItems.js) `POST /:id/claims` | If `item.status === 'Returned'`, refuses claim with HTTP 409 Conflict. |
| **Self-Claim Prevention** | [`routes/foundItems.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/routes/foundItems.js) `POST /:id/claims` | If `reportedBy === claimedBy`, refuses claim with HTTP 403 Forbidden. |
| **Reason Validation (10–500 chars)** | [`utils/validators.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/utils/validators.js) `validateClaim()` | Blank or short reason re-renders case sheet with HTTP 400 and preserved input. |
| **Duplicate Claim Rule (1 Claim Per Student)** | [`routes/foundItems.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/routes/foundItems.js) & [`models/Claim.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/models/Claim.js) | Pre-checked via `Claim.findOne()`; backed by compound unique index and E11000 catch (HTTP 409). |
| **Allow-List Extraction (Spoof Prevention)** | [`routes/foundItems.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/routes/foundItems.js) `POST /:id/claims` | `status` is forced to `Pending`; `claimedBy` is forced to `req.currentStudent._id`. |
| **Claim Ownership Check (Finder Only)** | [`routes/claims.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/routes/claims.js) `PATCH /:id/status` | Non-finders attempting approval/rejection receive HTTP 403; claim remains unchanged. |
| **Claim State Check (Deciding Only Pending)** | [`routes/claims.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/routes/claims.js) `PATCH /:id/status` | Attempting to re-decide an approved/rejected claim returns HTTP 409 Conflict. |
| **Ordered Atomic Resolution & Rollback** | [`routes/claims.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/routes/claims.js) `PATCH /:id/status` | Atomically transitions claim (`Pending` &rarr; `Approved`), item (`Available` &rarr; `Returned`), rolls back if item conflict, and auto-rejects competing claims. |
| **Direct Item Status Update Authorization** | [`routes/foundItems.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/routes/foundItems.js) `PATCH /:id/status` | Strictly allows only the reporting student (HTTP 403 otherwise). |
| **Direct Status Prerequisite (Approved Claim)** | [`routes/foundItems.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/routes/foundItems.js) `PATCH /:id/status` | Transitions to `Returned` only if an `Approved` claim exists (HTTP 409 otherwise). |
| **Viewer Data Isolation** | [`routes/foundItems.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/routes/foundItems.js) `GET /:id` | Competing claims are queried and supplied ONLY to the verified finder. |

---

## 8. Architectural Decision: Sign-In by College Email

### Why Passwordless College Email Identification Was Chosen
In compliance with project specifications, authentication is implemented via verified college email address and signed, tamper-proof HTTP cookies:
1. **Focus on Core Business Logic & Invariants:** Eliminates boilerplate password hashing, password recovery flows, and salt management, keeping the codebase transparent, beginner-readable, and 100% focused on relational integrity, finite state machines, and concurrency controls.
2. **Campus Identity Model:** On a real college campus intranet, students authenticate once via their institution identity (SSO/LDAP). In this prototype, entering their registered college email simulates authenticating as that registered student dossier.
3. **Tamper-Proof Session Security:** Session tokens are stored in `httpOnly` signed cookies (`req.signedCookies.studentId`) using an HMAC signature (`COOKIE_SECRET`). Even though sign-in is passwordless, once signed in, students cannot forge other student IDs in their cookies without invalidating the cryptographic signature.

---

## 9. Verification & Live Demo Checklist

- [x] Claim model created with both references and compound unique index.
- [x] `POST /found-items/:id/claims` enforces all 8 rules.
- [x] `PATCH /claims/:id/status` enforces all 9 rules.
- [x] `PATCH /found-items/:id/status` enforces all assignment rules.
- [x] `GET /my-claims` renders student's own claims with status filters.
- [x] `GET /found-items` supports status filtering (`Available` / `Returned`).
- [x] Error page renders 400, 401/403, 404, 409, and 500 without stack traces.
- [x] All 16 automated tests pass against isolated test database (`npm test`).
