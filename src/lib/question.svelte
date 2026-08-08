<script>
  import { answers } from '$lib/answers.js';

  let { n } = $props();
  let answer = $state('');

  $effect(() => {
    answers.update(a => ({ ...a, [n]: answer }));
    return () => {
      answers.update(a => {
        const next = { ...a };
        delete next[n];
        return next;
      });
    };
  });

  function autoresize(node) {
    function resize() {
      node.style.height = 'auto';
      node.style.height = node.scrollHeight + 'px';
    }
    node.addEventListener('input', resize);
    return { destroy: () => node.removeEventListener('input', resize) };
  }
</script>

<div class="question">
  <div class="q-label">Q{n}</div>
  <div class="q-text"><slot /></div>
  <textarea
    class="q-answer"
    placeholder="Answer..."
    bind:value={answer}
    rows={3}
    use:autoresize
  ></textarea>
</div>

<style>
  .question {
    border: 1px solid var(--border);
    border-left: 3px solid var(--border-strong);
    border-radius: 8px;
    padding: 16px 18px;
    margin: 20px 0;
    background: var(--muted-bg);
  }

  .q-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-3);
    margin-bottom: 8px;
  }

  .q-text {
    font-size: 14.5px;
    color: var(--text);
    line-height: 1.65;
  }

  .q-text :global(p) {
    margin: 0;
  }

  .q-answer {
    display: block;
    width: 100%;
    margin-top: 12px;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--card-bg);
    color: var(--text);
    font-family: var(--font-sans);
    font-size: 14px;
    line-height: 1.6;
    resize: none;
    overflow: hidden;
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }

  .q-answer::placeholder {
    color: var(--text-4);
  }

  .q-answer:focus {
    border-color: var(--border-strong);
  }
</style>
