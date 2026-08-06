---
n: 2
title: pthreads & Synchronization
date: "2026-09-16"
summary: Hands-on practice with POSIX threads, mutexes, and condition variables.
---

## The Problem with Shared State

Two threads incrementing a shared counter looks simple:

```c
int counter = 0;

void *increment(void *arg) {
    for (int i = 0; i < 1000000; i++)
        counter++;  // NOT safe
    return NULL;
}
```

The `counter++` compiles to three instructions: load, add, store. If two threads interleave in the wrong order, increments get lost. Run this and the result will be less than 2,000,000 — and different every time.

## Mutexes

A **mutex** (mutual exclusion lock) ensures only one thread executes a critical section at a time.

```c
#include <pthread.h>

int counter = 0;
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

void *increment(void *arg) {
    for (int i = 0; i < 1000000; i++) {
        pthread_mutex_lock(&lock);
        counter++;
        pthread_mutex_unlock(&lock);
    }
    return NULL;
}

int main(void) {
    pthread_t t1, t2;
    pthread_create(&t1, NULL, increment, NULL);
    pthread_create(&t2, NULL, increment, NULL);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    printf("counter = %d\n", counter);  // always 2000000
    pthread_mutex_destroy(&lock);
    return 0;
}
```

### Mutex Rules

| Rule | Reason |
|------|--------|
| Always lock before accessing shared data | Prevents races |
| Always unlock in every code path | Prevents deadlock |
| Keep critical sections short | Reduces contention |
| Never return from inside a locked section | Easy to miss unlocks |

## Condition Variables

A condition variable lets a thread **wait** until some condition becomes true, without busy-waiting.

```c
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t  cond = PTHREAD_COND_INITIALIZER;
int ready = 0;

void *producer(void *arg) {
    pthread_mutex_lock(&lock);
    ready = 1;
    pthread_cond_signal(&cond);   // wake one waiter
    pthread_mutex_unlock(&lock);
    return NULL;
}

void *consumer(void *arg) {
    pthread_mutex_lock(&lock);
    while (!ready)                // always loop, not if
        pthread_cond_wait(&cond, &lock);
    // process data...
    pthread_mutex_unlock(&lock);
    return NULL;
}
```

> **Critical**: always check the condition in a `while` loop, not an `if`. Spurious wakeups are real — `pthread_cond_wait` can return without anyone calling `signal`.

## Exercise: Bounded Buffer

Implement a thread-safe bounded buffer (assignment 2 preview):

- A buffer of fixed size `N`
- A producer thread that adds items; blocks when full
- A consumer thread that removes items; blocks when empty

You'll need: one mutex, two condition variables (`not_full`, `not_empty`), and careful reasoning about when to signal.

## Compiling with pthreads

```bash
gcc -Wall -g -pthread -o program program.c
```

The `-pthread` flag links the pthreads library and sets the right defines. Don't use `-lpthread` directly.
