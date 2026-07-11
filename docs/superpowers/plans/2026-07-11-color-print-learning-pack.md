# StoryStage Color Print Learning Pack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an eight-section color A4 learning pack to every StoryStage story so families can learn vocabulary, sentence patterns, speaking, memory cards, and parent-led review on paper.

**Architecture:** Extend each story with typed learning-pack content, then render it through one focused printable component selected from the existing print panel. Reuse existing assignments, vocabulary, lines, print error handling, design tokens, and GitHub Pages pipeline.

**Tech Stack:** React 19, TypeScript, CSS print media, Vitest, Testing Library, Vite/GitHub Pages.

## Global Constraints

- Primary medium is color A4 paper and each session lasts 25–30 minutes.
- Every story has 8 target words, 2 sentence patterns, speaking tasks, memory cards, and a parent answer/review sheet.
- The daughter marks vocabulary herself with `我认识`, `有点难`, or `我不会` on paper.
- Role identity always uses color plus name, icon, and border.
- Keep existing full-script and role-specific print modes.
- Existing online rehearsal, challenge, vinext build, and GitHub Pages build must remain operational.

---

### Task 1: Learning-pack domain and six story datasets

**Files:**
- Modify: `app/types.ts`
- Modify: `app/data/stories.ts`
- Modify: `app/lib/session.test.ts`

**Interfaces:**
- Produces: `LearningWord`, `SentencePattern`, `SpeakingChallenge`, `LearningPack`, and required `Story.learningPack`.

- [ ] Write failing tests asserting all six stories have exactly 8 target words, exactly 2 patterns, at least 3 speaking challenges, valid story vocabulary references, examples, grammar tips, and review prompts.
- [ ] Run `npx vitest run app/lib/session.test.ts` and confirm failure because `learningPack` is absent.
- [ ] Add exact types and learning-pack data for all stories. Use existing story vocabulary and lines; include five story-focus words and three rolling-review words where available.
- [ ] Run the focused test and commit `feat: add story learning pack content`.

### Task 2: Eight-section color A4 print experience

**Files:**
- Create: `app/components/LearningPackPrint.tsx`
- Modify: `app/components/PrintScript.tsx`
- Modify: `app/components/experience.test.tsx`
- Modify: `app/globals.css`
- Modify: `README.md`

**Interfaces:**
- Consumes: `story.learningPack`, `Story`, and `RoleAssignment[]`.
- Produces: print mode `learning-pack`, selected by default, and eight `.learning-pack-page` sections.

- [ ] Add failing interaction tests that select the learning pack and assert all eight section headings, daughter-assigned role lines, 8 three-state vocabulary rows, word/sentence cards, parent answer prompts, review schedule, and print action.
- [ ] Run `npx vitest run app/components/experience.test.tsx` and confirm missing learning-pack UI failure.
- [ ] Implement `LearningPackPrint` with mission, warmup, full script, daughter practice, patterns, speaking challenge, cards, and parent coach pages.
- [ ] Extend `PrintScript` to offer `彩色故事学习包`, `完整家庭剧本`, and each person’s highlighted script; default to learning pack.
- [ ] Add A4 page rules, page breaks, light ink-saving colors, status symbols, dotted cut lines, print-only visibility, and page labels.
- [ ] Update README with the new paper workflow.
- [ ] Run `npm test -- --run && npm run lint && npm run build && npm run build:pages`.
- [ ] Commit `feat: add printable family learning packs`, run `scripts/deploy-pages.sh`, and verify public page/assets return HTTP 200.
