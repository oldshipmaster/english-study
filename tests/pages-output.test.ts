import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

describe("GitHub Pages emitted output contract", () => {
  it("creates a complete deployment from a clean build", () => {
    const projectRoot = process.cwd();
    const outputDir = resolve(projectRoot, "pages-dist");
    rmSync(outputDir, { force: true, recursive: true });

    execFileSync("npm", ["run", "build:pages"], {
      cwd: projectRoot,
      stdio: "pipe",
    });

    expect(existsSync(resolve(outputDir, ".nojekyll"))).toBe(true);
    expect(existsSync(resolve(outputDir, "og.png"))).toBe(true);
    expect(readFileSync(resolve(outputDir, "index.html"), "utf8")).toMatch(
      /\/english-study\/assets\//,
    );
  });
});
