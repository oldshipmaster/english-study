# StoryStage Family English Roleplay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a warm storybook-style website where 2–3 family members can assign roles, rehearse six elementary English stories, complete a short challenge, and print shared or role-specific scripts.

**Architecture:** Use the Sites vinext starter as a client-rendered single-page experience. Keep typed story content in a dedicated data module, pure session/printing logic in a domain module, and UI state in a focused page component composed from feature components. Persist only the latest local preferences in `localStorage`; use print-specific CSS rather than a separate server route.

**Tech Stack:** TypeScript, React, vinext/Vite, CSS, Vitest, React Testing Library, Sites hosting.

## Global Constraints

- Audience is a 9–11-year-old child with elementary English ability.
- Participation is always 2 or 3 people; in 2-person mode one parent may play supporting roles.
- Include exactly 6 launch stories: 2 family, 2 school, and 2 fantasy stories, each designed for 8–12 minutes.
- The core experience must work without accounts, cloud data, speech APIs, or network-backed content.
- Store no child names or personal information.
- Use the selected warm storybook direction: cream background, honey yellow, mint green, coral pink, and ink-blue text.
- Printing must support a complete family script and a role-specific script, with black-and-white-safe labels and clean page breaks.
- Do not make speech playback or recognition a core dependency.

---

## File Map

- `app/layout.tsx`: site metadata and social preview metadata.
- `app/page.tsx`: top-level experience state and step routing.
- `app/globals.css`: visual system, responsive layout, motion preferences, and print rules.
- `app/types.ts`: story, role, line, challenge, assignment, and preference types.
- `app/data/stories.ts`: all six launch stories and their learning content.
- `app/lib/session.ts`: pure assignment, persistence-safe parsing, and print-selection helpers.
- `app/components/StoryLibrary.tsx`: filters and story selection cards.
- `app/components/RoleAssignment.tsx`: 2/3-person selection and valid role mapping.
- `app/components/ScriptPlayer.tsx`: rehearsal/performance presentation and line navigation.
- `app/components/ChallengePanel.tsx`: three-question completion flow.
- `app/components/PrintScript.tsx`: complete and role-specific printable markup.
- `app/lib/session.test.ts`: pure domain tests.
- `app/components/experience.test.tsx`: user-flow and accessibility tests.
- `.gitignore`: ignores `.superpowers/` brainstorming artifacts.

### Task 1: Project foundation and typed story catalog

**Files:**
- Create: `app/types.ts`
- Create: `app/data/stories.ts`
- Create: `app/lib/session.test.ts`
- Create: `app/lib/session.ts`
- Modify: `app/layout.tsx`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `Story`, `StoryRole`, `ScriptLine`, `ChallengeQuestion`, `RoleAssignment`, `PlayerCount`, and `stories: Story[]`.
- Produces: `assignRoles(story: Story, playerCount: PlayerCount): RoleAssignment[]` and `parsePreferences(raw: string | null): LocalPreferences | null`.

- [ ] **Step 1: Initialize the Sites starter**

Run the plugin initializer once against `/Users/xingsui/projects/english-book`, retain installation until complete, start `npm run dev`, and open the exact Local URL once in Codex.

- [ ] **Step 2: Add tests for deterministic assignments and safe preference parsing**

Create `app/lib/session.test.ts` with assertions that a three-role story assigns one role per person for `3`, assigns at least one supporting role to the parent for `2`, rejects malformed stored JSON, and accepts `{ storyId, playerCount, showHints }` only when types are valid.

Run: `npm test -- --run app/lib/session.test.ts`

Expected: FAIL because `assignRoles` and `parsePreferences` do not exist.

- [ ] **Step 3: Define the domain model and minimal pure logic**

Use these exact core shapes:

