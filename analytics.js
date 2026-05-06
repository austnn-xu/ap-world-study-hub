(function () {
  const apiRoot = window.APWorldStore?.apiRoot || "";
  const lock = document.querySelector("[data-analytics-lock]");
  const dashboard = document.querySelector("[data-analytics-dashboard]");
  const loginForm = document.querySelector("[data-analytics-login]");
  const loginMessage = document.querySelector("[data-login-message]");
  const refreshButton = document.querySelector("[data-refresh-analytics]");

  if (!lock || !dashboard || !loginForm) return;

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = String(new FormData(loginForm).get("password") || "");
    setLoginMessage("Checking password...");

    try {
      const response = await fetch(`${apiRoot}/api/analytics`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Could not unlock analytics.");

      loginForm.reset();
      setLoginMessage("");
      await loadAnalytics();
    } catch (error) {
      setLoginMessage(error.message || "Could not unlock analytics.");
    }
  });

  refreshButton?.addEventListener("click", loadAnalytics);
  loadAnalytics();

  async function loadAnalytics() {
    refreshButton?.setAttribute("disabled", "true");

    try {
      const response = await fetch(`${apiRoot}/api/analytics`, {
        credentials: "include",
        cache: "no-store"
      });
      const result = await response.json().catch(() => ({}));

      if (response.status === 401) {
        lock.hidden = false;
        dashboard.hidden = true;
        return;
      }

      if (!response.ok) throw new Error(result.error || "Analytics failed to load.");

      lock.hidden = true;
      dashboard.hidden = false;
      renderAnalytics(result);
    } catch (error) {
      lock.hidden = false;
      dashboard.hidden = true;
      setLoginMessage(error.message || "Analytics failed to load.");
    } finally {
      refreshButton?.removeAttribute("disabled");
    }
  }

  function renderAnalytics(data) {
    const totals = data.totals || {};
    const correctRate = totals.mcqAnswers ? Math.round((Number(totals.mcqCorrect || 0) / Number(totals.mcqAnswers || 1)) * 100) : 0;
    const metrics = [
      ["Total visits", totals.visits || 0],
      ["Unique visitors", totals.uniqueVisitors || 0],
      ["Prompts generated", totals.prompts || 0],
      ["Questions created", totals.questionsGenerated || 0],
      ["Writing grades", totals.grades || 0],
      ["MCQ answers", totals.mcqAnswers || 0],
      ["MCQ correct rate", `${correctRate}%`],
      ["Missed MCQs", totals.mcqMissed || 0],
      ["Reviews", totals.reviews || 0]
    ];

    document.querySelector("[data-metric-grid]").innerHTML = metrics.map(([label, value]) => `
      <article class="metric-card">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
      </article>
    `).join("");

    document.querySelector("[data-analytics-updated]").textContent = data.lastUpdated
      ? `Last updated ${formatDate(data.lastUpdated)}`
      : "No events recorded yet.";
    document.querySelector("[data-storage-label]").textContent = data.storage === "edge-config" ? "Stored on Vercel" : "Temporary server memory";

    renderDailyChart(data.daily || []);
    renderKeyValueTable("[data-pages-table]", data.pages || [], "No page visits yet.");
    renderPracticeTable(data.practiceTypes || []);
    renderKeyValueTable("[data-sources-table]", data.sources || [], "No AI generations yet.");
    renderEventsTable(data.recentEvents || []);
  }

  function renderDailyChart(days) {
    const container = document.querySelector("[data-daily-chart]");
    if (!container) return;
    if (!days.length) {
      container.innerHTML = `<p class="small-note">No daily activity yet.</p>`;
      return;
    }

    const maxValue = Math.max(...days.map((day) => Number(day.visits || 0) + Number(day.prompts || 0) + Number(day.grades || 0)), 1);
    container.innerHTML = days.map((day) => {
      const visits = Number(day.visits || 0);
      const prompts = Number(day.prompts || 0);
      const grades = Number(day.grades || 0);
      const total = visits + prompts + grades;
      const height = Math.max(8, Math.round((total / maxValue) * 100));
      return `
        <div class="daily-bar" title="${escapeHtml(`${day.date}: ${total} events`)}">
          <span style="height: ${height}%"></span>
          <small>${escapeHtml(day.date.slice(5))}</small>
        </div>
      `;
    }).join("");
  }

  function renderKeyValueTable(selector, rows, emptyText) {
    const container = document.querySelector(selector);
    if (!container) return;
    if (!rows.length) {
      container.innerHTML = `<p class="small-note">${escapeHtml(emptyText)}</p>`;
      return;
    }

    container.innerHTML = `
      <table class="analytics-table">
        <tbody>
          ${rows.map((row) => `
            <tr>
              <td>${escapeHtml(row.name)}</td>
              <td>${escapeHtml(row.count)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  function renderPracticeTable(rows) {
    const container = document.querySelector("[data-practice-table]");
    if (!container) return;
    if (!rows.length) {
      container.innerHTML = `<p class="small-note">No practice generated yet.</p>`;
      return;
    }

    container.innerHTML = `
      <table class="analytics-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Prompts</th>
            <th>Questions</th>
            <th>Grades</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              <td>${escapeHtml(String(row.type || "").toUpperCase())}</td>
              <td>${escapeHtml(row.prompts || 0)}</td>
              <td>${escapeHtml(row.questions || 0)}</td>
              <td>${escapeHtml(row.grades || 0)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  function renderEventsTable(events) {
    const container = document.querySelector("[data-events-table]");
    if (!container) return;
    if (!events.length) {
      container.innerHTML = `<p class="small-note">No events yet.</p>`;
      return;
    }

    container.innerHTML = `
      <table class="analytics-table">
        <thead>
          <tr>
            <th>Event</th>
            <th>Page</th>
            <th>When</th>
          </tr>
        </thead>
        <tbody>
          ${events.map((event) => `
            <tr>
              <td>${escapeHtml(labelEvent(event))}</td>
              <td>${escapeHtml(event.page || "/")}</td>
              <td>${escapeHtml(formatDate(event.at))}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  function labelEvent(event) {
    const type = String(event.type || "").replaceAll("_", " ");
    return event.practiceType ? `${type} (${String(event.practiceType).toUpperCase()})` : type;
  }

  function setLoginMessage(message) {
    if (!loginMessage) return;
    loginMessage.hidden = !message;
    loginMessage.textContent = message;
  }

  function formatDate(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
