<script>
  import '../app.css';
  import Sidebar from '$lib/sidebar.svelte';
  import { page } from '$app/state';
  import favicon from '$lib/assets/favicon.svg';
  import Menu from 'lucide-svelte/icons/menu';
  import X from 'lucide-svelte/icons/x';
  import course from '$lib/data/course.json';

  let { children } = $props();
  let draweropen = $state(false);

  $effect(() => {
    page.url.pathname;
    draweropen = false;
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100..900;1,100..900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
</svelte:head>

<div class="layout">
  <aside class="sidebar">
    <Sidebar />
  </aside>

  <div class="topbar">
    <button class="hamburger" onclick={() => draweropen = !draweropen} aria-label="Toggle menu">
      {#if draweropen}
        <X size={20} strokeWidth={2} />
      {:else}
        <Menu size={20} strokeWidth={2} />
      {/if}
    </button>
    <span class="topbar-title">{course.code} {course.name}</span>
  </div>

  {#if draweropen}
    <div
      class="backdrop"
      onclick={() => draweropen = false}
      role="presentation"
    ></div>
  {/if}

  <div class="drawer {draweropen ? 'open' : ''}">
    <Sidebar onclose={() => draweropen = false} />
  </div>

  <main class="main">
    <div class="content">
      {@render children()}
    </div>
  </main>
</div>

<style>
  .layout {
    min-height: 100vh;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 272px;
    background: var(--sidebar-bg);
    border-right: 1px solid var(--border);
    padding: 26px 16px 20px;
    overflow-y: auto;
    z-index: 40;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  .topbar {
    display: none;
  }

  .drawer {
    display: none;
  }

  .backdrop {
    display: none;
  }

  .main {
    margin-left: 272px;
    padding: 64px 72px 100px;
    box-sizing: border-box;
  }

  .content {
    max-width: 740px;
    margin: 0 auto;
  }

  @media (max-width: 960px) {
    .sidebar {
      display: none;
    }

    .topbar {
      display: flex;
      align-items: center;
      gap: 12px;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 56px;
      background: var(--sidebar-bg);
      border-bottom: 1px solid var(--border);
      padding: 0 16px;
      z-index: 50;
    }

    .topbar-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .hamburger {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text);
      display: flex;
      align-items: center;
      padding: 4px;
      border-radius: 6px;
      flex-shrink: 0;
    }

    .hamburger:hover {
      background: var(--hover-bg);
    }

    .backdrop {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 55;
    }

    .drawer {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 280px;
      background: var(--sidebar-bg);
      padding: 24px 22px 20px;
      z-index: 60;
      overflow-y: auto;
      transform: translateX(-100%);
      transition: transform 0.25s ease;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }

    .drawer.open {
      transform: translateX(0);
    }

    .main {
      margin-left: 0;
      margin-top: 56px;
      padding: 32px 20px 72px;
    }

    .content {
      max-width: 100%;
    }
  }
</style>
