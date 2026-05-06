(function () {
  const type = document.body.dataset.practiceType;
  if (!type) return;

  const labels = {
    mcq: { title: "MCQ Practice", count: 10, button: "Generate 10 Questions" },
    saq: { title: "SAQ Practice", count: 1, button: "Generate SAQ" },
    dbq: { title: "DBQ Practice", count: 1, button: "Generate DBQ" },
    leq: { title: "LEQ Practice", count: 1, button: "Generate LEQ" }
  };
  const randomTopics = [
    { topic: "Indian Ocean trade networks, merchant diasporas, and cultural exchange", period: "Period 1: c. 1200-c. 1450" },
    { topic: "Mongol rule, Eurasian trade, and cross-cultural transfer", period: "Period 1: c. 1200-c. 1450" },
    { topic: "Gunpowder empires, legitimacy, and state centralization", period: "Period 2: c. 1450-c. 1750" },
    { topic: "Atlantic slavery, plantation economies, and resistance", period: "Period 2: c. 1450-c. 1750" },
    { topic: "Maritime empires, silver flows, and global trade", period: "Period 2: c. 1450-c. 1750" },
    { topic: "Industrialization, labor systems, and urban social change", period: "Period 3: c. 1750-c. 1900" },
    { topic: "Imperialism, nationalism, and colonial resistance", period: "Period 3: c. 1750-c. 1900" },
    { topic: "Political revolutions, Enlightenment ideas, and new states", period: "Period 3: c. 1750-c. 1900" },
    { topic: "World wars, total war, and state mobilization", period: "Period 4: c. 1900-present" },
    { topic: "Decolonization, nationalism, and postcolonial political structures", period: "Period 4: c. 1900-present" },
    { topic: "Cold War competition, proxy conflicts, and nonalignment", period: "Period 4: c. 1900-present" },
    { topic: "Globalization, migration, technology, and environmental change", period: "Period 4: c. 1900-present" }
  ];
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
  const randomTopicButton = document.querySelector("#randomTopicButton");
  const reviewMissedButton = document.querySelector("#reviewMissedButton");
  const emptyState = document.querySelector("#emptyState");
  const questionArea = document.querySelector("#questionArea");

  generateButton?.addEventListener("click", () => generatePractice());
  randomTopicButton?.addEventListener("click", () => generateRandomTopic());
  reviewMissedButton?.addEventListener("click", () => loadMissedMcqs());

  function generateRandomTopic() {
    const topic = randomTopics[Math.floor(Math.random() * randomTopics.length)];
    if (topicInput) topicInput.value = topic.topic;
    if (periodInput) periodInput.value = topic.period;
    generatePractice();
  }

  async function generatePractice() {
    setLoading(true, labels[type].button);
    state.reviewMode = false;
    try {
      const result = await requestJson("/api/practice", {
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
    questionArea.querySelector("[data-next]")?.addEventListener("click", nextQuestion);
  }

  function renderMcq(item, warning) {
    const progress = `${state.index + 1} of ${state.items.length}`;
    const documents = renderDocumentsSection(item);
    const stimulus = shouldHideDuplicateStimulus(item) ? "" : item.stimulus;
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
        ${stimulus ? `<div class="stimulus">${escapeHtml(stimulus)}</div>` : ""}
        ${documents}
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
    const progress = `${state.index + 1} of ${state.items.length}`;
    const documents = renderDocumentsSection(item);
    const rubric = (item.rubric || []).map((line) => `<li>${escapeHtml(line)}</li>`).join("");

    return `
      ${warning ? `<p class="notice">${escapeHtml(warning)}</p>` : ""}
      <article class="question-card">
        <div class="question-meta">
          <span>${escapeHtml(progress)}</span>
          <span>${escapeHtml(item.period || "AP World")}</span>
          <span>${escapeHtml(item.skill || "Writing")}</span>
          <span>${type.toUpperCase()}</span>
        </div>
        ${item.stimulus ? `<div class="stimulus">${escapeHtml(item.stimulus)}</div>` : ""}
        ${documents}
        <h2>${escapeHtml(item.prompt)}</h2>
        <label class="response-label" for="studentResponse">Your response</label>
        <textarea id="studentResponse" rows="${type === "saq" ? "8" : "16"}" placeholder="Write your response here."></textarea>
        <div class="question-actions">
          <button class="primary-action" type="button" data-grade>Grade Response</button>
          ${state.items.length > 1 ? `<button class="secondary-action" type="button" data-next>${state.index + 1 === state.items.length ? "Finish Set" : "Next Prompt"}</button>` : ""}
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
      const result = await requestJson("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, question: item, answer })
      });
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
      const message = type === "mcq"
        ? (state.reviewMode ? "Any MCQ you answered correctly was cleared from missed review." : "Missed MCQs were saved for later review.")
        : "You finished this prompt. Generate another one when you want a fresh round.";
      renderMessage("Set complete.", message);
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
    if (generateButton) {
      generateButton.disabled = isLoading;
      generateButton.innerHTML = isLoading ? loadingLabel("Generating") : escapeHtml(label);
    }
    if (randomTopicButton) {
      randomTopicButton.disabled = isLoading;
      randomTopicButton.innerHTML = isLoading ? loadingLabel("Generating") : "Generate Random Topic";
    }
  }

  function loadingLabel(label) {
    return `<span class="loading-spinner" aria-hidden="true"></span><span>${escapeHtml(label)}</span>`;
  }

  async function requestJson(path, options) {
    const urls = apiUrls(path);
    let lastError = null;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      for (const url of urls) {
        try {
          const response = await fetch(url, options);
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || `Request failed with ${response.status}.`);
          return result;
        } catch (error) {
          lastError = error;
        }
      }
      if (attempt < 2) await wait(850 + attempt * 650);
    }

    throw lastError || new Error("Could not reach the study server.");
  }

  function apiUrls(path) {
    const urls = [`${apiRoot}${path}`];
    const localUrl = `http://localhost:4173${path}`;
    if (!urls.includes(localUrl)) urls.push(localUrl);
    return urls;
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function normalizeAnswer(value) {
    return String(value || "").trim().slice(0, 1).toUpperCase();
  }

  function renderDocumentsSection(item) {
    const documents = (item.documents || []).map((document, index) => renderDocument(document, index)).join("");
    if (!documents) return "";
    const heading = item.documents.length === 1 ? "Source" : "Documents";
    return `<div class="document-box"><h3>${heading}</h3><ol class="document-list">${documents}</ol></div>`;
  }

  function shouldHideDuplicateStimulus(item) {
    const stimulus = normalizeTextForCompare(item.stimulus);
    if (!stimulus || !Array.isArray(item.documents) || !item.documents.length) return false;
    return item.documents.some((document) => {
      const documentText = normalizeTextForCompare(document?.text || document);
      return documentText && (documentText.includes(stimulus) || stimulus.includes(documentText));
    });
  }

  function normalizeTextForCompare(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/["'.,;:!?()[\]{}-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function renderDocument(document, index) {
    if (typeof document === "string") {
      return `
        <li class="document-item">
          <div class="document-title">Document ${index + 1}</div>
          <p class="document-text">"${escapeHtml(document)}"</p>
        </li>
      `;
    }

    const title = document?.title || `Document ${index + 1}`;
    const source = document?.source || "";
    const date = document?.date || "";
    const sourceParts = [source, date].filter(Boolean).join(", ");
    const context = document?.context ? `<div class="document-source">${escapeHtml(document.context)}</div>` : "";
    return `
      <li class="document-item">
        <div class="document-title">${escapeHtml(title)}</div>
        <p class="document-text">"${escapeHtml(document?.text || "")}"${sourceParts ? ` - <span class="document-attribution">${escapeHtml(sourceParts)}</span>` : ""}</p>
        ${context}
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
        items: expandFallbackItems([
          {
            id: "static-mcq-1",
            type: "mcq",
            period: "Period 1: c. 1200-c. 1450",
            skill: "Causation",
            stimulus: "Use the source below to answer the question.",
            prompt: "Which outcome most directly resulted from the situation described?",
            choices: [
              { id: "A", text: "The permanent end of all nomadic states" },
              { id: "B", text: "Increased cross-cultural exchange across Eurasia" },
              { id: "C", text: "The disappearance of luxury-goods trade" },
              { id: "D", text: "The isolation of China from Afro-Eurasia" }
            ],
            answer: "B",
            explanation: "Mongol rule protected routes and helped ideas, goods, technologies, and diseases move across Eurasia.",
            documents: [
              {
                title: "Source 1",
                source: "Persian merchant traveling between Samarkand and Khanbaliq under Mongol rule",
                date: "Yuan dynasty, c. 1280",
                context: "Mongol authorities protected major routes across Eurasia and encouraged long-distance commerce.",
                text: "At the relay stations our animals are exchanged before their strength fails, and the tablets carried by the khan's officials open gates that once closed at sunset. In the markets I see paper from China, horses from the steppe, glass from Syria, and bolts of cloth that have crossed more lands than any single man could name."
              }
            ]
          },
          {
            id: "static-mcq-2",
            type: "mcq",
            period: "Period 3: c. 1750-c. 1900",
            skill: "Comparison",
            stimulus: "Use the source below to answer the question.",
            prompt: "Which social change was most closely connected to industrialization?",
            choices: [
              { id: "A", text: "The disappearance of wage labor" },
              { id: "B", text: "The complete end of migration" },
              { id: "C", text: "The decline of all consumer markets" },
              { id: "D", text: "The growth of urban working classes" }
            ],
            answer: "D",
            explanation: "Factories drew workers into cities and contributed to new industrial working-class communities.",
            documents: [
              {
                title: "Source 1",
                source: "Textile worker writing to a local newspaper about factory conditions",
                date: "Northern England, 1842",
                context: "Industrial workers increasingly criticized working conditions in print.",
                text: "We labor from early morning until the lamps are lit, breathing lint and heat while the engines never rest. My eldest daughter is twelve and earns a little beside me, but she returns home too tired to read. The masters speak of progress, yet in our street several families sleep in one damp room."
              }
            ]
          },
          {
            id: "static-mcq-3",
            type: "mcq",
            period: "Period 4: c. 1900-present",
            skill: "Contextualization",
            stimulus: "Use the source below to answer the question.",
            prompt: "The development described is best understood in the context of",
            choices: [
              { id: "A", text: "the beginning of the Neolithic Revolution" },
              { id: "B", text: "the first wave of maritime exploration" },
              { id: "C", text: "decolonization after World War II" },
              { id: "D", text: "the spread of Buddhism along the Silk Roads" }
            ],
            answer: "C",
            explanation: "World War II weakened European empires and strengthened anti-colonial nationalist movements.",
            documents: [
              {
                title: "Source 1",
                source: "Nationalist organizer speaking to supporters before independence negotiations",
                date: "South Asia, 1946",
                context: "Anti-colonial leaders demanded sovereignty while debating what kind of state should replace imperial rule.",
                text: "We do not ask merely that one set of officials depart and another sit behind the same desks. Villagers who paid taxes without representation, workers who supplied wartime factories, and students who filled the prisons expect a government answerable to them. Freedom will be measured by whether these instruments can be turned toward our own people."
              }
            ]
          }
        ], labels.mcq.count, "mcq")
      };
    }

    const written = {
      saq: {
        ...shared,
        id: "static-saq-1",
        type: "saq",
        stimulus: "Use the source below to answer all parts of the question.",
        prompt: "A. Identify ONE method rulers used to legitimize power. B. Explain ONE way that method strengthened a state. C. Explain ONE limitation of that method.",
        documents: [
          {
            title: "Source 1",
            source: "Court chronicler praising an early modern ruler after a successful siege",
            date: "Mughal Empire, c. 1570",
            context: "Early modern empires often combined military power with claims of religious, dynastic, or bureaucratic legitimacy.",
            text: "The emperor's cannon opened the fort, but victory was secured also by order. Accountants recorded each village newly placed under imperial revenue, judges promised protection to merchants, and poets compared the ruler's justice to shade in the hot season. Soldiers may break a gate in one day; obedience lasts only when people believe the ruler commands more than iron and fire."
          }
        ],
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
          },
          {
            title: "Document 5",
            source: "Municipal health official reporting on industrial neighborhoods",
            date: "Berlin, 1901",
            context: "Rapid urban growth led governments to investigate public health problems.",
            text: "The industrial districts continue to receive migrants faster than adequate housing can be built. Tenements near workshops show high rates of respiratory illness, especially among children. The city recommends improved drainage, limits on overcrowding, and inspection of factories that release smoke into residential streets."
          },
          {
            title: "Document 6",
            source: "Russian factory inspector describing labor discipline in a textile district",
            date: "Moscow, 1892",
            context: "Industrialization outside western Europe often relied on state oversight and strict factory discipline.",
            text: "In the larger mills, bells determine the worker's day more than the church calendar once did. Peasant families recently arrived from nearby villages crowd into rented rooms and depend on wages paid by the factory office. Managers complain that rural habits make workers irregular, while workers complain that fines reduce already modest pay."
          }
        ],
        rubric: ["Thesis", "Contextualization", "Document evidence", "Outside evidence", "Sourcing", "Complexity"]
      },
      leq: {
        ...shared,
        id: "static-leq-1",
        type: "leq",
        period: "Period 4: c. 1900-present",
        stimulus: "",
        prompt: "Evaluate the extent to which decolonization after 1945 changed political structures in Asia or Africa.",
        documents: [],
        rubric: ["Thesis", "Contextualization", "Specific evidence", "Historical reasoning", "Complexity"]
      }
    };

    return { items: [written[practiceType]] };
  }

  function expandFallbackItems(items, count, practiceType) {
    const output = [];
    for (let index = 0; index < count; index += 1) {
      const clone = JSON.parse(JSON.stringify(items[index % items.length]));
      output.push({ ...clone, id: `static-${practiceType}-${index + 1}` });
    }
    return output;
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
