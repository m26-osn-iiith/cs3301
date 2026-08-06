---
n: 3
title: CPU Scheduling
date: "2026-09-14"
summary: How the kernel decides which process runs next, and at what cost.
---

## The Scheduling Problem

At any moment, there are more runnable processes than CPUs. The **scheduler** decides which process gets a CPU, for how long, and what happens when it's time to switch.

Three competing goals:

1. **Fairness** — every process gets a reasonable share of CPU time
2. **Throughput** — maximize jobs completed per second
3. **Responsiveness** — interactive processes should feel snappy

These goals conflict. A scheduler optimized for throughput runs jobs to completion (high throughput, bad responsiveness). One optimized for responsiveness switches rapidly (low latency, high overhead).

## Scheduling Algorithms

### First-Come, First-Served (FCFS)

Run jobs in arrival order. Simple, but a long job blocks all shorter jobs behind it (**convoy effect**).

### Shortest Job First (SJF)

Run the shortest job next. Optimal for average turnaround time, but requires knowing job lengths in advance — which you usually don't.

### Round Robin (RR)

Run each job for a fixed **time quantum** (e.g., 10 ms), then preempt and move to the next. Good responsiveness; throughput depends on quantum size.

| Quantum | Context switches/sec | Cache efficiency |
|---------|----------------------|-----------------|
| 1 ms | 1000 | Poor |
| 10 ms | 100 | Good |
| 100 ms | 10 | Excellent |

### Multi-Level Feedback Queue (MLFQ)

Linux and macOS use variants of MLFQ. The key idea:

- Maintain multiple ready queues, each with a different priority
- New jobs start in the highest-priority queue
- If a job uses its full quantum without blocking, demote it to a lower queue
- Jobs that yield (block on I/O) stay in their current queue
- Periodically boost all jobs back to the highest queue (prevent starvation)

```text
Queue 0 (highest priority, quantum=10ms):  [interactive processes]
Queue 1 (medium priority, quantum=20ms):   [mixed workloads]
Queue 2 (lowest priority, quantum=100ms):  [CPU-bound batch jobs]
```

## Preemption

A **non-preemptive** scheduler runs a process until it voluntarily yields (via a system call or blocking). A **preemptive** scheduler can interrupt a running process using a hardware timer interrupt.

Modern OSes are preemptive. The timer fires, the CPU takes an interrupt, the kernel scheduler runs, and a different process may be selected. The interrupted process doesn't see any of this — it just finds itself running a bit later.

## Measuring Scheduler Performance

- **Turnaround time** = completion time − arrival time
- **Response time** = time of first run − arrival time
- **Throughput** = jobs completed / unit time
- **CPU utilization** = fraction of time CPU is busy

> Rule of thumb: optimizing for response time hurts throughput. Pick your tradeoff based on workload — interactive shell vs. batch rendering vs. real-time audio all need different policies.
