# Boutique Legal Product Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the demo into a lighter, editorial, more professional legal product while preserving the existing workflow logic and the shared text-alignment grid.

**Architecture:** Keep the current App Router and component boundaries, but swap the dark glass system for a light editorial token system, simplify the shared shell, tighten copy, and rebalance overview/review hierarchy around reading-first surfaces. Preserve `page-grid`, `grid-cols-subgrid`, and the shared inset rhythm so related text blocks align across sibling surfaces instead of only aligning container edges.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Vitest, Testing Library, lucide-react

---

## File Map

### Shared foundation

- Modify: `app/globals.css`
  - Replace dark glass tokens with light editorial tokens.
  - Preserve `page-grid` and `--tile-inset` as the shared layout invariant.
  - Add calmer motion, stronger focus states, and reusable paper/surface utilities.
- Modify: `app/layout.tsx`
  - Keep metadata and skip-link support aligned with the lighter visual system.
- Modify: `app/(demo)/layout.tsx`
  - Simplify the demo shell, reduce chrome, keep subtle sample-workspace framing, and preserve text alignment across header/content.

### Landing page

- Modify: `app/page.tsx`
  - Replace the bento-heavy hero with a more editorial product introduction and tighter product copy.
- Modify: `app/page.test.tsx`
  - Update expectations for the new CTA text and core marketing copy.

### Matter overview

- Modify: `components/matter/matter-overview-shell.tsx`
  - Keep the current route composition, but rebalance which surfaces are primary vs secondary.
- Modify: `components/matter/matter-header.tsx`
  - Turn the top section into an executive briefing with clearer state narrative.
- Modify: `components/matter/open-issues-strip.tsx`
  - Compress explanatory content and make blocker counts faster to scan.
- Modify: `components/matter/document-status-card.tsx`
  - Strengthen the “continue review” path and simplify the summary panel.
- Modify: `components/matter/activity-feed.tsx`
  - Reduce visual noise while keeping recent movement legible.
- Modify: `components/matter/agent-runs-list.tsx`
  - Tone down chips and helper copy while preserving run status meaning.
- Modify: `components/matter/collaborator-strip.tsx`
  - Simplify collaborator presentation and remove unnecessary decoration.
- Test: `components/matter/matter-overview.test.tsx`
  - Update assertions for shell copy, overview copy, and the primary review CTA.

### Review workspace

- Modify: `components/review/review-workspace.tsx`
  - Preserve workflow logic and state sync, but rebalance layout emphasis.
- Modify: `components/review/review-topbar.tsx`
  - Rewrite the top summary into a calmer, reading-first header.
- Modify: `components/review/document-pane.tsx`
  - Improve document typography, clause scanning, mode controls, and redline readability.
- Modify: `components/review/findings-rail.tsx`
  - Simplify queue controls and reduce explanatory clutter.
- Modify: `components/review/finding-card.tsx`
  - Refine hierarchy inside each finding card.
- Modify: `components/review/suggested-edit-card.tsx`
  - Make current/proposed text and decisions clearer and less noisy.
- Modify: `components/review/clause-outline.tsx`
  - Make the outline more navigational and less visually heavy.
- Modify: `components/review/comments-panel.tsx`
  - Simplify clause comment presentation and spacing.
- Modify: `components/review/activity-panel.tsx`
  - Match the calmer secondary-surface treatment.
- Modify: `components/review/undo-toast.tsx`
  - Ensure success/undo feedback matches the lighter system.
- Test: `components/review/review-workspace.test.tsx`
  - Keep workflow tests passing while updating copy/heading expectations where the UI wording changes.

## Constraints And Invariants

- Do not change the route structure.
- Do not change the seeded workflow story in `lib/demo-data/matter.ts`.
- Do not remove the overview -> review flow or the review queue interactions already covered by tests.
- Preserve the shared grid/subgrid alignment model.
- Preserve the internal text-alignment rhythm: if related surfaces sit on the same composition row, their headings/body copy should align intentionally.
- Prefer reducing repeated labels and helper text over adding new explanatory UI.
- Keep AI visibility explicit, but compress repeated reassurance copy into fewer surfaces.

