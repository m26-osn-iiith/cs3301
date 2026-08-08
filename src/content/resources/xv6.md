---
title: xv6
order: 3
summary: The teaching OS used in this course.
---

## What is xv6

This course uses xv6 to teach operating systems concepts. It's a small teaching OS written for MIT's 6.828, based on Unix Version 6.
We use the RISC-V version of xv6 which you can find [here](https://github.com/mit-pdos/xv6-riscv)


## Setup and reference

Instructions for setting up xv6 and course material can be found [here](https://pdos.csail.mit.edu/6.828/2025/xv6.html).

The [xv6 book](https://pdos.csail.mit.edu/6.828/2025/xv6/book-riscv-rev5.pdf) provides a more in depth explanation about the workings of xv6.

## Installation

### Linux

The only prerequisites for installing xv6 are `qemu`, `gdb` and the RISC-V GNU toolchain.

More specifically, `qemu-system` and not `qemu-user` (which is what you most likely have installed from CSO last semester). This is because you're emulating an entire machine instead of just a single program. It can be installed from your distro's package manager.

You also need a RISC-V cross compiler toolchain (`riscv64-linux-gnu-gcc` or similar), along with `make` and standard build tools. Check your package manager for a `riscv64-*-toolchain` or `riscv64-linux-gnu-gcc` package.

You will need a `gdb` that supports RISC-V architecture. On Arch Linux, it does out of the box, but for other distros, you might need to install `gdb-multiarch`. `riscv64-linux-gnu-gdb` works too. Can be installed from your distro's package manager.

Then, clone the xv6 repository:

```
git clone https://github.com/mit-pdos/xv6-riscv
```

### MacOS

Make sure you have `homebrew` installed.

Then install the following dependencies :

```bash
brew tap riscv-software-src/riscv
brew install qemu riscv-gnu-toolchain
```

Then, clone the xv6 repository:

```bash
git clone https://github.com/mit-pdos/xv6-riscv
```

### Other platforms

Regardless of whether you're on a niche unsupported Linux distro (btw) or on Windows or MacOS, your best bet (and most practical choice) is to work in a **container environment**.

Install [distrobox](https://distrobox.it/) and run:

```bash
distrobox create --name osn --image ubuntu:latest
```

To spawn a shell in your container, run:

```bash
distrobox enter --name osn
```

Then proceed with setup as specified in the Linux section.

To use VSCode in this container, refer to [this article](https://code.visualstudio.com/docs/devcontainers/containers).

## Running

To get started, run:

```bash
make qemu
```

This spawns the xv6 shell. To exit the shell, press `Ctrl + A` then `X`.

## Debugging

To run in debug mode, run these commands in 2 shells:

```bash
make qemu-gdb   # This command runs first.
```

```bash
gdb             # This one runs next.
                # You might have to run gdb-multiarch depending on your distro.
```

> When running for the first time, you might get a warning like this:
> ```
> ⚠️ warning: File ".../.gdbinit" auto-loading has been declined by your `auto-load safe-path' set to "$debugdir:$datadir/auto-load:.....".
> To enable execution of this file add
>         add-auto-load-safe-path .../.gdbinit
> line to your configuration file "~/gdb/gdbinit".
> To completely disable this security protection add
>         set auto-load safe-path /
> line to your configuration file "/home/gautam/.config/gdb/gdbinit".
> For more information about this security protection see the
> "Auto-loading safe path" section in the GDB manual.  E.g., run from the shell:
>         info "(gdb)Auto-loading safe path"
> ```
> Just follow the instructions. Any other gdb commands that you'd like to run on startup, you can place in this file.

You should be connected to the kernel automatically. If not, connect using

```gdb
target remote localhost:26000
```

Now, you can use standard gdb commands (can't use `run` here, the kernel already started up. You can use `continue` to start execution) and use the xv6 shell.

The program running is the kernel itself, so debug symbols are restricted to the kernel code. However, you can debug user programs too.

Compiled user program binaries on xv6 will be in the `user/` directory and prefixed with an underscore.

To debug a user program, say `cat`, you will need to run this in GDB:

```gdb
add-symbol-file user/_cat
```

`cat`'s debug symbols will now be available in the current context. You can run commands like:

```gdb
break main
break user/cat.c:26
```

This is also the first time you will be debugging a multi-threaded program. This section may not be relevant to you now but it will be later in the course.

To view running threads, run:

```gdb
info threads
```

Sample output:

```text
Id   Target Id                    Frame 
  1    Thread 1.1 (CPU#0 [halted ]) s_sstatus (x=2) at kernel/riscv.h:67
  2    Thread 1.2 (CPU#1 [halted ]) s_sstatus (x=2) at kernel/riscv.h:67
* 3    Thread 1.3 (CPU#2 [halted ]) scheduler () at kernel/proc.c:461
```

To switch to a thread (in the sample output, we are on thread 3), say 2, run:

```gdb
thread 2
```

## Tips

### Cleaning the build

If you switch branches, change Makefile variables like `CPUS`, or run into weird build errors, run:

```bash
make clean
```

This removes all compiled files and the kernel image, so the next `make` starts fresh.

### `clangd` support with compile_commands.json

xv6 uses a custom Makefile, so tools like `clangd` cannot parse the code properly out of the box. You can fix this with `bear`, which records every compiler call during a build and writes them into a `compile_commands.json` file.

Install `bear` from your package manager, then run:

```bash
make clean
bear -- make qemu
```

This gives you a `compile_commands.json` file in the project root. Point your editor's clangd setup at this file and you get proper autocomplete and go to definition.
