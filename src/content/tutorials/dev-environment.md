---
n: 1
title: Dev Environment Setup
date: "2026-08-26"
summary: Set up your C development environment, learn to use GDB, and get comfortable with the course tools.
---

## Prerequisites

You need a Unix-like environment. Linux is ideal; macOS works. Windows users should use WSL2.

Check you have the essentials:

```bash
gcc --version   # should be ≥ 12
make --version
gdb --version
valgrind --version
```

If anything is missing, install via your package manager:

```bash
# Ubuntu/Debian
sudo apt install build-essential gdb valgrind

# macOS (brew)
brew install gcc gdb valgrind
```

## Compiling C Programs

Always compile with warnings enabled:

```bash
gcc -Wall -Wextra -g -o hello hello.c
```

| Flag | Effect |
|------|--------|
| `-Wall` | Enable common warnings |
| `-Wextra` | Enable extra warnings |
| `-g` | Include debug symbols |
| `-O2` | Optimize for speed (disable with `-O0` for debugging) |
| `-fsanitize=address` | Enable AddressSanitizer (memory error detection) |

## Using GDB

GDB is the GNU debugger. It lets you step through your program, inspect variables, and find crashes.

```bash
# compile with debug symbols
gcc -g -o myprogram myprogram.c

# start gdb
gdb ./myprogram
```

### Essential GDB Commands

```text
run               start the program
break main        set a breakpoint at main()
break file.c:42   set a breakpoint at line 42
next (n)          step over (execute line, skip into calls)
step (s)          step into (enter function calls)
print var         print value of variable
backtrace (bt)    show call stack
continue (c)      continue to next breakpoint
quit (q)          exit gdb
```

> **Tip**: run your program under GDB even when it's not crashing. Being comfortable with the tool before you need it is the difference between a 10-minute debug session and a 2-hour one.

## Valgrind: Memory Error Detection

Valgrind catches memory errors that don't always cause immediate crashes:

```bash
valgrind --leak-check=full ./myprogram
```

Common issues it finds:

- **Heap block overrun** — writing past the end of `malloc`'d memory
- **Use after free** — accessing memory after calling `free`
- **Uninitialized reads** — using a variable before assigning it
- **Memory leaks** — forgetting to `free` allocated memory

> Enable AddressSanitizer during development (`-fsanitize=address -fsanitize=undefined`) — it's faster than Valgrind and catches most of the same bugs at compile time.

## Course Makefile Template

Start every assignment with this `Makefile`:

```makefile
CC = gcc
CFLAGS = -Wall -Wextra -g -fsanitize=address,undefined

all: main

main: main.c
	$(CC) $(CFLAGS) -o $@ $^

clean:
	rm -f main

.PHONY: all clean
```

Note the tab character before `$(CC)` — Make requires real tabs, not spaces.
