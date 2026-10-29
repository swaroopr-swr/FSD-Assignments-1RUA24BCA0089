require('dotenv').config();
const mongoose = require('mongoose');
const RosterEntry = require('../models/RosterEntry');
const rosterData = require('./roster-data');

/**
 * Seed script for University Registrar Roster simulation.
 * Upserts 5 fictional RV University student records by USN.
 * 
 * Run manually via: npm run seed:roster
 * Never executes automatically at application startup.
 */
async function seedRoster() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Error: MONGODB_URI is not set in environment.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB database to seed roster.');

    // Ensure model indexes are initialized
    await RosterEntry.init();

    let upsertedCount = 0;
    for (const entry of rosterData) {
      await RosterEntry.findOneAndUpdate(
        { usn: entry.usn.toUpperCase() },
        {
          $set: {
            fullName: entry.fullName.trim(),
            email: entry.email.trim().toLowerCase(),
            department: entry.department.trim()
          },
          $setOnInsert: {
            isRegistered: false,
            student: null
          }
        },
        { upsert: true, new: true }
      );
      upsertedCount++;
    }

    console.log(`✔ Successfully upserted ${upsertedCount} university roster entries.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed roster data:', err.message);
    process.exit(1);
  }
}

seedRoster();
