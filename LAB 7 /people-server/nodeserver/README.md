# Node Server with MongoDB

This project demonstrates how to set up a basic Express.js server and connect it to a MongoDB Atlas database using Mongoose.

## Technologies Used
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL Database
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js
- **Nodemon**: Utility that automatically restarts the Node.js application when file changes are detected

## Setup and Installation

1. Initialize the project:
   ```bash
   npm init -y
   ```
2. Install the necessary dependencies:
   ```bash
   npm install express body-parser ejs
   npm install mongoose
   ```
3. Install Nodemon globally (optional, but recommended for development):
   ```bash
   npm install -g nodemon
   ```
4. Start the application:
   ```bash
   nodemon index.js
   ```

## Key Learnings
During this session, the following concepts were covered:
- Setting up a basic Node.js Express server from scratch.
- Using `nodemon` to automatically restart the server during development.
- Configuring a connection to MongoDB Atlas using `mongoose.connect()`.
- Troubleshooting common Mongoose connection string errors, such as:
  - Resolving deprecation warnings and unsupported options (e.g., `usenewurlparser`).
  - Fixing syntax errors, unescaped characters, and empty userinfo sections in the URI.
  - Handling authentication failures (`bad auth`).
- Successfully establishing and verifying the connection to the MongoDB database.
