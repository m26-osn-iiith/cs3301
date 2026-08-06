---
n: 3
title: TCP Chat Server
released: null
due: "2026-11-06"
summary: Build a multi-client chat server over TCP using socket programming.
---

## Overview

You'll build a chat server that accepts multiple TCP connections and broadcasts each message to all connected clients. When a client sends a line of text, every other connected client receives it.

This assignment integrates OS concepts (processes, I/O multiplexing) and networking (TCP, sockets).

## Requirements

### Connection handling

- Accept connections on a configurable port (default: `4000`)
- Support at least 64 simultaneous clients
- Assign each client a numeric ID on connect: `[1] user connected`
- Notify all clients when someone joins or leaves

### Message broadcasting

When client N sends a message, all other clients receive:

```text
[3] hello everyone
```

Messages are newline-terminated. Your server reads until `\n` before broadcasting.

### Concurrency model

Choose one of:

| Model | Tradeoff |
|-------|----------|
| Thread per client | Simpler code; doesn't scale past ~1000 clients |
| `select`/`poll` event loop | Scales to thousands; more complex bookkeeping |

For this assignment, either model is acceptable. The thread-per-client approach is recommended unless you want the extra challenge.

## Design

```text
main thread
  └── accept() loop
        ├── client 1 fd → spawn thread → read loop → broadcast
        ├── client 2 fd → spawn thread → read loop → broadcast
        └── ...

shared state:
  - clients[]: array of {fd, id} structs
  - clients_lock: mutex protecting the array
```

## Broadcast Function

The tricky part is broadcasting without holding the lock while writing:

```c
void broadcast(int sender_fd, const char *msg, int msglen) {
    pthread_mutex_lock(&clients_lock);
    for (int i = 0; i < MAX_CLIENTS; i++) {
        if (clients[i].fd > 0 && clients[i].fd != sender_fd) {
            write(clients[i].fd, msg, msglen);
        }
    }
    pthread_mutex_unlock(&clients_lock);
}
```

> **Note**: holding the lock while calling `write` on every client fd means a slow client can block the whole server. For the purposes of this assignment, this is acceptable. (A production server would use non-blocking I/O or per-client write queues.)

## Testing

```bash
# terminal 1: start server
./chat 4000

# terminal 2: connect client A
nc 127.0.0.1 4000

# terminal 3: connect client B
nc 127.0.0.1 4000

# type in terminal 2 — you should see it in terminal 3
```

## Submission

Submit `chat.c`. It must compile with:

```bash
gcc -Wall -Wextra -g -pthread -o chat chat.c
```

Include a brief `README` describing your concurrency model and any known limitations.
