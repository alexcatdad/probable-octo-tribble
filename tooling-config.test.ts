import { readFileSync } from "node:fs";
import { join } from "node:path";

it("ignores nested git worktrees in repository tooling", () => {
  const vitestConfig = readFileSync(
    join(process.cwd(), "vitest.config.ts"),
    "utf8"
  );
  const eslintConfig = readFileSync(
    join(process.cwd(), "eslint.config.mjs"),
    "utf8"
  );

  expect(vitestConfig).toContain("**/.worktrees/**");
  expect(eslintConfig).toContain(".worktrees/**");
});
