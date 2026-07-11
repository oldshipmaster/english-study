# StoryStage GitHub Pages Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish StoryStage as a publicly accessible static site at `https://oldshipmaster.github.io/english-study/#top` while preserving the existing vinext/Sites build.

**Architecture:** Extract the client product into one reusable `StoryStageApp` component consumed by both the vinext page and a dedicated Vite static entry. Build the static entry with base path `/english-study/`, then publish only `pages-dist` to the `gh-pages` branch of a public `oldshipmaster/english-study` repository.

**Tech Stack:** React 19, TypeScript, Vite, vinext, Vitest, GitHub CLI, GitHub Pages.

## Global Constraints

- Final public URL is `https://oldshipmaster.github.io/english-study/#top`.
- Static assets must use the `/english-study/` base path.
- Reuse the existing components, story data, logic, tests, and CSS; do not duplicate product implementation.
- Keep the existing vinext/Sites build operational.
- The static build must not depend on server APIs, `next/headers`, accounts, cloud storage, or runtime secrets.
- Repository `oldshipmaster/english-study` must be public and must not overwrite unrelated existing content.
- GitHub Pages source is the root of branch `gh-pages` with HTTPS enforced.
- The static page title is `StoryStage | 家庭英语剧场`.
- The static page description is `适合 9–11 岁孩子的家庭英语角色扮演故事，支持 2–3 人排练与打印。`.
- The static share image URL is `https://oldshipmaster.github.io/english-study/og.png`.

---

### Task 1: Reusable app and GitHub Pages static build

**Files:**
- Create: `app/StoryStageApp.tsx`
- Create: `static-site/index.html`
- Create: `static-site/src/main.tsx`
- Create: `vite.pages.config.ts`
- Create: `tests/static-pages.test.ts`
- Modify: `app/page.tsx`
- Modify: `package.json`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `StoryStageApp(): JSX.Element`, the single client product entry used by both builds.
- Produces: `npm run build:pages`, writing a complete static deployment to `pages-dist/`.

- [ ] **Step 1: Add failing static-build source tests**

Create `tests/static-pages.test.ts` to assert that `vite.pages.config.ts` contains `base: "/english-study/"`, the static HTML contains the exact title/description/share URL and `id="root"`, `static-site/src/main.tsx` imports `StoryStageApp`, and `app/page.tsx` renders the same component.

Run: `npx vitest run tests/static-pages.test.ts`

Expected: FAIL because the static entry and pages config do not exist.

- [ ] **Step 2: Extract the reusable client application**

Move the current `app/page.tsx` client state and rendering into `app/StoryStageApp.tsx` without changing product behavior. Replace `app/page.tsx` with:

```tsx
import { StoryStageApp } from "./StoryStageApp";

export default function Home() {
  return <StoryStageApp />;
}
```

Ensure the top-level product container has `id="top"`.

- [ ] **Step 3: Add the static Vite entry**

Create `static-site/src/main.tsx`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { StoryStageApp } from "../../app/StoryStageApp";
import "../../app/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode><StoryStageApp /></React.StrictMode>,
);
```

Create `static-site/index.html` with the exact title, description, theme color, absolute Open Graph/Twitter share image URL, a root div, and `<script type="module" src="/src/main.tsx"></script>`.

- [ ] **Step 4: Add Pages build configuration**

Create `vite.pages.config.ts` with `root: "static-site"`, `base: "/english-study/"`, React plugin, and `build.outDir: "../pages-dist"`. Add `"build:pages": "vite build --config vite.pages.config.ts"` to `package.json`. Add `/pages-dist/` to `.gitignore`.

- [ ] **Step 5: Verify static output contract**

Run: `npx vitest run tests/static-pages.test.ts && npm run build:pages`

Expected: tests PASS and Vite writes `pages-dist/index.html` plus hashed assets.

Run:

```bash
rg -n '/english-study/assets/' pages-dist/index.html
test -f pages-dist/og.png
touch pages-dist/.nojekyll
```

Expected: base-prefixed asset matches, social image exists, and `.nojekyll` is created.

- [ ] **Step 6: Run all local release gates and commit**

Run: `npm test -- --run && npm run lint && npm run build && npm run build:pages`

Expected: all tests PASS; lint, vinext build, and static build exit 0.

Commit: `feat: add GitHub Pages build`

### Task 2: Public repository, Pages publication, and live verification

**Files:**
- Modify: `README.md`
- Create in generated output: `pages-dist/.nojekyll`

**Interfaces:**
- Consumes: validated `pages-dist/` from Task 1 and current `main` commit.
- Produces: public GitHub repository `oldshipmaster/english-study`, source branch `main`, deployment branch `gh-pages`, and live Pages URL.

- [ ] **Step 1: Verify repository name safety**

Run: `gh repo view oldshipmaster/english-study --json name,url,visibility,defaultBranchRef`

Expected when absent: GitHub reports the repository does not exist. If it exists, inspect its branches and latest commits; stop rather than overwrite unrelated content.

- [ ] **Step 2: Document local and Pages workflows**

Update `README.md` with the public URL, source location `/Volumes/extfastdata01/english-study`, `npm run dev`, `npm test -- --run`, `npm run build`, `npm run build:pages`, and the rule that textbook repositories may guide difficulty but copyrighted text is not copied.

Run: `npm test -- --run && npm run build:pages`

Expected: tests PASS and static build exits 0.

Commit: `docs: add GitHub Pages workflow`

- [ ] **Step 3: Create and push the public source repository**

If the repository is absent, run:

```bash
gh repo create oldshipmaster/english-study --public --source=. --remote=origin --push
```

If it exists and is confirmed as this project, set or reuse `origin` and push `main` normally. Never force-push.

- [ ] **Step 4: Publish the static output**

Rebuild from the pushed `main` commit, create `pages-dist/.nojekyll`, and publish the directory contents to `gh-pages` using a temporary Git worktree or orphan deployment checkout. Commit message: `deploy: publish StoryStage GitHub Pages`. Push without force when creating the branch; for later deployments use `--force-with-lease` only against the known prior deployment head.

- [ ] **Step 5: Configure GitHub Pages**

Use the GitHub API to configure Pages with branch `gh-pages` and root path `/`. If Pages already exists for this repository, update only when its source differs. Confirm HTTPS enforcement.

- [ ] **Step 6: Verify the public deployment**

Poll GitHub Pages build status until `built` or failure. Then run:

```bash
curl -fsSI https://oldshipmaster.github.io/english-study/
curl -fsSI https://oldshipmaster.github.io/english-study/assets/<actual-built-js-file>
curl -fsSI https://oldshipmaster.github.io/english-study/og.png
```

Expected: HTTP 200 for the page, JavaScript, and share image without authentication.

Open `https://oldshipmaster.github.io/english-study/#top` in the in-app browser. Confirm the visible page contains the StoryStage title and six story cards; do not perform broader browser QA unless explicitly requested.

- [ ] **Step 7: Final verification**

Run: `git status --short --branch && npm test -- --run && npm run build:pages`

Expected: clean `main`, all tests PASS, and static build exits 0.
