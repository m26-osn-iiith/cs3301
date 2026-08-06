---
title: Man Pages
order: 2
summary: How to use man pages for system calls and library functions.
---

[Always read the man page](https://en.wikipedia.org/wiki/RTFM) before asking a question about a system call.

```bash
man 2 read      # system calls are in section 2
man 3 printf    # library functions in section 3
man 7 ip        # overview pages in section 7
```

The section number matters. `man read` without a section gives you the `read` shell builtin, not the system call.
