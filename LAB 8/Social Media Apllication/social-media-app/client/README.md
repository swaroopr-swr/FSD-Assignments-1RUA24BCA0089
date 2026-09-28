# Margin Frontend UI

This is the frontend template for the "Margin" social media app, built for the Full Stack Development course project.

## How to Run

1. Navigate to the `client` directory.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. The app will be available at `http://localhost:5173`.

## Architecture & Design

- **React-Bootstrap & Bootstrap 5** are used for grid and layout (`Container`, `Row`, `Col`).
- Custom design tokens (colors, fonts, radii) are located in `src/styles/tokens.css` and are applied globally.
- The UI follows a "field journal" aesthetic using:
  - Serif fonts for user-generated content.
  - Monospace fonts for system labels and timestamps.
  - Rust accent colors and soft "paper" backgrounds.

## Mock Data vs. API

Currently, the application runs entirely on **Mock Data** located in `src/data/mockData.js`.
The REST API functions have been stubbed out in `src/services/api.js`.

**To wire up the backend later:**
1. Open `src/services/api.js` and ensure the `baseURL` points to your Express server.
2. In your page components (e.g., `HomePage`), replace the `setTimeout` mock calls with actual Axios requests from `api.js`.
3. In `CreatePostModal`, uncomment the `axios.post` call in `handleSubmit`.
