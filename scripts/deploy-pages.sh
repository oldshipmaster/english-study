#!/bin/sh

set -eu

repo_root=$(git rev-parse --show-toplevel)
cd "$repo_root"

if test -n "$(git status --porcelain --untracked-files=all)"; then
  echo "error: deployment requires a clean worktree" >&2
  exit 1
fi

source_sha=$(git rev-parse --verify HEAD)
git fetch origin refs/heads/gh-pages:refs/remotes/origin/gh-pages
deployment_head=$(git rev-parse --verify refs/remotes/origin/gh-pages)

npm run build:pages
test -f pages-dist/.nojekyll || {
  echo "error: pages-dist/.nojekyll is missing" >&2
  exit 1
}

temporary_root=$(mktemp -d "${TMPDIR:-/tmp}/story-stage-pages.XXXXXX")
deployment_dir="$temporary_root/deployment"
worktree_added=false

cleanup() {
  if test "$worktree_added" = true; then
    git worktree remove --force "$deployment_dir" >/dev/null 2>&1 || true
  fi
  rm -rf "$temporary_root"
}
trap cleanup EXIT HUP INT TERM

git worktree add --detach "$deployment_dir" "$deployment_head"
worktree_added=true
git -C "$deployment_dir" rm -rf .
cp -R pages-dist/. "$deployment_dir/"
git -C "$deployment_dir" add -A
git -C "$deployment_dir" commit --allow-empty -m "deploy: publish StoryStage from source $source_sha"
git -C "$deployment_dir" push origin HEAD:refs/heads/gh-pages \
  "--force-with-lease=refs/heads/gh-pages:$deployment_head"

deployment_sha=$(git -C "$deployment_dir" rev-parse HEAD)
printf 'Source: %s\nDeployment: %s\n' "$source_sha" "$deployment_sha"
