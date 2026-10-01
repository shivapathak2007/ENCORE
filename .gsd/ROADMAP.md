# ROADMAP.md

> **Current Phase**: Not started
> **Milestone**: Polish & Media Expansion

## Must-Haves (from SPEC)
- [ ] Audio/Video file uploads and transcription
- [ ] Export functionality (PDF/Markdown)
- [ ] Enhanced AI Video Script (Real TTS)
- [ ] Gamified Quiz UI

## Phases

### Phase 1: Export Features & UI Polish
**Status**: ✅ Complete
**Objective**: Implement "Export to PDF/Markdown" buttons across all generated content and add framer-motion gamification to the Quiz UI.

### Phase 2: Audio & Video Support
**Status**: ✅ Complete
**Objective**: Modify backend to accept `.mp3`, `.wav`, `.mp4` uploads, use a transcription service (or Gemini Audio API) to transcribe them, and feed the transcript into the existing AI generation pipeline.

### Phase 3: Real AI Avatar TTS
**Status**: ⬜ Not Started
**Objective**: Replace the basic browser `speechSynthesis` with a higher-quality Text-To-Speech API (like Google Cloud TTS or ElevenLabs) for the AI Presenter feature.
