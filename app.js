(function () {
  const appVersion = "2026.05.09.8";
  const missedKey = "apworld.missed.mcq.v1";
  const reviewKey = "apworld.reviews.v1";
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

  function readReviews() {
    try {
      const parsed = JSON.parse(localStorage.getItem(reviewKey) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeReviews(reviews) {
    localStorage.setItem(reviewKey, JSON.stringify(reviews.slice(0, 25)));
    renderReviews();
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
    updateBrowserThemeColor(nextTheme);
    updateThemeToggle(nextTheme);
  }

  function updateBrowserThemeColor(theme) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#050505" : "#f5f5f7");
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

  function setupReviewForm() {
    const openButton = document.querySelector("[data-review-open]");
    const form = document.querySelector("[data-review-form]");
    const cancelButton = document.querySelector("[data-review-cancel]");
    if (!openButton || !form) return;

    openButton.addEventListener("click", () => {
      form.hidden = false;
      openButton.hidden = true;
      form.querySelector("textarea")?.focus();
    });

    cancelButton?.addEventListener("click", () => {
      form.hidden = true;
      openButton.hidden = false;
      form.reset();
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const anonymous = data.get("anonymous") === "on";
      const body = String(data.get("review") || "").trim();
      if (body.length < 4) {
        form.querySelector("textarea")?.focus();
        return;
      }

      const name = anonymous ? "Anonymous" : String(data.get("name") || "").trim() || "Anonymous";
      const rating = Math.max(1, Math.min(5, Number(data.get("rating") || 5)));
      const nextReview = {
        id: `review-${Date.now()}`,
        name,
        anonymous,
        rating,
        body,
        version: appVersion,
        createdAt: new Date().toISOString()
      };
      writeReviews([nextReview, ...readReviews()]);
      form.reset();
      form.hidden = true;
      openButton.hidden = false;
    });

    renderReviews();
  }

  function renderReviews() {
    const list = document.querySelector("[data-review-list]");
    if (!list) return;
    const reviews = readReviews();
    if (!reviews.length) {
      list.innerHTML = `<p class="small-note">No reviews yet.</p>`;
      return;
    }

    list.innerHTML = reviews.slice(0, 4).map((review) => `
      <article class="review-card">
        <div>
          <strong>${escapeHtml(review.name || "Anonymous")}</strong>
          <span>${escapeHtml(`${Number(review.rating || 5)}/5`)}</span>
        </div>
        <p>${escapeHtml(review.body || "")}</p>
      </article>
    `).join("");
  }

  async function checkForUpdates() {
    try {
      const versionUrl = new URL("version.json", window.location.href);
      versionUrl.searchParams.set("t", String(Date.now()));
      const response = await fetch(versionUrl, { cache: "no-store" });
      if (!response.ok) return;
      const latest = await response.json();
      if (latest.version && latest.version !== appVersion) showUpdateNotice(latest.version);
    } catch {
      // Update checks should never interrupt studying.
    }
  }

  function showUpdateNotice(version) {
    if (document.querySelector("[data-update-notice]")) return;
    const notice = document.createElement("aside");
    notice.className = "update-notice";
    notice.dataset.updateNotice = "true";
    notice.innerHTML = `
      <div>
        <strong>New update available</strong>
        <span>Refresh for version ${escapeHtml(version)}. If it still looks old, hard refresh with Ctrl + F5.</span>
      </div>
      <button class="secondary-action" type="button">Refresh</button>
    `;
    notice.querySelector("button")?.addEventListener("click", () => {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set("fresh", version);
      window.location.href = nextUrl.toString();
    });
    document.body.appendChild(notice);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  window.APWorldStore = {
    readMissed,
    saveMissed,
    removeMissed,
    makeQuestionId,
    updateMissedCount,
    apiRoot,
    appVersion
  };

  document.addEventListener("DOMContentLoaded", () => {
    addThemeToggle();
    updateMissedCount();
    updateAiStatus();
    setupReviewForm();
    checkForUpdates();
  });
})();
