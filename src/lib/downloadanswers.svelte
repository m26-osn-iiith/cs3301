<script>
  import { answers } from '$lib/answers.js';
  import { get } from 'svelte/store';
  import Download from 'lucide-svelte/icons/download';

  let { title = 'Homework' } = $props();

  function download() {
    const a = get(answers);
    const entries = Object.entries(a).sort(([x], [y]) => Number(x) - Number(y));
    const body = entries
      .map(([n, ans]) => `Q${n}:\n${ans?.trim() || '(no answer)'}`)
      .join('\n\n');
    const text = `${title}\n${'─'.repeat(title.length)}\n\n${body}\n`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a2 = document.createElement('a');
    a2.href = url;
    a2.download = `${title.toLowerCase().replace(/\s+/g, '-')}-answers.txt`;
    a2.click();
    URL.revokeObjectURL(url);
  }
</script>

<div class="download-row">
  <button onclick={download} class="download-btn">
    <Download size={13} strokeWidth={2.2} />
    Download answers
  </button>
</div>

<style>
  .download-row {
    display: flex;
    justify-content: flex-end;
    margin-top: 32px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
  }

  .download-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border: 1px solid var(--border);
    border-radius: 7px;
    background: var(--card-bg);
    color: var(--text-2);
    font-family: var(--font-sans);
    font-size: 13.5px;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }

  .download-btn:hover {
    border-color: var(--border-strong);
    color: var(--text);
  }
</style>
