---
n: 2
title: Processes, Threads & Concurrency
date: "2026-08-31"
summary: Address spaces, the process lifecycle, and why threads exist at all.
---

## Processes

A **process** is a running program. More precisely, it's the OS abstraction that bundles:

- An **address space** (code, heap, stack)
- A **file descriptor table** (open files, sockets)
- CPU state (register values, program counter)
- Metadata (PID, owner, priority)

### Creating a Process

```c
#include <unistd.h>
#include <stdio.h>

int main(void) {
    pid_t pid = fork();

    if (pid == 0) {
        // child
        printf("child: pid=%d\n", getpid());
    } else {
        // parent
        printf("parent: child pid=%d\n", pid);
        wait(NULL);
    }
    return 0;
}
```

`fork()` duplicates the calling process. The child gets a copy of the parent's address space. Both then execute independently from the point of the `fork` call.

### The Process Lifecycle

| State | Meaning |
|-------|---------|
| Running | Actively executing on a CPU |
| Ready | Runnable, waiting for a CPU slot |
| Blocked | Waiting for I/O, a lock, or a signal |
| Zombie | Exited but not yet `wait()`-ed by parent |

## Threads

Threads let multiple execution paths share the same address space. All threads in a process see the same heap and global variables — but each has its own stack and registers.

### Why Threads?

- **Parallelism** — on multi-core hardware, threads can run truly simultaneously
- **Concurrency** — one thread can block on I/O while others keep running
- **Shared state** — threads communicate through shared memory (no IPC needed)

### pthreads

```c
#include <pthread.h>
#include <stdio.h>

void *worker(void *arg) {
    int id = *(int *)arg;
    printf("thread %d running\n", id);
    return NULL;
}

int main(void) {
    pthread_t t1, t2;
    int a = 1, b = 2;

    pthread_create(&t1, NULL, worker, &a);
    pthread_create(&t2, NULL, worker, &b);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    return 0;
}
```

### The Cost of Sharing

Sharing memory is fast but dangerous. A **data race** occurs when two threads access the same variable concurrently and at least one access is a write, with no synchronization. The result is undefined behavior — not just wrong output, but potentially crashes, corrupted data, or security vulnerabilities.

> Always protect shared mutable state with a mutex, semaphore, or equivalent primitive.

## Context Switching

The kernel switches between threads by:

1. Saving the current thread's registers to its kernel stack
2. Restoring the next thread's saved registers
3. Jumping to where the next thread left off

This is cheap (microseconds) but not free. The real cost is **cache pollution**: the new thread's working set displaces the old thread's data from L1/L2 cache.
