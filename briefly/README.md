# Briefly - AI Knowledge Companion

"Turn information into understanding."

Briefly is a full-stack AI-powered knowledge companion designed for students and professionals. It allows users to upload documents (PDF, DOCX, PPTX, TXT), images, and text, and uses AI to turn large amounts of information into concise, structured, visual, and revision-friendly knowledge.

## Core Features
*   **Crisp Summaries:** TL;DR, Key Takeaways, Core Concepts.
*   **Visual Knowledge:** Mind maps, flowcharts, knowledge graphs, timelines, and data charts.
*   **Study Tools:** Flashcards, quiz generator, "Explain simply" mode, revision notes.
*   **Professional Tools:** Executive summaries, meeting notes, action items.
*   **Ask Your Document:** Interactive Q&A backed by user-uploaded sources to minimize hallucination.
*   **Multi-Document Knowledge:** Compare and unify knowledge across multiple documents.

## Technology Stack
*   **Frontend:** React.js, Vite, React Router, Axios, Tailwind CSS, Recharts, React Flow.
*   **Backend:** Node.js, Express.js, REST API (MVC).
*   **Database & Storage:** Supabase (PostgreSQL), Supabase Storage.
*   **Authentication:** bcrypt, JWT.
*   **AI Integration:** Provider-independent architecture (supports OpenAI, Gemini, Anthropic, etc.).

## Project Structure
*   `frontend/`: React + Vite frontend application.
*   `backend/`: Node.js + Express backend application.

## Development Setup

### Backend setup
```bash
cd briefly/backend
npm install
npm run dev
```

### Frontend setup
```bash
cd briefly/frontend
npm install
npm run dev
```

## Environment Variables
See `.env.example` in both `frontend` and `backend` for required variables.
