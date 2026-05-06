import { gradePractice } from "../server.mjs";
import { handleOptions, methodNotAllowed, readBody, sendJson } from "./_shared.js";

export default async function handler(request, response) {
  if (handleOptions(request, response)) return;
  if (request.method !== "POST") return methodNotAllowed(response);

  try {
    const payload = await gradePractice(await readBody(request));
    sendJson(response, 200, payload);
  } catch (error) {
    const status = Number(error.statusCode || 500);
    sendJson(response, status, {
      error: status === 500 ? "Something went wrong on the study server." : error.message
    });
  }
}
