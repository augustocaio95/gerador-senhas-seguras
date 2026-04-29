import { generatePassword } from "./password.js";

const THEME_STORAGE_KEY = "gerador-senhas-theme";

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
const themeToggle = document.getElementById("themeToggle");

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

function getTheme() {
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

function setTheme(theme) {
  const next = theme === "light" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(THEME_STORAGE_KEY, next);
  updateThemeToggleUi();
}

function updateThemeToggleUi() {
  if (!themeToggle) return;
  const isDark = getTheme() === "dark";
  themeToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
  const label = themeToggle.querySelector(".theme-toggle__label");
  const hidden = themeToggle.querySelector(".visually-hidden");
  if (label) {
    label.textContent = isDark ? "Claro" : "Escuro";
  }
  if (hidden) {
    hidden.textContent = isDark ? "Ativar tema claro" : "Ativar tema escuro";
  }
  themeToggle.title = isDark ? "Usar tema claro" : "Usar tema escuro";
}

function toggleTheme() {
  setTheme(getTheme() === "dark" ? "light" : "dark");
}

lengthInput.addEventListener("input", () => {
  lengthValue.textContent = lengthInput.value;
});

generateBtn.addEventListener("click", generateAndRender);
copyBtn.addEventListener("click", copyPassword);
themeToggle?.addEventListener("click", toggleTheme);

updateThemeToggleUi();
generateAndRender();
