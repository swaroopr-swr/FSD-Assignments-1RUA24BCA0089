# React SPA Client (`react-spa-client`)

> **Course Competency Addressed:**
> - **Row 5:** *Build modular frontend applications using a component-based approach with state and event management concepts.*
> - **Row 6:** *Develop and consume backend services using RESTful API principles with basic CRUD operations and middleware handling.*

This directory contains the independent, modular **Single-Page Application (SPA)** client built using **React 18** and **Vite**. It decouples the user interface from the server-rendered EJS templates, consuming backend RESTful JSON endpoints (`/api/...`) served by the Node.js/Express backend running in `Phase-3-Verified-Access`.

---

## 1. Standard Full-Stack Architecture

The repository adheres to the standard full-stack decoupled architecture:

```
campus-lost-found-management-system/
├── Phase-1/                         # Milestone 1 (Tagged: phase-1-submission)
├── Phase-2/                         # Milestone 2 (Tagged: phase-2-submission)
├── Phase-3-Verified-Access/         # The Backend API & Admin Server (Port 3000)
└── react-spa-client/                # The Client-Side React Application (Port 5173)
```

Inside `react-spa-client/`:

```
react-spa-client/
├── index.html                   # HTML entry point with web fonts (Newsreader, Cinzel, IBM Plex Mono)
├── vite.config.js               # Dev server configuration with /api reverse proxy to port 3000
├── package.json                 # React 18, Vite, Lucide-react
├── src/
│   ├── main.jsx                 # Application bootstrapping into React.StrictMode
│   ├── App.jsx                  # Root layout, modal router & toast dispatcher
│   ├── index.css                # Property Office design tokens and CSS utility classes
│   ├── context/
│   │   └── AppContext.jsx       # Global state management via React Context & Reducer/Action pattern
│   └── components/
│       ├── Header.jsx           # Top masthead, view switcher, student identity switcher
│       ├── StatBanner.jsx       # Real-time reactive KPI metric counters
│       ├── FilterControls.jsx   # Controlled inputs for live search, category, type, and status
│       ├── ItemCard.jsx         # Case file card with postal reference number and status stamp
│       ├── StatusBadge.jsx      # Reusable rubber stamp badge for Open, Claimed, Returned
│       ├── ItemDetailModal.jsx  # Complete case dossier modal with finder claims ledger
│       ├── ClaimModal.jsx       # Controlled claim submission form with 10–500 char validation
│       ├── ReportModal.jsx      # Controlled report form for filing Lost and Found items
│       └── DashboardView.jsx    # Student personal docket: metrics, my reports, pending reviews
```

---

## 2. Component Hierarchy & Modular Decomposition

Every piece of the interface is broken down into small, single-responsibility components:

| Component | Responsibility | Props / State |
| :--- | :--- | :--- |
| `<AppProvider>` | Global data store, API synchronization, identity management | `items`, `stats`, `currentStudent`, `filters` |
| `<App>` | Top-level layout, modal orchestration, notifications | Dispatches toasts and active views |
| `<Header>` | University title, navigation tabs, identity switch dropdown | Controlled `<select>` with active student |
| `<StatBanner>` | Displays active metrics (Total, Lost, Found, Recovered) | Reads live `stats` from Context |
| `<FilterControls>` | Search bar, category dropdown, type and status pills | Controlled `searchQuery`, `filters` |
| `<ItemCard>` | Summarizes an item as a postal case record | `props: { item }` |
| `<StatusBadge>` | Rubber stamp effect for item and claim states | `props: { status }` |
| `<ItemDetailModal>`| Case file dossier, claimant history, finder approval actions | Reads `selectedItem`, emits `handleDecideClaim` |
| `<ClaimModal>` | Enforces ownership claim rules with live character counter | Controlled `reason` state, error validation |
| `<ReportModal>` | Modal form to file Lost or Found property | Form state with category, date, location |
| `<DashboardView>` | Dedicated personal docket for current student's case files | Derived lists of personal items and claims |

---

## 3. State & Event Management Concepts

