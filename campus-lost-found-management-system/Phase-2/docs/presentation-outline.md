# Phase 2 Presentation Outline & Live Demonstration Script

This document provides a slide-by-slide presentation structure, a step-by-step 2-student live demonstration script, and team assignment sections for the final course review.

---

## 1. Slide-by-Slide Presentation Structure

### Slide 1: Title & The Property Office Concept
* **Title:** Campus Lost & Found Management System — Phase 2: Claims, Ownership Resolution & Backend Integrity
* **Subtitle:** Full-Stack Node.js, Express, EJS & MongoDB Atlas Architecture
* **Visual Aesthetic:** "The Property Office" (physical hang tags, eyelets, string cards, underline filing slips, rubber status stamps).
* **Core Philosophy:** No hard-coded state, zero client-side trust, comprehensive backend business rule enforcement.

### Slide 2: The Phase 2 Scope & Evolution
* **Transition from Phase 1 to Phase 2:**
  * Phase 1 built the registry: student identity dossiers, lost item logging, found item custody, keyword search, category filtering, and signed cookie sessions.
  * Phase 2 completes the lifecycle: ownership claims, privacy-first case sheets, finder review ledger, atomic status transitions, and regression-proof test suites.
* **The Dependency Footprint:**
  * Only one runtime package added: `method-override` to support standard HTML forms sending `PATCH` requests.
  * Zero testing packages added: 100% native Node.js (`node:test`, `node:assert`, built-in `fetch`).

### Slide 3: Data Architecture & Relational Design
* **The Four Models:** `Student`, `LostItem`, `FoundItem`, `Claim`.
* **Why References instead of Embedded Documents?**
  * Single source of truth: updating student contact info propagates everywhere.
  * Relational integrity: Mongoose `.populate()` joins data on read.
  * Compound Unique Index on `Claim`: `{ foundItem: 1, claimedBy: 1 }` prevents concurrent duplicate claims.
* **Diagram:**
  ```
  [ Student ] (Identity & Dossier)
      ▲   ▲
      │   │ reportedBy
      │   ├────────────────────────┐
      │   │                        │
  [ LostItem ]              [ FoundItem ] ◄───┐
                                  ▲           │ foundItem
                                  │           │
                       claimedBy  │      [ Claim ]
                                  └───────────┤ (Pending / Approved / Rejected)
  ```

### Slide 4: The Five Backend Thinking Challenges
1. **Ownership Check:** Only the student who reported the found item may review claims (`claim.foundItem.reportedBy.toString() === req.currentStudent._id.toString()`).
2. **Relationship Check:** Validates 24-character hexadecimal IDs and verifies that both the item and student exist before creating a claim.
3. **State Check:** Terminal `Returned` status prevents further claims; claims that are not `Pending` cannot be decided again.
4. **Duplicate-Claim Rule:** One claim per student per item, ever. Enforced by application `findOne` and database unique compound index.
5. **Safe Update:** Uses atomic `$set` updates (`findOneAndUpdate`), completely preventing mass-assignment attacks.

### Slide 5: Viewer Privacy & Case File Authorization
* Explain that `GET /found-items/:id` never sends other students' claim data to non-finders.
* **Signed-out visitor:** Prompted to sign in.
* **Non-finder student (no claim):** Sees claim slip filing form.
* **Non-finder student (claimed):** Sees only their own claim status.
* **Finder student:** Sees the claims ledger with claimant contact details and decision buttons.
* **Closed item:** Displays prominent `RETURNED` rubber stamp and closes claim ingestion.

### Slide 6: Testing, Reliability & Results
* **Test Architecture:** 16 automated tests run against a standalone test database (`MONGODB_URI_TEST`).
* Tests verify security boundaries (403), format checks (404), validation rules (400), state conflicts (409), and cascades.
* **Pass Rate:** 100% (16/16 tests passing).

---

## 2. Step-by-Step Two-Student Live Demonstration Script

Follow this script during the live evaluation using two browser windows (e.g. Chrome Normal Window for **Student A**, Chrome Incognito Window for **Student B**):

### Pre-Demo Setup
1. Start the server: `npm start` in the Phase-2 directory.
2. Open **Window 1 (Normal Window)** at `http://localhost:3000`.
3. Open **Window 2 (Incognito Window)** at `http://localhost:3000`.

---

### Step 1: Student A (Finder) Registers & Logs a Found Item (Window 1)
1. In Window 1, click **Register** (`/students/new`).
2. Fill out:
   * **Full Name:** `Ananya Sen`
   * **College Email:** `ananya@campus.edu`
   * **Department:** `Computer Applications`
   * **Contact Number:** `9876543210`
3. Click **Register Student Profile**.
   * *Notice:* Masthead automatically shows "Signed in as Ananya Sen".
4. Click **Report an Item** &rarr; **Notice of Discovery** (`/found-items/new`).
5. Fill out:
   * **Item Name:** `Titan Octane Chronograph Watch`
   * **Category:** `Bottles & Accessories`
   * **Description:** `Silver stainless steel watch found on the wooden bench outside the Library entrance.`
   * **Found Location:** `Central Library Benches`
   * **Date Found:** Select today's date.
