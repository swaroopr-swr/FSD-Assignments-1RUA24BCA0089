# Field Supply Co. — Mini E-Commerce App

A full-stack Mini E-Commerce Web Application built for an online store specializing in analog field-journaling and outdoor documentation gear. 

This project was built to fulfill all the strict requirements of a Full-Stack React + Node.js assignment, featuring a custom thematic design system, dynamic cart calculations, token-based authentication, and a decoupled REST API.

## 🎨 Thematic Design System ("Field Form")

This project explicitly avoids ready-made e-commerce templates. Instead, it utilizes a 100% custom UI built from scratch using **Tailwind CSS v4**.

The visual language is designed to feel diegetic to the product category (analog gear). The interface mimics a physical, vintage field catalog:
- **Colors:** A warm, paper/cream background palette with high-contrast "rust" and "ink" accents.
- **Typography:** Serif fonts (`Georgia`) for prose and item names, combined with monospace fonts (`Courier New`) for system text, IDs, and pricing to mimic typewriter output.
- **Textures:** A subtle dot-grid background generated via CSS radial gradients mimics field notebooks.
- **UI Elements:** Checkboxes are designed as physical tally-marks. Buttons mimic rubber stamps. Images are rendered using heavy sepia and blend modes overlaid with "Fig. X / Plate" placards to feel like printed catalog illustrations rather than generic web photos.

## 🚀 Tech Stack

**Frontend:**
- **React (Vite):** Fast, modern frontend tooling.
- **React Router:** For strict client-side routing (no HTML page reloads).
- **Tailwind CSS v4:** For all custom styling, grid layouts, and thematic overlays.
- **Context API:** Global state management for Authentication (`AuthContext`) and Cart (`CartContext`).

**Backend:**
- **Node.js & Express:** Lightweight REST API.
- **In-Memory Store:** Serves as the database for the core products and order history (easily swappable to Postgres/MongoDB).
- **Authentication:** Token-based JWT authentication middleware.

## ✨ Features

- **Product Catalog:** Fetches and displays a list of 8 unique products dynamically from the Express backend.
- **Product Details:** Dedicated dynamic routes (`/products/:id`) for in-depth item inspection, featuring robust 404 handling for invalid product IDs.
- **Dynamic Cart:** Calculates subtotals dynamically using `reduce()`. Prevents adding more items than the available stock via a custom `QuantityStepper`.
- **Protected Checkout:** The "Place Order" workflow is strictly gated behind a login barrier. Unauthenticated users are prompted to log in before they can finalize a requisition.
- **Order Tracking:** Stock is permanently tracked and dynamically updated against the `totalStock` when an order is placed. Users can view their fulfilled dockets in a protected `/orders` route.
- **Robust Error Handling:** Custom "Record Not Found" pages, inline API error banners, and strict server-side validation against over-ordering.

## 📦 Setup & Installation

### 1. Start the Backend API
Navigate to the backend directory, install dependencies, and start the Express server (runs on `http://localhost:5001`).
```bash
cd backend
npm install
npm run dev
```

### 2. Start the Frontend App
Open a new terminal, navigate to the frontend directory, install dependencies, and start the Vite development server.
```bash
cd frontend
npm install
npm run dev
```

### 3. Access the App
Open your browser and navigate to `http://localhost:5173`.

## 🔐 Test Credentials
To test the checkout and order history flow, log in using the following test credentials:
- **Username:** `explorer`
- **Password:** `field123`
