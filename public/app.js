(function () {
  const missedKey = "apworld.missed.mcq.v1";
  const themeKey = "apworld.theme.v2";
  const apiRoot = window.location.protocol === "file:" || window.location.hostname.endsWith("github.io") ? "http://localhost:4173" : "";

  applyTheme(readTheme());

  function readMissed() {
    try {
      const parsed = JSON.parse(localStorage.getItem(missedKey) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeMissed(items) {
    localStorage.setItem(missedKey, JSON.stringify(items));
    updateMissedCount();
  }

  function makeQuestionId(question) {
    const raw = [
      question.id,
      question.prompt,
      question.stimulus,
      (question.choices || []).map((choice) => `${choice.id}:${choice.text}`).join("|")
    ].join("::");

    let hash = 0;
    for (let index = 0; index < raw.length; index += 1) {
      hash = ((hash << 5) - hash + raw.charCodeAt(index)) | 0;
    }
    return `mcq-${Math.abs(hash)}`;
  }

  function saveMissed(question, selected) {
    const id = makeQuestionId(question);
    const missed = readMissed();
    const existing = missed.find((item) => item.id === id);
    if (existing) {
      existing.attempts += 1;
      existing.lastSelected = selected;
      existing.lastMissedAt = new Date().toISOString();
      existing.question = { ...question, id };
    } else {
      missed.unshift({
        id,
        question: { ...question, id },
        attempts: 1,
        lastSelected: selected,
        firstMissedAt: new Date().toISOString(),
        lastMissedAt: new Date().toISOString()
      });
    }
    writeMissed(missed.slice(0, 75));
  }

  function removeMissed(question) {
    const id = makeQuestionId(question);
    writeMissed(readMissed().filter((item) => item.id !== id && item.question?.id !== question.id));
  }

  function updateMissedCount() {
    const count = readMissed().length;
    document.querySelectorAll("[data-missed-count]").forEach((node) => {
      node.textContent = String(count);
    });
  }

  function readTheme() {
    const stored = localStorage.getItem(themeKey);
    return stored === "dark" ? "dark" : "light";
  }

  function applyTheme(theme) {
    const nextTheme = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem(themeKey, nextTheme);
    updateThemeToggle(nextTheme);
  }

  function updateThemeToggle(theme) {
    const button = document.querySelector("[data-theme-toggle]");
    if (!button) return;
    const isDark = theme === "dark";
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    button.innerHTML = `
      <span class="theme-toggle-dot" aria-hidden="true"></span>
      <span>${isDark ? "Dark" : "Light"}</span>
    `;
  }

  function addThemeToggle() {
    const header = document.querySelector(".site-header");
    if (!header || header.querySelector("[data-theme-toggle]")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";
    button.dataset.themeToggle = "true";
    button.addEventListener("click", () => {
      const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
      applyTheme(current === "dark" ? "light" : "dark");
    });
    header.appendChild(button);
    updateThemeToggle(readTheme());
  }

  async function updateAiStatus() {
    const nodes = document.querySelectorAll("[data-ai-status]");
    if (!nodes.length) return;
    try {
      const response = await fetch(`${apiRoot}/api/status`);
      const status = await response.json();
      const provider = status.provider || "AI";
      const label = status.liveAI ? `Live ${provider}: ${status.model}` : "Sample mode";
      nodes.forEach((node) => {
        node.textContent = label;
      });
    } catch {
      const label = window.location.hostname.endsWith("github.io") ? "Static preview" : "Server offline";
      nodes.forEach((node) => {
        node.textContent = label;
      });
    }
  }

  window.APWorldStore = {
    readMissed,
    saveMissed,
    removeMissed,
    makeQuestionId,
    updateMissedCount,
    apiRoot
  };

  document.addEventListener("DOMContentLoaded", () => {
    addThemeToggle();
    updateMissedCount();
    updateAiStatus();
  });
})();