```ts
export type PlayerCount = 2 | 3;
export type StoryCategory = "family" | "school" | "fantasy";
export type StoryRole = { id: string; name: string; emoji: string; childFriendly: boolean };
export type ScriptLine = { roleId: string; english: string; chinese: string; vocabulary?: string[]; stageDirection?: string };
export type ChallengeQuestion = { prompt: string; options: string[]; answerIndex: number; encouragement: string };
export type Story = {
  id: string; title: string; chineseTitle: string; category: StoryCategory;
  minutes: number; level: "Elementary"; vocabulary: Record<string, string>;
  roles: StoryRole[]; lines: ScriptLine[]; challenges: ChallengeQuestion[];
};
export type RoleAssignment = { personId: "daughter" | "parent1" | "parent2"; roleIds: string[] };
export type LocalPreferences = { storyId: string; playerCount: PlayerCount; showHints: boolean };
```

Implement assignment so the daughter receives the first `childFriendly` role, parent 1 receives the next role, and player 3 receives the third role; in two-player mode, parent 1 receives all unassigned roles.

- [ ] **Step 4: Add all six complete stories**

Create 18–24 short lines per story, three roles, exactly three challenge questions, and a vocabulary map of 8–12 elementary terms. Ensure each story has a beginning, problem, collaborative resolution, and one reusable family expression.

- [ ] **Step 5: Run tests and commit the foundation**

Run: `npm test -- --run app/lib/session.test.ts && npm run build`

Expected: all session tests PASS and the deployment build exits 0.

Commit: `feat: add typed family story catalog`

### Task 2: Story library and role assignment flow

**Files:**
- Create: `app/components/StoryLibrary.tsx`
- Create: `app/components/RoleAssignment.tsx`
- Create: `app/components/experience.test.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `stories`, `Story`, `PlayerCount`, `RoleAssignment`, `assignRoles`.
- Produces: `StoryLibrary({ stories, onSelect })` and `RoleAssignmentView({ story, onBack, onStart })`.

- [ ] **Step 1: Write failing flow tests**

Test that the page shows six story cards, category filters reduce visible cards, selecting “The Moonlight Picnic” opens role assignment, only 2 and 3 are available, and choosing 2 produces a valid start action with all three role IDs covered.

Run: `npm test -- --run app/components/experience.test.tsx`

Expected: FAIL because the product components are absent.

- [ ] **Step 2: Implement the library first viewport**

Build a compact header, storybook hero, category chips, and six content-rich cards. Cards must show title, Chinese title, minutes, “Elementary”, vocabulary count, and “2–3 players”. Use real launch copy: “今晚，把英语故事演出来。” and “选一个故事，全家一起开口说英语。”

- [ ] **Step 3: Implement role assignment**

Render 2/3-person segmented controls and person cards for daughter, parent 1, and optional parent 2. Use deterministic default assignments and allow role swaps without ever leaving a role uncovered. In 2-person mode, explicitly label the parent's second role as “兼演”.

- [ ] **Step 4: Apply the selected visual system**

Define CSS custom properties for cream, honey, mint, coral, and ink; use storybook serif headings, readable sans-serif body copy, 44px minimum touch targets, visible focus rings, outlined paper cards, and responsive single/two/three-column layouts. Disable nonessential transitions inside `@media (prefers-reduced-motion: reduce)`.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- --run app/components/experience.test.tsx && npm run build`

Expected: flow tests PASS and build exits 0.

Commit: `feat: add story selection and family roles`

### Task 3: Rehearsal, performance, and challenge experience

