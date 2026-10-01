# SPEC.md — Briefly Project Specification

> **Status**: `FINALIZED`

## Vision
Briefly is a modern, premium AI document intelligence platform that allows users to upload documents (and soon Audio/Video) to automatically generate summaries, mind maps, flashcards, quizzes, and interactive AI avatar video scripts. The goal is to provide a "wow" aesthetic using dark mode, smooth framer-motion animations, and rapid performance.

## Goals
1. Add support for Audio/Video file uploads and transcription.
2. Allow users to export generated content (Summaries, Flashcards, Mindmaps) to PDF/Markdown.
3. Enhance the AI Video Script feature with real Text-to-Speech (TTS) integration.
4. Polish the UI (gamified quizzes, smoother transitions).
5. Improve SEO and basic frontend performance.

## Non-Goals (Out of Scope)
- No complex multi-user collaboration features right now.
- No paid billing systems for now.

## Users
Students, researchers, and professionals who need to quickly digest complex documents, audio lectures, or video recordings into actionable study materials and summaries.

## Constraints
- Must stick to the Lovable-style dark mode neon aesthetic.
- Must use `gemini-flash-lite-latest` (or stable models) to avoid 503 errors and quota limits.
- Backend is deployed on Render, Frontend on Vercel.

## Success Criteria
- [ ] Users can upload an audio/video file and get a summary.
- [ ] Users can click an "Export" button on a summary to download it.
- [ ] The AI Presenter has a realistic TTS voice via a proper API (e.g., Google TTS or Web Speech API improvements).
- [ ] Quiz UI has success/failure animations.
