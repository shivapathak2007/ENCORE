---
phase: 3
plan: 1
wave: 1
---

# Plan 3.1: Real AI Avatar TTS

## Objective
Replace the robotic browser `speechSynthesis` API in the AI Presenter feature with a higher-quality Text-To-Speech (TTS) solution using the `google-tts-api` library on the backend.

## Context
- .gsd/SPEC.md
- briefly/backend/package.json
- briefly/backend/src/controllers/documentController.js
- briefly/backend/src/routes/documentRoutes.js
- briefly/frontend/src/pages/Landing.jsx

## Tasks

<task type="auto">
  <name>Install and Setup TTS in Backend</name>
  <files>
    - briefly/backend/package.json
    - briefly/backend/src/controllers/documentController.js
    - briefly/backend/src/routes/documentRoutes.js
  </files>
  <action>
    1. Run `npm install google-tts-api` in the backend folder.
    2. In `documentController.js`, add a new controller `generateTTS(req, res)` that imports `googleTTS` from `google-tts-api`. It should take `text` from `req.body`, split it if it's too long (over 200 chars), and use `googleTTS.getAudioBase64(text, { lang: 'en', slow: false, host: 'https://translate.google.com' })`. Send the base64 audio string back to the client.
    3. In `documentRoutes.js`, add `router.post('/:id/tts', generateTTS);`.
  </action>
  <verify>grep "generateTTS" briefly/backend/src/routes/documentRoutes.js</verify>
  <done>Backend can generate base64 audio from text.</done>
</task>

<task type="auto">
  <name>Update VideoSummaryView in Frontend</name>
  <files>
    - briefly/frontend/src/pages/Landing.jsx
    - briefly/frontend/src/services/api.js
  </files>
  <action>
    1. In `api.js`, add a method `generateTTS: (documentId, text) => API.post(\`/documents/\${documentId}/tts\`, { text })`.
    2. In `Landing.jsx`, find `VideoSummaryView`.
    3. Replace `window.speechSynthesis` logic in `togglePlay()`. Instead, make an API call to `generateTTS(documentId, script)`.
    4. Decode the base64 audio and play it using `const audio = new Audio("data:audio/mp3;base64," + base64String); audio.play();`.
    5. Update `isPlaying` state accordingly based on `audio.onended`.
  </action>
  <verify>grep "generateTTS" briefly/frontend/src/pages/Landing.jsx</verify>
  <done>Frontend uses the new real TTS backend.</done>
</task>

## Success Criteria
- [ ] Clicking the play button on the AI Presenter plays a realistic Google TTS voice instead of the default browser robot.
