import { readFileSync } from "node:fs";
import { join } from "node:path";

it("ignores nested git worktrees in repository tooling", () => {
  const vitestConfig = readFileSync(
    join(process.cwd(), "vitest.config.ts"),
    "utf8",
  );
  const gitignore = readFileSync(join(process.cwd(), ".gitignore"), "utf8");
  const biomeConfig = JSON.parse(
    readFileSync(join(process.cwd(), "biome.json"), "utf8"),
  );

  expect(vitestConfig).toContain("**/.worktrees/**");
  expect(gitignore).toContain(".worktrees/");
  expect(biomeConfig.vcs.useIgnoreFile).toBe(true);
});
