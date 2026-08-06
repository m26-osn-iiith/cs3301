---
n: 3
title: Socket Programming Basics
date: "2026-10-02"
summary: Write your first TCP client and server, and understand how the socket API works.
---

## Socket Lifecycle

TCP sockets follow a different lifecycle on the client vs. server side.

**Server**: `socket` → `bind` → `listen` → `accept` → `read`/`write` → `close`

**Client**: `socket` → `connect` → `read`/`write` → `close`

## A Minimal TCP Server

```c
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#define PORT 8080

int main(void) {
    int srv = socket(AF_INET, SOCK_STREAM, 0);

    // allow reuse of local address after restart
    int opt = 1;
    setsockopt(srv, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    struct sockaddr_in addr = {
        .sin_family      = AF_INET,
        .sin_port        = htons(PORT),
        .sin_addr.s_addr = INADDR_ANY,
    };
    bind(srv, (struct sockaddr *)&addr, sizeof(addr));
    listen(srv, 10);

    printf("listening on port %d\n", PORT);

    while (1) {
        struct sockaddr_in client;
        socklen_t len = sizeof(client);
        int conn = accept(srv, (struct sockaddr *)&client, &len);

        char buf[256];
        ssize_t n = read(conn, buf, sizeof(buf) - 1);
        buf[n] = '\0';
        printf("received: %s\n", buf);

        write(conn, "hello\n", 6);
        close(conn);
    }
}
```

## A Minimal TCP Client

```c
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

int main(void) {
    int fd = socket(AF_INET, SOCK_STREAM, 0);

    struct sockaddr_in addr = {
        .sin_family = AF_INET,
        .sin_port   = htons(8080),
    };
    inet_pton(AF_INET, "127.0.0.1", &addr.sin_addr);
    connect(fd, (struct sockaddr *)&addr, sizeof(addr));

    write(fd, "hi\n", 3);

    char buf[256];
    ssize_t n = read(fd, buf, sizeof(buf) - 1);
    buf[n] = '\0';
    printf("server said: %s", buf);

    close(fd);
    return 0;
}
```

## Testing with Netcat

You don't need to write a client to test your server. `nc` (netcat) is a Swiss Army knife for TCP:

```bash
# connect to your server
nc 127.0.0.1 8080

# listen on a port (act as server)
nc -l 8080
```

## Key Issues to Handle

| Issue | Why it happens | Fix |
|-------|---------------|-----|
| Partial reads | TCP is a byte stream, not message-based | Loop until you've read what you expect |
| `SIGPIPE` | Writing to a closed connection sends `SIGPIPE` | `signal(SIGPIPE, SIG_IGN)` or `MSG_NOSIGNAL` |
| Port in use | Previous server still in `TIME_WAIT` | `SO_REUSEADDR` on the server socket |
| Blocking `accept` | No incoming connection | Use `select`/`poll` for non-blocking I/O |

## Next Steps

The server above handles one client at a time. For assignment 3, you'll handle multiple clients concurrently. The options are:

- **Thread per client** — `fork` or `pthread_create` for each `accept`
- **Event loop** — `select`/`poll`/`epoll` to multiplex multiple fds in a single thread

We'll cover event-driven I/O in the networking lecture.
