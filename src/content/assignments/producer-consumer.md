---
n: 2
title: Producer–Consumer
released: "2026-09-28"
due: "2026-10-16"
summary: Implement a thread-safe bounded buffer using mutexes and condition variables.
---

## Overview

You'll implement a **bounded buffer** — a fixed-size queue shared between producer threads (that add items) and consumer threads (that remove them). Producers block when the buffer is full; consumers block when it's empty.

This is the classic synchronization problem. Getting it right requires careful reasoning about when to lock, when to signal, and when to wait.

## The Interface

Implement these three functions in `buffer.c`:

```c
// initialize a buffer of capacity cap
void buffer_init(buffer_t *b, int cap);

// add item; blocks if buffer is full
void buffer_put(buffer_t *b, int item);

// remove and return item; blocks if buffer is empty
int buffer_get(buffer_t *b);

// free resources
void buffer_destroy(buffer_t *b);
```

The `buffer_t` struct is yours to define. You'll need at minimum:

```c
typedef struct {
    int     *items;
    int      cap;
    int      count;
    int      head;   // next read position
    int      tail;   // next write position
    pthread_mutex_t lock;
    pthread_cond_t  not_full;
    pthread_cond_t  not_empty;
} buffer_t;
```

## Implementation Sketch

```c
void buffer_put(buffer_t *b, int item) {
    pthread_mutex_lock(&b->lock);
    while (b->count == b->cap)
        pthread_cond_wait(&b->not_full, &b->lock);
    b->items[b->tail] = item;
    b->tail = (b->tail + 1) % b->cap;
    b->count++;
    pthread_cond_signal(&b->not_empty);
    pthread_mutex_unlock(&b->lock);
}
```

Fill in `buffer_get` symmetrically.

## Common Mistakes

| Mistake | Consequence |
|---------|-------------|
| Using `if` instead of `while` for condition check | Spurious wakeups cause incorrect behavior |
| Signaling before unlocking | Legal, but wastes a context switch |
| Using `broadcast` when `signal` suffices | Not wrong, but noisy |
| Forgetting to initialize the mutex | Undefined behavior on first lock |

## Testing

A test harness is provided in `test_buffer.c`. It spawns N producers and M consumers and verifies that every item produced is consumed exactly once.

```bash
gcc -Wall -g -pthread -o test buffer.c test_buffer.c
./test 4 4 1000    # 4 producers, 4 consumers, 1000 items each
```

All test cases must pass with no data races. Run under `helgrind` (Valgrind's thread error detector) to verify:

```bash
valgrind --tool=helgrind ./test 2 2 500
```

## Submission

Submit `buffer.c` and `buffer.h`. Do not modify `test_buffer.c`.
