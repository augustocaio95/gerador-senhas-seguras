const CHARSETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>/?",
};

function getCrypto() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    return crypto;
  }
  throw new Error("Secure random generator unavailable.");
}

function randomInt(maxExclusive) {
  const cryptoApi = getCrypto();
  const array = new Uint32Array(1);
  const limit = Math.floor(0xffffffff / maxExclusive) * maxExclusive;

  let value;
  do {
    cryptoApi.getRandomValues(array);
    value = array[0];
  } while (value >= limit);

  return value % maxExclusive;
}

function pickRandomChar(source) {
  return source[randomInt(source.length)];
}

export function generatePassword(options = {}) {
  const length = Number(options.length ?? 16);
  const allowedGroups = [
    options.uppercase !== false ? CHARSETS.uppercase : "",
    options.lowercase !== false ? CHARSETS.lowercase : "",
    options.numbers !== false ? CHARSETS.numbers : "",
    options.symbols !== false ? CHARSETS.symbols : "",
  ].filter(Boolean);

  if (!Number.isInteger(length) || length < 4 || length > 64) {
    throw new Error("Length must be an integer between 4 and 64.");
  }

  if (allowedGroups.length === 0) {
    throw new Error("Select at least one character group.");
  }

  if (length < allowedGroups.length) {
    throw new Error("Length is too short for the selected constraints.");
  }

  const allChars = allowedGroups.join("");
  const passwordChars = [];

  for (const group of allowedGroups) {
    passwordChars.push(pickRandomChar(group));
  }

  while (passwordChars.length < length) {
    passwordChars.push(pickRandomChar(allChars));
  }

  for (let i = passwordChars.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  return passwordChars.join("");
}

export function validatePasswordAgainstOptions(password, options = {}) {
  const checks = {
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /[0-9]/.test(password),
    symbols: /[!@#$%^&*()\-_=+\[\]{};:,.<>/?]/.test(password),
  };

  const required = {
    uppercase: options.uppercase !== false,
    lowercase: options.lowercase !== false,
    numbers: options.numbers !== false,
    symbols: options.symbols !== false,
  };

  for (const key of Object.keys(required)) {
    if (required[key] && !checks[key]) {
      return false;
    }
  }

  return true;
}
