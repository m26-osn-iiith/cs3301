---
order: 2
title: Reference Docs & Man Pages
summary: System call references, POSIX documentation, and RFC links for course topics.
---

## System Calls Quick Reference

### Process Management

| Call | Signature | What it does |
|------|-----------|--------------|
| `fork` | `pid_t fork(void)` | Duplicate calling process |
| `execvp` | `int execvp(const char *file, char *const argv[])` | Replace process image |
| `waitpid` | `pid_t waitpid(pid_t pid, int *status, int options)` | Wait for child state change |
| `exit` | `void exit(int status)` | Terminate process |
| `getpid` | `pid_t getpid(void)` | Get process ID |

### File I/O

| Call | Signature | What it does |
|------|-----------|--------------|
| `open` | `int open(const char *path, int flags, ...)` | Open or create a file |
| `read` | `ssize_t read(int fd, void *buf, size_t n)` | Read bytes from fd |
| `write` | `ssize_t write(int fd, const void *buf, size_t n)` | Write bytes to fd |
| `close` | `int close(int fd)` | Close file descriptor |
| `dup2` | `int dup2(int oldfd, int newfd)` | Duplicate fd to specific number |
| `pipe` | `int pipe(int pipefd[2])` | Create unidirectional pipe |

### Sockets

| Call | Signature | What it does |
|------|-----------|--------------|
| `socket` | `int socket(int domain, int type, int protocol)` | Create socket |
| `bind` | `int bind(int fd, const struct sockaddr *addr, socklen_t len)` | Assign address |
| `listen` | `int listen(int fd, int backlog)` | Mark as passive socket |
| `accept` | `int accept(int fd, struct sockaddr *addr, socklen_t *len)` | Accept connection |
| `connect` | `int connect(int fd, const struct sockaddr *addr, socklen_t len)` | Initiate connection |
| `send`/`recv` | similar to `write`/`read` | Send/receive with flags |

### Synchronization

| Call | What it does |
|------|--------------|
| `pthread_mutex_lock` / `unlock` | Acquire / release mutex |
| `pthread_cond_wait` | Atomically release lock and sleep |
| `pthread_cond_signal` | Wake one waiter |
| `pthread_cond_broadcast` | Wake all waiters |

## RFCs

RFCs (Request for Comments) are the authoritative specifications for internet protocols.

- [RFC 793](https://www.rfc-editor.org/rfc/rfc793) — TCP specification
- [RFC 791](https://www.rfc-editor.org/rfc/rfc791) — IP specification  
- [RFC 1034](https://www.rfc-editor.org/rfc/rfc1034) — DNS concepts
- [RFC 7230](https://www.rfc-editor.org/rfc/rfc7230) — HTTP/1.1

RFCs are dense but precise. When you need to know exactly how TCP handles a corner case, the RFC is the answer.

## Error Handling

Most system calls return `-1` on error and set `errno`. Always check return values:

```c
int fd = open("file.txt", O_RDONLY);
if (fd == -1) {
    perror("open");   // prints "open: No such file or directory"
    exit(1);
}
```

`perror(str)` prints `str: <error description>` based on `errno`. `strerror(errno)` gives the string alone.