## Task 1: Rebuild The Landing Page Around Editorial Product Copy

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Test: `app/page.test.tsx`

- [ ] **Step 1: Update the landing-page test to lock the new product framing**

  Add assertions in `app/page.test.tsx` for the new primary CTA and the new headline.

  ```tsx
  expect(
    screen.getByRole("link", { name: /open sample matter/i })
  ).toHaveAttribute("href", "/matters/matter-acme-v-omnicore");

  expect(
    screen.getByRole("heading", {
      name: /contract review, prepared for human judgment/i,
    })
  ).toBeInTheDocument();
  ```

- [ ] **Step 2: Run the focused test and verify it fails**

  Run: `npx vitest run app/page.test.tsx`

  Expected: FAIL because the page still renders the older hero copy and CTA text.

- [ ] **Step 3: Rewrite `app/page.tsx` into an editorial landing page**

  Implement:

  - a stronger hero headline
  - tighter supporting product copy
  - one primary CTA: `Open sample matter`
  - one subtle sample-workspace line
  - a smaller, calmer proof-point section instead of equally weighted tiles

  Keep:

  - the route target `/matters/matter-acme-v-omnicore`
  - the existing legal-review product story

- [ ] **Step 4: Add only the CSS utilities needed for the landing-page layout**

  In `app/globals.css`, add or rename utility classes only when they are reusable. Keep the layout attached to `page-grid` and the shared inset rhythm instead of introducing one-off paddings that break text alignment.

- [ ] **Step 5: Re-run the focused landing-page test**

  Run: `npx vitest run app/page.test.tsx`

  Expected: PASS

- [ ] **Step 6: Commit the landing-page slice**

  ```bash
  git add app/page.tsx app/page.test.tsx app/globals.css
  git commit -m "feat: redesign landing page with editorial product framing"
  ```

## Task 2: Establish The Light Editorial Shell And Alignment-Safe Foundation

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `app/(demo)/layout.tsx`
- Test: `components/matter/matter-overview.test.tsx`

- [ ] **Step 1: Update the demo-shell test for the new subtle framing**

  In `components/matter/matter-overview.test.tsx`, replace the explicit `demo workspace` shell expectation with the lighter shell wording you implement, such as `Sample workspace`, while keeping the route-shell smoke test.

  ```tsx
  expect(screen.getByText(/sample workspace/i)).toBeInTheDocument();
  expect(screen.queryByText(/matter overview/i)).not.toBeInTheDocument();
  ```

- [ ] **Step 2: Run the focused matter-overview test file and verify it fails**

  Run: `npx vitest run components/matter/matter-overview.test.tsx`

  Expected: FAIL because the shell still renders the old copy and dark header treatment.

- [ ] **Step 3: Replace the dark glass tokens with a light editorial token system**

  In `app/globals.css`:

  - define warm paper backgrounds, ink text, restrained bronze accents, and accessible semantic tones
  - remove or neutralize blur-heavy glass utilities
  - add calmer surface utilities for primary, secondary, and elevated panels
  - preserve `page-grid`, `grid-cols-subgrid`, and `--tile-inset`
  - keep focus-visible styling explicit and stronger than it is today

- [ ] **Step 4: Simplify the shared shell without losing structural alignment**

  In `app/layout.tsx` and `app/(demo)/layout.tsx`:

  - keep the skip link
  - lighten the shell framing
  - reduce nav/badge clutter
  - keep the header and page content locked to the same text rhythm using the shared inset token
  - preserve view-transition support

- [ ] **Step 5: Re-run the focused matter-overview tests**

  Run: `npx vitest run components/matter/matter-overview.test.tsx`

  Expected: PASS

- [ ] **Step 6: Commit the shell and token foundation**

  ```bash
  git add app/globals.css app/layout.tsx 'app/(demo)/layout.tsx' components/matter/matter-overview.test.tsx
  git commit -m "feat: establish light editorial shell and design tokens"
  ```

## Task 3: Simplify The Matter Overview Into An Executive Briefing

