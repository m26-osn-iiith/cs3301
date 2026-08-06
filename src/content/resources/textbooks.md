---
order: 1
title: Textbooks & Readings
summary: Primary and supplemental texts for the course, with chapter-by-chapter reading schedule.
---

## Primary Texts

### Operating Systems: Three Easy Pieces (OSTEP)

Remzi and Andrea Arpaci-Dusseau. Free at [ostep.org](https://ostep.org).

The main OS text for this course. Covers virtualization, concurrency, and persistence in a conversational style. Read the chapters listed each week before lecture.

| Weeks | Topic | OSTEP Chapters |
|-------|-------|----------------|
| 1–2 | Processes & scheduling | 4–9 |
| 3–4 | Concurrency | 26–34 |
| 5–6 | Memory | 13–22 |

### Computer Networks: A Top-Down Approach

Kurose & Ross, 8th edition.

The standard networking text. We use chapters 1–4 (introduction, application layer, transport, network). Later chapters on link layer and wireless are optional.

## Supplemental Reading

- **The Linux Programming Interface** — Kerrisk. Exhaustive reference for system calls. Don't read cover to cover; use it when you need to understand a specific call deeply.
- **Unix Network Programming, Vol. 1** — Stevens. The definitive socket programming reference. Chapters 3–6 cover everything you need for this course.
- **C Programming: A Modern Approach** — King. If you're rusty on C, this is the best refresher.

## Man Pages

Always read the man page before asking a question about a system call:

```bash
man 2 read      # system calls are in section 2
man 3 printf    # library functions in section 3
man 7 ip        # overview pages in section 7
```

The `2` and `3` matter — `man read` without a section gives you the `read` shell builtin, not the system call.

## Online Resources

- **Beej's Guide to Network Programming** — the friendliest intro to sockets
- **Beej's Guide to C Programming** — solid C reference
- **cppreference.com** — C standard library reference
- **POSIX standard** — authoritative but dense; use when man pages are ambiguous
