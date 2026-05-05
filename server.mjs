import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

loadDotEnv();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");
const port = Number(process.env.PORT || 4173);
const openAiKey = process.env.OPENAI_API_KEY || "";
const openAiModel = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const responsesUrl = process.env.OPENAI_RESPONSES_URL || "https://api.openai.com/v1/responses";

const routeFiles = new Map([
  ["/", "index.html"],
  ["/mcq", "mcq.html"],
  ["/saq", "saq.html"],
  ["/dbq", "dbq.html"],
  ["/leq", "leq.html"],
  ["/timeline", "timeline.html"]
]);

const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".svg", "image/svg+xml"]
]);

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

    if (request.method === "OPTIONS") {
      return sendEmpty(response, 204);
    }

    if (request.method === "GET" && url.pathname === "/api/status") {
      return sendJson(response, 200, {
        liveAI: Boolean(openAiKey),
        model: openAiKey ? openAiModel : "sample-mode"
      });
    }

    if (request.method === "POST" && url.pathname === "/api/practice") {
      const body = await readJson(request);
      const payload = await createPractice(body);
      return sendJson(response, 200, payload);
    }

    if (request.method === "POST" && url.pathname === "/api/grade") {
      const body = await readJson(request);
      const payload = await gradePractice(body);
      return sendJson(response, 200, payload);
    }

    if (request.method === "GET" || request.method === "HEAD") {
      return serveStatic(url.pathname, request.method, response);
    }

    sendJson(response, 405, { error: "Method not allowed" });
  } catch (error) {
    const status = Number(error.statusCode || 500);
    sendJson(response, status, {
      error: status === 500 ? "Something went wrong on the study server." : error.message
    });
  }
});

server.listen(port, () => {
  console.log(`AP World Study Hub running at http://localhost:${port}`);
});

function loadDotEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;

  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const splitAt = line.indexOf("=");
    if (splitAt === -1) continue;
    const key = line.slice(0, splitAt).trim();
    let value = line.slice(splitAt + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

async function serveStatic(pathname, method, response) {
  const fileRoute = routeFiles.get(pathname) || decodeURIComponent(pathname).replace(/^\/+/, "");
  const absolutePath = path.resolve(publicDir, fileRoute);

  if (absolutePath !== publicDir && !absolutePath.startsWith(publicDir + path.sep)) {
    return sendJson(response, 403, { error: "Forbidden" });
  }

  let filePath = absolutePath;
  const fileStats = await stat(filePath).catch(() => null);
  if (fileStats?.isDirectory()) filePath = path.join(filePath, "index.html");

  const content = await readFile(filePath).catch(() => null);
  if (!content) return sendJson(response, 404, { error: "Not found" });

  response.writeHead(200, {
    "Content-Type": mimeTypes.get(path.extname(filePath).toLowerCase()) || "application/octet-stream",
    "Cache-Control": filePath.includes(`${path.sep}assets${path.sep}`) ? "public, max-age=604800" : "no-cache"
  });
  if (method !== "HEAD") response.end(content);
  else response.end();
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(payload));
}

function sendEmpty(response, status) {
  response.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  response.end();
}

async function readJson(request) {
  let raw = "";
  for await (const chunk of request) {
    raw += chunk;
    if (raw.length > 250000) {
      const error = new Error("Request body is too large.");
      error.statusCode = 413;
      throw error;
    }
  }
  if (!raw.trim()) return {};
  try {
    return JSON.parse(raw);
  } catch {
    const error = new Error("Expected JSON.");
    error.statusCode = 400;
    throw error;
  }
}

function cleanText(value, fallback = "") {
  return String(value || fallback).trim();
}

function normalizeType(type) {
  const value = cleanText(type, "mcq").toLowerCase();
  if (!["mcq", "saq", "dbq", "leq"].includes(value)) {
    const error = new Error("Practice type must be mcq, saq, dbq, or leq.");
    error.statusCode = 400;
    throw error;
  }
  return value;
}

