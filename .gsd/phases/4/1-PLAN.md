---
phase: 4
plan: 1
wave: 1
---

# Plan 4.1: SEO & Performance Optimization

## Objective
Improve the frontend performance by implementing React lazy loading (code-splitting) and boost search engine visibility by adding static and dynamic SEO meta tags using `react-helmet-async`.

## Context
- briefly/frontend/index.html
- briefly/frontend/src/App.jsx
- briefly/frontend/package.json
- briefly/frontend/src/pages/Landing.jsx

## Tasks

<task type="auto">
  <name>Install react-helmet-async and Static SEO</name>
  <files>
    - briefly/frontend/package.json
    - briefly/frontend/index.html
  </files>
  <action>
    1. Run `npm install react-helmet-async` in the `briefly/frontend` directory.
    2. Update `index.html`:
       - Change `<title>` to `ENCORE - AI Study Companion`.
       - Add `<meta name="description" content="Turn any document, audio, or video into interactive summaries, mind maps, flashcards, and quizzes using AI.">`.
       - Add `<meta name="keywords" content="AI study tool, document summarization, AI flashcards, mind map generator, audio to text AI">`.
       - Add OpenGraph tags (`og:title`, `og:description`, `og:type="website"`).
  </action>
  <verify>grep "ENCORE - AI Study Companion" briefly/frontend/index.html</verify>
  <done>Dependencies installed and static HTML metadata updated.</done>
</task>

<task type="auto">
  <name>Implement Lazy Loading and HelmetProvider</name>
  <files>
    - briefly/frontend/src/App.jsx
  </files>
  <action>
    1. Import `HelmetProvider` from `react-helmet-async`.
    2. Wrap the entire app (inside or outside `<AuthProvider>`) with `<HelmetProvider>`.
    3. Implement route code-splitting: Replace standard imports of pages (`Landing`, `Login`, `Register`, `Upload`) with `React.lazy(() => import('./pages/...').then(module => ({ default: module.PageName })))` assuming they are named exports. Note: Since they are exported as `export const Landing`, we need `then(module => ({ default: module.Landing }))`.
    4. Wrap the `<Routes>` block in `<React.Suspense fallback={<div className="h-screen flex items-center justify-center">Loading ENCORE...</div>}>`.
  </action>
  <verify>grep "React.lazy" briefly/frontend/src/App.jsx</verify>
  <done>Code splitting implemented to reduce main bundle size.</done>
</task>

<task type="auto">
  <name>Add Dynamic SEO Tags via Helmet</name>
  <files>
    - briefly/frontend/src/pages/Landing.jsx
    - briefly/frontend/src/pages/Login.jsx
  </files>
  <action>
    1. In `Landing.jsx`, import `Helmet` from `react-helmet-async`.
    2. Inside the component, add `<Helmet><title>Dashboard - ENCORE</title></Helmet>` (or dynamically use documentId if present).
    3. In `Login.jsx` and `Register.jsx`, add `<Helmet><title>Login - ENCORE</title></Helmet>`.
  </action>
  <verify>grep "Helmet" briefly/frontend/src/pages/Landing.jsx</verify>
  <done>Dynamic SEO titles working via react-helmet-async.</done>
</task>

## Success Criteria
- [ ] Running `npm run build` shows improved chunk sizes (less than 500kb warning).
- [ ] View Page Source on index.html shows proper SEO tags.
- [ ] Page titles update correctly as you navigate the app.
