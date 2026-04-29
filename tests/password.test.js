import test from "node:test";
import assert from "node:assert/strict";
import {
  generatePassword,
  validatePasswordAgainstOptions,
} from "../src/password.js";

test("generates password with requested length", () => {
  const password = generatePassword({ length: 24 });
  assert.equal(password.length, 24);
});

test("respects enabled character groups", () => {
  const options = {
    length: 30,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  };

  const password = generatePassword(options);
  assert.equal(validatePasswordAgainstOptions(password, options), true);
});

test("works with only one character group", () => {
  const password = generatePassword({
    length: 12,
    uppercase: false,
    lowercase: true,
    numbers: false,
    symbols: false,
  });

  assert.match(password, /^[a-z]+$/);
});