6. Click **Log Discovered Property**.
   * *Notice:* Case file opens with reference `LF-XXXXXX` and blue `AVAILABLE` stamp. Ananya is listed as the finder.

---

### Step 2: Student B (Claimant) Registers & Inspects the Item (Window 2)
1. In Window 2 (Incognito), click **Register** (`/students/new`).
2. Fill out:
   * **Full Name:** `Rohan Mehta`
   * **College Email:** `rohan@campus.edu`
   * **Department:** `Mechanical Engineering`
   * **Contact Number:** `8765432109`
3. Click **Register Student Profile**.
   * *Notice:* Masthead shows "Signed in as Rohan Mehta".
4. Click **Found Items** in the navigation bar.
5. Click **Open tag &rarr;** on Ananya's watch.
   * *Point to evaluate:* Notice that Rohan sees the **Claim Slip form ("01 — Why this is yours")** with the ruled-line textarea, NOT the finder ledger.

---

### Step 3: Student B Submits an Ownership Claim (Window 2)
1. Under "Why this is yours", enter:
   `The watch has a small triangular scratch near the 4 o'clock marker and the second hand is red.`
2. Click **Submit claim &rarr;**.
   * *Notice:* Green flash banner appears: *"Claim submitted. The finder will review it."*
   * *Notice:* The form is now replaced by Rohan's own submitted claim slip showing rubber stamp `PENDING`.
3. Click **My Claims** in the masthead.
   * *Notice:* The item is listed in Rohan's personal claims ledger with the `PENDING` stamp.

---

### Step 4: Security Test — Student B Attempts Unauthorized Approval (Window 2)
1. To prove backend security to the evaluator, show that Rohan cannot approve his own claim.
2. In Window 2, craft or trigger an approval attempt (or inspect the form action):
   * Open Developer Tools Console and execute:
     ```javascript
     fetch('/claims/STATUS_ID/status?_method=PATCH', { method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: 'status=Approved' })
     ```
   * *Evaluator check:* The backend returns **HTTP 403 Forbidden: Only the finder who reported this item may decide claims.** The claim remains strictly `Pending`.

---

### Step 5: Student A (Finder) Reviews the Claims Ledger & Approves (Window 1)
1. Switch back to Window 1 (Ananya's window) and refresh the case file page.
2. *Point to evaluate:* Notice that Ananya now sees the **Finder Custody Ledger** with:
   * Rohan's name, department, and contact email.
   * Rohan's proof description.
   * Rubber stamp `PENDING`.
   * Warning: *"Approving a claim marks this item Returned and cannot be undone."*
   * Two decision stamps: **Approve** (filled olive) and **Reject** (outlined rust).
3. Click **Approve**. A browser confirmation dialog asks to confirm.
4. Click **OK**.
   * *Notice:* Green flash banner appears: *"Claim approved. The item is now marked as Returned."*
   * *Notice:* Item status stamp immediately changes to heavy bold olive **RETURNED**.
   * *Notice:* Case file displays the prominent rotated olive **RETURNED** rubber stamp and notice: *"This item has been returned to its owner. No further claims may be lodged."*

---

### Step 6: Student B Sees Resolution & New Claims Refused (Window 2)
1. Switch back to Window 2 (Rohan's window) and refresh `/my-claims`.
   * *Notice:* Rohan's claim stamp is now bold olive **APPROVED**.
2. Click into the item case file.
   * *Notice:* Notice states custody is closed. The claim form is completely gone.
3. Even if another student tries to `POST /claims`, the backend enforces the **State Check** and rejects the attempt with **HTTP 409 Conflict**.

---

## 3. Team Member Presentation Roles

Use this table during team preparation so each member knows which architectural domain they will speak to during evaluation:

| Team Member Name | Component / Topic | Code Files to Present | Key Concept to Highlight |
|---|---|---|---|
| **Member 1** | **Identity, Models & Schemas** | [`models/Claim.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/models/Claim.js), [`models/FoundItem.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/models/FoundItem.js) | Compound unique index `{ foundItem: 1, claimedBy: 1 }`, `Claim.init()`, and ObjectId references vs duplication. |
| **Member 2** | **Form Security & Business Logic** | [`routes/foundItems.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/routes/foundItems.js), [`utils/validators.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/utils/validators.js) | Allow-listing input parameters, 2-phase validation (route + schema), Post/Redirect/Get pattern, and self-claim prevention. |
| **Member 3** | **Authorization & Atomic Transitions** | [`routes/claims.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/routes/claims.js) | Ownership check (`req.currentStudent._id`), string comparison, ordered atomic updates without multi-document transactions, and automatic rejection cascade. |
| **Member 4** | **UI/UX & "The Property Office" Design** | [`views/partials/claim-panel.ejs`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/views/partials/claim-panel.ejs), [`public/css/components.css`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/public/css/components.css) | Dynamic viewer-based rendering (finder vs claimant), tactile paper styling, rubber stamp badges, and mobile stacking. |
| **Member 5** | **Testing Suite & Reliability** | [`tests/phase2.test.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/tests/phase2.test.js) | Native `node:test` architecture, separate test database isolation, cookie simulation, and all 16 test cases passing. |
