# Jadoo - Modern Travel Agency Landing Page

A responsive, frontend-only travel agency landing page built with semantic HTML5, modern CSS3 (Custom Properties, Flexbox, Grid), and vanilla ES6 JavaScript.

## 🚀 Live Demo & How to Run

Because this project utilizes ES6 modules (`type="module"`), it should be served via a local web server:

```bash
# Option 1: Python HTTP Server (Recommended)
python3 -m http.server 8000
# Then visit http://localhost:8000

# Option 2: Node.js (npx serve)
npx serve .

# Option 3: VS Code Live Server extension
Right click index.html -> "Open with Live Server"
```

---

## 📁 File Structure

```
Travel_Agency_clone/
├── index.html         # Semantic HTML structure & accessible landmark elements
├── css/
│   └── style.css      # CSS variables, modern layout (Grid/Flexbox), responsive breakpoints
├── js/
│   ├── data.js        # Mock data (destinations & testimonials arrays)
│   └── main.js        # Modular ES6 application logic & interaction handlers
├── assets/
│   └── images/        # Local, optimized travel photos and headshots
└── README.md          # Project documentation & viva guide
```

---

## 🎨 Design Tokens & Palette

All colors, fonts, and radii are managed strictly via CSS Custom Properties (`var(--...)`) in `:root`:

| Token | Hex Value | Application |
|---|---|---|
| `--navy` | `#1E1B4B` | Headings, brand logo, dark text, footer |
| `--orange` | `#DF6951` | Eyebrows, accents, step icon 2, subscribe button |
| `--yellow` | `#F1A501` | Primary CTA button ("Find out more"), step icon 1, logo dots |
| `--cream` | `#FDF3DE` | Hero background blob, badge backgrounds |
| `--text` | `#3A3A55` | High-contrast body text (meets WCAG 4.5:1 ratio) |
| `--white` | `#FFFFFF` | Cards and page surface background |

- **Body & UI Font:** Poppins (Google Fonts)
- **Heading Font:** Volkhov / Playfair Display (Google Fonts)

---

## 🌟 Implemented Sections & Features

1. **Sticky Navbar & Navigation:**
   - Jadoo logo with stylized yellow circular dots with navy centers.
   - Smooth scrolling to `#destinations`, `#hotels`, `#flights`, and `#bookings`.
   - Dynamic shadow applied when scrolled past 20px.
   - Interactive language selector (EN, ES, FR, DE) with toast feedback.
   - Responsive hamburger menu with slide-down animation and outside-click dismissal.

2. **Hero Section:**
   - Eyebrow label: `"BEST DESTINATIONS AROUND THE WORLD"`.
   - Bold headline with hand-drawn orange brush underline SVG under the word `"enjoy"`.
   - Yellow `"Find out more"` button (scrolls to Services).
   - Round `"Play Demo"` button with animated ripple hover (opens interactive 4K video reel modal).
   - Real, authentic copywriting (no lorem ipsum).
   - Hero search bar with destination input and date picker (includes inline validation and destination filtering).
   - Organic cream background blob shape (`--cream`) behind the traveler cutout.
   - Two flying blue paper airplanes with dotted SVG flight trails.

3. **Services Section:**
   - 4 service cards: *Calculated Weather*, *Best Flights*, *Local Events*, and *Customization*.
   - **Best Flights** is highlighted by default with an elevated card shadow and an orange rounded square peeking out from the bottom-left corner.
   - Hover lift on remaining cards.
   - Dotted grid decorative motif in the top-right corner.

4. **Top Destinations (Dynamic Data & Modal):**
   - Populated from `js/data.js` (Rome, London, Europe, plus Santorini, Tokyo, Paris for search exploration).
   - Clean card styling with soft drop shadows and duration labels with paper-plane icon.
   - Loose hand-drawn scribble decoration to the right of the cards.
   - Expandable view: Top 3 by default, with an `"Explore All 6 Destinations"` toggle.
   - **Interactive Destination Detail Modal:** Clicking any card opens a modal with high-res imagery, rating stars, duration, perks, and a `"Book Now"` button with accessible focus trap.

5. **Book Your Next Trip in 3 Easy Steps:**
   - 3 vertical steps with rounded-square icon tiles (Yellow: Choose Destination, Orange: Make Payment, Dark Teal: Reach Airport).
   - Interactive Trip Preview Card for Greece (Santorini rooftop photo, action badges, 24 people going, clickable favorite heart button).
   - Floating secondary card with ongoing Rome trip and 40% progress bar.
   - Blurred soft-blue ambient glow behind the preview card.

6. **Testimonials Carousel:**
   - Populated dynamically from `testimonials` array in `data.js`.
   - Active front card with overlapping circular avatar, real reviewer quote, and author details.
   - Faded back card teaser showing the upcoming testimonial (*Chris Thomas, CEO of Red Button*).
   - Next/Previous arrow buttons and 3 pagination dots with smooth fade transitions and wrap-around index navigation.

7. **Partners Strip:**
   - Centered row of airline and travel partner logos (*Axon, Jetstar, Expedia, Qantas, Alitalia*).
   - Grayscale with opacity, animating to full contrast on hover.

8. **Newsletter Section:**
   - Wide rounded card with flat lavender tint (`--lavender-card`), concentric circular background arcs, and corner dots.
   - Dark circular badge with paper plane icon overlapping top-right.
   - Inline email subscription form with regex validation, inline error messaging, and success feedback.

9. **Footer:**
   - Jadoo logo with tagline.
   - 3 structured link columns: Company, Contact, and More.
   - Circular social media buttons (Facebook, Instagram, Twitter).
   - Store download badges for Google Play and Apple App Store.
   - Copyright notice.

10. **Accessibility & Polish:**
    - Skip-to-content keyboard link.
    - High-contrast text throughout.
    - Keyboard-accessible dialogs (Esc key and backdrop click to close, focus management).
    - Lightweight toast notification system for user feedback.
    - Responsive at 1440px, 1024px, 768px, 480px, and 320px without horizontal overflow.

---

## 🎓 College Viva Preparation Guide

If asked to explain this project during a viva:

- **Why vanilla JavaScript instead of React/Vue?**
  Vanilla JS demonstrates a solid grasp of core DOM manipulation, ES6 modules (`import`/`export`), event delegation, array methods (`filter`, `map`, `find`), and browser APIs without the overhead or abstraction of build tools.
- **How is the layout constructed?**
  CSS Grid is used for multi-column structures (services grid, destinations grid, hero 2-column layout, footer columns). Flexbox is used for 1-dimensional alignments (navbars, card headers, step items, search bar).
- **How are design tokens enforced?**
  All colors and typography are centralized in CSS custom properties (`:root`). Changing `--navy` or `--orange` in one location updates the entire site synchronously.
- **How does the search and filtering work?**
  `initHeroSearch` listens for form submit, validates the input, and runs `.filter()` on the `destinations` array checking `city`, `country`, and `description`. It updates `state.activeFilter`, re-renders the grid, and smoothly scrolls to `#destinations`.
- **How is accessibility handled?**
  Semantic HTML5 tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`), `aria-expanded` and `aria-label` attributes, focus trap on modals, keyboard enter triggers on cards, and a skip-to-content landmark.
