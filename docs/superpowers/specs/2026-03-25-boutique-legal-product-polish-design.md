# Boutique Legal Product Polish Design

## Goal

Polish the existing Next.js legal review demo end-to-end so it reads like a credible, high-end product rather than a prototype with decorative chrome.

The redesign should improve:

- professional look and brand credibility
- readability of dense contract-review content
- accessibility of typography, contrast, focus, and navigation
- responsiveness across mobile, tablet, and desktop
- interaction quality, including page transitions and action clarity
- copy quality, concision, and product realism
- reduction of visual clutter without hiding the AI workflow

## Approved Direction

The chosen direction is:

- tone: boutique legal product
- palette: light editorial
- product framing: real product feel with subtle demo framing
- clutter strategy: moderate-to-strong reduction of nonessential chrome

This means the app should feel calm, premium, and reading-first.

It should no longer feel like a dark glassmorphism showcase or a feature-heavy AI dashboard.

## Product Intent

The demo is not meant to sell generic "AI magic."

It is meant to show how a legal team can safely review AI-assisted contract analysis in a polished, trustworthy workflow.

The interface should communicate:

- editorial seriousness
- strong product judgment
- careful handling of dense information
- visible but disciplined AI assistance
- believable operational flow from matter overview into contract review

## Problems To Solve

The current product already has a solid workflow foundation, but the polish pass should address these issues:

### 1. Visual Clutter

Too many badges, helper labels, glass panels, and repeated explanatory blocks compete for attention.

Result:

- weak focal hierarchy
- noisy scanning experience
- less premium overall impression

### 2. Over-Explained AI Reassurance

The product repeatedly explains that AI outputs are visible, cited, and reversible.

Result:

- copy fatigue
- repetitive surfaces
- less confidence in the writing

### 3. Heavy Visual Treatment

The dark glassmorphism direction feels more like a design study than a professional legal product.

Result:

- reduced readability
- lower information calmness
- weaker editorial character

### 4. Uneven Density Management

The product contains the right information, but too many elements are treated as equally important.

Result:

- overview and review surfaces feel busier than necessary
- supporting context competes with primary tasks

### 5. Responsiveness And Accessibility Need Intentional Rework

Sticky panels, dense chips, small uppercase labels, and compressed layouts need a more deliberate mobile and accessibility pass.

Result:

- reduced readability at smaller sizes
- weaker keyboard and focus experience
- lower confidence in the product quality

## Experience Principles

The entire polish pass should follow these principles:

### Reading First

The document and the decision workflow should lead.

Supporting metadata, collaborator states, and AI context should remain available, but they should not dominate the page.

### Calm Over Clever

Use restraint instead of decorative intensity.

The app should feel composed, premium, and legible rather than visually busy.

### AI Visible, Not Loud

AI support should be explicit and trustworthy, but compressed into fewer, better surfaces.

Do not hide the workflow. Do not repeat the same reassurance copy across the entire app.

### Professional Copy

Every piece of product writing should sound exact, useful, and product-real.

Avoid filler phrases, repeated conceptual disclaimers, and language that makes the product sound like a prototype annotation.

### One Primary Focus Per Region

Every major surface should have an obvious purpose:

- overview: matter state and next actions
- review: read, assess, decide
- supporting rails: navigate, clarify, and act

If multiple things fight for attention, simplify.

## Visual Direction

### Overall Feel

The new visual language should feel like a boutique legal platform with editorial refinement.

Desired qualities:

- warm, light, paper-informed surfaces
- dark ink structure and strong body contrast
- subtle bronze or parchment-toned accents
- premium but restrained composition
- less card noise and fewer ornamental effects

### Color System

Shift away from dark glass surfaces into a lighter, editorial palette.

Suggested structure:

- background: warm off-white or paper neutral
- primary surface: soft ivory or white
- secondary surface: slightly tinted parchment neutral
- primary text: dark ink, charcoal, or muted navy
- muted text: warm gray with strong readability
- accent: restrained bronze, tobacco, or muted gold
- caution: warm amber
- success: muted green
- destructive/reject: controlled rose or oxblood tint
- borders: subtle warm neutral separators rather than frosted-glass edges

