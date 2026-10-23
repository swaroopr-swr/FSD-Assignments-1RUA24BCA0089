require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

const flashMiddleware = require('./middleware/flash');
const { loadCurrentStudent } = require('./middleware/currentStudent');

const Claim = require('./models/Claim');

const homeRoutes = require('./routes/home');
const sessionRoutes = require('./routes/session');
const studentsRoutes = require('./routes/students');
const lostItemsRoutes = require('./routes/lostItems');
const foundItemsRoutes = require('./routes/foundItems');
const claimsRoutes = require('./routes/claims');
const myClaimsRoutes = require('./routes/myClaims');

const app = express();
const PORT = process.env.PORT || 3000;
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'property_office_default_secret_key_2026';
const MONGODB_URI = process.env.MONGODB_URI;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static assets
app.use(express.static(path.join(__dirname, 'public')));

// Request parsing & cookies
app.use(express.urlencoded({ extended: true }));

// Method-override: enables HTML forms to submit PATCH requests via query param (?_method=PATCH)
app.use(methodOverride('_method'));

app.use(cookieParser(COOKIE_SECRET));

// Application middleware
app.use(flashMiddleware);
app.use(loadCurrentStudent);

// Mount application routes
app.use('/', homeRoutes);
app.use('/', sessionRoutes);
app.use('/students', studentsRoutes);
app.use('/lost-items', lostItemsRoutes);
app.use('/found-items', foundItemsRoutes);
app.use('/claims', claimsRoutes);
app.use('/my-claims', myClaimsRoutes);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).render('404', {
    title: '404 — Page Not Found',
    currentPath: req.path,
    message: 'The requested desk, ledger, or record does not exist.'
  });
});

// Central 500 error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err.message);
  res.status(500).render('error', {
    status: 500,
    title: '500 — System Error',
    currentPath: req.path,
    message: 'An unexpected issue occurred while querying the property registry.'
  });
});

/**
 * Connect to MongoDB Atlas and start server.
 * Per specification: Express server starts ONLY after successful database connection.
 * In Phase 2: builds the compound unique index on Claim ({ foundItem: 1, claimedBy: 1 }).
 */
async function startServer() {
  if (!MONGODB_URI) {
    console.error('================================================================');
    console.error('DATABASE CONNECTION ERROR: MONGODB_URI is not set in .env');
    console.error('Please configure your MongoDB Atlas connection string in .env');
    console.error('================================================================');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);

    // Synchronize compound unique index for claims at startup
    await Claim.init();

    console.log('================================================================');
    console.log('✔ Connected successfully to MongoDB Atlas database');
    console.log('✔ Claim model compound unique indexes verified and built');
    console.log('================================================================');

    const server = app.listen(PORT, () => {
      console.log(`✔ Campus Lost & Found server running at http://localhost:${PORT}`);
      console.log('Press Ctrl+C to stop the server.');
    });
    return server;
  } catch (err) {
    console.error('================================================================');
    console.error('MONGODB ATLAS CONNECTION FAILED:');
    console.error(err.message);
    console.error('Troubleshooting tips:');
    console.error('1. Check that your IP address is whitelisted in Atlas Network Access.');
    console.error('2. Verify the database username and password in .env.');
    console.error('3. Ensure special characters in your password are URL encoded.');
    console.error('================================================================');
  }
}

// Start server when executed directly as entrypoint
if (require.main === module) {
  startServer();
}

app.startServer = startServer;
module.exports = app;
