---
n: 4
title: Networking Fundamentals
date: "2026-09-21"
summary: Packets, protocols, and the layered model that makes the internet work.
---

## Packets

All network communication reduces to **packets** — discrete chunks of bytes sent from one machine to another. Packets have a fixed maximum size (the MTU, typically 1500 bytes on Ethernet) and travel independently through the network. Two packets from the same TCP connection may take different routes and arrive out of order.

## IP: The Network Layer

The **Internet Protocol** (IP) provides best-effort delivery of packets across networks. "Best-effort" means:

- No guarantee of delivery
- No guarantee of ordering
- No guarantee of timing
- Packets may be duplicated

IP addresses identify machines on the network. IPv4 addresses are 32-bit integers written in dotted decimal: `192.168.1.1`. IPv6 uses 128-bit addresses: `2001:db8::1`.

### IP Header Fields

| Field | Size | Purpose |
|-------|------|---------|
| Version | 4 bits | IPv4 or IPv6 |
| TTL | 8 bits | Hop limit; decremented at each router |
| Protocol | 8 bits | TCP (6), UDP (17), ICMP (1) |
| Source IP | 32 bits | Sender's address |
| Dest IP | 32 bits | Receiver's address |

## TCP: Reliable Delivery

**TCP** (Transmission Control Protocol) sits above IP and adds:

- **Reliability** — retransmits lost packets
- **Ordering** — delivers bytes in the order sent
- **Flow control** — sender won't overwhelm a slow receiver
- **Congestion control** — backs off when the network is congested

### The TCP Handshake

```text
Client                         Server
  |  ──── SYN ──────────────>  |   (client wants to connect)
  |  <─── SYN-ACK ──────────   |   (server acknowledges)
  |  ──── ACK ──────────────>  |   (client confirms)
  |          [connected]        |
```

After the three-way handshake, both sides have a **socket** — a file descriptor backed by a kernel data structure that tracks connection state.

### TCP vs. UDP

| Property | TCP | UDP |
|----------|-----|-----|
| Reliable delivery | Yes | No |
| Ordering | Yes | No |
| Connection setup | 3-way handshake | None |
| Overhead | Higher | Lower |
| Use cases | HTTP, SSH, databases | DNS, video streaming, games |

## The Socket API

Sockets are the OS interface to the network. A socket looks like a file: you `read()` and `write()` it like any other fd.

```c
// create a TCP socket
int fd = socket(AF_INET, SOCK_STREAM, 0);

// connect to a server
struct sockaddr_in addr = {
    .sin_family = AF_INET,
    .sin_port   = htons(80),
};
inet_pton(AF_INET, "93.184.216.34", &addr.sin_addr);
connect(fd, (struct sockaddr *)&addr, sizeof(addr));

// send HTTP request
write(fd, "GET / HTTP/1.0\r\n\r\n", 18);

// read response
char buf[4096];
ssize_t n = read(fd, buf, sizeof(buf));
```

> Port numbers below 1024 are privileged on Unix — only root can bind to them. This is why web servers typically run as root and then drop privileges, or use port 8080 in development.

## DNS

Before you can connect to `example.com`, you need its IP address. **DNS** (Domain Name System) is a distributed database that maps hostnames to IPs.

```bash
$ dig example.com
;; ANSWER SECTION:
example.com.    3600  IN  A   93.184.216.34
```

DNS uses **UDP** by default (port 53) because queries and responses are small and one round-trip is enough. TCP is used for large responses (e.g., zone transfers).
