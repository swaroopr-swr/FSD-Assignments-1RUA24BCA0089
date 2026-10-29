require('dotenv').config();
const mongoose = require('mongoose');

const Student = require('../models/Student');
const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const Claim = require('../models/Claim');
const RosterEntry = require('../models/RosterEntry');

/**
 * Development Database Reset Helper (C8)
 * 
 * Safety guards:
 * 1. Strictly refuses to run when NODE_ENV === 'production'
 * 2. Requires explicit command-line flag '--confirm'
 * 3. Drops only students, lostitems, founditems, claims, and rosterentries collections
 * 4. Rebuilds collection indexes (Claim compound index, Student email/USN unique indexes)
 */
async function resetDevData() {
  if (process.env.NODE_ENV === 'production') {
    console.error('FATAL SAFETY GUARD: Database reset refused in production environment (NODE_ENV=production).');
    process.exit(1);
  }

  const hasConfirmFlag = process.argv.includes('--confirm');
  if (!hasConfirmFlag) {
    console.error('SAFETY WARNING: Resetting the database drops development collections and rebuilds indexes.');
    console.error('To confirm this action, run: npm run reset:dev -- --confirm');
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('FATAL: MONGODB_URI is not configured in .env');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);

    const dbName = mongoose.connection.name;
    console.log(`Connected to target development database: [${dbName}]`);

    const collectionsToDrop = ['students', 'lostitems', 'founditems', 'claims', 'rosterentries'];
    const existingCollections = (await mongoose.connection.db.listCollections().toArray()).map((c) => c.name);

    for (const coll of collectionsToDrop) {
      if (existingCollections.includes(coll)) {
        await mongoose.connection.db.dropCollection(coll);
        console.log(`✔ Dropped collection: ${coll}`);
      } else {
        console.log(`- Collection not found (skipped): ${coll}`);
      }
    }

    console.log('Rebuilding model indexes...');
    await Promise.all([
      RosterEntry.init(),
      Student.init(),
      Claim.init(),
      LostItem.init(),
      FoundItem.init()
    ]);
    console.log('✔ Schema unique and compound indexes rebuilt successfully.');

    console.log('================================================================');
    console.log(`Database [${dbName}] has been reset cleanly.`);
    console.log('Next step: run `npm run seed:roster` to populate registrar records.');
    console.log('================================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error during database reset:', err.message);
    process.exit(1);
  }
}

resetDevData();
