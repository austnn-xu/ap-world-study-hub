import { getStatusPayload } from "../server.mjs";
import { handleOptions, methodNotAllowed, sendJson } from "./_shared.js";

export default async function handler(request, response) {
  if (handleOptions(request, response)) return;
  if (request.method !== "GET") return methodNotAllowed(response);
  sendJson(response, 200, getStatusPayload());
}
