# TravelPlan – Smart Travel Planner & Itinerary Web Application

## Overview
TravelPlan is a responsive single-page web application designed to help users plan trips and organize their travel itineraries in one place. This project was built specifically for the **IBM SkillsBuild Web Development Fundamentals** certification.

The application allows users to create a trip, enter a destination and travel dates, and seamlessly generate a day-wise itinerary. Users can add, edit, delete, and categorize activities, all while their data is securely saved directly in the browser.

## Problem Statement
Planning a trip often involves managing information across multiple sources such as notes, messages, websites, and documents. Travelers find it difficult to organize:
* Travel destinations and dates
* Daily activities and places to visit
* Activity timings and important travel notes

**TravelPlan** solves this by providing a centralized, easy-to-use platform that organizes travel schedules dynamically without needing to maintain separate documents.

## Technology Stack
To demonstrate proficiency in core web fundamentals, this project relies exclusively on:
* **HTML5:** For semantic structure, accessibility, and form inputs.
* **CSS3:** For visual design, CSS Grid/Flexbox layouts, and making the application fully responsive across mobile and desktop devices.
* **Vanilla JavaScript:** For application logic, DOM manipulation, form validation, dynamic itinerary generation, and real-time filtering.
* **LocalStorage:** For persistent browser-based data storage, allowing the application to function entirely offline without a backend server.

## Features
* **Create a Trip:** Start a new trip by defining the name, destination, start/end dates, and traveler count. Form validation prevents logical errors like an end date preceding a start date.
* **Day-Wise Itinerary:** Automatically generates a sidebar with individual days based on the selected trip duration.
* **Activity Management:** Add, edit, and delete activities. Each activity tracks time, location, category (e.g., Food, Sightseeing, Travel), and custom notes.
* **Search & Filter:** Instantly search through your itinerary by activity name, or filter by category to find specific plans.
* **Data Persistence:** If you accidentally close your browser, your entire travel plan is securely saved in `localStorage` and will reload exactly how you left it.

## How to Run
Since this is a vanilla frontend application without a backend server, you don't need to install any dependencies. 
1. Clone this repository.
2. Navigate to the `CIE1_COMPONENT1/planmytrip` folder.
3. Open `index.html` directly in any modern web browser.

## IBM SkillsBuild Concepts Demonstrated
* **Semantic HTML:** Proper use of tags, forms, and input elements.
* **Responsive CSS:** Media queries ensure the layout adapts from mobile to desktop.
* **JavaScript DOM Manipulation:** UI updates dynamically without page refreshes.
* **Browser APIs:** Direct interaction with the `window.localStorage` object.
