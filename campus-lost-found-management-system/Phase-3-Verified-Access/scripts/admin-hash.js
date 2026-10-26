const readline = require('readline');
const { Writable } = require('stream');
const { hashPassword } = require('../utils/passwords');

/**
 * Prompts the operator for input in the terminal while muting echo to screen.
 * Prevents shoulder-surfing of administrative master passwords (C10).
 */
function promptHidden(promptText) {
  return new Promise((resolve) => {
    let muted = false;
    const mutableStdout = new Writable({
      write(chunk, encoding, callback) {
        if (!muted) {
          process.stdout.write(chunk, encoding);
        }
        callback();
      }
    });

    const rl = readline.createInterface({
      input: process.stdin,
      output: mutableStdout,
      terminal: true
    });

    process.stdout.write(promptText);
    muted = true;

    rl.question('', (answer) => {
      muted = false;
      process.stdout.write('\n');
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  console.log('================================================================');
  console.log('Property Office · Administrative Password Hash Generator');
  console.log('Typed characters are muted to protect credentials from shoulder-surfing.');
  console.log('Minimum length required: 12 characters.');
  console.log('================================================================');

  try {
    const password = await promptHidden('Enter Admin Password: ');

    if (!password || password.length < 12) {
      console.error('Error: Admin password must be at least 12 characters.');
      process.exit(1);
    }

    const confirmPassword = await promptHidden('Confirm Admin Password: ');

    if (password !== confirmPassword) {
      console.error('Error: Passwords do not match.');
      process.exit(1);
    }

    console.log('Generating cryptographic scrypt hash...');
    const hash = await hashPassword(password);

    console.log('\n✔ Scrypt Hash generated successfully:');
    console.log('----------------------------------------------------------------');
    console.log(hash);
    console.log('----------------------------------------------------------------');
    console.log('Copy and paste this hash into your .env file as:');
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    console.log('Never commit the plaintext password or .env to version control.');
    console.log('================================================================');
    process.exit(0);
  } catch (err) {
    console.error('Failed to generate admin hash:', err.message);
    process.exit(1);
  }
}

main();
