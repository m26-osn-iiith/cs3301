---
title: Git
order: 4
summary: How to initialize a git repo and commit iteratively, and how to submit your work using git.
---

### Setup

```bash
git init                        # initialize a repo
git add file.c                  # stage a specific file
git add .                       # stage everything
git commit -m "feat: implement sequential execution"
git log --oneline               # check history

git remote add origin <repo-url>
git push -u origin main
```

### Commit as you go

Commit whenever you finish a meaningful chunk, not just once at the end. We will look at your timestamps, and a bunch of random commits right before the deadline may result in you being penalized.

Commit when you:
- get a feature working
- fix a bug
- finish a part of the spec

```bash
git commit -m "feat: add pipe support between commands"
git commit -m "fix: handle empty input in tokenizer"
```

### Before you submit

```bash
git status                      # anything uncommitted?
git log --oneline               # does history make sense?
git push                        # is it actually on the remote?
```

Open your repo on GitHub and confirm the files are there. Local commits don't count as submitted.

### Avoid

- committing only at the end
- force pushing to rewrite history (we will know)
- committing build files or binaries (use `.gitignore`)
- forgetting to push (no excuses)

## More resources

* [Git Handbook](https://guides.github.com/introduction/git-handbook/)
* [Pro Git](https://git-scm.com/book/en/v2) (free, you don't have to pay)
* [Conventional Commits Cheatsheet](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13)
