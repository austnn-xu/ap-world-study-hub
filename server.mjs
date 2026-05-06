import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

loadDotEnv();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");
const port = Number(process.env.PORT || 4173);
const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const geminiApiUrl = (process.env.GEMINI_API_URL || "https://generativelanguage.googleapis.com/v1beta").replace(/\/+$/, "");

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
        liveAI: Boolean(geminiKey),
        provider: geminiKey ? "Gemini" : "Sample",
        model: geminiKey ? geminiModel : "sample-mode"
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
  const count = type === "mcq" ? 10 : 1;
  const request = {
    type,
    count,
    topic: cleanText(body.topic, "mixed AP World units"),
    period: cleanText(body.period, "any AP World period"),
    difficulty: cleanText(body.difficulty, "AP exam style")
  };

  if (!geminiKey) {
    return {
      source: "sample",
      warning: "Set GEMINI_API_KEY in .env for live AI-generated practice.",
      ...samplePractice(request)
    };
  }

  try {
    const result = await createPracticeWithAI(request);
    return {
      source: "ai",
      model: geminiModel,
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

  if (!geminiKey) {
    return {
      source: "sample",
      warning: "Set GEMINI_API_KEY in .env for live AI grading.",
      ...sampleGrade(request)
    };
  }

  try {
    const result = await gradeWithAI(request);
    return {
      source: "ai",
      model: geminiModel,
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
    "Every item must include a documents array. MCQ and SAQ need at least 1 source document; DBQ needs 4-6 source documents; LEQ must use an empty documents array.",
    "Every document must be an object with text, source, date, context, and title. The text must be a full source-style excerpt of 60-140 words, not a summary.",
    "Write each document so the site can display it in this exact exam-style order: \"long quote or excerpt\" - \"specific person, role, or civilian in context\", \"specific date, dynasty, or time period\".",
    "The source field should be the person or group plus context, like \"Chinese merchant in Quanzhou describing Indian Ocean trade\". The date field should be specific, like \"Yuan dynasty, c. 1290\" or \"Manchester, 1842\".",
    "Do not use short generic stimulus summaries such as merchants traveled across routes. Use source excerpts that sound like AP World exam stimuli.",
    "For MCQ, choices must be exactly four objects with id A-D and answer must be A, B, C, or D.",
    "For MCQ sets with more than one item, vary the correct answer letters across A, B, C, and D. Do not make every answer A.",
    "Create exactly the requested number of separate items.",
    "For SAQ items, make one three-part prompt labeled A, B, and C based on at least one source document.",
    "For DBQ items, include 4-6 invented AP-style source documents for each item.",
    "For LEQ items, ask for one thesis-driven essay only. Do not include any source document for LEQ."
  ].join(" ");

  const prompt = [
    `Practice type: ${request.type.toUpperCase()}`,
    `Number of items: ${request.count}`,
    `Topic focus: ${request.topic}`,
    `Period focus: ${request.period}`,
    `Difficulty: ${request.difficulty}`,
    "Make the material useful for AP World History studying from c. 1200 to the present."
  ].join("\n");

  return callGeminiJson(instructions, prompt);
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

  return callGeminiJson(instructions, prompt);
}

async function callGeminiJson(instructions, prompt) {
  const endpoint = `${geminiApiUrl}/models/${encodeURIComponent(geminiModel)}:generateContent?key=${encodeURIComponent(geminiKey)}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: instructions }]
      },
      contents: [
        {
          role: "user",
          parts: [{ text: `${prompt}\n\nReturn only valid JSON.` }]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.75
      }
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Gemini returned ${response.status}: ${details.slice(0, 180)}`);
  }

  const data = await response.json();
  const text = extractResponseText(data);
  if (!text) throw new Error("Gemini returned no text.");
  return JSON.parse(stripJsonFence(text));
}

