---
order: 3
title: Tools & Setup
summary: GDB, Valgrind, Wireshark, and other tools used throughout the semester.
---

## Compiler & Build

### GCC

Always compile with warnings and debug symbols during development:

```bash
gcc -Wall -Wextra -Wpedantic -g -o program program.c
```

For sanitizers (fastest way to catch memory bugs and races):

```bash
# memory errors
gcc -g -fsanitize=address,undefined -o program program.c

# thread races (mutually exclusive with ASan)
gcc -g -fsanitize=thread -o program program.c
```

### Make

Use `make` for any project with more than one file. The course template:

```makefile
CC     = gcc
CFLAGS = -Wall -Wextra -g -fsanitize=address,undefined
LIBS   = -lpthread

SRCS = $(wildcard *.c)
OBJS = $(SRCS:.c=.o)

program: $(OBJS)
	$(CC) $(CFLAGS) -o $@ $^ $(LIBS)

%.o: %.c
	$(CC) $(CFLAGS) -c $<

clean:
	rm -f $(OBJS) program

.PHONY: clean
```

## Debugging

### GDB

```bash
# basic session
gdb ./program
(gdb) run arg1 arg2
(gdb) break function_name
(gdb) print variable
(gdb) backtrace
```

### GDB with Multi-threading

```text
info threads          list all threads
thread N              switch to thread N
set scheduler-locking on   only run current thread (useful for stepping)
```

### Valgrind

| Tool | Command | Finds |
|------|---------|-------|
| Memcheck (default) | `valgrind ./prog` | Memory errors, leaks |
| Helgrind | `valgrind --tool=helgrind ./prog` | Thread races, lock-order violations |
| Callgrind | `valgrind --tool=callgrind ./prog` | CPU profiling |

> Run `valgrind` with a small input. It slows programs by 10–50×.

## Network Tools

### Wireshark

GUI packet capture tool. Lets you inspect every byte of TCP/IP traffic on your machine.

```bash
# start capturing on loopback (for local server testing)
wireshark -k -i lo
```

Filter by port: `tcp.port == 8080`

### tcpdump

CLI alternative to Wireshark:

```bash
# capture on loopback, show ASCII content
tcpdump -i lo -A port 8080
```

### netcat (nc)

```bash
nc 127.0.0.1 8080        # connect as TCP client
nc -l 4000               # listen as TCP server
echo "hello" | nc host port  # pipe stdin over TCP
```

### curl

Test HTTP servers:

```bash
curl -v http://localhost:8080/     # verbose, shows headers
curl -X POST -d '{"key":"val"}' http://localhost:8080/api
```

## Editor Setup

Any editor works. For VS Code, install the **C/C++ extension** (Microsoft) for IntelliSense, formatting, and inline debugger integration.

For `clangd`-based setups, generate a `compile_commands.json`:

```bash
bear -- make    # wraps make and captures compile commands
```
