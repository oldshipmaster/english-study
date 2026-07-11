# Task 4 report: print views, metadata, and release validation

## Status

Complete. Implemented complete and role-specific printable scripts, print-safe styling, final metadata, starter cleanup, and one validated social card. Per controller instruction, I did not deploy, browser-test, or stop/touch the retained development server.

## RED / GREEN evidence

### RED

Command:

```text
npm test -- --run app/components/experience.test.tsx
```

Result: exit 1. Vitest could not resolve `./PrintScript` because the production component did not yet exist. This established the missing print feature before implementation.

### GREEN

Focused command after implementing `PrintScript` and its player entry point:

```text
npm test -- --run app/components/experience.test.tsx
```

First implementation run: exit 1, 12 passed / 3 failed. The print sheet was always mounted inside `ScriptPlayer`, causing existing single-line queries to find both stage and print copies. I corrected the behavior by making the print panel explicitly expandable from the post-assignment player view.

Focused command after correction:

```text
npm test -- --run app/components/experience.test.tsx
```

Result: exit 0, 1 file passed, 15 tests passed. Coverage proves:

- the complete script retains all 18 lines in three stable `.print-scene` wrappers and 18 `.print-line` blocks;
- daughter-specific printing retains every cue line and applies `.is-focus-line` only to her assigned roles;
- complete and role-specific controls have distinct accessible labels and invoke `window.print()`.

## Implementation summary

- Added an expandable print panel after role assignment/rehearsal starts.
- Added complete-family and per-person variants while retaining all contextual lines.
- Included title, Chinese title, cast/assignment mapping, scene wrappers, bilingual lines, vocabulary, and footer.
- Added print CSS with `@page` margins, white/black output, hidden interactive UI, scene/line break protection, retained role/emoji labels, and non-color focus indicators (star, heavy border, bold underline).
- Set the exact requested title and description, changed document language to `zh-CN`, and added Open Graph/X card metadata with an absolute metadata host.
- Removed `_sites-preview`, its obsolete node test/script, `react-loading-skeleton`, old starter package naming, and starter SVG icons.

## Social-card validation

- Used exactly one image-generation pass after print UI styling and site copy were stable.
- Saved the passing asset as `public/og.png` and normalized it to 1200×630.
- Inspected the final saved file at original detail: headline reads exactly `StoryStage 家庭英语剧场`; all Latin and Chinese text is legible; no extra generated copy or watermark is present.
- Visual inspection confirms the requested cream, honey, mint, coral, and ink palette and layered paper-card motif.
- `file public/og.png` reports: `PNG image data, 1200 x 630, 8-bit/color RGB, non-interlaced`.
- Wired `og.png` for both Open Graph and X/Twitter metadata.

## Final verification

Focused print suite:

```text
npm test -- --run app/components/experience.test.tsx
```

Result: exit 0; 15/15 tests passed.

Final release gate (fresh run after all package/starter cleanup):

```text
npm run lint && npm test -- --run && npm run build
```

Result: exit 0.

- ESLint: exit 0, no findings.
- Vitest: 2 files passed, 19/19 tests passed.
- Vinext production build: exit 0; all five build stages completed. It emitted the existing informational route-classification note and a proxy-environment warning, but no build error.

Starter-content check:

```text
rg -n "codex-preview|_sites-preview|vinext starter|site-creator-vinext-starter|react-loading-skeleton" app package.json package-lock.json public tests 2>/dev/null || true
```

Result: no matches.

Diff hygiene:

```text
git diff --check
```

Result: exit 0, no whitespace errors.

Built-metadata check confirmed the requested title/description and `/og.png` references in `dist/server/index.js`; the built public-file manifest includes `/og.png`.

## Files changed

- Added `app/components/PrintScript.tsx`
- Added `public/og.png`
- Modified `app/components/ScriptPlayer.tsx`
- Modified `app/components/experience.test.tsx`
- Modified `app/globals.css`
- Modified `app/layout.tsx`
- Modified `package.json`
- Modified `package-lock.json`
- Deleted `app/_sites-preview/SkeletonPreview.tsx`
- Deleted `app/_sites-preview/preview.css`
- Deleted `public/favicon.svg`
- Deleted `public/file.svg`
- Deleted `public/globe.svg`
- Deleted `public/window.svg`
- Deleted `tests/rendered-html.test.mjs`

## Self-review

- Confirmed every role-specific view retains all lines, not only the selected actor's lines.
- Confirmed focus styling is semantic in markup and distinguishable in monochrome print.
- Confirmed print-only rules hide screen navigation/actions and do not depend on color.
- Confirmed the print sheet is not mounted until requested, avoiding duplicate screen-reader/test content during normal rehearsal.
- Confirmed metadata values match the brief exactly and all deleted dependencies/artifacts have no remaining references.
- Confirmed no unrelated files or retained-server state were changed.

