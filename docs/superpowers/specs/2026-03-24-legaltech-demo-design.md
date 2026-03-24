# Legaltech Frontend Demo Design

## Goal

Build a small, high-signal Next.js demo that shows the ability to design and implement a trustworthy, data-rich frontend workflow for legal work without building the entire product.

The demo should prove:

- strong frontend product taste
- comfort with dense, workflow-heavy UI
- ability to design reviewable AI-assisted interactions
- familiarity with document-centric professional software
- ability to ship a convincing vertical slice quickly

## Constraints

- timeframe: 2-3 days
- framework: Next.js with TypeScript
- styling: Tailwind CSS
- component acceleration: shadcn/ui for primitives only
- data: mocked local data only
- backend: none
- database: none
- deployment: Vercel

## Hiring-Signal Mapping

This concept is intentionally shaped around the role requirements and follow-up screening notes:

- complex UI and workflow: coordinated matter overview and review workspace
- data-rich UX: findings, citations, statuses, collaborators, and activity in one coherent interface
- rapid shipping in a high-feedback environment: mocked local data, focused scope, deployable quickly
- document-centric product design: the main interaction centers on reviewing a contract
- collaboration-aware frontend: comments, reviewer states, and activity history
- legaltech and AI familiarity: agent outputs are visible, reviewable, cited, and reversible

## Product Concept

The demo is not "legal AI chat."

The demo is a frontend surface for lawyers to inspect, verify, and act on AI-assisted contract review safely.

It is intentionally narrow: one matter, one contract, one realistic review flow.

## Scope

The product has two screens.

### 1. Matter Overview

A lightweight operational entry point for a single legal matter.

Purpose:

- show information architecture and workflow organization
- demonstrate product taste on a dense but calm screen
- provide context before entering the document workflow

Content:

- matter title, client, counterparty, and stage
- primary contract card with review status
- open issues summary
- recent agent runs with status
- collaborators and reviewer states
- short activity feed
- call to action to open the review workspace

### 2. Contract Review Workspace

The primary demo screen and the core proof of skill.

Purpose:

- show a document-centric workflow
- demonstrate trust-building UI for AI-assisted output
- coordinate state across multiple surfaces

Layout:

- top bar with breadcrumb, document title, version, and review status
- left outline or mini navigation for contract sections
- center document pane with readable legal text and clause highlights
- right rail with findings, citations, rationale, and suggested edits
- comments or activity surface tied to the current clause

## Primary User Path

The demo should present one clear, believable story:

1. open the matter overview
2. scan matter health, collaborators, and pending review items
3. enter the contract review workspace
4. select a flagged indemnity clause
5. inspect citation and reasoning for the finding
6. compare current wording to suggested wording
7. accept one suggestion
8. reject one suggestion
9. leave a comment requesting partner input
10. return to the overview and observe updated counts and activity

This path is short enough for a live walkthrough and rich enough to demonstrate product thinking.

## Core States To Show

The app does not need many states, but the chosen states should feel intentional:

- default review state
- selected clause state
- finding linked to highlighted document region
- accepted suggestion state
- rejected suggestion state
- unresolved comment state
- agent output marked as needing human review
- prior agent run shown as superseded

These states matter because the role is about making workflows and agent actions visible and easy to reason about.

## UX Principles

The interface should be shaped by these product decisions:

### Trust Before Automation

AI output is not the hero. Reviewability is.

Each finding should show:

- severity
- linked clause
- citation or evidence
- concise rationale
- explicit review action

### Clarity Under Density

The UI should feel information-dense but calm.

That means:

- obvious visual hierarchy
- restrained use of color
- strong spacing and grouping
- clear distinction between document content and control surfaces

### Reversible Action Model

Users should feel in control. Actions should be explicit and reflected across the interface:

- accept
- reject
- needs follow-up
- comment

### Bounded Realism

The demo should feel like part of a real product without pretending to be a full production system.

Deliberately excluded:

- real upload flow
- real DOCX parsing
- real AI requests
- real authentication
- real multiplayer sync
- full editing engine

## Visual Direction

Avoid generic AI SaaS styling.

Desired feel:

- serious and professional
- editorial and document-friendly
- polished but restrained
- modern product UI without looking like a stock admin dashboard

Suggested direction:

- warm paper-toned neutrals for document surfaces
- dark ink or navy for structure and primary text
- amber for cautionary findings
- green for accepted changes
- muted rose for rejected or risky language
- refined typography pairing: readable serif or editorial face for the contract pane, clean sans-serif for interface chrome

Motion should be light and purposeful:

- clause highlight transitions
- selection transitions in the findings rail
- subtle activity updates

## Technical Approach

Use a small but intentional structure:

```text
app/
  (demo)/
    page.tsx
    matters/[id]/review/page.tsx
components/
  matter/
  review/
  ui/
lib/
  demo-data/
hooks/
```

Guidance:

- use App Router
- use TypeScript types for matter, clause, finding, comment, and activity entities
- keep seed data in local files
- manage interaction state locally
- prefer simple derived state over adding a full global store
- if workflow transitions grow, use a focused reducer for review actions

## shadcn/ui Usage

Use shadcn/ui to move quickly on primitives, not to define the product's identity.

Good candidates:

- sheet
- tabs
- tooltip
- dialog
- avatar
- badge
- separator
- scroll-area
- button primitives

The information architecture, page composition, and review-specific components should be custom.

## What Success Looks Like

A successful demo should make a reviewer think:

- this person can design dense professional software
- this person understands review workflows, not just screens
- this person can translate AI capability into trustworthy user interaction
- this person knows how to scope a realistic 0-to-1 product slice

## Interview Narrative

When presenting the demo, frame it around product reasoning:

- The goal was to demonstrate trust-oriented legal workflow UI, not to simulate a full backend.
- The scope was intentionally limited to one believable vertical slice.
- The overview screen shows information architecture and operational context.
- The review workspace shows synchronized state across document, findings, comments, and activity.
- Mocked data was a deliberate choice to prioritize frontend workflow quality and product judgment.

## Risks And Mitigations

### Risk: Looks too generic

Mitigation:

- make the document pane central
- use legal-language examples
- design review-specific components instead of generic cards everywhere

### Risk: Looks too shallow

Mitigation:

- include linked findings, clause highlights, comments, and activity updates
- ensure actions propagate visibly across surfaces

### Risk: Scope creep

Mitigation:

- keep to one matter, one contract, 3-5 findings, and one primary walkthrough
- avoid infrastructure work that does not improve the demo story

## Final Recommendation

Build the balanced two-screen version:

- a matter overview page
- a contract review workspace page

Make the review workspace the hero and keep the overview page intentionally light.

This is the strongest fit for the role because it demonstrates product taste, workflow design, and legaltech relevance without overbuilding.
