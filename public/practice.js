(function () {
  const type = document.body.dataset.practiceType;
  if (!type) return;

  const labels = {
    mcq: { title: "MCQ Practice", count: 5, button: "Generate Questions" },
    saq: { title: "SAQ Practice", count: 1, button: "Generate SAQ" },
    dbq: { title: "DBQ Practice", count: 1, button: "Generate DBQ" },
    leq: { title: "LEQ Practice", count: 1, button: "Generate LEQ" }
  };

  const state = {
    items: [],
    index: 0,
    reviewMode: false,
    loading: false
  };

  const topicInput = document.querySelector("#topicInput");
  const periodInput = document.querySelector("#periodInput");
  const difficultyInput = document.querySelector("#difficultyInput");
  const generateButton = document.querySelector("#generateButton");
  const reviewMissedButton = document.querySelector("#reviewMissedButton");
  const emptyState = document.querySelector("#emptyState");
  const questionArea = document.querySelector("#questionArea");

  generateButton?.addEventListener("click", () => generatePractice());
  reviewMissedButton?.addEventListener("click", () => loadMissedMcqs());

  async function generatePractice() {
    setLoading(true, labels[type].button);
    state.reviewMode = false;
    try {
      const response = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          count: labels[type].count,
          topic: topicInput?.value || "",
          period: periodInput?.value || "",
          difficulty: difficultyInput?.value || ""
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not generate practice.");
      state.items = result.items || [];
      state.index = 0;
      renderQuestion(result.warning);
    } catch (error) {
      renderMessage("Practice could not load.", error.message);
    } finally {
      setLoading(false, labels[type].button);
    }
  }

  function loadMissedMcqs() {
    const missed = window.APWorldStore.readMissed();
    if (!missed.length) {
      renderMessage("No missed MCQs yet.", "When you miss a multiple-choice question, it will appear here for review.");
      return;
    }
    state.items = missed.map((item) => item.question);
    state.index = 0;
    state.reviewMode = true;
    renderQuestion();
  }

  function renderQuestion(warning) {
    const item = state.items[state.index];
    if (!item) {
      renderMessage("Nothing loaded yet.", "Generate a new prompt to begin.");
      return;
    }

    emptyState.hidden = true;
    questionArea.hidden = false;

    if (type === "mcq") {
      questionArea.innerHTML = renderMcq(item, warning);
      questionArea.querySelectorAll("[data-choice]").forEach((button) => {
        button.addEventListener("click", () => gradeMcq(item, button.dataset.choice));
      });
      questionArea.querySelector("[data-next]")?.addEventListener("click", nextQuestion);
      return;
    }

    questionArea.innerHTML = renderWritten(item, warning);
    const textarea = questionArea.querySelector("textarea");
    const gradeButton = questionArea.querySelector("[data-grade]");
    gradeButton?.addEventListener("click", () => gradeWritten(item, textarea.value));
  }

  function renderMcq(item, warning) {
    const progress = `${state.index + 1} of ${state.items.length}`;
    const choices = (item.choices || []).map((choice) => `
      <button class="choice-button" type="button" data-choice="${escapeHtml(choice.id)}">
        <span class="choice-letter">${escapeHtml(choice.id)}</span>
        <span>${escapeHtml(choice.text)}</span>
      </button>
    `).join("");

    return `
      ${warning ? `<p class="notice">${escapeHtml(warning)}</p>` : ""}
      <article class="question-card">
        <div class="question-meta">
          <span>${escapeHtml(progress)}</span>
          <span>${escapeHtml(state.reviewMode ? "Review missed" : item.period || "AP World")}</span>
          <span>${escapeHtml(item.skill || "Practice")}</span>
        </div>
        ${item.stimulus ? `<div class="stimulus">${escapeHtml(item.stimulus)}</div>` : ""}
        <h2>${escapeHtml(item.prompt)}</h2>
        <div class="choices">${choices}</div>
        <div id="resultBox" class="result-box" hidden></div>
        <div class="question-actions">
          <button class="secondary-action" type="button" data-next>${state.index + 1 === state.items.length ? "Finish Set" : "Next Question"}</button>
        </div>
      </article>
    `;
  }

  function renderWritten(item, warning) {
    const documents = (item.documents || []).map((documentText) => `<li>${escapeHtml(documentText)}</li>`).join("");
    const rubric = (item.rubric || []).map((line) => `<li>${escapeHtml(line)}</li>`).join("");

    return `
      ${warning ? `<p class="notice">${escapeHtml(warning)}</p>` : ""}
      <article class="question-card">
        <div class="question-meta">
          <span>${escapeHtml(item.period || "AP World")}</span>
          <span>${escapeHtml(item.skill || "Writing")}</span>
          <span>${type.toUpperCase()}</span>
        </div>
        ${item.stimulus ? `<div class="stimulus">${escapeHtml(item.stimulus)}</div>` : ""}
        <h2>${escapeHtml(item.prompt)}</h2>
        ${documents ? `<div class="document-box"><h3>Documents</h3><ol>${documents}</ol></div>` : ""}
        <label class="response-label" for="studentResponse">Your response</label>
        <textarea id="studentResponse" rows="${type === "saq" ? "8" : "16"}" placeholder="Write your response here."></textarea>
        <div class="question-actions">
          <button class="primary-action" type="button" data-grade>Grade Response</button>
        </div>
        <div id="resultBox" class="result-box" hidden></div>
        ${rubric ? `<details class="rubric-details"><summary>Rubric target</summary><ul>${rubric}</ul></details>` : ""}
      </article>
    `;
  }

  function gradeMcq(item, selected) {
    const answer = normalizeAnswer(item.answer);
    const correct = normalizeAnswer(selected) === answer;
    const resultBox = questionArea.querySelector("#resultBox");
    questionArea.querySelectorAll("[data-choice]").forEach((button) => {
      button.disabled = true;
      if (normalizeAnswer(button.dataset.choice) === answer) button.classList.add("correct");
      if (normalizeAnswer(button.dataset.choice) === normalizeAnswer(selected) && !correct) button.classList.add("incorrect");
    });

    if (correct && state.reviewMode) window.APWorldStore.removeMissed(item);
    if (!correct) window.APWorldStore.saveMissed(item, selected);

    resultBox.hidden = false;
    resultBox.className = `result-box ${correct ? "is-correct" : "is-wrong"}`;
    resultBox.innerHTML = `
      <strong>${correct ? "Correct." : `Not quite. Correct answer: ${escapeHtml(answer)}.`}</strong>
      <p>${escapeHtml(item.explanation || "Review the concept, then try a similar question.")}</p>
    `;
  }

  async function gradeWritten(item, answer) {
    const resultBox = questionArea.querySelector("#resultBox");
    if (!answer || answer.trim().length < 20) {
      resultBox.hidden = false;
      resultBox.className = "result-box is-wrong";
      resultBox.innerHTML = "<strong>Write a bit more first.</strong><p>The grader needs enough text to evaluate evidence and reasoning.</p>";
      return;
    }

    const gradeButton = questionArea.querySelector("[data-grade]");
    gradeButton.disabled = true;
    gradeButton.textContent = "Grading";
    resultBox.hidden = false;
    resultBox.className = "result-box";
    resultBox.innerHTML = "<strong>Reading your response...</strong>";

    try {
      const response = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, question: item, answer })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not grade response.");
      renderGrade(resultBox, result);
    } catch (error) {
      resultBox.className = "result-box is-wrong";
      resultBox.innerHTML = `<strong>Grading failed.</strong><p>${escapeHtml(error.message)}</p>`;
    } finally {
      gradeButton.disabled = false;
      gradeButton.textContent = "Grade Response";
    }
  }

  function renderGrade(container, grade) {
    const strengths = (grade.strengths || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    const improvements = (grade.improvements || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    const rubric = (grade.rubricBreakdown || []).map((item) => `
      <li><strong>${item.earned ? "Earned" : "Missed"}:</strong> ${escapeHtml(item.label)}. ${escapeHtml(item.note || "")}</li>
    `).join("");

    container.className = "result-box is-graded";
    container.innerHTML = `
      ${grade.warning ? `<p class="notice">${escapeHtml(grade.warning)}</p>` : ""}
      <div class="score-line">
        <strong>${escapeHtml(String(grade.score))}/${escapeHtml(String(grade.maxScore))}</strong>
        <span>${escapeHtml(grade.level || "Graded")}</span>
      </div>
      <p>${escapeHtml(grade.feedback || "")}</p>
      ${strengths ? `<h3>Strengths</h3><ul>${strengths}</ul>` : ""}
      ${improvements ? `<h3>Improve next</h3><ul>${improvements}</ul>` : ""}
      ${rubric ? `<h3>Rubric</h3><ul>${rubric}</ul>` : ""}
    `;
  }

  function nextQuestion() {
    if (state.index + 1 >= state.items.length) {
      renderMessage("Set complete.", state.reviewMode ? "Any MCQ you answered correctly was cleared from missed review." : "Missed MCQs were saved for later review.");
      window.APWorldStore.updateMissedCount();
      return;
    }
    state.index += 1;
    renderQuestion();
  }

  function renderMessage(title, message) {
    emptyState.hidden = true;
    questionArea.hidden = false;
    questionArea.innerHTML = `
      <div class="empty-state in-panel">
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(message || "")}</p>
      </div>
    `;
  }

  function setLoading(isLoading, label) {
    state.loading = isLoading;
    if (!generateButton) return;
    generateButton.disabled = isLoading;
    generateButton.textContent = isLoading ? "Generating" : label;
  }

  function normalizeAnswer(value) {
    return String(value || "").trim().slice(0, 1).toUpperCase();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