async function createPractice(body) {
  const type = normalizeType(body.type);
  const requestedCount = Number(body.count || 10);
  const count = Math.max(10, Math.min(10, Number.isFinite(requestedCount) ? requestedCount : 10));
  const request = {
    type,
    count,
    topic: cleanText(body.topic, "mixed AP World units"),
    period: cleanText(body.period, "any AP World period"),
    difficulty: cleanText(body.difficulty, "AP exam style")
  };

  if (!openAiKey) {
    return {
      source: "sample",
      warning: "Set OPENAI_API_KEY in .env for live AI-generated practice.",
      ...samplePractice(request)
    };
  }

  try {
    const result = await createPracticeWithAI(request);
    return {
      source: "ai",
      model: openAiModel,
      ...normalizePracticeResult(result, request)
    };
  } catch (error) {
    return {
      source: "sample",
      warning: `The AI request failed, so sample practice loaded instead. ${error.message}`,
      ...samplePractice(request)
    };
  }
}

async function gradePractice(body) {
  const type = normalizeType(body.type);
  if (type === "mcq") {
    const error = new Error("MCQs are graded in the browser.");
    error.statusCode = 400;
    throw error;
  }

  const answer = cleanText(body.answer);
  if (answer.length < 20) {
    const error = new Error("Write a little more before asking for grading.");
    error.statusCode = 400;
    throw error;
  }

  const question = body.question || {};
  const request = { type, question, answer };

  if (!openAiKey) {
    return {
      source: "sample",
      warning: "Set OPENAI_API_KEY in .env for live AI grading.",
      ...sampleGrade(request)
    };
  }

  try {
    const result = await gradeWithAI(request);
    return {
      source: "ai",
      model: openAiModel,
      ...normalizeGradeResult(result, type)
    };
  } catch (error) {
    return {
      source: "sample",
      warning: `The AI grading request failed, so sample grading loaded instead. ${error.message}`,
      ...sampleGrade(request)
    };
  }
}

async function createPracticeWithAI(request) {
  const instructions = [
    "You create original AP World History practice. Do not copy real College Board questions.",
    "Keep questions historically accurate and aligned to AP World skills: causation, comparison, continuity and change, contextualization, evidence, sourcing, and argumentation.",
    "Return valid JSON only. No markdown, no prose outside JSON.",
    "Use this exact top-level shape: {\"title\":\"...\",\"items\":[...]}",
    "Each item must include: id, type, period, skill, stimulus, prompt, choices, answer, explanation, rubric, documents, tags.",
    "For MCQ, choices must be exactly four objects with id A-D and answer must be A, B, C, or D.",
    "For MCQ sets with more than one item, vary the correct answer letters across A, B, C, and D. Do not make every answer A.",
    "Create exactly the requested number of separate items.",
    "For SAQ items, make each prompt three parts labeled A, B, and C.",
    "For DBQ items, include 4-6 invented AP-style documents for each item, not summaries. Each document must be an object with title, source, date, context, and text. The text should be 60-120 words and read like a short primary source excerpt, data table description, petition, speech, law, letter, newspaper passage, or report excerpt.",
    "For LEQ items, ask for thesis-driven essays.",
    "For SAQ, DBQ, and LEQ sets, vary the topic angle across the items while staying inside the user's focus."
  ].join(" ");

  const prompt = [
    `Practice type: ${request.type.toUpperCase()}`,
    `Number of items: ${request.count}`,
    `Topic focus: ${request.topic}`,
    `Period focus: ${request.period}`,
    `Difficulty: ${request.difficulty}`,
    "Make the material useful for AP World History studying from c. 1200 to the present."
  ].join("\n");

  return callOpenAIJson(instructions, prompt);
}

async function gradeWithAI(request) {
  const maxScore = { saq: 3, dbq: 7, leq: 6 }[request.type];
  const instructions = [
    "You are a careful AP World History writing grader.",
    "Grade against the AP style expectations for the prompt type.",
    "Be specific, fair, and useful. Do not be mean. Do not invent facts that are not in the response.",
    "Return valid JSON only with this shape: {\"score\":number,\"maxScore\":number,\"level\":\"...\",\"feedback\":\"...\",\"strengths\":[...],\"improvements\":[...],\"rubricBreakdown\":[{\"label\":\"...\",\"earned\":true,\"note\":\"...\"}]}."
  ].join(" ");

  const prompt = [
    `Prompt type: ${request.type.toUpperCase()}`,
    `Maximum score: ${maxScore}`,
    `Question JSON: ${JSON.stringify(request.question).slice(0, 12000)}`,
    `Student response: ${request.answer}`
  ].join("\n\n");

  return callOpenAIJson(instructions, prompt);
}

