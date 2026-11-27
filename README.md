# AP World Study Hub

Static GitHub Pages preview:

https://austnn-xu.github.io/ap-world-study-hub/

The GitHub Pages link is a static preview. For the public site with live Gemini AI, deploy this same repo on Vercel so the `/api` routes can run securely.

A full AP World History study website with:

- Gemini-generated MCQ, SAQ, DBQ, and LEQ practice
- AI grading for written SAQ, DBQ, and LEQ responses
- Missed MCQ storage in the browser so you can review wrong answers later
- A built-in AP World timeline page with units, events, vocab, and study notes
- No npm dependencies required

## Use The Static Preview

Open:

```text
https://austnn-xu.github.io/ap-world-study-hub/
```

The GitHub Pages version works with built-in sample questions, wrong-MCQ review, dark/light mode, and the built-in timeline page.

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
```

If no API key is set, the app still works with built-in sample questions and sample grading so the pages stay usable.

## Project Notes

The API key stays on the server. The browser only calls local endpoints:

- `POST /api/practice`
- `POST /api/grade`
- `GET /api/status`

Missed MCQ questions are stored locally in the browser under `apworld.missed.mcq.v1`.
