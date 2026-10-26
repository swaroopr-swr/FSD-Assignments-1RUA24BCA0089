# Phase 2 Architectural Explanation & Thinking Challenges

This document details the security architecture, concurrency controls, data integrity mechanisms, and business rules implemented in **Phase 2** of the Campus Lost & Found Management System ("The Property Office").

---

## 1. The Five Core Thinking Challenges

### Challenge 1: The Ownership Check
* **What it is:** The rule that only the student who discovered and logged a found item has the legal and administrative authority to review, approve, or reject claims lodged against that article.
* **Where it is enforced:**
  * File: [`routes/claims.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/routes/claims.js)
  * Code:
    ```javascript
    // Compare MongoDB ObjectIds as strings to avoid object reference inequality
    if (
      !claim.foundItem ||
      claim.foundItem.reportedBy.toString() !== req.currentStudent._id.toString()
    ) {
      return res.status(403).render('error', {
        status: 403,
        title: '403 — Unauthorized Decision Attempt',
        message: 'Forbidden: Only the student who reported this found item may decide claims.'
      });
    }
    ```
  * Also enforced on direct item status modification in [`routes/foundItems.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/routes/foundItems.js) (`PATCH /found-items/:id/status`).
* **What would go wrong without it:** Any authenticated student on campus could inspect another student's found item, forge a `PATCH` request with arbitrary tools (like `curl` or browser devtools), approve fraudulent claims to hand over expensive property (laptops, jewelry, wallets) to their accomplices, or arbitrarily reject legitimate claims from genuine owners.

---

### Challenge 2: The Relationship Check
* **What it is:** Enforcing relational integrity prior to document creation. A claim slip cannot exist in isolation; it must reference a real, existing `FoundItem` and an authenticated, existing `Student`.
* **Where it is enforced:**
  * File: [`routes/foundItems.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/routes/foundItems.js) (`POST /found-items/:id/claims`)
  * Code:
    ```javascript
    // 1. Strict Hexadecimal ID Format Check
    if (!isValidObjectId(id)) {
      return res.status(404).render('404', { message: 'Invalid found item identifier.' });
    }

    // 2. Database Existence Check
    const item = await FoundItem.findById(id).populate('reportedBy', 'fullName department');
    if (!item) {
      return res.status(404).render('404', { message: 'No found item record discovered with that reference.' });
    }

    // 3. Authenticated Identity Anchor
    const claim = new Claim({
      foundItem: item._id,            // Sourced from validated route param
      claimedBy: req.currentStudent._id, // Sourced from verified signed cookie
      reason: req.body.reason.trim(),
      status: 'Pending'
    });
    ```
* **What would go wrong without it:** The database would suffer from orphaned documents and foreign-key corruption. Submitting claims against non-existent item IDs would clutter the collection with ghost claims, leading to null-pointer crashes during `.populate('foundItem')` lookups on `/my-claims`.

---

### Challenge 3: The State Check
* **What it is:** Enforcing finite state machine invariants:
  1. An item marked `Returned` is closed; no further claims may ever be lodged.
  2. A claim marked `Approved` or `Rejected` is final; it can never be re-decided.
  3. Approving one claim atomically transitions the item to `Returned` and transitions all other pending claims to `Rejected`.
* **Where it is enforced:**
  * File: [`routes/foundItems.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/routes/foundItems.js) (`POST /found-items/:id/claims`)
    ```javascript
    if (item.status === 'Returned') {
      return res.status(409).render('error', {
        status: 409,
        title: '409 — Item Already Returned',
        message: 'This item has already been marked as Returned. No new claims may be lodged.'
      });
    }
    ```
  * File: [`routes/claims.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/routes/claims.js) (`PATCH /claims/:id/status`)
    ```javascript
    if (claim.status !== 'Pending') {
      return res.status(409).render('error', {
        status: 409,
        title: '409 — Decision Conflict',
        message: 'This claim has already been reviewed and cannot be decided again.'
      });
    }
    ```
* **What would go wrong without it:** In a concurrent multi-user environment, two finders or claimants could cause double-returns or contradictory statuses. For example, two competing claimants could both be marked `Approved` for the exact same physical article, or a student could claim an item days after it was physically handed back to someone else.

---

### Challenge 4: The Duplicate-Claim Rule
* **What it is:** A strict policy: **One claim per student per found item, ever.** Even if an earlier claim was rejected, the student may not lodge a second claim for that item.
* **Justification:** Prevents spam and badgering of student finders. Once a finder inspects the proof and renders a decision, that decision is final for that claimant.
* **Where it is enforced:** Enforced at two independent defense perimeters:
  1. **Application-layer check** in [`routes/foundItems.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/routes/foundItems.js):
     ```javascript
     const existingClaim = await Claim.findOne({
       foundItem: item._id,
       claimedBy: req.currentStudent._id
     });
     if (existingClaim) {
       return res.status(409).render('error', {
         status: 409,
         title: '409 — Duplicate Claim Conflict',
         message: 'You have already submitted a claim for this item. Only one claim is permitted per student.'
       });
     }
     ```
  2. **Database-layer compound unique index** in [`models/Claim.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/models/Claim.js):
     ```javascript
     claimSchema.index({ foundItem: 1, claimedBy: 1 }, { unique: true });
     ```
     With index synchronization `await Claim.init()` executed at server boot. Caught via MongoDB error code `11000` as a safety net.
* **What would go wrong without it:** A student could submit dozens of identical or slightly altered claims to harass the finder or bypass rejection. In high-concurrency race conditions (e.g. double-clicking submit), duplicate claims would bypass application-level `findOne` checks without the compound unique database index.

---

### Challenge 5: The Safe Update
* **What it is:** Updating records strictly using atomic conditional operators (`findOneAndUpdate` with `$set`) rather than loading a document, mutating properties from untrusted request bodies, and calling `doc.save()`.
* **Where it is enforced:**
  * File: [`routes/claims.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/routes/claims.js)
  * Code:
    ```javascript
    // Atomically update claim only if it is still Pending
    const updatedClaim = await Claim.findOneAndUpdate(
      { _id: claim._id, status: 'Pending' },
      { $set: { status: 'Approved', reviewedAt } },
      { new: true }
    );

    // Atomically transition item only if it is still Available
    const updatedItem = await FoundItem.findOneAndUpdate(
      { _id: claim.foundItem._id, status: 'Available' },
      { $set: { status: 'Returned' } },
      { new: true }
    );
    ```
