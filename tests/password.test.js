import test from "node:test";
import assert from "node:assert/strict";
import {
  generatePassword,
  validatePasswordAgainstOptions,
  PASSWORD_LENGTH_MAX,
} from "../src/password.js";

test("generates password with requested length", () => {
  const password = generatePassword({ length: 12 });
  assert.equal(password.length, 12);
});

test("respects enabled character groups", () => {
  const options = {
    length: 12,
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

test("rejects invalid options", () => {
  assert.throws(() => generatePassword({ length: 3 }), /between 4 and 12/);
  assert.throws(() => generatePassword({ length: 13 }), /between 4 and 12/);
  assert.throws(
    () =>
      generatePassword({
        length: 10,
        uppercase: false,
        lowercase: false,
        numbers: false,
        symbols: false,
      }),
    /Select at least one/,
  );
});

test("distribution sanity check for randomness", () => {
  const sampleCount = 400;
  const generated = new Set();

  for (let i = 0; i < sampleCount; i += 1) {
    generated.add(generatePassword({ length: PASSWORD_LENGTH_MAX }));
  }

  assert.ok(generated.size > sampleCount * 0.97);
});
