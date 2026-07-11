import { execFileSync, spawnSync } from "node:child_process";
import {
  chmodSync,
  cpSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

const temporaryDirectories: string[] = [];

const run = (cwd: string, command: string, args: string[] = [], env = process.env) =>
  execFileSync(command, args, { cwd, encoding: "utf8", env });

const createFixture = () => {
  const root = mkdtempSync(join(tmpdir(), "story-stage-pages-"));
  temporaryDirectories.push(root);
  const source = join(root, "source");
  const remote = join(root, "remote.git");
  const bin = join(root, "bin");
  mkdirSync(source);
  mkdirSync(bin);

  run(root, "git", ["init", "--bare", remote]);
  run(source, "git", ["init", "-b", "main"]);
  run(source, "git", ["config", "user.name", "Pages Test"]);
  run(source, "git", ["config", "user.email", "pages@example.test"]);
  run(source, "git", ["remote", "add", "origin", remote]);
  writeFileSync(join(source, "source.txt"), "source\n");
  mkdirSync(join(source, "scripts"));
  cpSync(resolve("scripts/deploy-pages.sh"), join(source, "scripts/deploy-pages.sh"));
  chmodSync(join(source, "scripts/deploy-pages.sh"), 0o755);
  run(source, "git", ["add", "."]);
  run(source, "git", ["commit", "-m", "source"]);
  run(source, "git", ["push", "origin", "main"]);

  run(root, "git", ["clone", remote, join(root, "deployment")]);
  const deployment = join(root, "deployment");
  run(deployment, "git", ["config", "user.name", "Pages Test"]);
  run(deployment, "git", ["config", "user.email", "pages@example.test"]);
  run(deployment, "git", ["switch", "--orphan", "gh-pages"]);
  writeFileSync(join(deployment, "old.txt"), "old deployment\n");
  run(deployment, "git", ["add", "."]);
  run(deployment, "git", ["commit", "-m", "initial deployment"]);
  run(deployment, "git", ["push", "origin", "gh-pages"]);

  const fakeNpm = join(bin, "npm");
  writeFileSync(
    fakeNpm,
    `#!/bin/sh
set -eu
test "$1" = run
test "$2" = build:pages
mkdir -p pages-dist/assets
printf '<html>built</html>\\n' > pages-dist/index.html
printf 'asset\\n' > pages-dist/assets/app.js
if test "\${OMIT_NOJEKYLL:-0}" != 1; then
  printf '' > pages-dist/.nojekyll
fi
`,
  );
  chmodSync(fakeNpm, 0o755);

  return {
    bin,
    remote,
    root,
    source,
    env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
  };
};

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { force: true, recursive: true });
  }
});

describe("safe GitHub Pages deployment", () => {
  it("refuses to deploy a dirty source worktree", () => {
    const { source, env } = createFixture();
    writeFileSync(join(source, "dirty.txt"), "not committed\n");

    const result = spawnSync("./scripts/deploy-pages.sh", [], {
      cwd: source,
      encoding: "utf8",
      env,
    });

    expect(result.status).not.toBe(0);
    expect(`${result.stdout}${result.stderr}`).toContain("clean worktree");
    expect(run(source, "git", ["ls-remote", "origin", "refs/heads/gh-pages"])).toContain(
      "refs/heads/gh-pages",
    );
  });

  it("publishes only built output with source provenance", () => {
    const { source, env } = createFixture();
    const sourceSha = run(source, "git", ["rev-parse", "HEAD"]).trim();

    run(source, "./scripts/deploy-pages.sh", [], env);

    run(source, "git", ["fetch", "origin", "gh-pages"]);
    const deploymentSha = run(source, "git", ["rev-parse", "origin/gh-pages"]).trim();
    const message = run(source, "git", ["show", "-s", "--format=%B", deploymentSha]);
    const files = run(source, "git", ["ls-tree", "-r", "--name-only", deploymentSha]);

    expect(message).toContain(sourceSha);
    expect(files.trim().split("\n").sort()).toEqual([
      ".nojekyll",
      "assets/app.js",
      "index.html",
    ]);
    expect(existsSync(join(source, "pages-dist", ".nojekyll"))).toBe(true);
    expect(run(source, "git", ["worktree", "list", "--porcelain"])).not.toContain(
      "story-stage-pages.",
    );
  });

  it("does not publish when the build omits .nojekyll", () => {
    const { source, env } = createFixture();
    const before = run(source, "git", ["ls-remote", "origin", "refs/heads/gh-pages"]);

    const result = spawnSync("./scripts/deploy-pages.sh", [], {
      cwd: source,
      encoding: "utf8",
      env: { ...env, OMIT_NOJEKYLL: "1" },
    });

    expect(result.status).not.toBe(0);
    expect(`${result.stdout}${result.stderr}`).toContain(".nojekyll is missing");
    expect(run(source, "git", ["ls-remote", "origin", "refs/heads/gh-pages"])).toBe(before);
  });

  it("rejects a concurrent gh-pages update instead of overwriting it", () => {
    const { bin, env, remote, root, source } = createFixture();
    const realGit = run(source, "sh", ["-c", "command -v git"]).trim();
    const gitWrapper = join(bin, "git");
    writeFileSync(
      gitWrapper,
      `#!/bin/sh
set -eu
case " $* " in
  *" push origin HEAD:refs/heads/gh-pages "*)
    "$REAL_GIT" clone --branch gh-pages "$TEST_REMOTE" "$RACE_ROOT" >/dev/null 2>&1
    "$REAL_GIT" -C "$RACE_ROOT" config user.name "Concurrent Publisher"
    "$REAL_GIT" -C "$RACE_ROOT" config user.email "race@example.test"
    printf 'competing deployment\\n' > "$RACE_ROOT/race.txt"
    "$REAL_GIT" -C "$RACE_ROOT" add race.txt
    "$REAL_GIT" -C "$RACE_ROOT" commit -m "competing deployment" >/dev/null
    "$REAL_GIT" -C "$RACE_ROOT" push origin gh-pages >/dev/null 2>&1
    ;;
esac
exec "$REAL_GIT" "$@"
`,
    );
    chmodSync(gitWrapper, 0o755);

    const result = spawnSync("./scripts/deploy-pages.sh", [], {
      cwd: source,
      encoding: "utf8",
      env: {
        ...env,
        RACE_ROOT: join(root, "race"),
        REAL_GIT: realGit,
        TEST_REMOTE: remote,
      },
    });
    const remoteHead = run(source, "git", ["ls-remote", "origin", "refs/heads/gh-pages"])
      .split("\t")[0];
    const competingHead = run(join(root, "race"), realGit, ["rev-parse", "HEAD"]).trim();

    expect(result.status).not.toBe(0);
    expect(`${result.stdout}${result.stderr}`).toContain("stale info");
    expect(remoteHead).toBe(competingHead);
  });

  it("pins the push lease to the fetched deployment head", () => {
    const script = readFileSync(resolve("scripts/deploy-pages.sh"), "utf8");

    expect(script).toContain(
      '"--force-with-lease=refs/heads/gh-pages:$deployment_head"',
    );
    expect(script).not.toContain('"--force"');
  });
});
