# AP World Study Hub

Static GitHub Pages preview:

https://austnn-xu.github.io/ap-world-study-hub/

Live Vercel site:

https://ap-world-study-hub.vercel.app/

The GitHub Pages link is a static preview. For the public site with live Gemini AI, deploy this same repo on Vercel so the `/api` routes can run securely.

A full AP World History study website with:

- Gemini-generated MCQ, SAQ, DBQ, and LEQ practice
- AI grading for written SAQ, DBQ, and LEQ responses
- Missed MCQ storage in the browser so you can review wrong answers later
- Private developer analytics behind a password wall
- A button that opens the original AP World timeline project
- No npm dependencies required

## Use The Static Preview

Open:

```text
https://austnn-xu.github.io/ap-world-study-hub/
```

The GitHub Pages version works with built-in sample questions, wrong-MCQ review, dark/light mode, and the timeline link.

## Put Live AI On The Public Site

GitHub Pages cannot run Node or hide a Gemini key. Use Vercel for the real AI version:

1. Open this deploy link:

```text
https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Faustnn-xu%2Fap-world-study-hub&env=GEMINI_API_KEY,GEMINI_MODEL&envDescription=Gemini%20API%20key%20for%20live%20AI&envLink=https%3A%2F%2Faistudio.google.com%2Fapp%2Fapikey
```

2. Add these environment variables in Vercel:

```text
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash-lite
GEMINI_FALLBACK_MODELS=gemini-2.0-flash,gemini-2.0-flash-lite,gemini-flash-lite-latest
```

3. Click Deploy. The Vercel URL it gives you is the public site with live AI.

## Developer Analytics

Open:

```text
https://ap-world-study-hub.vercel.app/analytics.html
```

The dashboard is protected by `ANALYTICS_PASSWORD` and stores shared totals through Vercel Edge Config. It tracks visits, unique visitors, generated prompts, generated questions, written grades, MCQ answers, MCQ misses, reviews, popular pages, AI source/model usage, daily activity, and recent events.

## Run It Locally For Live AI

```bash
node server.mjs
```

Then open:

```text
http://localhost:4173
```

## Turn On Live AI Locally

Copy `.env.example` to `.env`, then add your key:

```text
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash-lite
GEMINI_FALLBACK_MODELS=gemini-2.0-flash,gemini-2.0-flash-lite,gemini-flash-lite-latest
PORT=4173
ANALYTICS_PASSWORD=your_dashboard_password
ANALYTICS_SESSION_SECRET=any_long_random_secret
ANALYTICS_EDGE_CONFIG_ID=optional_edge_config_id_for_persistent_stats
ANALYTICS_VERCEL_TOKEN=optional_vercel_token_for_edge_config_writes
```

If no API key is set, the app still works with built-in sample questions and sample grading so the pages stay usable.

## Project Notes

The API key stays on the server. The browser only calls local endpoints:

- `POST /api/practice`
- `POST /api/grade`
- `GET /api/status`
- `GET/POST /api/analytics`

Missed MCQ questions are stored locally in the browser under `apworld.missed.mcq.v1`.
