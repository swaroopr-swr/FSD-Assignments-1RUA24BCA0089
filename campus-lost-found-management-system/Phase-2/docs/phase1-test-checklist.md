# Phase 1 Manual Test Checklist

Use this checklist to verify functional correctness, validation resilience, and security constraints before submission.

---

## Test Execution Matrix

| # | Test Scenario | Steps to Execute | Expected Result | Status |
|---|---|---|---|---|
| **1** | **Successful Student Registration** | 1. Go to `/students/new`<br>2. Enter valid details (`Aarav Patel`, `aarav@college.edu`, `BCA`, `9123456780`)<br>3. Submit | Redirected to `/students/:id` with success banner; masthead shows "Signed in as Aarav Patel". | Verified |
| **2** | **Duplicate Email Registration** | 1. Go to `/students/new`<br>2. Submit with `aarav@college.edu` again | HTTP 400; Email field displays "A student profile is already registered with this email address."; other fields preserved. | Verified |
| **3** | **Empty & Whitespace-Only Validation** | 1. Open `/students/new`<br>2. Fill all fields with only spaces (`   `)<br>3. Submit | HTTP 400; Field error messages appear under every required field; form does not submit. | Verified |
| **4** | **Invalid Email & Phone Format** | 1. Go to `/students/new`<br>2. Enter Email: `notanemail`<br>3. Enter Phone: `12345`<br>4. Submit | HTTP 400; Email highlights invalid format; phone highlights requirement for 10 digits starting with 6–9. | Verified |
| **5** | **Future Date Rejection** | 1. Sign in<br>2. Go to `/lost-items/new`<br>3. Enter a date tomorrow or next month<br>4. Submit | HTTP 400; Date field indicates "Date lost cannot be in the future."; input values preserved. | Verified |
| **6** | **Successful Lost Item Filing** | 1. Sign in as a student<br>2. Go to `/lost-items/new`<br>3. Fill all fields with valid data<br>4. Submit | Redirected to `/lost-items/:id`; assigned `LF-XXXXXX` ref; status stamp `LOST`; reporter linked to signed-in student. | Verified |
| **7** | **Successful Found Item Filing** | 1. Sign in as a student<br>2. Go to `/found-items/new`<br>3. Fill all fields with valid data<br>4. Submit | Redirected to `/found-items/:id`; assigned `LF-XXXXXX` ref; status stamp `AVAILABLE`; reporter linked to signed-in student. | Verified |
| **8** | **Non-existent / Invalid ID Handling** | 1. Navigate to `/students/abc-123`<br>2. Navigate to `/lost-items/507f1f77bcf86cd799439011` (non-existent 24-hex ID) | Server does not crash; renders friendly 404 page with "That reference isn't valid" or "No record found". | Verified |
| **9** | **Unauthenticated Report Protection** | 1. Click Sign Out in masthead<br>2. Try to directly navigate to `/lost-items/new` or `/found-items/new` | Immediate redirect to `/sign-in` with notice banner "Please sign in with your college email...". | Verified |
| **10** | **Ownership Tampering Immunity** | 1. Send POST to `/lost-items` with forged body `{ "reportedBy": "other_id", "status": "Resolved" }` | Server ignores body fields; derives `reportedBy` strictly from session cookie; initial status forced to `Lost`. | Verified |
| **11** | **Keyword & Category Search** | 1. Go to `/lost-items`<br>2. Search for existing location or title<br>3. Filter by category | Results match filter; count displays `X TAGS FOUND`; Clear link appears; searching regex chars like `(` does not crash server. | Verified |
| **12** | **Search With Zero Matches** | 1. Search for `xyznotfoundstring` on `/lost-items` | Displays empty drawer panel with "No tags match your search." and a Clear Filters button. | Verified |
| **13** | **Empty Ledger State** | 1. View lists when database has no records | Displays empty drawer panel with "No lost items have been reported yet." and a call-to-action button. | Verified |
| **14** | **Student Dossier Cross-Reference** | 1. Open `/students/:id` | Displays ID card info and dual ledgers showing all lost items and found items filed by this student. | Verified |
