# Campus Lost & Found — Phase 2 Plan & Specification

> **Status:** Planned / Architecture Specification  
> **Development Phase:** Scheduled to commence after Phase 1 evaluation and review.  
> **Note:** To maintain clean separation for Phase 1 submission and review, Phase 2 features and code are not pre-emptively implemented in Phase 1.

---

## 1. Phase 2 Overview & Objectives

While Phase 1 establishes the core campus property registry (student identity, lost item filing, found item custody, and search), **Phase 2 introduces the ownership resolution and claim lifecycle**. 

In Phase 2, students who recognise their lost property among the found items can lodge a formal **Claim Slip**. The finder can then review competing claims, verify proof of ownership, and issue rubber-stamp decisions (`APPROVED` or `REJECTED`) directly through the system.

---

## 2. Planned Data Architecture

### The `Claim` Model (`models/Claim.js`)
Phase 2 will introduce the `Claim` Mongoose schema with timestamps:

```javascript
const claimSchema = new mongoose.Schema({
  // The found item being claimed
  foundItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoundItem',
    required: [true, 'Found item reference is required']
  },

  // The student asserting ownership
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Claimant student reference is required']
  },

  // Description of proof (serial numbers, internal contents, purchase receipts)
  reason: {
    type: String,
    required: [true, 'Claim explanation and proof of ownership is required'],
    trim: true,
    minlength: [10, 'Reason must be at least 10 characters'],
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },

  // Lifecycle status of the claim
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

// Compound unique index ensuring one claim per student per found item
claimSchema.index({ foundItem: 1, claimedBy: 1 }, { unique: true });
```

---

## 3. Core Business Logic & Security Rules

1. **Self-Claim Prevention:** A student cannot claim an item they themselves reported finding (`claimedBy !== foundItem.reportedBy`).
2. **One Claim per Item per Student:** Enforced both by pre-query checks and a unique compound MongoDB index on `{ foundItem, claimedBy }`.
3. **Finder-Only Authorization:** Only the original finder who logged the item can approve or reject claims. The backend checks:
   ```javascript
   if (foundItem.reportedBy.toString() !== req.currentStudent._id.toString()) {
     return res.status(403).render('error', { message: 'Unauthorized: Only the item finder can review claims.' });
   }
   ```
4. **Atomic Resolution:** Approval atomically updates `FoundItem.status` from `Available` to `Returned` using `findOneAndUpdate({ _id, status: 'Available' }, { status: 'Returned' })`. This prevents race conditions where multiple claims could be approved simultaneously.
5. **Lockout on Returned Items:** Once an item has transitioned to `Returned`, all further claim submissions are refused at the route level.

---

## 4. Planned Routes & Middleware

| Method | Route | Description | Access |
|---|---|---|---|
| `POST` | `/found-items/:id/claims` | Submit a claim slip for a found item | Signed-in Claimant |
| `PATCH` | `/claims/:id/status` | Approve or reject a claim (via `method-override`) | Signed-in Finder |
| `GET` | `/my-claims` | Personal dashboard of all claims filed by the student | Signed-in Student |

### Dependency Addition: `method-override`
HTML forms natively support only `GET` and `POST`. Phase 2 will introduce `method-override` middleware to support RESTful `PATCH` requests on status transitions:
```html
<form method="POST" action="/claims/<%= claim._id %>/status?_method=PATCH">
  <input type="hidden" name="status" value="Approved">
  <button type="submit" class="btn btn-primary">Approve Claim</button>
</form>
```

---

## 5. UI/UX Extensions ("The Property Office")

Phase 2 will expand the Property Office aesthetic with new elements:
- **Claim Slips:** A dashed claim panel rendered on `/found-items/:id` allowing authenticated visitors to submit proof of ownership.
- **Finder Ledger:** An interactive ledger table rendered only for the finder, listing all claimant dossiers, submission timestamps, reasons, and decision buttons.
- **New Rubber Stamps:** Angled rubber stamp styles for `PENDING` (rust outline), `APPROVED` (olive filled), `REJECTED` (rust-deep hatch), and `RETURNED` (olive bold).
- **Status Filter Tabs:** Filter tabs on `/found-items` allowing visitors to toggle between *All*, *Available*, and *Returned* articles.

---

## 6. Implementation Strategy

1. **Tagging Phase 1:** Before writing any Phase 2 code, Phase 1 will be tagged as `phase-1-submission` in Git history.
2. **Non-Destructive Evolution:** Phase 2 will overlay on Phase 1 without altering existing `Student` or `LostItem` schemas, as `FoundItem.status` already includes `Returned` in its enum definition.