async function callOpenAIJson(instructions, prompt) {
  const payloads = [
    {
      model: openAiModel,
      input: [
        { role: "system", content: [{ type: "input_text", text: instructions }] },
        { role: "user", content: [{ type: "input_text", text: prompt }] }
      ],
      text: { format: { type: "json_object" } }
    },
    {
      model: openAiModel,
      input: `${instructions}\n\n${prompt}\n\nReturn only JSON.`
    }
  ];

  let lastError = null;
  for (const payload of payloads) {
    try {
      const response = await fetch(responsesUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${openAiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const details = await response.text();
        throw new Error(`OpenAI returned ${response.status}: ${details.slice(0, 180)}`);
      }

      const data = await response.json();
      const text = extractResponseText(data);
      if (!text) throw new Error("OpenAI returned no text.");
      return JSON.parse(stripJsonFence(text));
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("OpenAI request failed.");
}

function extractResponseText(data) {
  if (typeof data.output_text === "string") return data.output_text;
  if (data.choices?.[0]?.message?.content) return data.choices[0].message.content;

  const parts = [];
  const walk = (value) => {
    if (!value) return;
    if (typeof value === "string") return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    if (typeof value === "object") {
      if (value.type === "output_text" && typeof value.text === "string") parts.push(value.text);
      Object.values(value).forEach(walk);
    }
  };
  walk(data.output);
  return parts.join("\n").trim();
}

function stripJsonFence(text) {
  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");
}

function normalizePracticeResult(result, request) {
  const fallback = samplePractice(request);
  const items = Array.isArray(result.items) ? result.items : [];
  const normalizedItems = items.slice(0, request.count).map((item, index) => normalizeItem(item, request, index));
  const finalItems = request.type === "mcq" ? rebalanceMcqAnswers(normalizedItems) : normalizedItems;
  const completedItems = ensureItemCount(finalItems, fallback.items, request);

  return {
    title: cleanText(result.title, fallback.title),
    items: completedItems
  };
}

function ensureItemCount(items, fallbackItems, request) {
  const output = items.slice(0, request.count);
  const fallback = Array.isArray(fallbackItems) ? fallbackItems : [];

  for (let index = output.length; index < request.count && fallback.length; index += 1) {
    const clone = cloneItem(fallback[index % fallback.length]);
    output.push({
      ...clone,
      id: `${request.type}-fallback-${index + 1}`,
      type: request.type
    });
  }

  return request.type === "mcq" ? rebalanceMcqAnswers(output) : output;
}

function normalizeItem(item, request, index) {
  const type = cleanText(item.type, request.type).toLowerCase();
  const choices = Array.isArray(item.choices) ? item.choices : [];
  return {
    id: cleanText(item.id, `${request.type}-${Date.now()}-${index}`),
    type: ["mcq", "saq", "dbq", "leq"].includes(type) ? type : request.type,
    period: cleanText(item.period, request.period),
    skill: cleanText(item.skill, "AP historical reasoning"),
    stimulus: cleanText(item.stimulus),
    prompt: cleanText(item.prompt, "Practice prompt unavailable."),
    choices: choices.map((choice, choiceIndex) => ({
      id: cleanText(choice.id, "ABCD"[choiceIndex] || String(choiceIndex + 1)).slice(0, 1).toUpperCase(),
      text: cleanText(choice.text || choice.label || choice)
    })).slice(0, 4),
    answer: cleanText(item.answer).slice(0, 1).toUpperCase(),
    explanation: cleanText(item.explanation, "Review the relevant AP World concept and historical evidence."),
    rubric: Array.isArray(item.rubric) ? item.rubric.map((entry) => cleanText(entry)).filter(Boolean) : [],
    documents: Array.isArray(item.documents) ? item.documents.map((entry, docIndex) => normalizeDocument(entry, docIndex)).filter(Boolean) : [],
    tags: Array.isArray(item.tags) ? item.tags.map((entry) => cleanText(entry)).filter(Boolean) : []
  };
}

function normalizeDocument(entry, index) {
  if (!entry) return null;
  if (typeof entry === "string") {
    return {
      title: `Document ${index + 1}`,
      source: "",
      date: "",
      context: "",
      text: cleanText(entry)
    };
  }

  return {
    title: cleanText(entry.title, `Document ${index + 1}`),
    source: cleanText(entry.source || entry.author || entry.attribution),
    date: cleanText(entry.date || entry.year),
    context: cleanText(entry.context || entry.description),
    text: cleanText(entry.text || entry.excerpt || entry.content)
  };
}

function rebalanceMcqAnswers(items) {
  const targets = ["B", "D", "C", "A"];
  return items.map((item, index) => {
    if (!Array.isArray(item.choices) || item.choices.length !== 4 || !item.answer) return item;
    const target = targets[index % targets.length];
    const currentAnswer = cleanText(item.answer).slice(0, 1).toUpperCase();
    const correctIndex = item.choices.findIndex((choice) => cleanText(choice.id).slice(0, 1).toUpperCase() === currentAnswer);
    const targetIndex = "ABCD".indexOf(target);
    if (correctIndex === -1 || targetIndex === -1) return item;

    const choices = item.choices.map((choice) => ({ ...choice }));
    const [correctChoice] = choices.splice(correctIndex, 1);
    choices.splice(targetIndex, 0, correctChoice);
    return {
      ...item,
      choices: choices.map((choice, choiceIndex) => ({
        id: "ABCD"[choiceIndex],
        text: choice.text
      })),
      answer: target
    };
  });
}

function normalizeGradeResult(result, type) {
  const maxScore = { saq: 3, dbq: 7, leq: 6 }[type];
  const score = Math.max(0, Math.min(maxScore, Number(result.score || 0)));
  return {
    score,
    maxScore: Number(result.maxScore || maxScore),
    level: cleanText(result.level, score >= maxScore * 0.75 ? "Strong" : "Developing"),
    feedback: cleanText(result.feedback, "Use more specific evidence and connect it directly to the argument."),
    strengths: Array.isArray(result.strengths) ? result.strengths.map((entry) => cleanText(entry)).filter(Boolean) : [],
    improvements: Array.isArray(result.improvements) ? result.improvements.map((entry) => cleanText(entry)).filter(Boolean) : [],
    rubricBreakdown: Array.isArray(result.rubricBreakdown) ? result.rubricBreakdown.map((entry) => ({
      label: cleanText(entry.label, "Rubric point"),
      earned: Boolean(entry.earned),
      note: cleanText(entry.note)
    })) : []
  };
}

function samplePractice(request) {
  if (request.type === "mcq") {
    return {
      title: "Sample AP World MCQ Set",
      items: rebalanceMcqAnswers(buildSampleItems(sampleMcqBank, request))
    };
  }

  const sample = sampleWritten[request.type];
  return {
    title: sample.title,
    items: buildSampleItems(sample.items || [sample.item], request)
  };
}

function buildSampleItems(baseItems, request) {
  const items = [];
  for (let index = 0; index < request.count; index += 1) {
    const clone = cloneItem(baseItems[index % baseItems.length]);
    items.push({
      ...clone,
      id: `sample-${request.type}-${index + 1}`,
      type: request.type
    });
  }
  return items;
}

function cloneItem(item) {
  return JSON.parse(JSON.stringify(item || {}));
}

function sampleGrade(request) {
  const maxScore = { saq: 3, dbq: 7, leq: 6 }[request.type];
  const words = request.answer.split(/\s+/).filter(Boolean).length;
  const evidenceWords = ["because", "therefore", "for example", "evidence", "trade", "empire", "state", "continuity", "change"];
  const evidenceHits = evidenceWords.filter((word) => request.answer.toLowerCase().includes(word)).length;
  const rough = Math.min(maxScore, Math.max(1, Math.round((words / (request.type === "saq" ? 45 : 115)) + evidenceHits / 3)));

  return {
    score: rough,
    maxScore,
    level: rough >= maxScore * 0.75 ? "Strong sample score" : "Developing sample score",
    feedback: "Sample grading is estimating structure, length, and evidence. Live AI grading will give more precise rubric feedback once OPENAI_API_KEY is set.",
    strengths: [
      "The response makes an attempt to answer the prompt.",
      words > 80 ? "There is enough length to start developing evidence." : "The response is concise."
    ],
    improvements: [
      "Name specific historical evidence and explain how it supports the claim.",
      "Tie each paragraph or part directly back to the prompt wording."
    ],
    rubricBreakdown: [
      { label: "Claim or direct answer", earned: words > 25, note: "Make the central answer explicit." },
      { label: "Specific evidence", earned: evidenceHits >= 2, note: "Use named examples, not only broad categories." },
      { label: "Historical reasoning", earned: evidenceHits >= 4, note: "Explain causation, comparison, or change over time." }
    ]
  };
}

const sampleMcqBank = [
  {
    period: "Period 1: c. 1200-c. 1450",
    skill: "Causation",
    stimulus: "A traveler describes caravans moving textiles, horses, paper, and luxury goods between oasis cities across Inner Asia.",
    prompt: "Which development most directly helped make the exchange described in the stimulus possible?",
    choices: [
      { id: "A", text: "The decline of banking practices in commercial cities" },
      { id: "B", text: "The expansion and protection of transregional trade routes under large land empires" },
      { id: "C", text: "The elimination of all local religious traditions along trade routes" },
      { id: "D", text: "The end of demand for luxury goods in Afro-Eurasia" }
    ],
    answer: "B",
    explanation: "Large states and empires helped secure routes, standardize practices, and support long-distance commerce.",
    rubric: [],
    documents: [],
    tags: ["Silk Roads", "trade", "land empires"]
  },
  {
    period: "Period 2: c. 1450-c. 1750",
    skill: "Continuity and change",
    stimulus: "Silver mined in the Americas moved through European merchants to Asian markets, where it was exchanged for manufactured goods.",
    prompt: "The pattern described in the stimulus best illustrates which broader change?",
    choices: [
      { id: "A", text: "The replacement of silver by barter in all major economies" },
      { id: "B", text: "The disappearance of coerced labor systems in the Americas" },
      { id: "C", text: "The isolation of Asian economies from maritime trade" },
      { id: "D", text: "The growth of a truly global trading system connecting the Americas, Europe, and Asia" }
    ],
    answer: "D",
    explanation: "American silver linked global markets and became central to early modern trade, especially with Asian demand.",
    rubric: [],
    documents: [],
    tags: ["silver", "Columbian Exchange", "global trade"]
  },
  {
    period: "Period 3: c. 1750-c. 1900",
    skill: "Comparison",
    stimulus: "Factories concentrated workers near machines powered first by water and then by steam engines.",
    prompt: "Which comparison between industrialization in Britain and Japan is most accurate?",
    choices: [
      { id: "A", text: "Neither country used textile production as part of industrial growth" },
      { id: "B", text: "Both industrialized only after becoming colonies of European empires" },
      { id: "C", text: "Britain industrialized earlier through private enterprise, while Japan industrialized later with strong state direction" },
      { id: "D", text: "Japan industrialized before Britain because of abundant coal in Hokkaido" }
    ],
    answer: "C",
    explanation: "Britain led early industrialization, while Meiji Japan used state reforms and investment to industrialize rapidly.",
    rubric: [],
    documents: [],
    tags: ["industrialization", "Meiji Japan", "Britain"]
  },
  {
    period: "Period 4: c. 1900-present",
    skill: "Contextualization",
    stimulus: "New international institutions formed after 1945 to manage security, finance, development, and diplomacy.",
    prompt: "The development described in the stimulus was most directly shaped by which context?",
    choices: [
      { id: "A", text: "The destruction of the Second World War and the desire to prevent another global conflict" },
      { id: "B", text: "The complete end of ideological rivalry after 1918" },
      { id: "C", text: "The decline of all nationalist movements after 1945" },
      { id: "D", text: "The return of most states to mercantilist isolation" }
    ],
    answer: "A",
    explanation: "Institutions such as the UN, IMF, and World Bank reflected postwar efforts to stabilize international relations.",
    rubric: [],
    documents: [],
    tags: ["postwar order", "United Nations", "global institutions"]
  },
  {
    period: "Period 2: c. 1450-c. 1750",
    skill: "Causation",
    stimulus: "Gunpowder weapons helped rulers expand armies, breach fortifications, and centralize authority.",
    prompt: "Which state best demonstrates the process described in the stimulus?",
    choices: [
      { id: "A", text: "The Mongol Empire before the adoption of siege technologies" },
      { id: "B", text: "The Inca Empire before contact with Afro-Eurasian gunpowder weapons" },
      { id: "C", text: "The city-states of classical Greece during the Persian Wars" },
      { id: "D", text: "The Ottoman Empire during its expansion into southeastern Europe and the Middle East" }
    ],
    answer: "D",
    explanation: "The Ottomans used gunpowder artillery and firearms as part of imperial expansion and centralization.",
    rubric: [],
    documents: [],
    tags: ["gunpowder empires", "Ottoman Empire", "state-building"]
  },
  {
    period: "Period 1: c. 1200-c. 1450",
    skill: "Comparison",
    stimulus: "Swahili city-states grew wealthy by connecting African interior goods with merchants from Arabia, Persia, India, and China.",
    prompt: "Which comparison best describes the Swahili city-states and the cities of the Silk Roads?",
    choices: [
      { id: "A", text: "Both relied only on local subsistence farming and avoided long-distance commerce" },
      { id: "B", text: "Both served as commercial centers where trade encouraged cultural exchange" },
      { id: "C", text: "Both developed in complete isolation from larger regional networks" },
      { id: "D", text: "Both rejected the use of foreign languages and religions in trade" }
    ],
    answer: "B",
    explanation: "Both the Swahili coast and Silk Road cities became trade hubs where merchants, languages, religions, and goods mixed.",
    rubric: [],
    documents: [],
    tags: ["Indian Ocean", "Swahili coast", "trade"]
  },
  {
    period: "Period 2: c. 1450-c. 1750",
    skill: "Contextualization",
    stimulus: "European states established maritime trading-post empires and plantation colonies after developing oceanic navigation and armed ships.",
    prompt: "The pattern described in the stimulus was most directly enabled by",
    choices: [
      { id: "A", text: "the spread of maritime technologies and state-backed exploration" },
      { id: "B", text: "the permanent collapse of all Asian trading networks" },
      { id: "C", text: "the end of demand for spices and luxury goods" },
      { id: "D", text: "the disappearance of joint-stock companies" }
    ],
    answer: "A",
    explanation: "Navigation tools, ship designs, cannon, and state sponsorship helped European states expand maritime activity.",
    rubric: [],
    documents: [],
    tags: ["maritime empires", "exploration", "technology"]
  },
  {
    period: "Period 3: c. 1750-c. 1900",
    skill: "Causation",
    stimulus: "Anti-colonial rebellions and reform movements emerged in regions facing expanding European economic and political pressure.",
    prompt: "Which development was most often a cause of the resistance described?",
    choices: [
      { id: "A", text: "Colonized peoples uniformly accepted foreign rule without negotiation" },
      { id: "B", text: "Imperial states reduced taxes and gave up control over raw materials" },
      { id: "C", text: "Local groups objected to foreign political control, economic extraction, and cultural interference" },
      { id: "D", text: "Industrial states stopped seeking overseas markets" }
    ],
    answer: "C",
    explanation: "Resistance often responded to colonial rule, land pressure, resource extraction, missionary activity, and unequal economic relationships.",
    rubric: [],
    documents: [],
    tags: ["imperialism", "resistance", "colonialism"]
  },
  {
    period: "Period 4: c. 1900-present",
    skill: "Continuity and change",
    stimulus: "Newly independent states after 1945 often kept colonial borders while attempting to build national governments and economies.",
    prompt: "Which statement best explains a challenge connected to the process described?",
    choices: [
      { id: "A", text: "All new states inherited identical ethnic and linguistic populations" },
      { id: "B", text: "Colonial boundaries and economic structures sometimes made postcolonial nation-building difficult" },
      { id: "C", text: "Decolonization ended all international economic dependency immediately" },
      { id: "D", text: "Nationalist movements rejected sovereignty as a goal" }
    ],
    answer: "B",
    explanation: "Postcolonial states often faced borders, institutions, and economies shaped by colonial priorities rather than local unity.",
    rubric: [],
    documents: [],
    tags: ["decolonization", "postcolonial states", "nationalism"]
  },
  {
    period: "Period 4: c. 1900-present",
    skill: "Causation",
    stimulus: "Container shipping, air travel, digital communication, and multinational corporations accelerated global economic connections late in the twentieth century.",
    prompt: "Which outcome most directly resulted from the developments described?",
    choices: [
      { id: "A", text: "Global supply chains linked production and consumption across multiple regions" },
      { id: "B", text: "International migration permanently ended" },
      { id: "C", text: "States lost all ability to regulate trade" },
      { id: "D", text: "All local cultures disappeared at the same pace" }
    ],
    answer: "A",
    explanation: "Late twentieth-century technologies and corporations made it easier to split production across regions and sell goods globally.",
    rubric: [],
    documents: [],
    tags: ["globalization", "technology", "trade"]
  }
];

const sampleWritten = {
  saq: {
    title: "Sample SAQ Practice",
    item: {
      period: "Period 2: c. 1450-c. 1750",
      skill: "Causation",
      stimulus: "Many early modern empires expanded by combining military innovation, tax systems, and claims to religious or political legitimacy.",
      prompt: "A. Identify ONE military technology used by an early modern empire. B. Explain ONE way that technology helped expand or maintain empire. C. Explain ONE non-military method rulers used to legitimize authority.",
      choices: [],
      answer: "",
      explanation: "A strong answer names a technology, explains its effect, and gives a separate legitimacy strategy.",
      rubric: [
        "A point: identifies a relevant military technology such as artillery, firearms, or naval cannon.",
        "B point: explains how the technology supported conquest, defense, or centralization.",
        "C point: explains legitimacy through religion, monumental architecture, bureaucracy, law, or court ritual."
      ],
      documents: [],
      tags: ["empires", "gunpowder", "legitimacy"]
    }
  },
  dbq: {
    title: "Sample DBQ Practice",
    item: {
      period: "Period 3: c. 1750-c. 1900",
      skill: "Argumentation",
      stimulus: "Use the documents and your knowledge of world history to answer the prompt.",
      prompt: "Evaluate the extent to which industrialization changed social structures in the period c. 1750-c. 1900.",
      choices: [],
      answer: "",
      explanation: "A strong DBQ makes a defensible thesis, contextualizes industrialization, uses documents as evidence, and adds outside evidence.",
      rubric: [
        "Thesis or claim: 1 point.",
        "Contextualization: 1 point.",
        "Evidence from documents: up to 2 points.",
        "Evidence beyond documents: 1 point.",
        "Sourcing: 1 point.",
        "Complexity: 1 point."
      ],
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
          text: "We labor from early morning until the lamps are lit, breathing lint and heat while the engines never rest. My eldest daughter is twelve and earns a little beside me, but she returns home too tired to read. The masters speak of progress, yet in our street several families sleep in one damp room. If machines enrich the nation, workers ask why our hours lengthen and our bread remains dear."
        },
        {
          title: "Document 3",
          source: "Speech by an Indian merchant in Bombay discussing mechanized cotton imports",
          date: "1877",
          context: "Industrial production reshaped global trade and colonial economies.",
          text: "Cloth once woven by skilled hands in our towns now arrives by the shipload from Lancashire, priced so low that many local weavers cannot compete. Some merchants profit by carrying these goods inland, but artisans complain that the new trade reduces them to debt. Railways and steamships have enlarged commerce, yet they also bind our markets to factories far beyond our shores."
        },
        {
          title: "Document 4",
          source: "Petition from women workers in a Japanese silk-reeling factory",
          date: "1898",
          context: "Meiji industrialization expanded factory work for young women.",
          text: "We ask that dormitory rules be made less severe and that wages promised by recruiters be paid in full. Many of us left farming villages to help our families meet taxes, but deductions for food and lodging leave little to send home. We do not reject work for the nation; we ask only that supervisors stop extending hours when export orders rise."
        },
        {
          title: "Document 5",
          source: "Excerpt from a municipal health report in Berlin",
          date: "1901",
          context: "Rapid urban growth led governments to investigate public health problems.",
          text: "The industrial districts continue to receive migrants faster than adequate housing can be built. Tenements near workshops show high rates of respiratory illness, especially among children. The city recommends improved drainage, limits on overcrowding, and inspection of factories that release smoke into residential streets. Economic growth has increased employment, but it has also created public burdens requiring state action."
        }
      ],
      tags: ["industrialization", "social change", "labor"]
    }
  },
  leq: {
    title: "Sample LEQ Practice",
    item: {
      period: "Period 4: c. 1900-present",
      skill: "Continuity and change",
      stimulus: "",
      prompt: "Evaluate the extent to which decolonization after 1945 changed political structures in Asia and Africa.",
      choices: [],
      answer: "",
      explanation: "A strong LEQ has a defensible thesis, context, specific evidence, historical reasoning, and complexity.",
      rubric: [
        "Thesis or claim: 1 point.",
        "Contextualization: 1 point.",
        "Evidence: up to 2 points.",
        "Analysis and reasoning: up to 2 points."
      ],
      documents: [],
      tags: ["decolonization", "nationalism", "postwar"]
    }
  }
};