The palette should maintain contrast and professional seriousness.

### Typography

Typography should do much more of the visual work.

Recommended structure:

- display/editorial serif for major titles and contract-focused headings
- refined sans-serif for interface chrome, metadata, actions, and navigation

Typography goals:

- larger, calmer heading rhythm
- more readable body copy
- less dependence on tiny uppercase labels
- stronger distinction between document content and interface controls

The contract text should feel intentionally set, not simply placed in a container.

### Surfaces And Decoration

Reduce or remove:

- heavy blur effects
- layered glass treatment
- excessive pill badges
- unnecessary border emphasis
- repeated shadow treatments

Prefer:

- paper-like panels
- subtle tonal separation
- careful whitespace
- sharper hierarchy through type and spacing
- occasional premium accent moments instead of constant visual effects

## Information Architecture

The app should preserve the existing core flow:

1. landing page
2. matter overview
3. review workspace

The structure is right. The polish pass should improve composition and clarity, not rebuild the product concept from scratch.

## Screen-Level Design

### 1. Landing Page

The landing page should shift from a bento-style capability layout toward a more editorial product introduction.

#### Purpose

- establish credibility
- explain the product in clearer, more mature language
- provide a believable entry into the live matter

#### Direction

- stronger headline and narrative framing
- tighter supporting copy
- less "feature tile" emphasis
- more elegant visual pacing
- subtle demo framing rather than obvious prototype labelling

#### Keep

- a direct path into the live matter
- a concise explanation of the core workflow
- a short set of capabilities or product benefits

#### Change

- reduce the number of competing badges and tile treatments
- use fewer but stronger supporting surfaces
- improve hierarchy between headline, product summary, and proof points
- rewrite copy to sound more like product marketing and less like a design exercise

### 2. Shared App Shell

The shell should become quieter and more premium.

#### Direction

- simplify the header treatment
- reduce visual clutter in nav and status chips
- align spacing and horizontal rhythm across screens
- make transitions between overview and review feel intentional

#### Transitions

Use modern, restrained transitions:

- page-level view transitions where supported
- subtle enter and exit choreography
- hover and focus motion that supports clarity
- no decorative motion that distracts from reading

Transitions should help users understand continuity between screens, especially when entering the review workspace.

### 3. Matter Overview

The matter overview should feel like an executive briefing surface.

#### Primary Job

Tell the user:

- what matter this is
- what state it is in
- what needs attention now
- what changed recently

#### Layout Strategy

Organize the screen into three layers:

1. matter identity and current state
2. action-relevant summary
3. supporting operational context

#### Content Priorities

Highest priority:

- matter title and counterparties
- stage and state narrative
- unresolved review load
- document status and path into the review workspace

Secondary:

- recent activity
- collaborator state
- agent runs

#### Change Goals

- reduce the sense of panel sprawl
- merge or compress lower-value metadata
- use stronger narrative copy for the matter status
- make the call to continue review more visually obvious

### 4. Review Workspace

The review workspace is the core product surface and should become more reading-led and less panel-led.

#### Primary Job

Help a reviewer read, evaluate, and act on AI-assisted findings with confidence.

#### Hierarchy

Primary:

- document text
- selected clause context
- selected finding and suggested action

Secondary:

- outline navigation
- queue filters
- comments and activity

#### Layout Strategy

The document should visually lead.

The clause outline should feel lighter and more navigational.

The findings rail should remain accessible, but with reduced chrome and less persistent explanatory copy.

Comments and activity should support the current clause without crowding the main reading path.

#### Density Strategy

Be moderately aggressive:

- trim repeated helper text
- reduce badge count
- simplify filter styling
- compress supporting metadata
- keep strong affordances around actions and current selection

#### Document Pane

The contract pane should feel editorial and highly readable.

