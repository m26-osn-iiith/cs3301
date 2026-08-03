<svelte:head>
  <title>Policy — CS3.301</title>
</svelte:head>

<div class="page-header">
  <h1>Course Policy</h1>
  <p>Grading, attendance, and academic integrity for CS3.301.</p>
</div>

<div class="policy-sections">
  {#each ['Grading', 'Late Policy', 'Attendance', 'Collaboration', 'Academic Integrity'] as section}
    <section class="policy-section">
      <h2 class="section-title">{section}</h2>
      <div class="content-placeholder">
        <p class="placeholder-text">Content for {section} will appear here.</p>
      </div>
    </section>
  {/each}
</div>

<style>
  .policy-sections {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .section-title {
    font-size: 16px;
    font-weight: 650;
    color: var(--text);
    margin-bottom: 14px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
  }

  .content-placeholder {
    min-height: 80px;
    border: 1px dashed var(--border-strong);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--muted-bg);
  }

  .placeholder-text {
    font-size: 13.5px;
    color: var(--text-4);
  }
</style>