**Files:**
- Modify: `components/matter/matter-overview-shell.tsx`
- Modify: `components/matter/matter-header.tsx`
- Modify: `components/matter/open-issues-strip.tsx`
- Modify: `components/matter/document-status-card.tsx`
- Modify: `components/matter/activity-feed.tsx`
- Modify: `components/matter/agent-runs-list.tsx`
- Modify: `components/matter/collaborator-strip.tsx`
- Test: `components/matter/matter-overview.test.tsx`

- [ ] **Step 1: Expand the overview tests to cover the new copy hierarchy**

  Keep the existing route assertions, then update the human-facing copy expectations to the new wording.

  Example targets:

  ```tsx
  expect(
    screen.getByRole("link", { name: /continue review/i })
  ).toHaveAttribute("href", "/matters/matter-acme-v-omnicore/review");

  expect(
    screen.getByText(/the matter is in active clause review/i)
  ).toBeInTheDocument();
  ```

- [ ] **Step 2: Run the overview tests and verify they fail**

  Run: `npx vitest run components/matter/matter-overview.test.tsx`

  Expected: FAIL because the old header/body/CTA copy is still present.

- [ ] **Step 3: Refactor the top-of-page hierarchy first**

  In `components/matter/matter-header.tsx`, `components/matter/open-issues-strip.tsx`, and `components/matter/document-status-card.tsx`:

  - make the matter identity and state narrative primary
  - compress issue explanations
  - make the review CTA more direct
  - reduce badge count and helper-copy repetition

- [ ] **Step 4: Tone down supporting operational surfaces**

  In `components/matter/activity-feed.tsx`, `components/matter/agent-runs-list.tsx`, and `components/matter/collaborator-strip.tsx`:

  - simplify section headers
  - reduce repeated chips
  - trim explanatory copy to the minimum useful amount
  - ensure text columns still align with the main summary surfaces

- [ ] **Step 5: Re-run the overview tests**

  Run: `npx vitest run components/matter/matter-overview.test.tsx`

  Expected: PASS

- [ ] **Step 6: Commit the overview redesign**

  ```bash
  git add components/matter/matter-overview-shell.tsx components/matter/matter-header.tsx components/matter/open-issues-strip.tsx components/matter/document-status-card.tsx components/matter/activity-feed.tsx components/matter/agent-runs-list.tsx components/matter/collaborator-strip.tsx components/matter/matter-overview.test.tsx
  git commit -m "feat: redesign matter overview as executive briefing"
  ```

## Task 4: Reframe The Review Workspace Around Reading And Decision-Making

**Files:**
- Modify: `components/review/review-workspace.tsx`
- Modify: `components/review/review-topbar.tsx`
- Modify: `components/review/document-pane.tsx`
- Modify: `components/review/findings-rail.tsx`
- Modify: `components/review/finding-card.tsx`
- Modify: `components/review/suggested-edit-card.tsx`
- Modify: `components/review/clause-outline.tsx`
- Modify: `components/review/comments-panel.tsx`
- Modify: `components/review/activity-panel.tsx`
- Modify: `components/review/undo-toast.tsx`
- Test: `components/review/review-workspace.test.tsx`

- [ ] **Step 1: Update the review-workspace tests only where wording will intentionally change**

  Preserve the interaction tests for:

  - selecting findings
  - clause/document synchronization
  - accept/reject/follow-up state changes
  - inline redline mode
  - comment persistence

  Update only the expectations that target changed copy or headings.

  Example:

  ```tsx
  expect(
    screen.getByRole("heading", { name: /vendor msa v3/i })
  ).toBeInTheDocument();

  expect(
    screen.getByRole("heading", { name: /review queue/i })
  ).toBeInTheDocument();
  ```

- [ ] **Step 2: Run the review-workspace test file and verify failures**

  Run: `npx vitest run components/review/review-workspace.test.tsx`

  Expected: FAIL once the new assertions are in place and before the UI is updated.

- [ ] **Step 3: Redesign the topbar and document pane first**

  In `components/review/review-topbar.tsx` and `components/review/document-pane.tsx`:

  - make the document reading surface visually primary
  - reduce repeated AI explanation copy
  - improve heading rhythm and body readability
  - make view-mode controls cleaner and easier to scan
  - keep active, preview, and selected clause states legible beyond color alone

