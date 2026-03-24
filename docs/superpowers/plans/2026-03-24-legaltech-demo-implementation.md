# Legaltech Frontend Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a polished two-screen Next.js legaltech demo that showcases a matter overview and a contract review workspace with mocked data, trust-oriented AI review controls, and collaboration-style UI states.

**Architecture:** Start from a minimal Next.js App Router app with Tailwind, shadcn/ui primitives, and typed mocked data. Keep the domain model and review workflow logic isolated from the page components so both screens can reuse the same source of truth and interaction state without introducing unnecessary backend or global-store complexity.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Vitest, React Testing Library, Vercel

---

## Implementation Notes

- The repository currently contains only docs and Git metadata at commit `e310351`.
- Build for `npm` unless the user explicitly prefers `pnpm` or `bun`.
- Keep the app intentionally narrow: one matter, one contract, 3-5 findings, one believable walkthrough.
- During implementation, use `@superpowers/test-driven-development` before changing behavior, `@frontend-design` for visual decisions, and `@superpowers/verification-before-completion` before claiming the demo is done.

## Planned File Structure

### Root configuration

- Create: `package.json`
- Create: `package-lock.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `components.json`
- Modify: `.gitignore`

### App shell and routes

- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `app/page.tsx`
- Create: `app/(demo)/layout.tsx`
- Create: `app/(demo)/matters/[id]/page.tsx`
- Create: `app/(demo)/matters/[id]/review/page.tsx`

### Shared utilities and domain state

- Create: `lib/utils.ts`
- Create: `lib/types/legal-demo.ts`
- Create: `lib/demo-data/matter.ts`
- Create: `lib/demo-data/document.ts`
- Create: `lib/demo-data/activity.ts`
- Create: `lib/review-state.ts`
- Create: `hooks/use-review-demo-state.ts`

### Matter overview components

- Create: `components/matter/matter-header.tsx`
- Create: `components/matter/document-status-card.tsx`
- Create: `components/matter/open-issues-strip.tsx`
- Create: `components/matter/agent-runs-list.tsx`
- Create: `components/matter/collaborator-strip.tsx`
- Create: `components/matter/activity-feed.tsx`

### Review workspace components

- Create: `components/review/review-workspace.tsx`
- Create: `components/review/review-topbar.tsx`
- Create: `components/review/clause-outline.tsx`
- Create: `components/review/document-pane.tsx`
- Create: `components/review/findings-rail.tsx`
- Create: `components/review/finding-card.tsx`
- Create: `components/review/suggested-edit-card.tsx`
- Create: `components/review/comments-panel.tsx`
- Create: `components/review/activity-panel.tsx`

### Testing and docs

- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `app/page.test.tsx`
- Create: `lib/review-state.test.ts`
- Create: `components/matter/matter-overview.test.tsx`
- Create: `components/review/review-workspace.test.tsx`
- Create: `README.md`
- Create: `docs/demo-script.md`

## Task 1: Scaffold the Next.js app and shared tooling

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `components.json`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Create: `lib/utils.ts`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Modify: `.gitignore`
- Test: `app/page.test.tsx`

- [ ] **Step 1: Write the initial failing smoke test for the root route**

```tsx
import { render, screen } from "@testing-library/react";
import HomePage from "./page";

