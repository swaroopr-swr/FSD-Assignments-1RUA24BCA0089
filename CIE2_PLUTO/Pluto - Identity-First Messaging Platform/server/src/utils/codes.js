import crypto from "node:crypto";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomToken(length) {
  let value = "";

  for (let index = 0; index < length; index += 1) {
    value += alphabet[crypto.randomInt(0, alphabet.length)];
  }

  return value;
}

export function generatePlutoUsername() {
  return randomToken(6);
}

export function generateConnectionCode() {
  return `PLU-${randomToken(4)}-${randomToken(3)}`;
}

export function normalizeUsername(value = "") {
  return value.trim().replace(/^@/, "").toUpperCase();
}

export function normalizeConnectionCode(value = "") {
  return value.trim().toUpperCase();
}
