# Campus Lost & Found Management System

A full-stack campus property office application built with **Node.js, Express.js, EJS, and MongoDB Atlas (Mongoose)** following "The Property Office" editorial design direction (physical hang tags, filing slips, and rubber stamps).

---

## Project Organization & Phases

This repository is organized by project phases to enable independent review, evaluation, and progression:

```
campus-lost-found-management-system/
├── README.md                      # Project landing page (this file)
├── package.json                   # Workspace root script orchestration
├── .gitignore                     # Repository-level ignore rules
├── .env.example                   # Atlas environment variables template
│
├── demo-screenshots/              # Visual proof of running app & Atlas data
│   ├── README.md                  # Screenshots index & walkthrough
│   └── 01-11-*.png                # 11 high-resolution interface & database captures
│
├── docs/                          # Phase 2 evaluation documentation & test results
│   ├── phase2-explanation.md      # Five core thinking challenges & security models
│   ├── phase2-test-cases.md       # Comprehensive test matrix & verified results
│   ├── phase2-test-results.txt    # Saved output of npm test (16/16 pass)
│   └── presentation-outline.md    # Slide outline, 2-student demo script & team roles
│
├── Phase-1/                       # Complete, runnable Phase 1 application
│   ├── README.md                  # Comprehensive Phase 1 documentation
│   ├── package.json               # Dependencies & execution scripts
│   ├── index.js                   # Application server & Atlas connection
│   ├── models/                    # Student, LostItem, FoundItem
│   ├── routes/                    # Home, session, students, lost & found
│   ├── views/                     # EJS templates & Property Office UI
│   ├── public/                    # CSS tokens, layout & components
│   └── docs/                      # Phase 1 architecture & checklist
│
└── Phase-2/                       # Complete Phase 2 claims & resolution system
    ├── README.md                  # Comprehensive Phase 2 documentation & rule matrix
    ├── package.json               # Dependencies (with method-override) & test script
    ├── index.js                   # Application server & compound index init
    ├── models/                    # Student, LostItem, FoundItem, Claim (compound index)
    ├── routes/                    # Includes claims.js and myClaims.js
    ├── views/                     # Property Office UI with claim-panel & claim-row
    ├── public/                    # Extended tokens, rubber stamps & responsive ledger
    ├── tests/                     # Automated test suite (node:test + fetch)
    └── docs/                      # Phase 2 documentation artifacts
```

---

## Phase Status Summary

| Phase | Title | Scope | Status | Link |
|---|---|---|---|---|
| **Phase 1** | **Core Registry & Identity** | Student registration, signed cookie session, lost & found ledgers, case-file detail sheets, keyword search, category filtering, and MongoDB Atlas persistence. | **Complete & Tagged** (`phase-1-submission`) | [View Phase 1 Documentation](./Phase-1/README.md) |
| **Phase 2** | **Claims & Ownership Resolution** | Claim submissions on found items, finder ledger review, approval/rejection rubber stamps, atomic item status transitions to `Returned`, duplicate prevention, `my-claims` tracking, and 16 automated end-to-end tests. | **Complete & Submittable** | [View Phase 2 Documentation](./Phase-2/README.md) |

---

## Visual Design: "The Property Office"

The application departs from generic card grids, using a tactile paper-world aesthetic:
- **Hang Tags**: Every lost and found record is presented as an archival hang tag with a clipped corner, punched eyelet, suspension string, unique reference code (`LF-XXXXXX`), and status stamp.
- **Filing Slips**: Data entry forms utilize clean underline inputs, numbered sections (`01 — The item`), ruled-line description paper, and ballot-style checkboxes (`[✕]`).
- **Rubber Stamps**: Monochrome and colored angled stamps for `LOST`, `FOUND`, `AVAILABLE`, `RESOLVED`, `PENDING`, `APPROVED`, `REJECTED`, and `RETURNED`.
- **System Typography**: Georgia serif headings with Courier New monospace labels, ensuring complete offline functionality without CDN dependencies.

---

## Quickstart (Phase 2)

### 1. Installation
```bash
# Navigate to Phase-2 directory (or run from root workspace)
cd Phase-2
npm install
```

### 2. Environment Configuration
Ensure `.env` contains your Atlas connection strings:
```bash
cp .env.example .env
```
Ensure `MONGODB_URI` and `MONGODB_URI_TEST` are defined.

### 3. Run the Application
```bash
npm start
```
Open `http://localhost:3000` in your browser.

### 4. Run the Automated Test Suite
```bash
npm test
```
All 16 test cases run against the isolated test database (`MONGODB_URI_TEST`).

For complete details on business rules, architecture challenges, form submissions, and data models, see [`Phase-2/README.md`](./Phase-2/README.md) and [`docs/phase2-explanation.md`](./docs/phase2-explanation.md).
