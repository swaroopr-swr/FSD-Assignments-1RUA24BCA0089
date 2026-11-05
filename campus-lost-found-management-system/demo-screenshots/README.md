# Campus Lost & Found — End-to-End Demonstration Walkthrough

> **Scope Note:**
> This directory documents the **server-rendered Campus Lost & Found Property Office application** (Phases 1 & 2: Node.js, Express, EJS, and MongoDB Atlas).
> The client-side single-page React frontend is located independently in [`react-spa-client/`](../react-spa-client/).

The screenshots below are organized in sequential order (01 through 18), providing visual verification of the user journey, business rules, form validation resilience, claims workflow, and MongoDB Atlas cloud persistence.

---

## Complete Walkthrough Flow (Start to End)

| Step | File | Screen | Description & Verified Features |
| :---: | :--- | :--- | :--- |
| **01** | [`01-home-initial-empty-desk.png`](./01-home-initial-empty-desk.png) | **Home Desk (Initial Slate)** | Clean state showing live Atlas counter (`0` Lost, `0` Found, `1` Student), empty drawers, and primary action buttons. |
| **02** | [`02-student-registration-success.png`](./02-student-registration-success.png) | **Student Registration** | Green success banner verifying account creation for student *Aryan* (`Design`, `aryan@rvu.edu.in`). |
| **03** | [`03-student-identity-dossier.png`](./03-student-identity-dossier.png) | **Student Identity Dossier** | Campus identity card presentation with official `REGISTERED` rubber stamp, department, email, and contact number. |
| **04** | [`04-lost-item-form-validation.png`](./04-lost-item-form-validation.png) | **Form Validation Resilience** | Server-side validation highlighting empty fields in rust red while preserving entered category ballot (`[✕] ID & Cards`) and description. |
| **05** | [`05-lost-item-report-success.png`](./05-lost-item-report-success.png) | **Lost Item Reported** | Filing confirmation banner and generated reference code `LF-3E8E76` for lost *Watch* filed by *Girish*. |
| **06** | [`06-lost-item-case-file.png`](./06-lost-item-case-file.png) | **Lost Item Case File** | Permanent case dossier `LF-44FF47` for *ID CARD* stamped `LOST` with receipt timestamp and linked filer record. |
| **07** | [`07-lost-items-ledger.png`](./07-lost-items-ledger.png) | **Lost Items Ledger** | Public searchable ledger with category filter dropdown and physical hang-tag presentation cards. |
| **08** | [`08-found-item-case-file.png`](./08-found-item-case-file.png) | **Found Item Case File** | Property dossier `LF-44FF68` for *Laptop Charger* stamped with blue `AVAILABLE` seal and custodian contact. |
| **09** | [`09-found-items-ledger.png`](./09-found-items-ledger.png) | **Found Items Ledger** | Public discovered property ledger with live status dropdown (`All Statuses`, `Available`, `Returned`). |
| **10** | [`10-claim-submission-form.png`](./10-claim-submission-form.png) | **Claim Submission Slip** | Ownership claim slip (*01 — Why this is yours*) enforcing 10–500 character rule and anti-spoofing constraints. |
| **11** | [`11-claim-submitted-pending.png`](./11-claim-submitted-pending.png) | **Claim Submitted (Pending)** | Found property case dossier updated with green flash notice and student's submitted claim slip marked `PENDING`. |
| **12** | [`12-claims-ledger-empty-state.png`](./12-claims-ledger-empty-state.png) | **My Claims Ledger (Initial)** | Student personal claims ledger before submitting any ownership assertions (*"You haven't submitted any claims yet"*). |
| **13** | [`13-claims-ledger-active-pending.png`](./13-claims-ledger-active-pending.png) | **My Claims Ledger (Active)** | Active docket tracking the submitted ownership claim slip on the Laptop Charger with direct link to case file. |
| **14** | [`14-student-dossier-case-history.png`](./14-student-dossier-case-history.png) | **Student Profile History** | Comprehensive student dossier for *Swaroop* displaying both filed lost reports (1) and logged found items (1). |
| **15** | [`15-home-desk-populated-records.png`](./15-home-desk-populated-records.png) | **Home Desk (Populated State)** | Live counters updated to `2` Lost, `1` Found, and `3` Students with dual columns showing latest active property tags. |
| **16** | [`16-atlas-students-collection.png`](./16-atlas-students-collection.png) | **MongoDB Atlas: Students** | Cloud document verification in MongoDB Atlas Data Explorer for `students` collection. |
| **17** | [`17-atlas-founditems-collection.png`](./17-atlas-founditems-collection.png) | **MongoDB Atlas: Found Items** | Cloud document verification for `founditems` collection with status and relational ObjectId references. |
| **18** | [`18-atlas-lostitems-collection.png`](./18-atlas-lostitems-collection.png) | **MongoDB Atlas: Lost Items** | Cloud document verification for `lostitems` collection with status `Lost` and `reportedBy` relationship. |
