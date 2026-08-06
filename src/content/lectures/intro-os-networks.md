---
n: 1
title: Introduction to OS & Networks
date: "2026-08-24"
summary: What an operating system does, why networks matter, and how the two halves of this course connect.
---

## What is an Operating System?

An operating system is the software layer between your programs and the hardware. It provides abstractions — things like files, processes, and sockets — that make writing applications possible without worrying about physical memory addresses or device registers.

The three core jobs of an OS are:

1. **Resource management** — allocate CPU time, memory, and I/O bandwidth fairly across competing processes
2. **Abstraction** — hide hardware complexity behind clean APIs (`read`, `write`, `fork`)
3. **Protection** — keep processes isolated from each other and from the kernel

> "The OS is like a government: it does nothing useful itself, but enables everything else to function." — Arpaci-Dusseau

## What is a Network?

A network is a collection of machines that exchange data. The internet is one giant network of networks, stitched together by protocols — agreed-upon rules for formatting and routing packets.

### The Layered Model

Modern networking is built in layers, each solving a specific problem:

| Layer | Name | Example Protocols |
|-------|------|-------------------|
| 7 | Application | HTTP, DNS, SSH |
| 4 | Transport | TCP, UDP |
| 3 | Network | IP, ICMP |
| 2 | Data Link | Ethernet, Wi-Fi |
| 1 | Physical | Cables, radio |

Each layer talks only to the layers directly above and below it. A TCP segment doesn't know what HTTP request it carries — it just gets delivered.

## How OS and Networks Connect

OS primitives and network protocols aren't separate worlds:

- The **socket API** (`socket`, `bind`, `connect`, `send`, `recv`) is an OS abstraction over the network stack
- The kernel manages the **TCP connection state machine**, not your application
- **Network I/O** uses the same file descriptor model as disk I/O — `read` and `write` work on sockets too
- A web server is just a process that uses `fork` (OS) to handle connections arriving over TCP (network)

This course covers both halves and shows how they fit together. By the end, you'll write a multi-client TCP server using OS primitives you understand inside out.

## Reading

Chapter 1 and 2 of OSTEP (free online). Skim the network chapter in Tanenbaum for the layered model overview.
