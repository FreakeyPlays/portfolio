---
name: land
description: >-
  Land changes in the FreakeyPlays/portfolio repository: commit them on a
  feature branch, open a pull request into master, wait for the required
  Cloudflare Pages check, and rebase-merge it. Only invoke when the user has
  explicitly requested landing or merging the change (for example via Land
  Changes or /land), not for review, preparation, passing checks, or skill
  installation.
disable-model-invocation: true
metadata:
  delta-action: land
---

# Land changes (portfolio)

Invoking this skill is the landing request. Do not ask again whether to merge
and never reply that you are waiting for an explicit landing request. Stop only
for genuine blockers or unclear scope. If you stop, say plainly that the
changes have **not** landed and why.

Repository facts (re-verify at run time, don't assume):

- Remote `origin` = `https://github.com/FreakeyPlays/portfolio.git`; default
  branch `master`.
- PRs are merged with rebase merges (recent PRs, e.g. #76 and #84).
- The only PR check is the **Cloudflare Pages** status; there are no GitHub
  Actions workflows (`.github/` only contains `PULL_REQUEST_TEMPLATE.md`).
- Husky hooks: `.husky/pre-commit` runs `pnpm exec lint-staged`;
  `.husky/pre-push` runs `pnpm check`. Never bypass them with `--no-verify`.
- Node version comes from `.nvmrc`; the package manager is pnpm
  (`pnpm-lock.yaml`, `pnpm-workspace.yaml`).

## 1. Preflight

1. Run `git --no-optional-locks status --short`, `git remote -v`, and
   `git fetch origin`.
2. Confirm `gh auth status` succeeds for an account with push access to
   `FreakeyPlays/portfolio`. If it doesn't, stop.
3. Work out which changes belong to the request: uncommitted changes, local
   commits not on `origin/master`, or an existing branch/PR. If unrelated or
   unclear changes are mixed in, stop and ask which belong. Never commit
   secrets, `.env` files, `dist/`, or `node_modules/`.

## 2. Branch and commit

1. If you are on `master` or in detached HEAD, create a feature branch from the
   current state, named `<type>/<short-topic>` (e.g. `build/update-deps`,
   `fix/json-ld`, `feat/add-blog`):
   `git switch -c <branch>`.
   If the change is already on a feature branch or open PR, keep using it.
2. Stage only the relevant files explicitly (`git add <paths>`) and commit with
   a Conventional Commit message matching history (`build: update deps`,
   `fix: json ld`, `feat: add index now hook`, `chore: ...`):
   `GIT_EDITOR=true git commit -m "<type>: <summary>"`.
   The pre-commit hook runs `lint-staged` (Biome, see `package.json`
   `lint-staged`). If it rewrites files, review and include them; if it fails,
   fix the cause or stop.
3. Rebase onto the latest master: `git rebase origin/master` (non-interactive).
   See **Conflicts** below.

## 3. Local verification

Run from the repo root (scripts in `package.json`):

- `pnpm install --frozen-lockfile` (fails if `package.json` and
  `pnpm-lock.yaml` disagree; then run `pnpm install`, commit the lockfile, and
  rerun)
- `pnpm lint` (`biome lint .`)
- `pnpm build` (`astro check && astro build`)

If any of these fail, fix the problem when the fix is clearly within the
change's scope, commit it, and rerun. Otherwise stop: not landed.

## 4. Publish and open the PR

1. `git push -u origin <branch>` (the pre-push hook runs `pnpm check`). Never
   force-push `master`. Force-pushing your own feature branch after a rebase
   is allowed only with `git push --force-with-lease origin <branch>`.
2. If no PR exists yet, open one into `master`, following
   `.github/PULL_REQUEST_TEMPLATE.md`:
   `gh pr create --base master --head <branch> --title "<conventional title>" --body-file <file>`
   The body keeps the template sections: **Describe your changes** (summary,
   motivation/context, any new dependencies), **Additional Comments**
   (reviewer notes, e.g. checks run, manual checks still needed), and
   **Checklist**. Tick a checklist item only if it's true; use `Closes #N`
   only if there is a real related issue, otherwise drop that line.

## 5. Conflicts

The user's preference: resolve conflicts yourself only when you are confident
of the intended result. Stop and ask when anything is ambiguous or important.

- Resolve automatically: straightforward, non-overlapping edits; regenerating
  `pnpm-lock.yaml` with `pnpm install` after resolving `package.json`;
  dependency version bumps where taking the newer version is clearly intended.
- Stop and ask (report the conflicting files and both sides): CMS config
  (`src/pages/admin/config.yml`, `src/blocks/*/config.ts`, `src/hooks/*`),
  content entries edited through the CMS (`cms/*` branches), deploy and
  routing files (`public/_headers`, `public/_redirects`, `astro.config.mjs`),
  or anything where intent is unclear.
- Never drop unrelated work. Continue a rebase with
  `GIT_EDITOR=true git rebase --continue`; if you abort, use
  `git rebase --abort`.
- After any conflict resolution, rerun **Local verification** and push again.

## 6. Required checks

1. Re-check destination rules at run time:
   `gh api repos/FreakeyPlays/portfolio/rulesets` and
   `gh api repos/FreakeyPlays/portfolio/branches/master/protection` (a 404
   "Branch not protected" means no protection). If rules require reviews or
   additional checks, those are required too. If a required review is
   missing, stop: not landed.
2. Wait for checks on the PR's current head commit:
   `gh pr checks <number> --watch --fail-fast`
   then confirm with
   `gh pr view <number> --json headRefOid,statusCheckRollup,mergeable,mergeStateStatus`
   that **Cloudflare Pages** (and any other required check) is `SUCCESS` for
   that same `headRefOid`.
3. Pending, failing, missing, or unverifiable checks are not passing. On
   failure, look at the details, fix if clearly in scope (then go back to
   step 3), otherwise stop: not landed.

## 7. Merge

1. Confirm the PR is `MERGEABLE` and the head hasn't changed since checks
   passed.
2. `gh pr merge <number> --rebase --delete-branch --match-head-commit <headRefOid>`
   If rebase merging is disallowed or fails, stop and report rather than
   switching to a different merge method.

## 8. Verify the result

1. `gh pr view <number> --json state,mergedAt,mergeCommit`: `state` must be
   `MERGED`.
2. `git fetch origin` and confirm the changes are on `origin/master`
   (`git log --oneline origin/master -5`; the commits' changes are present).
3. Check the Cloudflare Pages status on the new master head:
   `gh api repos/FreakeyPlays/portfolio/commits/master/status --jq '.statuses[]|.context+" "+.state'`.
   Wait for it to stop being pending and report the outcome. A failed
   production deploy must be reported prominently.
4. Report the PR URL, the merged commits on `master`, the checks that passed,
   and anything not verified.