* **Why not MongoDB transactions?**
  Local standalone MongoDB instances (e.g. typical development environments without replica set clustering) do not support multi-document ACID transactions. Instead, we use **ordered atomic conditional updates** with a compensating rollback action: if updating the item fails because it was already marked `Returned`, the approved claim is immediately rolled back to `Pending` and a 409 error is returned.
* **What would go wrong without it:**
  Mass-assignment vulnerabilities. If an application blindly accepts `req.body` into `claim.save()` or `Claim.findByIdAndUpdate(id, req.body)`, an attacker could inject `{ "claimedBy": "other_id", "reason": "overwritten", "foundItem": "hacked" }`.

---

## 2. Viewer Authorization Matrix (Found Item Case Sheet)

The case sheet route `GET /found-items/:id` enforces server-side privacy boundaries before rendering:

| Viewer Type | Data Provided in Route | What the Viewer Sees |
|---|---|---|
| **Signed-Out Visitor** | `item`, `isFinder: false`, `claims: []`, `userClaim: null` | Case file + "Sign in to claim this item" callout |
| **Claimant (Item Available, No Claim)** | `item`, `isFinder: false`, `claims: []`, `userClaim: null` | Case file + Claim Slip filing form ("01 — Why this is yours") |
| **Claimant (Item Available, Claim Lodged)** | `item`, `isFinder: false`, `claims: []`, `userClaim: [Doc]` | Case file + Their own claim slip with status stamp (`PENDING`) |
| **Original Finder** | `item`, `isFinder: true`, `claims: [All Docs]`, `userClaim: null` | Case file + Finder Claims Ledger (all applicants, proofs, decision stamps) |
| **Any Visitor (Item Returned)** | `item`, `isFinder: false/true`, `claims: [] / [History]`, `userClaim: null` | Case file + Heavy `RETURNED` stamp + Closed custody notice |

> [!IMPORTANT]
> **Data Isolation Guarantee:** Competing claimants never receive other students' claims in the response payload. Claims are filtered at the Mongoose query level in the route handler, never hidden via CSS or EJS if-statements.
