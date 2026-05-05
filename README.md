# AP World Study Hub

Live site:

https://austnn-xu.github.io/ap-world-study-hub/

This GitHub page is the code/instructions page. The actual website is the link above.

A full AP World History study website with:

- AI-generated MCQ, SAQ, DBQ, and LEQ practice
- AI grading for written SAQ, DBQ, and LEQ responses
- Missed MCQ storage in the browser so you can review wrong answers later
- A built-in AP World timeline page
- No npm dependencies required

## Use It Online

Open:

```text
https://austnn-xu.github.io/ap-world-study-hub/
```

The online GitHub Pages version works as a static preview with built-in sample questions, timeline filters, wrong-MCQ review, and dark/light mode.

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
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini
PORT=4173
```

If no API key is set, the app still works with built-in sample questions and sample grading so the pages stay usable.

## Project Notes

The API key stays on the server. The browser only calls local endpoints:

- `POST /api/practice`
- `POST /api/grade`
- `GET /api/status`

Missed MCQ questions are stored locally in the browser under `apworld.missed.mcq.v1`.
