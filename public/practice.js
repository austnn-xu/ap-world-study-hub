(function () {
  const type = document.body.dataset.practiceType;
  if (!type) return;

  const labels = {
    mcq: { title: "MCQ Practice", count: 5, button: "Generate Questions" },
    saq: { title: "SAQ Practice", count: 1, button: "Generate SAQ" },
    dbq: { title: "DBQ Practice", count: 1, button: "Generate DBQ" },
    leq: { title: "LEQ Practice", count: 1, button: "Generate LEQ" }
  };
  const apiRoot = window.APWorldStore?.apiRoot || "";

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
      const response = await fetch(`${apiRoot}/api/practice`, {
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
      const fallback = clientPracticeFallback(type);
      state.items = fallback.items;
      state.index = 0;
      renderQuestion(`Static preview sample loaded. Live AI needs the Node server. ${error.message}`);
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
    const documents = (item.documents || []).map((document, index) => renderDocument(document, index)).join("");
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
        ${documents ? `<div class="document-box"><h3>Documents</h3><ol class="document-list">${documents}</ol></div>` : ""}
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
      const response = await fetch(`${apiRoot}/api/grade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, question: item, answer })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not grade response.");
      renderGrade(resultBox, result);
    } catch (error) {
      renderGrade(resultBox, clientGradeFallback(type, error.message));
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

  function renderDocument(document, index) {
    if (typeof document === "string") {
      return `
        <li class="document-item">
          <div class="document-title">Document ${index + 1}</div>
          <p class="document-text">${escapeHtml(document)}</p>
        </li>
      `;
    }

    const title = document?.title || `Document ${index + 1}`;
    const sourceParts = [document?.source, document?.date].filter(Boolean).join(", ");
    const context = document?.context ? `<div class="document-source">${escapeHtml(document.context)}</div>` : "";
    return `
      <li class="document-item">
        <div class="document-title">${escapeHtml(title)}</div>
        ${sourceParts ? `<div class="document-source">${escapeHtml(sourceParts)}</div>` : ""}
        ${context}
        <p class="document-text">${escapeHtml(document?.text || "")}</p>
      </li>
    `;
  }

  function clientPracticeFallback(practiceType) {
    const shared = {
      period: "Period 2: c. 1450-c. 1750",
      skill: "AP historical reasoning",
      tags: ["static preview"],
      answer: "",
      choices: [],
      documents: [],
      rubric: []
    };

    if (practiceType === "mcq") {
      return {
        items: [
          {
            id: "static-mcq-1",
            type: "mcq",
            period: "Period 1: c. 1200-c. 1450",
            skill: "Causation",
            stimulus: "Merchants, missionaries, and envoys traveled across Mongol-controlled routes linking China, Central Asia, Persia, and Europe.",
            prompt: "Which outcome most directly resulted from the situation described?",
            choices: [
              { id: "A", text: "The permanent end of all nomadic states" },
              { id: "B", text: "Increased cross-cultural exchange across Eurasia" },
              { id: "C", text: "The disappearance of luxury-goods trade" },
              { id: "D", text: "The isolation of China from Afro-Eurasia" }
            ],
            answer: "B",
            explanation: "Mongol rule protected routes and helped ideas, goods, technologies, and diseases move across Eurasia."
          },
          {
            id: "static-mcq-2",
            type: "mcq",
            period: "Period 3: c. 1750-c. 1900",
            skill: "Comparison",
            stimulus: "Industrial factories concentrated workers near machines and used new sources of power to increase production.",
            prompt: "Which social change was most closely connected to industrialization?",
            choices: [
              { id: "A", text: "The disappearance of wage labor" },
              { id: "B", text: "The complete end of migration" },
              { id: "C", text: "The decline of all consumer markets" },
              { id: "D", text: "The growth of urban working classes" }
            ],
            answer: "D",
            explanation: "Factories drew workers into cities and contributed to new industrial working-class communities."
          },
          {
            id: "static-mcq-3",
            type: "mcq",
            period: "Period 4: c. 1900-present",
            skill: "Contextualization",
            stimulus: "After 1945, many colonized peoples used nationalism and international pressure to demand sovereignty.",
            prompt: "The development described is best understood in the context of",
            choices: [
              { id: "A", text: "the beginning of the Neolithic Revolution" },
              { id: "B", text: "the first wave of maritime exploration" },
              { id: "C", text: "decolonization after World War II" },
              { id: "D", text: "the spread of Buddhism along the Silk Roads" }
            ],
            answer: "C",
            explanation: "World War II weakened European empires and strengthened anti-colonial nationalist movements."
          }
        ]
      };
    }

    const written = {
      saq: {
        ...shared,
        id: "static-saq-1",
        type: "saq",
        stimulus: "Early modern rulers used military force, taxation, religion, and visual displays to maintain authority.",
        prompt: "A. Identify ONE method rulers used to legitimize power. B. Explain ONE way that method strengthened a state. C. Explain ONE limitation of that method.",
        rubric: ["Directly answer A, B, and C.", "Use specific historical evidence.", "Explain the connection to state power."]
      },
      dbq: {
        ...shared,
        id: "static-dbq-1",
        type: "dbq",
        period: "Period 3: c. 1750-c. 1900",
        stimulus: "Use the documents and your knowledge of world history to answer the prompt.",
        prompt: "Evaluate the extent to which industrialization changed labor systems in the period c. 1750-c. 1900.",
        documents: [
          {
            title: "Document 1",
            source: "Rules posted by the owner of a Manchester textile mill",
            date: "1833",
            context: "Factory owners attempted to discipline a large wage-labor workforce.",
            text: "Any worker arriving after the bell shall lose one quarter day's wages. Talking at the frames, leaving the room without permission, or damaging thread through carelessness shall be fined. Children employed as piecers must remain at their assigned machines until relieved. The overseer is instructed to report idleness immediately, for the success of the mill depends upon regular motion and punctual attendance."
          },
          {
            title: "Document 2",
            source: "Letter from a textile worker to a local newspaper in northern England",
            date: "1842",
            context: "Industrial workers increasingly criticized working conditions in print.",
            text: "We labor from early morning until the lamps are lit, breathing lint and heat while the engines never rest. My eldest daughter is twelve and earns a little beside me, but she returns home too tired to read. The masters speak of progress, yet in our street several families sleep in one damp room."
          },
          {
            title: "Document 3",
            source: "Speech by an Indian merchant in Bombay discussing mechanized cotton imports",
            date: "1877",
            context: "Industrial production reshaped global trade and colonial economies.",
            text: "Cloth once woven by skilled hands in our towns now arrives by the shipload from Lancashire, priced so low that many local weavers cannot compete. Some merchants profit by carrying these goods inland, but artisans complain that the new trade reduces them to debt."
          },
          {
            title: "Document 4",
            source: "Petition from women workers in a Japanese silk-reeling factory",
            date: "1898",
            context: "Meiji industrialization expanded factory work for young women.",
            text: "We ask that dormitory rules be made less severe and that wages promised by recruiters be paid in full. Many of us left farming villages to help our families meet taxes, but deductions for food and lodging leave little to send home."
          }
        ],
        rubric: ["Thesis", "Contextualization", "Document evidence", "Outside evidence", "Sourcing", "Complexity"]
      },
      leq: {
        ...shared,
        id: "static-leq-1",
        type: "leq",
        period: "Period 4: c. 1900-present",
        prompt: "Evaluate the extent to which decolonization after 1945 changed political structures in Asia or Africa.",
        rubric: ["Thesis", "Contextualization", "Specific evidence", "Historical reasoning", "Complexity"]
      }
    };

    return { items: [written[practiceType]] };
  }

  function clientGradeFallback(practiceType, detail) {
    const maxScore = { saq: 3, dbq: 7, leq: 6 }[practiceType] || 3;
    return {
      warning: `Static preview grading loaded. Live AI needs the Node server. ${detail || ""}`,
      score: Math.max(1, Math.round(maxScore / 2)),
      maxScore,
      level: "Static sample feedback",
      feedback: "This preview can show the grading layout, but live AI feedback requires the backend server and an API key.",
      strengths: ["The response is in the right workspace and ready for rubric feedback."],
      improvements: ["Add specific evidence, connect it to the claim, and explain causation, comparison, or change over time."],
      rubricBreakdown: [
        { earned: true, label: "Attempted response", note: "The grader can detect that a response was submitted." },
        { earned: false, label: "Live rubric analysis", note: "Run the Node server for full AI scoring." }
      ]
    };
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
