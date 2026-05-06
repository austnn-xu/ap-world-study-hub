import {
  createAnalyticsCookie,
  getAnalyticsSnapshot,
  isAnalyticsAuthorized,
  trackAnalyticsEvent,
  verifyAnalyticsPassword
} from "../server.mjs";
import { handleOptions, methodNotAllowed, readBody, sendJson } from "./_shared.js";

export default async function handler(request, response) {
  if (handleOptions(request, response)) return;

  try {
    if (request.method === "POST") {
      const body = await readBody(request);

      if (Object.hasOwn(body, "password")) {
        if (!verifyAnalyticsPassword(body.password)) {
          return sendJson(response, 401, { ok: false, error: "Incorrect password." });
        }

        response.setHeader("Set-Cookie", createAnalyticsCookie(request.headers.host || ""));
        return sendJson(response, 200, { ok: true });
      }

      await trackAnalyticsEvent(body, {
        userAgent: request.headers["user-agent"] || "",
        referer: request.headers.referer || ""
      }).catch(() => null);
      return sendJson(response, 202, { ok: true });
    }

    if (request.method === "GET") {
      if (!isAnalyticsAuthorized(request.headers.cookie || "")) {
        return sendJson(response, 401, { ok: false, error: "Password required." });
      }

      return sendJson(response, 200, await getAnalyticsSnapshot());
    }

    return methodNotAllowed(response);
  } catch (error) {
    const status = Number(error.statusCode || 500);
    return sendJson(response, status, {
      ok: false,
      error: status === 500 ? "Analytics are temporarily unavailable." : error.message
    });
  }
}
