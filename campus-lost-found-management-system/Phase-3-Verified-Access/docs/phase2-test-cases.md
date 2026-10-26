# Phase 2 Test Cases & Execution Matrix

This document details the automated test scenarios executed against the application and a dedicated test database (`MONGODB_URI_TEST`). All test cases correspond to automated assertions in [`tests/phase2.test.js`](file:///Users/swarpson/my-app/FSD-Assignments-1RUA24BCA0089/campus-lost-found-management-system/Phase-2/tests/phase2.test.js).

---

## 1. Test Execution Matrix

| Test ID | Scenario / Feature | Test Steps | Expected Result | Actual Result (Real Run) | Status |
|---|---|---|---|---|---|
| **TC-01** | **Successful Report Creation** | 1. Authenticate as Student A.<br>2. `POST /found-items` with valid fields.<br>3. `POST /lost-items` with valid fields. | HTTP 302 redirect to item detail page (`/found-items/:id`); document saved in DB with status `Available` and `reportedBy: StudentA`. | HTTP 302; item persisted with reference `LF-XXXXXX` and status `Available`. | **PASS** |
| **TC-02** | **Invalid Identifier Format** | 1. Authenticate as Student B.<br>2. `GET /found-items/abc`. | HTTP 404 page rendered; application does not crash with Mongoose `CastError`. | HTTP 404; "That reference number is not a valid found item identifier." | **PASS** |
| **TC-03** | **Missing Record Lookup** | 1. Generate valid 24-char ObjectId not in database.<br>2. `GET /found-items/:randomId`. | HTTP 404 page rendered. | HTTP 404; "No found item record discovered with that reference number." | **PASS** |
| **TC-04** | **Signed-Out Access Control** | 1. Clear session cookie.<br>2. `POST /found-items/:id/claims` with valid reason. | HTTP 302 redirect to `/sign-in` with flash notice. | HTTP 302 redirect to `/sign-in`; no claim created in database. | **PASS** |
| **TC-05** | **Self-Claim Prevention** | 1. Authenticate as Finder (Student A).<br>2. `POST /found-items/:id/claims` for own found item. | HTTP 403 Forbidden; error page explains self-claims are prohibited. | HTTP 403; "You cannot submit an ownership claim for an item you reported finding." | **PASS** |
| **TC-06** | **Invalid Form Data (Whitespace Reason)** | 1. Authenticate as Student B.<br>2. `POST /found-items/:id/claims` with `reason: "           "`. | HTTP 400 Bad Request; re-render case sheet with field error. | HTTP 400; re-rendered with validation error highlighting on textarea. | **PASS** |
| **TC-07** | **Invalid Form Data (Short Reason)** | 1. Authenticate as Student B.<br>2. `POST /found-items/:id/claims` with `reason: "My watch"`. | HTTP 400 Bad Request; message indicates 10–500 character rule. | HTTP 400; "Proof of ownership reason must be between 10 and 500 characters." | **PASS** |
| **TC-08** | **Safe Claim Creation & Spoof Prevention** | 1. Authenticate as Student B.<br>2. `POST /found-items/:id/claims` with valid reason and forged `status: "Approved"`, `claimedBy: StudentA`. | HTTP 302 redirect; claim created with status `Pending` and `claimedBy: StudentB`; forged values ignored. | HTTP 302; DB inspection confirms status is `Pending`, `claimedBy` is Student B, and `reviewedAt` is null. | **PASS** |
| **TC-09** | **Duplicate Claim Rule** | 1. Authenticate as Student B.<br>2. Submit a second claim for the exact same found item. | HTTP 409 Conflict; duplicate claim is refused; database compound index prevents multiple entries. | HTTP 409; "You have already submitted a claim for this item. Duplicate claims are refused." | **PASS** |
| **TC-10** | **Unauthorized Decision Attempt** | 1. Authenticate as Claimant (Student B).<br>2. Send `PATCH /claims/:claimId/status?_method=PATCH` with `status: "Approved"`. | HTTP 403 Forbidden; claim status in database remains `Pending`; `reviewedAt` remains null. | HTTP 403; database inspection confirms claim status remained `Pending`. | **PASS** |
| **TC-11** | **Multi-Claimant Ingestion** | 1. Authenticate as Student C.<br>2. `POST /found-items/:id/claims` for the same item. | HTTP 302 redirect; Student C claim logged with status `Pending`. | HTTP 302; Finder ledger now contains two distinct competing claims. | **PASS** |
| **TC-12** | **Finder Approval & Cascade Resolution** | 1. Authenticate as Finder (Student A).<br>2. `PATCH /claims/:claimBId/status?_method=PATCH` with `status: "Approved"`. | HTTP 302 redirect; Claim B becomes `Approved`; FoundItem becomes `Returned`; Claim C becomes `Rejected`. | HTTP 302; Claim B is `Approved`, FoundItem is `Returned`, Claim C is automatically marked `Rejected`. | **PASS** |
| **TC-13** | **Re-Deciding a Resolved Claim** | 1. Authenticate as Finder (Student A).<br>2. Attempt to reject the already `Approved` Claim B. | HTTP 409 Conflict; state machine refuses re-decision. | HTTP 409; "This claim has already been reviewed and cannot be decided again." | **PASS** |
| **TC-14** | **Claiming a Returned Item** | 1. Authenticate as Student D.<br>2. `POST /found-items/:returnedId/claims`. | HTTP 409 Conflict; claim refused at route level. | HTTP 409; "This item has already been marked as Returned. No new claims may be lodged." | **PASS** |
| **TC-15** | **Direct Item Status Update (`PATCH /found-items/:id/status`)** | 1. Verify non-finder attempt returns 403.<br>2. Verify non-Returned body status returns 400.<br>3. Verify item without approved claim returns 409.<br>4. Verify already returned item returns 409. | Strict compliance with assignment status route rules. | Non-finder returns 403; invalid status returns 400; unapproved prerequisite returns 409; re-transition returns 409. | **PASS** |
| **TC-16** | **Search, Status Filtering & My Claims** | 1. Query `/found-items?q=Mechanical`.<br>2. Query `/found-items?status=Returned`.<br>3. Query `/found-items?status=Available`.<br>4. Query `/my-claims` with active cookie. | Filtered results returned with HTTP 200 and accurate item counts and statuses. | HTTP 200 for all queries; keyword, status filters, and `/my-claims` personal dashboard render correctly. | **PASS** |

---

## 2. Test Verification Summary

* **Total Test Cases Executed:** 16
* **Passed:** 16
* **Failed:** 0
* **Test Isolation:** Dedicated database `campus_lost_found_test` purged before execution; all collections reset; child server process cleanly torn down upon test completion.