**Files:**
- Create: `app/components/ScriptPlayer.tsx`
- Create: `app/components/ChallengePanel.tsx`
- Modify: `app/components/experience.test.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: selected `Story`, `RoleAssignment[]`, and `showHints` preference.
- Produces: `ScriptPlayer({ story, assignments, mode, onComplete, onExit })` and `ChallengePanel({ questions, onRestart, onChooseStory })`.

- [ ] **Step 1: Extend tests for line navigation and challenge completion**

Assert that the current speaker, English line, progress, hidden Chinese hint, hint toggle, next/previous buttons, rehearsal/performance toggle, keyboard ArrowLeft/ArrowRight behavior, and three challenge answers work. Assert controls have accessible names and focusable buttons.

Run: `npm test -- --run app/components/experience.test.tsx`

Expected: FAIL on the missing player behavior.

- [ ] **Step 2: Implement `ScriptPlayer`**

Keep `lineIndex`, `mode`, and `showHints` as local state. Derive the speaker's assigned person from `assignments`. Prevent navigation outside valid bounds. Register keyboard navigation in an effect with cleanup. On the last line, label the primary action “完成故事” and call `onComplete`.

- [ ] **Step 3: Implement `ChallengePanel`**

Show one question at a time, lock the answer after selection, display the story's encouragement, and advance until all three are complete. The completion panel offers “再演一次” and “选择新故事” without rankings or scores.

- [ ] **Step 4: Persist minimal local preferences safely**

Store only `{ storyId, playerCount, showHints }` under `storystage.preferences`. Catch storage read/write errors. Restore story and role defaults after refresh, but restart the script at line one.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- --run app/components/experience.test.tsx && npm run build`

Expected: all experience tests PASS and build exits 0.

Commit: `feat: add family rehearsal and story challenge`

### Task 4: Print views, final metadata, and release validation

**Files:**
- Create: `app/components/PrintScript.tsx`
- Modify: `app/components/experience.test.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Delete: `app/_sites-preview/**`

**Interfaces:**
- Consumes: selected `Story`, `RoleAssignment[]`, and optional selected person ID.
- Produces: complete and role-specific printable script markup; screen actions call `window.print()`.

- [ ] **Step 1: Add failing print-structure tests**

Assert that “完整家庭剧本” contains every script line, a daughter-specific print choice emphasizes only her role while retaining preceding cue text, print buttons have clear labels, and every printable scene/line block has a stable print class.

Run: `npm test -- --run app/components/experience.test.tsx`

Expected: FAIL because print markup is absent.

- [ ] **Step 2: Implement print selection and markup**

Add a print panel available after role assignment. Let users choose complete script or a person's script. For role-specific output, render all lines as contextual cues but apply `is-focus-line` only to the selected person's role IDs. Include story title, cast, vocabulary, page footer, and scene-safe wrappers.

- [ ] **Step 3: Add robust print CSS**

Inside `@media print`, remove navigation and interactive controls, force white backgrounds and black text, preserve role names and emoji/text labels, use `break-inside: avoid` on line blocks, apply page margins with `@page`, and avoid color-only distinctions.

- [ ] **Step 4: Finish product metadata and remove starter artifacts**

Set title to `StoryStage | 家庭英语剧场` and description to `适合 9–11 岁孩子的家庭英语角色扮演故事，支持 2–3 人排练与打印。`. Remove starter preview imports, temporary metadata, unused skeleton dependency, and starter icons if present.

- [ ] **Step 5: Create and validate one bespoke social card**

Generate one landscape social card after the finished visual direction is stable. It must use the cream, honey, mint, coral, and ink palette; show `StoryStage 家庭英语剧场`; and visually echo the paper-card motif. Inspect text, save a passing result as `public/og.png`, and wire absolute-host Open Graph/X metadata. If text remains unusable after one retry, omit `og:image`.

- [ ] **Step 6: Run full verification**

Run: `npm test -- --run && npm run build`

Expected: all tests PASS and the production build exits 0.

Verify the build output contains no starter title, `codex-preview`, or `_sites-preview` import:

```bash
rg -n "codex-preview|_sites-preview|vinext starter" app || true
```

Expected: no matches.

- [ ] **Step 7: Commit and publish**

Commit: `feat: finish printable StoryStage experience`

Use the Sites hosting workflow, return the deployed URL, and stop the retained development server only after hosting finishes.
