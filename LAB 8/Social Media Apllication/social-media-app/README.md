# Margin - Social Media Dashboard (Lab 8)

This project is a full-stack social media application built for a Full Stack Development course. It implements a unique "field journal" design system called **Margin**—featuring warm paper backgrounds, rust-colored accents, and a blend of serif (content) and monospace (system) typography.

## 🛠 Tech Stack

**Frontend:**
- React (bootstrapped with Vite)
- React Router v6
- React-Bootstrap & Bootstrap 5 (with heavily customized CSS overrides)
- Axios (for API requests)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- CORS & dotenv

## ✨ Features Implemented

1. **Custom Design System (Margin)**
   - Complete departure from standard Bootstrap styles.
   - Heavy use of CSS variables (`tokens.css`) for paper/ink colors.
   - Custom "Stamp" buttons with tactile offset shadows.
2. **Responsive Layouts**
   - **Desktop:** 3-column sticky layout (Navigation, Feed, Trending).
   - **Tablet:** Collapsed icon-rail sidebar.
   - **Mobile:** Bottom Tab Bar mimicking native mobile apps, with an elevated center "Create" button.
3. **End-to-End Post Functionality (CRUD)**
   - **Create:** Fullscreen modal with live image preview saves directly to MongoDB.
   - **Read:** Homepage feed fetches posts sequentially from the backend, featuring a skeleton loading state.
   - **Update:** Users can "Like" posts with immediate UI feedback that syncs with the database.
   - **Delete:** Dropdown menu allows deleting posts, instantly filtering them from the UI.

## 🚀 How to Run Locally

### Prerequisites
- Node.js installed
- MongoDB running locally on `mongodb://127.0.0.1:27017`

### 1. Start the Backend Server
```bash
cd server
npm install
npm start
```
*The backend API will run on `http://localhost:5001`.*

### 2. Start the Frontend Client
```bash
cd client
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173`.*

## 📂 Project Structure

- `client/` - Contains the React Vite application, custom styling (`src/styles`), layout blocks, UI components, and mock fallback data.
- `server/` - Contains the Node/Express backend, Mongoose models (`models/Post.js`), and CRUD routing logic (`routes/posts.js`).
