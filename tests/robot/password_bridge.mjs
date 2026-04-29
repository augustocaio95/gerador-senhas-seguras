import {
  generatePassword,
  validatePasswordAgainstOptions,
} from "../../src/password.js";

function parseOptions(raw) {
  if (!raw) return {};
  return JSON.parse(raw);
}

function main() {
  try {
    const options = parseOptions(process.argv[2]);
    const password = generatePassword(options);
    const valid = validatePasswordAgainstOptions(password, options);

    process.stdout.write(
      JSON.stringify({
        ok: true,
        password,
        length: password.length,
        valid,
      }),
    );
  } catch (error) {
    process.stdout.write(JSON.stringify({ ok: false, error: error.message }));
    process.exitCode = 1;
  }
}

main();
