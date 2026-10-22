# Campus Lost & Found Management System

A full-stack campus property office application built with **Node.js, Express.js, EJS, and MongoDB Atlas (Mongoose)** following "The Property Office" editorial design direction (physical hang tags, filing slips, and rubber stamps).

---

## Project Organization & Phases

This repository is organized by project phases to enable independent review, evaluation, and progression:

```
campus-lost-found-management-system/
├── README.md                      # Project landing page (this file)
├── .gitignore                     # Repository-level ignore rules
├── .env.example                   # Atlas environment variables template
│
├── Phase-1/                       # Complete, runnable Phase 1 application
│   ├── README.md                  # Comprehensive Phase 1 documentation
│   ├── package.json               # Dependencies & execution scripts
│   ├── index.js                   # Application server & Atlas connection
│   ├── models/                    # Student, LostItem, FoundItem
│   ├── routes/                    # Home, session, students, lost & found
│   ├── views/                     # EJS templates & Property Office UI
│   ├── public/                    # CSS tokens, layout & components
│   └── docs/                      # Architecture explanation & test checklist
│
└── Phase-2/                       # Planned Phase 2 claims & resolution system
    └── README.md                  # Phase 2 specification & requirements plan
```

---

## Phase Status Summary

| Phase | Title | Scope | Status | Link |
|---|---|---|---|---|
| **Phase 1** | **Core Registry & Identity** | Student registration, signed cookie session, lost & found ledgers, case-file detail sheets, keyword search, category filtering, and MongoDB Atlas persistence. | **Complete & Submittable** | [View Phase 1 Documentation](./Phase-1/README.md) |
| **Phase 2** | **Claims & Ownership Resolution** | Claim submissions on found items, finder ledger review, approval/rejection rubber stamps, atomic item status transitions to `Returned`, and `my-claims` tracking. | **Planned (Awaiting Phase 1 Review)** | [View Phase 2 Specification](./Phase-2/README.md) |

---

## Visual Design: "The Property Office"

The application departs from generic card grids, using a tactile paper-world aesthetic:
- **Hang Tags**: Every lost and found record is presented as an archival hang tag with a clipped corner, punched eyelet, suspension string, unique reference code (`LF-XXXXXX`), and status stamp.
- **Filing Slips**: Data entry forms utilize clean underline inputs, numbered sections (`01 — The item`), ruled-line description paper, and ballot-style checkboxes (`[✕]`).
- **Rubber Stamps**: Monochrome and colored angled stamps for `LOST`, `FOUND`, `AVAILABLE`, and `RESOLVED`.
- **System Typography**: Georgia serif headings with Courier New monospace labels, ensuring complete offline functionality without CDN dependencies.

---

## Quickstart (Phase 1)

1. Navigate to the Phase 1 application directory:
   ```bash
   cd campus-lost-found-management-system/Phase-1
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```bash
   cp .env.example .env
   # Add your MongoDB Atlas connection string to MONGODB_URI
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open your browser at `http://localhost:3000`.

For full setup instructions, data model diagrams, and testing matrices, visit [`Phase-1/README.md`](./Phase-1/README.md).
