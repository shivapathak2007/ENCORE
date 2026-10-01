---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: Export to Markdown & Gamified Quiz UI

## Objective
Implement Markdown Export for documents and add Gamified UI elements to the Quiz View using framer-motion. We will start with Markdown Export since it requires no extra dependencies, and focus on the Quiz gamification.

## Context
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- briefly/frontend/src/components/workspace/SummaryView.jsx
- briefly/frontend/src/components/workspace/QuizView.jsx

## Tasks

<task type="auto">
  <name>Implement Markdown Export in SummaryView</name>
  <files>
    - briefly/frontend/src/components/workspace/SummaryView.jsx
  </files>
  <action>
    Add a "Download MD" button in the header of SummaryView next to the "Generate New Summary" button.
    When clicked, it should take the `tldr`, `key_takeaways`, `core_concepts`, and `conclusion` from the `summary` state and format them into a markdown string.
    Then, create a Blob and trigger a download of `summary.md`.
    Use a nice icon (e.g., `Download`) for the button.
  </action>
  <verify>grep "Download MD" briefly/frontend/src/components/workspace/SummaryView.jsx</verify>
  <done>Button exists and triggers markdown download.</done>
</task>

<task type="auto">
  <name>Add Gamification to QuizView</name>
  <files>
    - briefly/frontend/src/components/workspace/QuizView.jsx
  </files>
  <action>
    Wrap the quiz option buttons in `motion.button` (from framer-motion).
    When an option is clicked, animate it:
    - If correct: flash green with a slight scale-up bounce.
    - If incorrect: shake left-to-right and flash red.
    Add a `motion.div` popup when the quiz is finished showing their final score with a confetti-like bounce animation.
  </action>
  <verify>grep "motion.button" briefly/frontend/src/components/workspace/QuizView.jsx</verify>
  <done>Framer-motion is integrated into quiz interactions.</done>
</task>

## Success Criteria
- [ ] Users can download their summary as a markdown file.
- [ ] Quiz answers give immediate, animated visual feedback.
