---
n: 1
title: Shell Implementation
released: "2026-09-04"
due: "2026-09-18"
summary: Build a minimal Unix shell that supports pipes, redirection, and background jobs.
---

## Overview

You'll implement a simplified Unix shell in C. It reads commands from stdin, parses them, and executes them using `fork`, `exec`, `pipe`, and `dup2`.

By the end you'll have a real shell that can run programs, chain them with pipes, redirect I/O, and manage background jobs.

## What to Implement

### Phase 1 — Basic Execution

Run a single command with arguments:

```bash
$ /bin/ls -la
$ /usr/bin/echo hello world
```

Steps: `fork()`, then in the child call `execvp(argv[0], argv)`. The parent calls `waitpid()`.

### Phase 2 — Built-in Commands

Some commands must be implemented inside the shell process (a child can't change the parent's directory):

| Built-in | Behavior |
|----------|----------|
| `cd [dir]` | Change working directory |
| `exit [code]` | Exit the shell |
| `jobs` | List background jobs |

### Phase 3 — Redirection

```bash
$ ls > out.txt          # stdout → file
$ sort < input.txt      # file → stdin
$ cmd >> append.txt     # stdout → file (append)
```

Use `open()` + `dup2()` to replace stdin/stdout file descriptors before `exec`.

### Phase 4 — Pipes

```bash
$ ls | sort | head -5
```

Each `|` creates a `pipe()`, and you connect one command's stdout to the next command's stdin using `dup2`. You'll need to `fork` multiple times and track all child PIDs.

### Phase 5 — Background Jobs

```bash
$ sleep 10 &
[1] 12345
$ jobs
[1]  running   sleep 10
```

A trailing `&` means don't wait for the child. Track background PIDs in a job table and `waitpid(WNOHANG)` to reap them when they finish.

## Grading

| Component | Points |
|-----------|--------|
| Basic execution | 20 |
| Built-ins | 15 |
| Redirection | 25 |
| Pipes | 25 |
| Background jobs | 15 |

## Submission

Submit a single `shell.c` file. It must compile with:

```bash
gcc -Wall -Wextra -g -o shell shell.c
```

> Do not use `system()` or `popen()`. The point is to use the raw system calls directly.
