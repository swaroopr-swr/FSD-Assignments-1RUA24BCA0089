# Phase 1 Architectural & Technical Explanation

This document explains the data models, relationship strategy, form processing flows, validation philosophy, and includes a 2-minute live demonstration script for evaluation.

---

## 1. Data Models and Relationship Strategy

### Why `reportedBy` Stores a Student `ObjectId`
Instead of duplicating the student's name, department, or contact number directly on the item record, both `LostItem` and `FoundItem` schemas store:
```javascript
reportedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Student',
  required: true
}
```

**Key Reasons:**
1. **Single Source of Truth:** If a student updates their phone number or profile details, the change immediately reflects across every item they reported without data inconsistencies.
2. **Relational Integrity:** Mongoose `.populate('reportedBy', 'fullName department')` allows efficient querying and dynamic joins across MongoDB collections.
3. **Immutability of Ownership:** The ObjectId points to a verified database record created upon student registration.

---

## 2. HTML Form Processing & Security Pipeline

The application strictly adheres to standard server-rendered HTML forms without reliance on client-side JavaScript.

### Submission Lifecycle
```
[Browser Form (POST)]
        ↓ (application/x-www-form-urlencoded)
[Express Body-Parser (extended: true)]
        ↓
[Cookie-Parser (signed)] → Identifies req.currentStudent
        ↓
[Allow-List Field Extraction] → Discards unauthorized inputs (status, reportedBy)
        ↓
[Server-side Validator]
   ├── Invalid → Re-render Form (HTTP 400 + Errors + Preserved Inputs)
   └── Valid   → Save Document → Set Flash Cookie → Redirect (HTTP 302 Post/Redirect/Get)
```

### Why Allow-Listing is Crucial
If the application directly passed `req.body` into `new LostItem(req.body)`, a malicious user could craft a request payload containing:
```json
{
  "itemName": "Backpack",
  "reportedBy": "attacker_student_id",
  "status": "Resolved"
}
```
By explicitly cherry-picking only permitted fields in the route handler:
```javascript
const values = {
  itemName: req.body.itemName,
  category: req.body.category,
  description: req.body.description,
  lastSeenLocation: req.body.lastSeenLocation,
  dateLost: req.body.dateLost
};
```
and setting `reportedBy: req.currentStudent._id` directly from the authenticated session, spoofing and privilege escalation are completely prevented.

### Post/Redirect/Get (PRG) Pattern
After a successful `POST`, the server redirects to a `GET` route (`/lost-items/:id`). This prevents accidental duplicate submissions if the user refreshes the page or presses the browser back button.

---

## 3. Validation Hierarchy

Validation operates at two distinct layers:

1. **Route/Utility Layer (`utils/validators.js`):**
   - Executed **before** any database operation.
   - Collects all user-facing errors into a key-value object (`{ itemName: 'Item name is required', dateLost: 'Date lost cannot be in the future' }`).
   - Allows re-rendering the template with specific, field-level feedback and accessible `aria-invalid` and `aria-describedby` attributes.

2. **Mongoose Schema Layer (`models/`):**
   - Serves as the ultimate defense boundary.
   - Enforces unique indexing on `email`, minimum/maximum string lengths, and schema-level regex checks.

### Safe ID Handling
Standard `mongoose.Types.ObjectId.isValid` accepts arbitrary 12-character strings, which can lead to casting exceptions. Our validator uses a strict 24-character hexadecimal regex:
```javascript
function isValidObjectId(id) {
  if (typeof id !== 'string') return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
}
```
Any invalid ID instantly renders a clean 404 page rather than crashing the server with a CastError.

---

## 4. Two-Minute Live Demonstration Script

Follow this script to demonstrate the system to mentors or evaluators:

1. **Step 1: The Property Office Aesthetic (30s)**
   - Open `http://localhost:3000`.
   - Point out the Property Office design language: dot grid paper background, live stats count strip, Georgia serif titles, and Courier New monospace labels.
   - Show that live counts currently reflect real database records.

2. **Step 2: Student Registration & Session (30s)**
   - Click **Register** (`/students/new`).
   - Submit an invalid form (e.g. invalid phone number `12345`) to show field-level error messages and preserved values.
   - Enter valid details (e.g., Name: *Rahul Sharma*, Email: *rahul@college.edu*, Dept: *Computer Applications*, Phone: *9876543210*).
   - Submit. Notice the automatic sign-in slip in the masthead ("Signed in as Rahul Sharma") and the student dossier card.

3. **Step 3: Filing a Lost Item Slip (30s)**
   - Click **Report an Item** (`/report`) &rarr; **File Lost Report**.
   - Fill in: Title: *Blue Laptop Charger*, Category: *Electronics*, Location: *Central Library Table 4*, Date: *Today*.
   - Submit. Show the newly minted hang tag on the Case File page with reference code `LF-XXXXXX` and rubber stamp `LOST`.
   - Show the "Filer Record" sidebar linking back to Rahul's dossier.

4. **Step 4: Search, Filtering & Ledger Inspection (30s)**
   - Navigate to **Lost Items** (`/lost-items`).
   - Test the keyword filter: type `Library` &rarr; click **Search**. The list filters smoothly.
   - Clear filters and inspect the tag card: eyelet, string, clipped corner, and reference code.
   - Click **Sign out** and verify that attempting to report an item now prompts you to sign in.
