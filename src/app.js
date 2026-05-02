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
const themeLightBtn = document.getElementById("themeLight");
const themeDarkBtn = document.getElementById("themeDark");

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
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

function setTheme(theme) {
  const next = theme === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(THEME_STORAGE_KEY, next);
  updateThemeButtonsUi();
}

function updateThemeButtonsUi() {
  const isDark = getTheme() === "dark";
  if (themeLightBtn && themeDarkBtn) {
    themeLightBtn.classList.toggle("theme-btn--active", !isDark);
    themeDarkBtn.classList.toggle("theme-btn--active", isDark);
    themeLightBtn.setAttribute("aria-pressed", isDark ? "false" : "true");
    themeDarkBtn.setAttribute("aria-pressed", isDark ? "true" : "false");
  }
}

lengthInput.addEventListener("input", () => {
  lengthValue.textContent = lengthInput.value;
});

generateBtn.addEventListener("click", generateAndRender);
copyBtn.addEventListener("click", copyPassword);
themeLightBtn?.addEventListener("click", () => setTheme("light"));
themeDarkBtn?.addEventListener("click", () => setTheme("dark"));

updateThemeButtonsUi();
generateAndRender();