- [ ] **Step 4: Simplify the queue and suggested-edit surfaces**

  In `components/review/findings-rail.tsx`, `components/review/finding-card.tsx`, and `components/review/suggested-edit-card.tsx`:

  - simplify filter styling
  - make the queue cards calmer and more hierarchical
  - compress citation/rationale presentation
  - make current/proposed text easier to compare
  - keep the primary decision buttons obvious and touch-friendly

- [ ] **Step 5: Lighten the secondary review surfaces**

  In `components/review/clause-outline.tsx`, `components/review/comments-panel.tsx`, `components/review/activity-panel.tsx`, and `components/review/undo-toast.tsx`:

  - reduce panel heaviness
  - simplify labels and spacing
  - keep review actions and feedback clear
  - maintain the existing workflow state behavior

- [ ] **Step 6: Re-run the review-workspace tests**

  Run: `npx vitest run components/review/review-workspace.test.tsx`

  Expected: PASS

- [ ] **Step 7: Commit the review-workspace redesign**

  ```bash
  git add components/review/review-workspace.tsx components/review/review-topbar.tsx components/review/document-pane.tsx components/review/findings-rail.tsx components/review/finding-card.tsx components/review/suggested-edit-card.tsx components/review/clause-outline.tsx components/review/comments-panel.tsx components/review/activity-panel.tsx components/review/undo-toast.tsx components/review/review-workspace.test.tsx
  git commit -m "feat: redesign review workspace around reading and decisions"
  ```

## Task 5: Responsive, Accessibility, And Final Product Polish Verification

**Files:**
- Modify as needed: `app/globals.css`
- Modify as needed: `app/page.tsx`
- Modify as needed: `app/(demo)/layout.tsx`
- Modify as needed: `components/matter/*.tsx`
- Modify as needed: `components/review/*.tsx`
- Test: `app/page.test.tsx`
- Test: `components/matter/matter-overview.test.tsx`
- Test: `components/review/review-workspace.test.tsx`

- [ ] **Step 1: Do a keyboard and semantics pass before tweaking visuals further**

  Verify:

  - headings still form a clear outline
  - buttons/links keep accessible names
  - focus rings are visible on all interactive elements
  - status meaning is not color-only

  Update tests if a semantic label intentionally changes.

- [ ] **Step 2: Do a breakpoint pass with the alignment invariant in mind**

  Check mobile, tablet, and desktop manually with `pnpm dev`.

  Verify:

  - no sibling surfaces drift out of text alignment
  - sticky behavior does not create cramped layouts
  - the document remains the focus on smaller screens
  - action buttons remain comfortably tappable

- [ ] **Step 3: Run the full automated suite**

  Run: `pnpm test`

  Expected: PASS

- [ ] **Step 4: Run lint and production build verification**

  Run: `pnpm lint`

  Expected: PASS

  Run: `pnpm build`

  Expected: PASS

- [ ] **Step 5: Capture any last copy or spacing cleanup needed from the verification pass**

  Limit this step to polish fixes surfaced by the checks above. Do not add new features.

- [ ] **Step 6: Commit the final polish pass**

  ```bash
  git add app/globals.css app/page.tsx 'app/(demo)/layout.tsx' components/matter components/review app/page.test.tsx components/matter/matter-overview.test.tsx components/review/review-workspace.test.tsx
  git commit -m "feat: complete boutique legal product polish pass"
  ```

## Verification Checklist

- [ ] Landing page reads like a premium product, not a design exercise
- [ ] Shared shell is lighter, calmer, and still aligned to the grid
- [ ] Matter overview feels like an executive briefing
- [ ] Review workspace is reading-first and less cluttered
- [ ] AI workflow remains visible but less repetitive
- [ ] Text alignment is preserved across related surfaces
- [ ] Mobile/tablet layouts remain intentional and readable
- [ ] `pnpm test` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm build` passes

## Notes For Execution

- Keep commits small and in the order above so regressions are easier to isolate.
- If a visual idea requires breaking the shared inset/text rhythm, reject the idea and solve it another way.
- Reuse existing workflow state and test coverage instead of rewriting logic unnecessarily.
- Prefer tightening or deleting copy over adding new helper text.