## Concerns

- `metadataBase` currently uses `https://storystage.pages.dev` to ensure absolute Open Graph/X image URLs before a final hosting URL exists. The publishing controller should replace it if Sites assigns a different canonical production host.
- `npm install` reports 14 pre-existing audit findings (1 low, 7 moderate, 6 high). No audit remediation was attempted because it would expand scope and could introduce breaking dependency changes.
- No browser or print-preview inspection was performed because the controller explicitly prohibited browser testing; automated DOM, CSS, asset, lint, and production-build evidence is green.

## Final whole-branch review fix wave (2026-07-11)

### Implementation details

- Challenge answers now compare the chosen option with `answerIndex`, announce correct/incorrect feedback through a `status` region, and retain the story-specific encouragement.
- Performance mode now has a per-line temporary help control that reveals Chinese, current vocabulary, and pronunciation without writing rehearsal hint preferences. It hides on request and line navigation.
- The named script stage supports pointer/touch horizontal swipes with a 60px threshold, rejects predominantly vertical gestures, and clamps at the first/last line.
- Print CSS adds a paged-media bottom-center `counter(page)` footer while preserving monochrome focus treatment, protected page breaks, and the approved all-lines role-specific print sequence.
- Local preferences now persist anonymous role mappings. Restoration accepts them only when people match the selected cast size, every current story role appears exactly once, and per-person role counts fit 2- or 3-player mode; otherwise it uses safe default assignments.
- Added optional line pronunciation guidance and one elementary pronunciation/stress example to each of the six stories. Help appears in rehearsal/performance assistance and printable lines only when present.
- Printing now catches missing or throwing `window.print()` and exposes concise browser-menu instructions in an alert.
- Removed the assumed `storystage.pages.dev` origin and host-dependent social image metadata while retaining title, description, and non-host-dependent social metadata.
- Replaced the starter README and removed the unused auth helper, D1 API/example, database helpers/schema, Drizzle config/script, and Drizzle packages. Retained `build/sites-vite-plugin.ts` because `vite.config.ts` actively uses it to package `.openai/hosting.json` for Sites builds.

### RED / GREEN evidence

Initial focused RED:

```text
npm test -- --run app/lib/session.test.ts app/components/experience.test.tsx
```

Exit 1: 2 files failed; 7 failed / 19 passed; one expected uncaught print error. Failures identified missing temporary performance hint, swipe region/behavior, pronunciation help, print fallback, challenge status feedback, and assignment restoration.

First implementation run: exit 1; 1 failed / 25 passed. The only failure was the old local-storage snapshot expecting no `assignments`; the implementation correctly persisted the new anonymous mapping, so the contract assertion was updated.

Focused GREEN:

```text
npm test -- --run app/lib/session.test.ts app/components/experience.test.tsx
```

Exit 0: 2 files passed; 26/26 tests passed.

### Final verification

```text
npm test -- --run
```

Exit 0: 2 files passed; 26/26 tests passed.

```text
npm run lint
```

Exit 0: ESLint completed with no findings.

```text
npm run build
```

Exit 0: vinext completed all 5/5 build stages. It emitted the existing proxy-environment warning and informational unknown-route classification, with no build error.

`git diff --check` also exited 0 with no whitespace errors before commit.

### Files changed in final fix wave

- `README.md`
- `app/components/ChallengePanel.tsx`
- `app/components/PrintScript.tsx`
- `app/components/ScriptPlayer.tsx`
- `app/components/experience.test.tsx`
- `app/data/stories.ts`
- `app/globals.css`
- `app/layout.tsx`
- `app/lib/session.test.ts`
- `app/lib/session.ts`
- `app/page.tsx`
- `app/types.ts`
- `package.json`
- `package-lock.json`
- Deleted `app/chatgpt-auth.ts`
- Deleted `db/index.ts`
- Deleted `db/schema.ts`
- Deleted `drizzle.config.ts`
- Deleted `examples/d1/app/api/notes/route.ts`
- Deleted `examples/d1/db/schema.ts`

### Final concerns

- Browser and print-preview inspection were intentionally not performed per controller instruction; swipe and print behavior are covered by DOM tests and production build verification.
- The generated `public/og.png` remains available, but host-dependent OG/X image metadata is intentionally omitted until the publishing controller can provide the real deployed origin.
- `npm install --package-lock-only` reports 11 audit findings (2 low, 3 moderate, 6 high). No broad audit remediation was attempted because that could introduce out-of-scope dependency changes.
