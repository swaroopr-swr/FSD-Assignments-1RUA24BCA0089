# Brutalist Amazon Clone

A high-contrast, black-and-white brutalist e-commerce application built with React. Features a fully functioning shopping cart, a dedicated Amazon-style checkout flow, an active search bar, and category filtering.

**Live Deployment:** [https://jade-salmiakki-f5dbd6.netlify.app](https://jade-salmiakki-f5dbd6.netlify.app)

## Features
- **Brutalist Design System**: Strict monochrome color palette, massive typography, thick 4px borders, and hard drop shadows.
- **Global Search**: Instantly filter products directly from the navbar.
- **Amazon-style Cart**: Dedicated `/cart` page with inline quantity controls, gift checkout options, and cross-sell recommendations.
- **Buy Box Layout**: Amazon-inspired product detail pages with a sticky "Buy Box", "Add to Cart" and instant "Buy Now" checkout buttons.
- **Responsive**: Fully responsive grid and layout that scales from mobile devices to desktop widths.
- **State Management**: Uses React Context API (`CartContext`, `SearchContext`) for seamless global state without prop-drilling.
- **Routing**: Client-side routing with `react-router-dom`.

## Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`
Builds the app for production to the `build` folder.
