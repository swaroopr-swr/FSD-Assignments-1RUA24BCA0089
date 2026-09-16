# People Server - Node.js & Express Tutorial

## Overview

This project was developed as part of a Full Stack Development tutorial to learn the fundamentals of backend development using **Node.js, Express.js, EJS, and Body Parser**.

The tutorial focused on creating a basic web server, handling routes, serving HTML pages, using dynamic EJS templates, handling form submissions, and creating a simple dynamic people directory.

---

## Technologies Used

- Node.js
- Express.js
- EJS
- Body Parser
- HTML
- JavaScript
- npm

---

## What I Learned

### 1. Node.js and npm

Created a Node.js project using:

```bash
npm init -y
```

This generated the `package.json` file used to manage the project and its dependencies.

### 2. Installing Packages

Installed the required packages:

```bash
npm install express body-parser ejs
```

### 3. Creating an Express Server

Created an Express application and started the server on port 3000.

```javascript
const express = require("express");

const app = express();

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
```
The application can be accessed at:
`http://localhost:3000`

### 4. GET Routes

Learned how Express handles GET requests using:

```javascript
app.get("/", (req, res) => {
    res.send("Hello from my Express server!");
});
```
Multiple routes were created for different pages.

### 5. Serving HTML Files

Created static HTML files such as:
- `person.html`
- `person2.html`

These were served using Express:

```javascript
app.get("/person", (req, res) => {
    res.sendFile(__dirname + "/person.html");
});
```

### 6. EJS Templates

Configured EJS as the view engine:

```javascript
app.set("view engine", "ejs");
```
Created reusable EJS templates inside the `views` folder.
EJS allows JavaScript data to be inserted into HTML:

```html
<h1><%= name %></h1>
<p><%= description %></p>
```

### 7. Dynamic Routing

Learned how to create dynamic routes using route parameters:

```javascript
app.get("/profile/:id", (req, res) => {
    const id = req.params.id;
});
```
Different people can therefore be accessed using URLs such as:
- `/profile/0`
- `/profile/1`
- `/profile/2`

The same EJS template is reused while displaying different data.

### 8. Middleware

Implemented custom middleware to observe incoming requests:

```javascript
app.use((req, res, next) => {
    console.log("Request received:", req.url);
    next();
});
```
This helped understand how middleware operates between the incoming request and the final response.

### 9. Body Parser and Form Submission

Used Body Parser to process form data:

```javascript
app.use(bodyParser.urlencoded({ extended: true }));
```
Created a form where users can enter a person's name and description.
The submitted data was accessed using:
- `req.body.name`
- `req.body.description`

### 10. POST Request

Handled form submission using a POST route:

```javascript
app.post("/submit", (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
});
```
The submitted information was then displayed using the EJS profile template.

---

## Final Application

The final project contains a simple People Directory.
The directory displays a list of people, and each person's name links to their dynamic profile.

Example:
```text
People Directory
│
├── Swaroop
├── Aryan
└── Girish
```
Each profile uses the same EJS template but displays different information based on the URL parameter.

---

## Project Structure

```text
people-server/
│
├── node_modules/
├── public/
│   └── profile.jpg
│
├── views/
│   ├── home.ejs
│   ├── form.ejs
│   └── person.ejs
│
├── .gitignore
├── index.js
├── person.html
├── person2.html
├── package.json
└── package-lock.json
```
`node_modules` is excluded from Git using `.gitignore`.

---

## How to Run

1. Navigate to the project directory:
   ```bash
   cd people-server
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node index.js
   ```

The server runs on:
`http://localhost:3000`

---

## Main Routes

| Route | Purpose |
|---|---|
| `/` | Basic Express server response |
| `/person` | Static HTML profile |
| `/person2` | Second static HTML profile |
| `/profile` | EJS profile |
| `/profile/:id` | Dynamic profile route |
| `/people` | People directory |
| `/form` | Person input form |
| `/submit` | Handles form submission |

---

## Key Concepts Covered

This tutorial helped me understand the basic flow of a Node.js and Express application:

```text
Client Request
      ↓
Express Server
      ↓
Middleware
      ↓
Route
      ↓
Data / Form Input
      ↓
EJS Template
      ↓
HTML Response
```

The project provided hands-on practice with Node.js, npm, Express routing, GET and POST requests, middleware, EJS templating, dynamic routes, static files, and form data handling.
