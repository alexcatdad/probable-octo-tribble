# Matter Demo

A polished legaltech demo for reviewing a matter, inspecting the review workspace, and showing how human decisions stay visible and reversible.

## Quick Start

```bash
pnpm install
pnpm dev
```

## Verification

```bash
pnpm lint
pnpm test
pnpm build
```

## Production Preview

```bash
pnpm preview
```

`pnpm preview` builds first, then starts the production server. The equivalent manual sequence is `pnpm build && pnpm start`.

Open the root route at `/` first, then click into the overview and review workspace.

## Deployment

Deploy to Vercel from the repository root.

- Build command: `pnpm build`
- Output is the standard Next.js production build
- No environment variables are required

## Notes

- The demo data is mocked intentionally.
- The overview and review routes are seeded so interviewers can explore the workflow without any backend setup.
