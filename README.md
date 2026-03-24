# Matter Demo

A polished legaltech demo for reviewing a matter, inspecting the review workspace, and showing how human decisions stay visible and reversible.

## Quick Start

```bash
npm install
npm run dev
```

## Verification

```bash
npm run lint
npm test
npm run build
```

## Production Preview

```bash
npm run start
```

Open the root route at `/` first, then click into the overview and review workspace.

## Deployment

Deploy to Vercel from the repository root.

- Build command: `npm run build`
- Output is the standard Next.js production build
- No environment variables are required

## Notes

- The demo data is mocked intentionally.
- The overview and review routes are seeded so interviewers can explore the workflow without any backend setup.
