# Demo Script

## 30-Second Intro

This demo is a focused legaltech workspace for reviewing a matter end to end. It starts with a clean overview of the matter, then moves into a clause-by-clause review surface where machine suggestions, reviewer comments, and audit history stay connected. The main idea is to make review fast without hiding why a decision was made.

## Walkthrough

1. Start on `/` and open the demo.
2. On the matter overview, point out the current status, the review summary, and the active collaborators.
3. Open the review workspace at `/matters/matter-acme-v-omnicore/review`.
4. Walk through the left-to-right layout:
   - document and clause navigation
   - review queue and suggested edits
   - comments and activity tied to the selected clause
5. Make one or two actions to show the interaction model, then call out that the state is mocked so the demo is safe to explore and easy to reset.

## Review Workspace Talking Points

- Trust: reviewers can see the machine output, the human decision, and the history around each clause in one place.
- Clarity: the layout keeps the document, findings, and discussion separate enough to scan quickly, but still linked together.
- Reversible actions: accept, reject, or defer actions are explicit, so nothing feels like a hidden one-way commit.
- Traceability: the activity feed and decision summaries make it easy to explain why the current state exists.

## Interview Talking Points

- If the JD emphasizes ownership, describe how the demo keeps the workflow coherent from landing page to final review state.
- If the JD emphasizes product judgment, explain why the UI favors a compact, review-first layout instead of a general-purpose document editor.
- If the JD emphasizes collaboration, point to the comment thread and activity history as the shared context between reviewers and agents.
- If the JD emphasizes reliability, note that the app uses seeded data and deterministic interaction states so the experience is predictable in interviews and easy to test.