function extractResponseText(data) {
  if (typeof data.output_text === "string") return data.output_text;
  if (data.choices?.[0]?.message?.content) return data.choices[0].message.content;
  if (Array.isArray(data.candidates?.[0]?.content?.parts)) {
    return data.candidates[0].content.parts
      .map((part) => part.text || "")
      .filter(Boolean)
      .join("\n")
      .trim();
  }

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
    documents: request.type === "leq" ? [] : (Array.isArray(item.documents) ? item.documents.map((entry, docIndex) => normalizeDocument(entry, docIndex)).filter(Boolean) : []),
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
    feedback: "Sample grading is estimating structure, length, and evidence. Live AI grading will give more precise rubric feedback once GEMINI_API_KEY is set.",
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
    stimulus: "Use the source below to answer the question.",
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
    documents: [
      {
        title: "Source 1",
        source: "Persian merchant traveling between Samarkand and Khanbaliq under Mongol rule",
        date: "Yuan dynasty, c. 1280",
        context: "Mongol authorities protected major routes across Eurasia and encouraged long-distance commerce.",
        text: "At the relay stations our animals are exchanged before their strength fails, and the tablets carried by the khan's officials open gates that once closed at sunset. In the markets I see paper from China, horses from the steppe, glass from Syria, and bolts of cloth that have crossed more lands than any single man could name. The roads are watched, and a merchant who pays the proper dues may travel farther than his father imagined."
      }
    ],
    tags: ["Silk Roads", "trade", "land empires"]
  },
  {
    period: "Period 2: c. 1450-c. 1750",
    skill: "Continuity and change",
    stimulus: "Use the source below to answer the question.",
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
    documents: [
      {
        title: "Source 1",
        source: "Spanish official reporting on silver shipments from New Spain to Manila",
        date: "Mexico City, 1597",
        context: "American silver moved through Pacific and Atlantic routes into Asian markets.",
        text: "The merchants press continually for permission to send more pesos across the sea, for in Manila the Chinese traders will take silver more eagerly than woolens or wine. From those islands return silks, porcelain, and spices that fill the shops of Mexico and Seville. The mines have made our king powerful, yet the coin does not rest in Spain; it moves wherever Asian goods command a better price."
      }
    ],
    tags: ["silver", "Columbian Exchange", "global trade"]
  },
  {
    period: "Period 3: c. 1750-c. 1900",
    skill: "Comparison",
    stimulus: "Use the source below to answer the question.",
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
    documents: [
      {
        title: "Source 1",
        source: "Japanese student sent by the Meiji government to inspect British textile factories",
        date: "Manchester, 1872",
        context: "Meiji leaders studied Western industry while pursuing state-directed modernization.",
        text: "The mills here were begun by merchants who risked private fortunes, but their machines now appear as disciplined as a regiment. Our own country cannot wait for such habits to grow slowly. If Japan is to preserve its independence, officials must purchase machinery, send students abroad, and teach factory labor as deliberately as we once taught service to a lord. Industry has become a defense of the nation."
      }
    ],
    tags: ["industrialization", "Meiji Japan", "Britain"]
  },
  {
    period: "Period 4: c. 1900-present",
    skill: "Contextualization",
    stimulus: "Use the source below to answer the question.",
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
    documents: [
      {
        title: "Source 1",
        source: "Delegate from a war-damaged European state speaking at an international conference",
        date: "San Francisco, 1945",
        context: "World War II convinced many governments to create new institutions for diplomacy and security.",
        text: "Our cities have learned what follows when nations treat treaties as scraps of paper and economic misery as another country's problem. We come here not because we trust all states equally, but because the alternative has been tested in fire. A council of nations, relief for shattered economies, and rules for settling disputes may not end ambition, yet they may keep ambition from becoming another world war."
      }
    ],
    tags: ["postwar order", "United Nations", "global institutions"]
  },
  {
    period: "Period 2: c. 1450-c. 1750",
    skill: "Causation",
    stimulus: "Use the source below to answer the question.",
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
    documents: [
      {
        title: "Source 1",
        source: "Ottoman artillery officer describing the siege of a fortified city",
        date: "Reign of Mehmed II, 1453",
        context: "Gunpowder weapons helped several early modern empires expand and centralize rule.",
        text: "The great guns are slow to move, but when they speak the old walls tremble like clay jars. Engineers measure the distance, gunners prepare powder, and scribes record supplies sent from the sultan's storehouses. This is not the work of a single warrior seeking glory. It is the work of a ruler who commands foundries, roads, taxes, and soldiers so that stone fortresses may no longer halt his authority."
      }
    ],
    tags: ["gunpowder empires", "Ottoman Empire", "state-building"]
  },
  {
    period: "Period 1: c. 1200-c. 1450",
    skill: "Comparison",
    stimulus: "Use the source below to answer the question.",
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
    documents: [
      {
        title: "Source 1",
        source: "Swahili merchant in Kilwa writing to a trading partner across the Indian Ocean",
        date: "Kilwa, c. 1330",
        context: "Coastal East African city-states linked inland African goods with Indian Ocean commerce.",
        text: "The monsoon has turned, and with it come ships carrying cotton cloth, beads, and porcelain. In our warehouses are ivory from the interior, gold dust brought by caravan, and mangrove poles cut near the shore. A man who speaks only the language of his village will bargain poorly here, for the harbor carries Arabic prayers, Persian accounts, and the speech of sailors from Gujarat."
      }
    ],
    tags: ["Indian Ocean", "Swahili coast", "trade"]
  },
  {
    period: "Period 2: c. 1450-c. 1750",
    skill: "Contextualization",
    stimulus: "Use the source below to answer the question.",
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
    documents: [
      {
        title: "Source 1",
        source: "Portuguese pilot advising a royal official about voyages around Africa",
        date: "Lisbon, c. 1505",
        context: "Maritime technology and state support helped European kingdoms enter Indian Ocean trade.",
        text: "The compass and astrolabe do not quiet the sea, but they allow a pilot to argue with it more confidently. The crown has ordered charts copied, cannon mounted, and captains supplied for voyages past the Cape. Without royal warehouses and armed ships, our merchants would be only visitors in eastern waters. With them, they become factors in forts, collecting duties and bargaining under the shadow of guns."
      }
    ],
    tags: ["maritime empires", "exploration", "technology"]
  },
  {
    period: "Period 3: c. 1750-c. 1900",
    skill: "Causation",
    stimulus: "Use the source below to answer the question.",
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
    documents: [
      {
        title: "Source 1",
        source: "Village headman petitioning against new colonial taxes and land rules",
        date: "East Africa, 1895",
        context: "Imperial administrations often imposed taxes, labor demands, and land policies that provoked resistance.",
        text: "The new officers say the tax is small, but it must be paid in coin that our people cannot grow in the fields. They mark land that belonged to our ancestors and tell young men to carry loads for roads we did not request. If a chief refuses, soldiers arrive; if he agrees, his own people call him a servant. We ask whether law is still law when it speaks only in a foreign tongue."
      }
    ],
    tags: ["imperialism", "resistance", "colonialism"]
  },
  {
    period: "Period 4: c. 1900-present",
    skill: "Continuity and change",
    stimulus: "Use the source below to answer the question.",
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
    documents: [
      {
        title: "Source 1",
        source: "Newly elected African legislator addressing a national assembly after independence",
        date: "Accra, 1958",
        context: "Decolonization created new states that often inherited colonial borders and economies.",
        text: "The flag has changed, and with it the hope of our people, but the railway still runs from mine to port rather than village to village. The borders enclose communities that traded and quarreled long before Europeans drew maps in distant offices. We must build a nation from the tools left by an empire, using schools, courts, and roads that were not designed for our unity."
      }
    ],
    tags: ["decolonization", "postcolonial states", "nationalism"]
  },
  {
    period: "Period 4: c. 1900-present",
    skill: "Causation",
    stimulus: "Use the source below to answer the question.",
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
    documents: [
      {
        title: "Source 1",
        source: "Factory manager describing electronics production for a multinational corporation",
        date: "Shenzhen, 1998",
        context: "Late twentieth-century globalization expanded supply chains across multiple regions.",
        text: "The design arrives by fax and computer file from California, the chips come from several ports, and the finished boards leave in containers before the month ends. Workers here assemble what customers in Europe may purchase under a brand they know better than our city's name. Speed matters more than distance now. A delay in one harbor can halt orders in three countries."
      }
    ],
    tags: ["globalization", "technology", "trade"]
  }
];

