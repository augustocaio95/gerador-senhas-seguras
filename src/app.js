import { generatePassword } from "./password.js";

const lengthInput = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");
const uppercaseInput = document.getElementById("uppercase");
const lowercaseInput = document.getElementById("lowercase");
const numbersInput = document.getElementById("numbers");
const symbolsInput = document.getElementById("symbols");
const outputInput = document.getElementById("passwordOutput");
const statusEl = document.getElementById("status");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");

function getOptions() {
  return {
    length: Number(lengthInput.value),
    uppercase: uppercaseInput.checked,
    lowercase: lowercaseInput.checked,
    numbers: numbersInput.checked,
    symbols: symbolsInput.checked,
  };
}

function renderStatus(message) {
  statusEl.textContent = message;
}

function generateAndRender() {
  try {
    const password = generatePassword(getOptions());
    outputInput.value = password;
    renderStatus("Senha gerada com sucesso.");
  } catch (error) {
    outputInput.value = "";
    renderStatus(error.message);
  }
}

async function copyPassword() {
  if (!outputInput.value) {
    renderStatus("Gere uma senha antes de copiar.");
    return;
  }

  try {
    await navigator.clipboard.writeText(outputInput.value);
    renderStatus("Senha copiada para a area de transferencia.");
  } catch {
    renderStatus("Nao foi possivel copiar automaticamente.");
  }
}

lengthInput.addEventListener("input", () => {
  lengthValue.textContent = lengthInput.value;
});

generateBtn.addEventListener("click", generateAndRender);
copyBtn.addEventListener("click", copyPassword);

generateAndRender();