Goals:

- improved line length and line height
- more polished heading treatment
- clearer active clause and preview states
- redline and AI suggestion modes that are easier to scan
- stronger differentiation between document content and annotations

#### Findings Rail

The findings queue should be more disciplined.

Goals:

- cleaner cards
- clearer prioritization of title, severity, clause reference, and state
- less visual competition among chips, borders, and helper labels
- more obvious next action flow

#### Suggested Edit Surface

Suggested edits and decisions should feel deliberate, calm, and trustworthy.

Goals:

- cleaner accept/reject/follow-up actions
- stronger information ordering
- shorter rationale copy
- easier scanning of before/after language

## Copy Direction

The rewritten copy should feel:

- exact
- quiet
- mature
- product-real

### Copy Rules

- remove repetitive reassurance language
- avoid filler descriptors like "AI-assisted" in every section
- replace generic labels with clearer product terms
- prefer short explanatory sentences over stacked helper blurbs
- keep demo framing subtle and infrequent

### Examples Of What To Improve

- repeated statements that findings are visible, cited, and reversible
- excessive status chip wording
- long explanatory paragraphs in top-level surfaces
- labels that say what the layout already makes obvious

## Accessibility Requirements

Accessibility is part of the redesign, not a final check.

The polish pass should include:

- strong color contrast across the new light palette
- visible keyboard focus states on all interactive controls
- improved semantic heading structure
- less reliance on tiny uppercase labels for important meaning
- clearer selected, previewed, and active states beyond color alone
- touch-friendly controls on smaller viewports
- better skip-link continuity and landmark clarity

Where visual refinement conflicts with readability, choose readability.

## Responsiveness Requirements

The app should feel intentional on all major breakpoints.

### Mobile

- stack content in a clear reading order
- reduce persistent side-by-side compression
- keep the most important status and actions near the top
- ensure review flow remains understandable without desktop rails

### Tablet

- maintain strong primary/secondary hierarchy
- use sticky behavior only when genuinely helpful
- avoid cramped multi-column compositions

### Desktop

- use wider layouts to support reading comfort, not just add more surfaces
- preserve clear focal hierarchy
- keep overview and review screens spacious rather than crowded

## Technical Direction

The implementation should be a coordinated polish pass across existing files rather than a full rebuild.

High-level areas:

- `app/globals.css`
- shared layouts in `app/layout.tsx` and `app/(demo)/layout.tsx`
- landing page in `app/page.tsx`
- matter overview components in `components/matter/*`
- review workspace components in `components/review/*`
- supporting UI primitives where needed

The work should prioritize:

- token cleanup
- typography improvements
- spacing system consistency
- state styling clarity
- reduced repeated copy
- transition polish

## Success Criteria

The finished product should make a reviewer think:

- this feels like a serious legal workflow product
- the reading experience is clearer and calmer
- the AI workflow is understandable without being overexposed
- the interface is more accessible and more mature
- the demo looks intentional on mobile and desktop

## Non-Goals

This polish pass should not try to:

- add backend functionality
- invent new product modules
- expand the workflow beyond the current demo scope
- bury AI visibility so deeply that the product story weakens
- introduce flashy motion or novelty UI for its own sake

## Recommended Implementation Shape

The implementation should proceed in a few coordinated layers:

1. establish the new editorial visual system and tokens
2. redesign the landing page copy and composition
3. simplify the shared shell and transition behavior
4. refactor the matter overview hierarchy and copy
5. refactor the review workspace hierarchy, document surface, and queue styling
6. validate accessibility, responsiveness, and content density across screens

## Definition Of Done

The redesign is complete when:

- the app consistently uses the new light editorial visual system
- the landing page, overview, and review flow feel like one coherent product
- clutter has been meaningfully reduced
- copy is shorter, more professional, and less repetitive
- responsive behavior has been intentionally refined
- focus states, contrast, and interaction clarity meet a strong accessibility bar
- transitions feel modern and supportive rather than decorative
