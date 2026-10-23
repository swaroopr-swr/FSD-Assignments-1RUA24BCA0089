# Phase 1 Live Demonstration Screenshots

Visual proof of the running application connected to MongoDB Atlas, demonstrating "The Property Office" user interface, validation resilience, and end-to-end data persistence.

---

### Screenshot Gallery

| # | File Name | Screen Description | Key Features Verified |
|---|---|---|---|
| **01** | [`01-home-initial-empty-state.png`](./01-home-initial-empty-state.png) | Home Desk (Initial State) | Shows live Atlas count (`0` Lost, `0` Found, `1` Student) with empty drawer panels and CTA buttons. |
| **02** | [`02-student-profile-dossier.png`](./02-student-profile-dossier.png) | Student Profile Dossier | Official campus identity card presentation with `REGISTERED` rubber stamp, department, email, and phone. |
| **03** | [`03-lost-item-form-validation.png`](./03-lost-item-form-validation.png) | Notice of Loss Form | Server-side validation highlighting empty fields in rust red while preserving entered category ballot (`[✕] ID & Cards`) and description. |
| **04** | [`04-lost-item-case-file.png`](./04-lost-item-case-file.png) | Lost Item Case File | Case file `LF-44FF47` with `LOST` stamp, receipt timestamp, and linked "Filer Record" sidebar. |
| **05** | [`05-lost-items-ledger.png`](./05-lost-items-ledger.png) | Lost Items Ledger | Filter bar with search, category dropdown, result count, and physical hang-tag card with eyelet and string. |
| **06** | [`06-found-item-case-file.png`](./06-found-item-case-file.png) | Found Item Case File | Case file `LF-44FF68` for Laptop Charger with blue `AVAILABLE` stamp and green flash success banner. |
| **07** | [`07-found-items-ledger.png`](./07-found-items-ledger.png) | Found Items Ledger | Found property repository showing active hang-tag for discovered property. |
| **08** | [`08-home-page-active-records.png`](./08-home-page-active-records.png) | Home Desk (Populated State) | Live counts updated to `1` Lost, `1` Found, and `1` Student with dual columns showing latest property tags. |
| **09** | [`09-atlas-students-collection.png`](./09-atlas-students-collection.png) | Atlas: `students` Collection | Live document verification in MongoDB Atlas Data Explorer for student `swaroop`. |
| **10** | [`10-atlas-founditems-collection.png`](./10-atlas-founditems-collection.png) | Atlas: `founditems` Collection | Live document verification for Laptop Charger with status `Available` and `reportedBy` ObjectId reference. |
| **11** | [`11-atlas-lostitems-collection.png`](./11-atlas-lostitems-collection.png) | Atlas: `lostitems` Collection | Live document verification for ID Card with status `Lost` and relational `reportedBy` reference. |

