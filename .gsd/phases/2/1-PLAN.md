---
phase: 2
plan: 1
wave: 1
---

# Plan 2.1: Audio & Video Uploads and AI Transcription

## Objective
Support uploading Audio and Video files (.mp3, .wav, .mp4, etc.) from the frontend and transcribe them using Gemini so the text can be processed into summaries and flashcards like any other document.

## Context
- .gsd/SPEC.md
- briefly/backend/src/middleware/uploadMiddleware.js
- briefly/backend/src/services/aiService.js
- briefly/backend/src/services/documentParserService.js
- briefly/frontend/src/components/workspace/UploadArea.jsx

## Tasks

<task type="auto">
  <name>Allow Media MimeTypes in Upload Middleware</name>
  <files>
    - briefly/backend/src/middleware/uploadMiddleware.js
  </files>
  <action>
    Add 'audio/mpeg', 'audio/wav', 'audio/webm', 'video/mp4', 'video/webm' to `allowedMimeTypes`.
    Update the error message to mention Audio and Video.
  </action>
  <verify>grep "audio/mpeg" briefly/backend/src/middleware/uploadMiddleware.js</verify>
  <done>Audio/Video mime types are allowed.</done>
</task>

<task type="auto">
  <name>Implement Transcription in AI Service</name>
  <files>
    - briefly/backend/src/services/aiService.js
  </files>
  <action>
    Add an async method `transcribeMedia(buffer, mimeType)`.
    Use `genAI.getGenerativeModel({ model: this.modelStr })`.
    Call `model.generateContent` with a prompt ("Please transcribe the following audio/video accurately, returning only the text.") and an `inlineData` object: `{ inlineData: { data: buffer.toString('base64'), mimeType } }`.
    Return the text response.
  </action>
  <verify>grep "transcribeMedia" briefly/backend/src/services/aiService.js</verify>
  <done>aiService can transcribe inline media buffers.</done>
</task>

<task type="auto">
  <name>Wire Transcription into Parser and UI</name>
  <files>
    - briefly/backend/src/services/documentParserService.js
    - briefly/frontend/src/components/workspace/UploadArea.jsx
  </files>
  <action>
    In `documentParserService.js`, import `aiService` from `./aiService.js`.
    In `parseDocument`, if `mimeType.startsWith('audio/') || mimeType.startsWith('video/')`, set `parsedData.text = await aiService.transcribeMedia(buffer, mimeType)`.
    In `UploadArea.jsx` in frontend, add `audio/*` and `video/*` to the Dropzone `accept` prop, and update the UI text to explicitly say "PDF, DOCX, PPTX, Images, MP3, MP4".
  </action>
  <verify>grep "audio/\*" briefly/frontend/src/components/workspace/UploadArea.jsx</verify>
  <done>UI and Parser are fully wired to handle audio and video.</done>
</task>

## Success Criteria
- [ ] Users can drag and drop MP3 or MP4 files.
- [ ] The backend successfully transcribes them via Gemini and saves the text to DB chunks.