### A. State Management (`AppContext.jsx`)
- **Centralized Application State:** Utilizes React's `createContext` and custom hook `useAppContext()` to provide state across deeply nested components without "prop drilling".
- **Local Component State (`useState`):**
  - Controlled inputs in forms (`searchQuery`, `reason`, `title`, `description`, etc.).
  - Live character counter in `<ClaimModal>` (validating between 10 and 500 characters in real time).
  - Tab selection and modal display triggers.
- **Side Effects (`useEffect`):**
  - Initial mount hook fetches catalog items (`GET /api/items`), metrics (`GET /api/stats`), and students (`GET /api/students`).
  - Reactive query hook automatically refetches filtered items when `filters` or `searchQuery` change with debouncing.
  - Escape key listener dynamically attached to window to dismiss open modals.

### B. Event Handling
- **Form Submissions (`onSubmit`):** Prevent default page reload (`e.preventDefault()`), validate inputs client-side, submit to REST API via `fetch`, and handle server response codes (201 Created, 400 Bad Request, 403 Forbidden, 409 Conflict).
- **Synthetic Events (`onClick`, `onChange`):**
  - Instant filter toggles for Item Type (`All`, `Lost`, `Found`) and Item Status (`All`, `Open`, `Claimed`, `Returned`).
  - Real-time text changes in the search input updating parent state instantly.
  - Dropdown student switching updating the active session (`POST /api/auth/switch`).
- **Optimistic & Reactive Updates:** After submitting a claim, reporting an item, or approving a decision, the frontend state updates immediately to reflect the new state without requiring a full page refresh.

---

## 4. RESTful API Consumption (Row 6 Integration)

The frontend communicates with the backend via JSON over HTTP:

| Method | Endpoint | Description | Frontend Trigger |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/stats` | Live counters for items, claims, returned cases | `<StatBanner>` on mount/actions |
| `GET` | `/api/students` | List of verified roster students | Identity switcher in `<Header>` |
| `GET` | `/api/items` | Filtered case files matching query parameters | `<FilterControls>` changes |
| `GET` | `/api/items/:id` | Full item dossier with claims ledger | Clicking "Inspect Dossier" on card |
| `POST` | `/api/items` | File a new Lost or Found case | Submitting `<ReportModal>` form |
| `POST` | `/api/items/:id/claims`| Submit ownership claim with rationale | Submitting `<ClaimModal>` form |
| `PATCH`| `/api/claims/:id/status`| Finder approves or rejects claim | Approve/Reject buttons in modal/dashboard |
| `POST` | `/api/auth/switch` | Switch simulated student session | Dropdown selection in `<Header>` |

---

## 5. How to Run the React Frontend

### Step 1: Start the Backend Server
In your first terminal:
```bash
cd Phase-3-Verified-Access
npm start
```
The backend starts at `http://localhost:3000`.

### Step 2: Start the React Frontend
In a second terminal:
```bash
cd react-spa-client
npm install
npm run dev
```
The React development server starts at `http://localhost:5173`.

### Step 3: Open in Browser
Open `http://localhost:5173`.
All requests to `/api/...` are transparently proxied to `http://localhost:3000` via Vite's proxy configuration in `vite.config.js`.

---

## 6. Viva & Demonstration Walkthrough

When demonstrating this component to the examiner:

1. **Modular Architecture:** Show how `<Header>`, `<FilterControls>`, `<ItemCard>`, `<ItemDetailModal>`, and `<DashboardView>` are decoupled into independent files inside `src/components/`.
2. **State Management:** Show `src/context/AppContext.jsx` and explain how `items`, `stats`, `filters`, and `currentStudent` are shared globally. Show local state (`useState`) in `ClaimModal.jsx` managing character counts and field validation.
3. **Event Management:** Show how `onChange` on the search input filters items dynamically, and `onSubmit` on forms dispatches asynchronous `fetch` calls.
4. **Student Identity Switcher:** Use the dropdown in the header to switch between **Alice Sharma** and **Bob Rao**. Show how:
   - Alice cannot claim an item she reported (Rule: Self-claim blocked with HTTP 403).
   - Bob can claim an item reported by Alice.
   - Once Bob claims it, switching back to Alice shows the claim in her **Student Dashboard** under *"Claims Awaiting Your Decision"*.
   - Alice approves the claim, which immediately stamps the item as **Returned** and rejects any competing pending claims.