it("renders a link into the demo workspace", () => {
  render(<HomePage />);
  expect(screen.getByRole("link", { name: /open demo/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify the repo is not scaffolded yet**

Run: `npm test -- app/page.test.tsx`
Expected: fail because the Next.js app and test tooling do not exist yet

- [ ] **Step 3: Scaffold a minimal Next.js App Router project into the repo**

Recommended approach:

```bash
mkdir -p ../probable-octo-tribble-scaffold
npx create-next-app@latest ../probable-octo-tribble-scaffold --ts --tailwind --eslint --app --use-npm --import-alias "@/*"
rsync -a --exclude=".git" --exclude="README.md" ../probable-octo-tribble-scaffold/ ./
rm -rf ../probable-octo-tribble-scaffold
```

Then restore the repo-specific docs if the scaffold overwrote any files.

- [ ] **Step 4: Install and initialize the UI/testing dependencies**

Run:

```bash
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
npx shadcn@latest init -d
npx shadcn@latest add button card badge avatar scroll-area separator tabs sheet tooltip
```

- [ ] **Step 5: Configure the root app shell and demo entry page**

Minimum requirements:
- `app/layout.tsx` loads base fonts and metadata
- `app/page.tsx` provides a small landing page with an `Open demo` link to the matter overview route
- `app/globals.css` establishes the visual tokens for a serious legaltech look instead of default Tailwind gray
- `.gitignore` includes `.next/`, `node_modules/`, coverage artifacts, and keeps the existing `.superpowers/` rule

- [ ] **Step 6: Add Vitest wiring and make the smoke test pass**

Run:

```bash
npm test -- app/page.test.tsx
```

Expected: pass with one green test

- [ ] **Step 7: Commit the scaffold checkpoint**

```bash
git add package.json package-lock.json next.config.ts tsconfig.json postcss.config.mjs eslint.config.mjs components.json app lib vitest.config.ts vitest.setup.ts .gitignore
git commit -m "chore: scaffold Next.js legaltech demo"
```

## Task 2: Model the legal demo domain and review state

**Files:**
- Create: `lib/types/legal-demo.ts`
- Create: `lib/demo-data/matter.ts`
- Create: `lib/demo-data/document.ts`
- Create: `lib/demo-data/activity.ts`
- Create: `lib/review-state.ts`
- Test: `lib/review-state.test.ts`

- [ ] **Step 1: Write failing tests for the review state transitions**

Cover:
- default selected clause and finding
- accepting a finding updates reviewed counts
- rejecting a finding stores status and reason
- adding a comment appends activity and unresolved comment counts

Example test shape:

```ts
it("marks a finding as accepted and updates summary counts", () => {
  const nextState = reviewReducer(seedState, {
    type: "accept_finding",
    findingId: "finding-indemnity-1",
  });

  expect(nextState.findings["finding-indemnity-1"].decision).toBe("accepted");
  expect(nextState.summary.reviewedCount).toBe(1);
});
```

- [ ] **Step 2: Run the reducer tests and confirm they fail**

Run: `npm test -- lib/review-state.test.ts`
Expected: fail because the types, seed data, and reducer do not exist yet

- [ ] **Step 3: Create the typed demo entities**

Define explicit types for:
- matter
- collaborator
- contract section
- clause
- finding
- suggested edit
- comment
- activity event
- review summary

Keep these in `lib/types/legal-demo.ts` and prefer discriminated unions for finding decisions and agent run statuses.

- [ ] **Step 4: Add believable mocked legal data**

Seed one matter with:
- one `Vendor MSA v3` contract
- 4 findings across different clauses
- 2 collaborators plus one reviewer waiting state
- one superseded agent run
- one unresolved comment
- enough activity items to make the overview feel alive

- [ ] **Step 5: Implement the review reducer and selectors**

The reducer should support:
- `select_clause`
- `select_finding`
- `accept_finding`
- `reject_finding`
- `mark_needs_follow_up`
- `add_comment`

Keep the implementation simple and deterministic so it remains easy to test.

- [ ] **Step 6: Run the reducer tests and make them pass**

Run: `npm test -- lib/review-state.test.ts`
Expected: pass with all reducer transition tests green

- [ ] **Step 7: Commit the domain model checkpoint**

```bash
git add lib/types/legal-demo.ts lib/demo-data/matter.ts lib/demo-data/document.ts lib/demo-data/activity.ts lib/review-state.ts lib/review-state.test.ts
git commit -m "feat: add mocked legal review domain state"
```

## Task 3: Build the matter overview route and components

**Files:**
- Create: `app/(demo)/layout.tsx`
- Create: `app/(demo)/matters/[id]/page.tsx`
- Create: `components/matter/matter-header.tsx`
- Create: `components/matter/document-status-card.tsx`
- Create: `components/matter/open-issues-strip.tsx`
- Create: `components/matter/agent-runs-list.tsx`
- Create: `components/matter/collaborator-strip.tsx`
- Create: `components/matter/activity-feed.tsx`
- Test: `components/matter/matter-overview.test.tsx`

- [ ] **Step 1: Write a failing overview rendering test**

Cover:
- matter title is visible
- the primary document card is visible
- the review workspace CTA links to `/matters/matter-acme-v-omnicore/review`
- activity feed shows at least one recent event

- [ ] **Step 2: Run the overview test and verify it fails**

Run: `npm test -- components/matter/matter-overview.test.tsx`
Expected: fail because the overview route and components do not exist yet

- [ ] **Step 3: Build the overview route with a calm, dense layout**

The route should include:
- a strong matter header with stage and timestamps
- a primary contract card with review progress
- a concise strip for flagged clauses, unresolved comments, and pending decisions
- a recent agent run list with statuses such as `completed`, `needs review`, and `superseded`
- collaborator avatars with status badges
- a short activity feed

- [ ] **Step 4: Keep the visual language intentional**

Implementation notes:
- avoid generic dashboard card sprawl
- use restrained panel borders and warm surface tones
- keep the document card and CTA visually dominant
- make the screen responsive down to tablet width without losing information hierarchy

- [ ] **Step 5: Run the overview test and make it pass**

Run: `npm test -- components/matter/matter-overview.test.tsx`
Expected: pass with the overview assertions green

- [ ] **Step 6: Manually verify the route in the browser**

Run: `npm run dev`
Check:
- `/` loads the landing link
- `/matters/matter-acme-v-omnicore` loads the overview cleanly
- overview content feels readable and not template-like on desktop width

- [ ] **Step 7: Commit the overview checkpoint**

```bash
git add app/(demo)/layout.tsx app/(demo)/matters/[id]/page.tsx components/matter
git commit -m "feat: add matter overview demo route"
```

## Task 4: Build the contract review workspace and synchronized interactions

**Files:**
- Create: `app/(demo)/matters/[id]/review/page.tsx`
- Create: `hooks/use-review-demo-state.ts`
- Create: `components/review/review-workspace.tsx`
- Create: `components/review/review-topbar.tsx`
- Create: `components/review/clause-outline.tsx`
- Create: `components/review/document-pane.tsx`
- Create: `components/review/findings-rail.tsx`
- Create: `components/review/finding-card.tsx`
- Create: `components/review/suggested-edit-card.tsx`
- Create: `components/review/comments-panel.tsx`
- Create: `components/review/activity-panel.tsx`
- Test: `components/review/review-workspace.test.tsx`

- [ ] **Step 1: Write failing interaction tests for the review workspace**

Cover:
- clicking a finding selects the corresponding clause
- accepting a suggestion updates the reviewed count
- rejecting a suggestion reveals rejected state in the rail
- adding a comment updates the activity panel

Example test shape:

```tsx
await user.click(screen.getByRole("button", { name: /broad indemnity/i }));
await user.click(screen.getByRole("button", { name: /accept suggestion/i }));

expect(screen.getByText(/1 of 4 findings reviewed/i)).toBeInTheDocument();
```

- [ ] **Step 2: Run the workspace tests and verify they fail**

Run: `npm test -- components/review/review-workspace.test.tsx`
Expected: fail because the workspace does not exist yet

- [ ] **Step 3: Build the client-side review state hook**

`hooks/use-review-demo-state.ts` should:
- initialize from the typed seed data
- expose selected clause and selected finding
- wrap reducer actions in focused helper callbacks
- return derived counts for the top bar and overview refresh path

- [ ] **Step 4: Build the review layout and linked surfaces**

Required layout pieces:
- top bar with breadcrumb, title, version, and review progress
- left outline of clauses and sections
- center document pane with visible clause highlights
- right rail of findings with severity, rationale, and citations
- selected finding detail showing current text and proposed text
- comments/activity panel for the active clause

- [ ] **Step 5: Implement trust-oriented interaction details**

Required behavior:
- finding selection visibly updates the document highlight
- citations are rendered as anchored metadata, even if mocked
- accept/reject/follow-up actions are explicit and visually distinct
- comments use believable legal-review language
- one agent run remains labeled as `needs human review`

- [ ] **Step 6: Run the workspace tests and make them pass**

Run: `npm test -- components/review/review-workspace.test.tsx`
Expected: pass with all interaction assertions green

- [ ] **Step 7: Manually verify the full demo story**

Run: `npm run dev`
Walk through:
1. open the overview
2. enter the review workspace
3. select the indemnity finding
4. accept one suggestion
5. reject one suggestion
6. add a comment requesting partner input

Expected: all related counts and UI states update immediately without page reload

- [ ] **Step 8: Commit the workspace checkpoint**

```bash
git add app/(demo)/matters/[id]/review/page.tsx hooks/use-review-demo-state.ts components/review
git commit -m "feat: add legal contract review workspace"
```

## Task 5: Apply product polish, responsiveness, and visual identity

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Modify: `components/matter/document-status-card.tsx`
- Modify: `components/matter/open-issues-strip.tsx`
- Modify: `components/matter/agent-runs-list.tsx`
- Modify: `components/review/review-workspace.tsx`
- Modify: `components/review/document-pane.tsx`
- Modify: `components/review/findings-rail.tsx`
- Modify: `components/review/suggested-edit-card.tsx`
- Modify: `components/review/comments-panel.tsx`

- [ ] **Step 1: Capture a quick visual polish checklist before editing**

Checklist:
- the app does not feel like a stock admin dashboard
- the document pane has a distinct editorial reading surface
- severity and decision states are legible without being loud
- important actions feel obvious
- mobile and tablet layouts stay usable

- [ ] **Step 2: Refine typography, color tokens, and spacing**

Implementation targets:
- use a more editorial face or tone for the document text
- keep UI chrome in a clean sans-serif
- add warm document surfaces and restrained semantic accents
- reduce any visual noise introduced by default shadcn styles

- [ ] **Step 3: Add subtle motion only where it helps comprehension**

Good candidates:
- active clause highlight transitions
- rail selection transitions
- small status-change feedback after accept/reject actions

Avoid decorative animation that slows the reading workflow.

- [ ] **Step 4: Verify responsive behavior manually**

Run: `npm run dev`
Check widths:
- desktop around 1440px
- laptop around 1200px
- tablet around 768px

Expected:
- overview remains readable
- review workspace collapses secondary panels gracefully
- no controls become unreachable

- [ ] **Step 5: Re-run the test suite to catch regressions**

Run: `npm test`
Expected: all tests still pass

- [ ] **Step 6: Commit the polish checkpoint**

```bash
git add app/layout.tsx app/globals.css components/matter components/review
git commit -m "style: polish legaltech demo UI"
```

## Task 6: Add demo documentation and run final verification

**Files:**
- Create: `README.md`
- Create: `docs/demo-script.md`
- Modify: `package.json`

- [ ] **Step 1: Write a concise README for local setup and deployment**

Include:
- install command
- local dev command
- test command
- build command
- short project description
- note that data is mocked intentionally

- [ ] **Step 2: Write the live demo script**

`docs/demo-script.md` should cover:
- 30-second intro framing
- overview walkthrough
- review workspace walkthrough
- the design rationale behind trust, clarity, and reversible actions
- likely interview talking points tied back to the JD

- [ ] **Step 3: Run the full verification sequence**

Run:

```bash
npm run lint
npm test
npm run build
```

Expected:
- lint exits 0
- tests exit 0
- build exits 0

- [ ] **Step 4: Smoke-test the production build locally**

Run:

```bash
npm run start
```

Check:
- overview route loads
- review route loads
- mocked interactions still work in the production build

- [ ] **Step 5: Prepare Vercel deployment**

Checklist:
- confirm no environment variables are required
- confirm `npm run build` is the detected build command
- confirm the root route is a clean entry point for reviewers

- [ ] **Step 6: Commit the documentation and verification checkpoint**

```bash
git add README.md docs/demo-script.md package.json
git commit -m "docs: add demo walkthrough and verification notes"
```

## Final Acceptance Checklist

- [ ] Root route gives a clean way into the demo
- [ ] Matter overview feels curated, dense, and readable
- [ ] Review workspace demonstrates linked document, findings, and comments
- [ ] Accept/reject/comment actions update state coherently
- [ ] Visual design feels intentional rather than template-driven
- [ ] Test suite passes
- [ ] Production build passes
- [ ] App is ready to deploy to Vercel
