export function setCors(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export function sendJson(response, status, payload) {
  setCors(response);
  response.status(status).json(payload);
}

export async function readBody(request) {
  if (!request.body) return {};
  if (typeof request.body === "object") return request.body;
  if (typeof request.body === "string") return JSON.parse(request.body || "{}");

  let raw = "";
  for await (const chunk of request) {
    raw += chunk;
    if (raw.length > 250000) {
      const error = new Error("Request body is too large.");
      error.statusCode = 413;
      throw error;
    }
  }
  return raw.trim() ? JSON.parse(raw) : {};
}

export function handleOptions(request, response) {
  if (request.method !== "OPTIONS") return false;
  setCors(response);
  response.status(204).end();
  return true;
}

export function methodNotAllowed(response) {
  sendJson(response, 405, { error: "Method not allowed" });
}
