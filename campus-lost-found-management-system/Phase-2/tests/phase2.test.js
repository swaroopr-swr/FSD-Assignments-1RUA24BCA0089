const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const { spawn } = require('node:child_process');
const path = require('node:path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Student = require('../models/Student');
const FoundItem = require('../models/FoundItem');
const LostItem = require('../models/LostItem');
const Claim = require('../models/Claim');

const TEST_PORT = 3999;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

// Enforce test database isolation constraints
const { MONGODB_URI, MONGODB_URI_TEST } = process.env;

if (!MONGODB_URI_TEST) {
  console.error('FATAL: MONGODB_URI_TEST is not configured in .env');
  process.exit(1);
}

if (MONGODB_URI_TEST === MONGODB_URI) {
  console.error('FATAL: MONGODB_URI_TEST must not match production MONGODB_URI');
  process.exit(1);
}

let serverProcess = null;
let cookieStudentA = null; // Finder
let cookieStudentB = null; // Claimant 1
let cookieStudentC = null; // Claimant 2

let studentAId = null;
let studentBId = null;
let studentCId = null;

let foundItemId = null;
let lostItemId = null;
let claimBId = null;
let claimCId = null;

/**
 * Helper to extract signed studentId cookie from set-cookie headers
 */
function extractStudentCookie(res) {
  let cookieHeader = null;
  if (typeof res.headers.getSetCookie === 'function') {
    const cookies = res.headers.getSetCookie();
    cookieHeader = cookies.find((c) => c.startsWith('studentId='));
  }
  if (!cookieHeader) {
    const raw = res.headers.get('set-cookie');
    if (raw) {
      const parts = raw.split(/,(?=[a-zA-Z0-9_-]+=)/);
      cookieHeader = parts.find((p) => p.trim().startsWith('studentId='));
    }
  }
  if (!cookieHeader) return null;
  return cookieHeader.split(';')[0].trim();
}

/**
 * Helper to sign in via POST /sign-in and retrieve cookie
 */
async function signInStudent(email) {
  const res = await fetch(`${BASE_URL}/sign-in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ email }).toString(),
    redirect: 'manual'
  });
  return extractStudentCookie(res);
}

describe('Campus Lost & Found — Phase 2 Comprehensive Test Suite', () => {
  before(async () => {
    console.log('\n[TEST SETUP] Connecting to dedicated test database...');
    await mongoose.connect(MONGODB_URI_TEST);

    console.log('[TEST SETUP] Purging test database collections...');
    await Promise.all([
      Student.deleteMany({}),
      FoundItem.deleteMany({}),
      LostItem.deleteMany({}),
      Claim.deleteMany({})
    ]);

    // Ensure Compound Index exists on Claim
    await Claim.init();

    console.log(`[TEST SETUP] Spawning Phase 2 server on port ${TEST_PORT}...`);
    serverProcess = spawn('node', ['index.js'], {
      cwd: path.join(__dirname, '..'),
      env: {
        ...process.env,
        PORT: TEST_PORT.toString(),
        MONGODB_URI: MONGODB_URI_TEST
      },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    serverProcess.stderr.on('data', (d) => {
      const msg = d.toString();
      if (!msg.includes('DeprecationWarning')) {
        console.error('[SERVER STDERR]', msg);
      }
    });

    // Wait until server is listening
    let ready = false;
    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch(`${BASE_URL}/`);
        if (res.status === 200) {
          ready = true;
          break;
        }
      } catch (err) {
        // Retry delay
      }
      await new Promise((r) => setTimeout(r, 400));
    }

    if (!ready) {
      throw new Error('Test server failed to respond within 12 seconds');
    }
    console.log('[TEST SETUP] Server ready and accepting connections.\n');

    // Seed test students directly in MongoDB
    const [stA, stB, stC] = await Student.create([
      {
        fullName: 'Finder Alice',
        email: 'alice.finder@college.edu',
        department: 'Computer Applications',
        contactNumber: '9876543210'
      },
      {
        fullName: 'Claimant Bob',
        email: 'bob.claimant@college.edu',
        department: 'Mechanical Engineering',
        contactNumber: '8765432109'
      },
      {
        fullName: 'Claimant Charlie',
        email: 'charlie.claimant@college.edu',
        department: 'Civil Engineering',
        contactNumber: '7654321098'
      }
    ]);

    studentAId = stA._id.toString();
    studentBId = stB._id.toString();
    studentCId = stC._id.toString();

    // Authenticate students and retain session cookies
    cookieStudentA = await signInStudent('alice.finder@college.edu');
    cookieStudentB = await signInStudent('bob.claimant@college.edu');
    cookieStudentC = await signInStudent('charlie.claimant@college.edu');

    assert.ok(cookieStudentA, 'Student A session cookie must be present');
    assert.ok(cookieStudentB, 'Student B session cookie must be present');
    assert.ok(cookieStudentC, 'Student C session cookie must be present');
  });

  after(async () => {
    console.log('\n[TEST TEARDOWN] Shutting down test server and closing DB connection...');
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
    }
    await mongoose.disconnect();
    console.log('[TEST TEARDOWN] Cleaned up successfully.\n');
  });

  it('1. Successful lost and found item creation by Student A', async () => {
    // Create Found Item
    const foundRes = await fetch(`${BASE_URL}/found-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieStudentA
      },
      body: new URLSearchParams({
        itemName: 'Vintage Mechanical Watch',
        category: 'Bottles & Accessories',
        description: 'Silver-cased analog watch found near Science Block bench.',
        foundLocation: 'Science Block Benches',
        dateFound: new Date().toISOString().split('T')[0]
      }).toString(),
      redirect: 'manual'
    });

    assert.strictEqual(foundRes.status, 302, 'Should redirect after successful found item creation');
    const redirectUrl = foundRes.headers.get('location');
    assert.match(redirectUrl, /\/found-items\/[0-9a-fA-F]{24}$/, 'Should redirect to item detail page');

    foundItemId = redirectUrl.split('/').pop();
    const itemInDb = await FoundItem.findById(foundItemId);
    assert.strictEqual(itemInDb.itemName, 'Vintage Mechanical Watch');
    assert.strictEqual(itemInDb.status, 'Available');
    assert.strictEqual(itemInDb.reportedBy.toString(), studentAId);

    // Create Lost Item
    const lostRes = await fetch(`${BASE_URL}/lost-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieStudentA
      },
      body: new URLSearchParams({
        itemName: 'Blue Laboratory Notebook',
        category: 'Books & Stationery',
        description: 'Hardcover spiral notebook containing chemistry lab notes.',
        lastSeenLocation: 'Chemistry Laboratory 2',
        dateLost: new Date().toISOString().split('T')[0]
      }).toString(),
      redirect: 'manual'
    });

    assert.strictEqual(lostRes.status, 302, 'Should redirect after successful lost item creation');
    lostItemId = lostRes.headers.get('location').split('/').pop();
    const lostInDb = await LostItem.findById(lostItemId);
    assert.strictEqual(lostInDb.status, 'Lost');
  });

  it('2. Invalid ID format (/found-items/abc) returns 404', async () => {
    const res = await fetch(`${BASE_URL}/found-items/abc`, {
      headers: { Cookie: cookieStudentB }
    });
    assert.strictEqual(res.status, 404, 'Invalid hex ID should return 404');
    const html = await res.text();
    assert.ok(html.includes('404'), 'Response body should display 404 page');
  });

  it('3. Valid format but non-existent ID returns 404', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await fetch(`${BASE_URL}/found-items/${fakeId}`, {
      headers: { Cookie: cookieStudentB }
    });
    assert.strictEqual(res.status, 404, 'Non-existent item should return 404');
  });

  it('4. Signed-out claim submission redirects to /sign-in (302)', async () => {
    const res = await fetch(`${BASE_URL}/found-items/${foundItemId}/claims`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        reason: 'This is my watch with an engraved initials AB on the back cover.'
      }).toString(),
      redirect: 'manual'
    });
    assert.strictEqual(res.status, 302, 'Signed-out submission must redirect');
    assert.match(res.headers.get('location'), /\/sign-in/, 'Redirect location must be /sign-in');
  });

  it('5. Finder cannot claim their own reported item (returns 403)', async () => {
    const res = await fetch(`${BASE_URL}/found-items/${foundItemId}/claims`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieStudentA
      },
      body: new URLSearchParams({
        reason: 'This is my watch with an engraved initials AB on the back cover.'
      }).toString()
    });
    assert.strictEqual(res.status, 403, 'Self-claim by finder must return 403');
    const html = await res.text();
    assert.ok(html.includes('403'), 'Response must show 403 Error');
    assert.ok(html.includes('Self-Claim Prohibited') || html.includes('cannot submit'), 'Explanation must be given');
  });

  it('6. Claim with blank/whitespace reason returns 400 Bad Request', async () => {
    const res = await fetch(`${BASE_URL}/found-items/${foundItemId}/claims`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieStudentB
      },
      body: new URLSearchParams({
        reason: '           '
      }).toString()
    });
    assert.strictEqual(res.status, 400, 'Blank reason must return 400');
    const html = await res.text();
    assert.ok(html.includes('reason') || html.includes('Proof of ownership'), 'Validation error message rendered');
  });

  it('7. Claim with short reason (<10 characters) returns 400 Bad Request', async () => {
    const res = await fetch(`${BASE_URL}/found-items/${foundItemId}/claims`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieStudentB
      },
      body: new URLSearchParams({
        reason: 'My watch'
      }).toString()
    });
    assert.strictEqual(res.status, 400, 'Reason < 10 chars must return 400');
  });

  it('8. Successful claim submission: starts as Pending, ignores body status/claimedBy spoofing', async () => {
    const res = await fetch(`${BASE_URL}/found-items/${foundItemId}/claims`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieStudentB
      },
      body: new URLSearchParams({
        reason: 'The watch has a scratch at 3 oclock and the leather strap has stitch mark on the buckle.',
        status: 'Approved', // Spoofed field
        claimedBy: studentAId // Spoofed field
      }).toString(),
      redirect: 'manual'
    });

    assert.strictEqual(res.status, 302, 'Valid claim should redirect to item page');
    const claim = await Claim.findOne({ foundItem: foundItemId, claimedBy: studentBId });
    assert.ok(claim, 'Claim record must exist in database');
    assert.strictEqual(claim.status, 'Pending', 'Claim status must be Pending despite spoofing');
    assert.strictEqual(claim.claimedBy.toString(), studentBId, 'Claimant must be authenticated student');
    assert.strictEqual(claim.reviewedAt, null, 'reviewedAt must be null on creation');
    claimBId = claim._id.toString();
  });

  it('9. Duplicate claim by same student on same item is rejected (returns 409)', async () => {
    const res = await fetch(`${BASE_URL}/found-items/${foundItemId}/claims`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieStudentB
      },
      body: new URLSearchParams({
        reason: 'Submitting a second duplicate claim for the same mechanical watch.'
      }).toString()
    });
    assert.strictEqual(res.status, 409, 'Duplicate claim submission must return 409');
    const html = await res.text();
    assert.ok(html.includes('409'), 'HTML should indicate 409 status');
    assert.ok(html.includes('Duplicate Claim') || html.includes('already submitted'), 'Friendly duplicate message present');

    // Confirm collection still only has 1 claim from Student B
    const count = await Claim.countDocuments({ foundItem: foundItemId, claimedBy: studentBId });
    assert.strictEqual(count, 1, 'Only one claim may ever exist per student per item');
  });

  it('10. Unauthorized approval attempt by Student B (non-finder) returns 403 and leaves claim Pending', async () => {
    const res = await fetch(`${BASE_URL}/claims/${claimBId}/status?_method=PATCH`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieStudentB
      },
      body: new URLSearchParams({
        status: 'Approved'
      }).toString()
    });

    assert.strictEqual(res.status, 403, 'Non-finder attempting approval must receive 403');
    const claim = await Claim.findById(claimBId);
    assert.strictEqual(claim.status, 'Pending', 'Claim status must remain unchanged as Pending');
    assert.strictEqual(claim.reviewedAt, null, 'reviewedAt must remain null');
  });

  it('11. Student C lodges a second claim on the item (pre-approval multi-claim scenario)', async () => {
    const res = await fetch(`${BASE_URL}/found-items/${foundItemId}/claims`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieStudentC
      },
      body: new URLSearchParams({
        reason: 'I also lost an analog watch in the same vicinity yesterday morning.'
      }).toString(),
      redirect: 'manual'
    });

    assert.strictEqual(res.status, 302);
    const claimC = await Claim.findOne({ foundItem: foundItemId, claimedBy: studentCId });
    assert.ok(claimC, 'Claim from Student C must exist');
    assert.strictEqual(claimC.status, 'Pending');
    claimCId = claimC._id.toString();
  });

  it('12. Finder approves Student B claim: claim Approved, item Returned, other claims auto-Rejected', async () => {
    const res = await fetch(`${BASE_URL}/claims/${claimBId}/status?_method=PATCH`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieStudentA
      },
      body: new URLSearchParams({
        status: 'Approved'
      }).toString(),
      redirect: 'manual'
    });

    assert.strictEqual(res.status, 302, 'Successful approval should redirect to item page');

    // Check approved claim
    const updatedClaimB = await Claim.findById(claimBId);
    assert.strictEqual(updatedClaimB.status, 'Approved', 'Claim B must be Approved');
    assert.ok(updatedClaimB.reviewedAt, 'Claim B reviewedAt must be set');

    // Check item status transitioned to Returned
    const updatedItem = await FoundItem.findById(foundItemId);
    assert.strictEqual(updatedItem.status, 'Returned', 'Found item status must transition to Returned');

    // Check competing pending claim was automatically rejected
    const updatedClaimC = await Claim.findById(claimCId);
    assert.strictEqual(updatedClaimC.status, 'Rejected', 'Competing Claim C must be auto-Rejected');
    assert.ok(updatedClaimC.reviewedAt, 'Claim C reviewedAt must be set');
  });

  it('13. Deciding an already-decided claim returns 409 Conflict', async () => {
    // Attempting to reject an already Approved claim
    const res = await fetch(`${BASE_URL}/claims/${claimBId}/status?_method=PATCH`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieStudentA
      },
      body: new URLSearchParams({
        status: 'Rejected'
      }).toString()
    });

    assert.strictEqual(res.status, 409, 'Attempting to re-decide an approved claim must return 409');
  });

  it('14. Submitting a new claim on a Returned item returns 409 Conflict', async () => {
    // Create new student D
    const stD = await Student.create({
      fullName: 'Late Claimant Dave',
      email: 'dave.late@college.edu',
      department: 'Physics',
      contactNumber: '9123456780'
    });
    const cookieStudentD = await signInStudent('dave.late@college.edu');

    const res = await fetch(`${BASE_URL}/found-items/${foundItemId}/claims`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieStudentD
      },
      body: new URLSearchParams({
        reason: 'I am claiming this watch even though it is already marked returned.'
      }).toString()
    });

    assert.strictEqual(res.status, 409, 'Claim submission on returned item must return 409');
    const html = await res.text();
    assert.ok(html.includes('409'), 'Error page must show 409');
    assert.ok(html.includes('Returned') || html.includes('closed'), 'Must indicate item is Returned');
  });

  it('15. PATCH /found-items/:id/status business rule enforcement', async () => {
    // 15a: Non-finder attempt returns 403
    const resForbidden = await fetch(`${BASE_URL}/found-items/${foundItemId}/status?_method=PATCH`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieStudentB
      },
      body: new URLSearchParams({ status: 'Returned' }).toString()
    });
    assert.strictEqual(resForbidden.status, 403, 'Non-finder must receive 403');

    // 15b: Invalid status transition (not Returned) returns 400
    const resBadStatus = await fetch(`${BASE_URL}/found-items/${foundItemId}/status?_method=PATCH`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieStudentA
      },
      body: new URLSearchParams({ status: 'Available' }).toString()
    });
    assert.strictEqual(resBadStatus.status, 400, 'Non-Returned status must return 400');

    // 15c: Already Returned item returns 409
    const resAlreadyReturned = await fetch(`${BASE_URL}/found-items/${foundItemId}/status?_method=PATCH`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieStudentA
      },
      body: new URLSearchParams({ status: 'Returned' }).toString()
    });
    assert.strictEqual(resAlreadyReturned.status, 409, 'Re-transitioning Returned item must return 409');

    // 15d: Calling on item without an approved claim returns 409
    const item2 = await FoundItem.create({
      itemName: 'Scientific Calculator',
      category: 'Electronics',
      description: 'Casio fx-991EX calculator found in Lecture Hall 3.',
      foundLocation: 'Lecture Hall 3',
      dateFound: new Date(),
      status: 'Available',
      reportedBy: studentAId
    });

    const resNoApproved = await fetch(`${BASE_URL}/found-items/${item2._id}/status?_method=PATCH`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: cookieStudentA
      },
      body: new URLSearchParams({ status: 'Returned' }).toString()
    });
    assert.strictEqual(resNoApproved.status, 409, 'Setting status to Returned without Approved claim must return 409');
  });

  it('16. Search and filtering on found items and my-claims', async () => {
    // Found items search by keyword
    const resSearch = await fetch(`${BASE_URL}/found-items?q=Mechanical`);
    assert.strictEqual(resSearch.status, 200);
    const searchHtml = await resSearch.text();
    assert.ok(searchHtml.includes('Mechanical Watch'), 'Search result should include item matching query');

    // Found items filter by status=Returned
    const resReturned = await fetch(`${BASE_URL}/found-items?status=Returned`);
    assert.strictEqual(resReturned.status, 200);
    const returnedHtml = await resReturned.text();
    assert.ok(returnedHtml.includes('Vintage Mechanical Watch'), 'Should list Returned item');

    // Found items filter by status=Available
    const resAvailable = await fetch(`${BASE_URL}/found-items?status=Available`);
    assert.strictEqual(resAvailable.status, 200);
    const availHtml = await resAvailable.text();
    assert.ok(availHtml.includes('Scientific Calculator'), 'Should list Available item');

    // GET /my-claims for Student B
    const resMyClaims = await fetch(`${BASE_URL}/my-claims`, {
      headers: { Cookie: cookieStudentB }
    });
    assert.strictEqual(resMyClaims.status, 200);
    const myClaimsHtml = await resMyClaims.text();
    assert.ok(myClaimsHtml.includes('Claims') && myClaimsHtml.includes('Ledger'), 'Must display Claims Ledger');
    assert.ok(myClaimsHtml.includes('Vintage Mechanical Watch'), 'Must display student claimed item');

    // GET /my-claims?status=Approved
    const resApproved = await fetch(`${BASE_URL}/my-claims?status=Approved`, {
      headers: { Cookie: cookieStudentB }
    });
    assert.strictEqual(resApproved.status, 200);

    // GET /my-claims?status=Rejected for Student C
    const resRejected = await fetch(`${BASE_URL}/my-claims?status=Rejected`, {
      headers: { Cookie: cookieStudentC }
    });
    assert.strictEqual(resRejected.status, 200);
    const rejHtml = await resRejected.text();
    assert.ok(rejHtml.includes('Vintage Mechanical Watch'));
  });
});
