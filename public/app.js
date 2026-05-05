(function () {
  const missedKey = "apworld.missed.mcq.v1";

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

  async function updateAiStatus() {
    const nodes = document.querySelectorAll("[data-ai-status]");
    if (!nodes.length) return;
    try {
      const response = await fetch("/api/status");
      const status = await response.json();
      const label = status.liveAI ? `Live AI: ${status.model}` : "Sample mode";
      nodes.forEach((node) => {
        node.textContent = label;
      });
    } catch {
      nodes.forEach((node) => {
        node.textContent = "Server offline";
      });
    }
  }

  window.APWorldStore = {
    readMissed,
    saveMissed,
    removeMissed,
    makeQuestionId,
    updateMissedCount
  };

  document.addEventListener("DOMContentLoaded", () => {
    updateMissedCount();
    updateAiStatus();
  });
})();