const sampleWritten = {
  saq: {
    title: "Sample SAQ Practice",
    item: {
      period: "Period 2: c. 1450-c. 1750",
      skill: "Causation",
      stimulus: "Use the source below to answer all parts of the question.",
      prompt: "A. Identify ONE military technology referenced or implied in the source. B. Explain ONE way that technology helped expand or maintain empire. C. Explain ONE non-military method rulers used to legitimize authority.",
      choices: [],
      answer: "",
      explanation: "A strong answer names a technology, explains its effect, and gives a separate legitimacy strategy.",
      rubric: [
        "A point: identifies a relevant military technology such as artillery, firearms, or naval cannon.",
        "B point: explains how the technology supported conquest, defense, or centralization.",
        "C point: explains legitimacy through religion, monumental architecture, bureaucracy, law, or court ritual."
      ],
      documents: [
        {
          title: "Source 1",
          source: "Court chronicler praising an early modern ruler after a successful siege",
          date: "Mughal Empire, c. 1570",
          context: "Early modern empires often combined military power with claims of religious, dynastic, or bureaucratic legitimacy.",
          text: "The emperor's cannon opened the fort, but victory was secured also by order. Accountants recorded each village newly placed under imperial revenue, judges promised protection to merchants, and poets compared the ruler's justice to shade in the hot season. Soldiers may break a gate in one day; obedience lasts only when people believe the ruler commands more than iron and fire."
        }
      ],
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
          source: "Textile mill owner posting rules for workers in an industrial factory",
          date: "Manchester, 1833",
          context: "Factory owners attempted to discipline a large wage-labor workforce.",
          text: "Any worker arriving after the bell shall lose one quarter day's wages. Talking at the frames, leaving the room without permission, or damaging thread through carelessness shall be fined. Children employed as piecers must remain at their assigned machines until relieved. The overseer is instructed to report idleness immediately, for the success of the mill depends upon regular motion and punctual attendance."
        },
        {
          title: "Document 2",
          source: "Textile worker writing to a local newspaper about factory conditions",
          date: "Northern England, 1842",
          context: "Industrial workers increasingly criticized working conditions in print.",
          text: "We labor from early morning until the lamps are lit, breathing lint and heat while the engines never rest. My eldest daughter is twelve and earns a little beside me, but she returns home too tired to read. The masters speak of progress, yet in our street several families sleep in one damp room. If machines enrich the nation, workers ask why our hours lengthen and our bread remains dear."
        },
        {
          title: "Document 3",
          source: "Indian merchant in Bombay discussing mechanized cotton imports",
          date: "Bombay, 1877",
          context: "Industrial production reshaped global trade and colonial economies.",
          text: "Cloth once woven by skilled hands in our towns now arrives by the shipload from Lancashire, priced so low that many local weavers cannot compete. Some merchants profit by carrying these goods inland, but artisans complain that the new trade reduces them to debt. Railways and steamships have enlarged commerce, yet they also bind our markets to factories far beyond our shores."
        },
        {
          title: "Document 4",
          source: "Women workers petitioning managers in a Japanese silk-reeling factory",
          date: "Meiji Japan, 1898",
          context: "Meiji industrialization expanded factory work for young women.",
          text: "We ask that dormitory rules be made less severe and that wages promised by recruiters be paid in full. Many of us left farming villages to help our families meet taxes, but deductions for food and lodging leave little to send home. We do not reject work for the nation; we ask only that supervisors stop extending hours when export orders rise."
        },
        {
          title: "Document 5",
          source: "Municipal health official reporting on industrial neighborhoods",
          date: "Berlin, 1901",
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
