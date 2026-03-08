<script>
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';

  export let data;

  function notifyElectron() {
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.send(
        'chapter:navigate',
        JSON.stringify({ chapterSlug: data.chapter })
      );
    }
  }

  let hasError = false;
  let errorInfo = null;

  function openEditor() {
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.send('chapter:edit', hasError && errorInfo ? JSON.stringify(errorInfo) : '');
    }
  }

  let contentEl;
  let dropdownOpen = false;

  function closeDropdown(e) {
    if (!e.target.closest?.('.chapter-nav-wrapper')) dropdownOpen = false;
  }

  onMount(() => {
    notifyElectron();
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.receive('game:error', ({ message, sourceId, line }) => {
        hasError = true;
        errorInfo = { message, sourceId, line };
      });
      window.electronAPI.receive('game:clear-error', () => {
        hasError = false;
        errorInfo = null;
      });
      // Signal main process that listeners are ready — it will replay any
      // error that fired before this page hydrated.
      window.electronAPI.send('left:ready', '');
    }
  });

  afterNavigate(() => {
    notifyElectron();
    hasError = false;
    errorInfo = null;
    if (contentEl) contentEl.scrollTop = 0;
    // Remember position so the app reopens to this step.
    localStorage.setItem('starfighter:lastPath', `/chapter/${data.chapter}/${data.step}`);
  });
</script>

<svelte:window on:click={closeDropdown} />

<div class="chapter-layout">
  <div class="content" bind:this={contentEl}>
    <div class="step-label">
      <span class="chapter-nav-wrapper">
        <button class="chapter-title-btn" on:click|stopPropagation={() => (dropdownOpen = !dropdownOpen)}>
          Chapter {data.chapterIndex + 1}: {data.chapterTitle} <span class="caret">{dropdownOpen ? '▴' : '▾'}</span>
        </button>
        {#if dropdownOpen}
          <div class="chapter-dropdown">
            {#each data.chapterNav as ch, i}
              {#if ch.href}
                <a
                  href={ch.href}
                  class="chapter-option"
                  class:active={ch.slug === data.chapter}
                  on:click={() => (dropdownOpen = false)}
                >
                  <span class="chapter-num">Ch {i + 1}</span>{ch.title}
                </a>
              {/if}
            {/each}
          </div>
        {/if}
      </span>
      &mdash; Step {data.stepIndex + 1} of {data.totalSteps}
    </div>

    <div class="markdown">
      {@html data.content}
    </div>
  </div>

  <div class="footer">
    <div class="nav">
      {#if data.prev}
        <a href={data.prev} class="btn btn-nav">← Prev</a>
      {:else}
        <span class="btn btn-nav btn-disabled">← Prev</span>
      {/if}

      {#if data.next}
        <a href={data.next} class="btn btn-nav btn-primary">Next →</a>
      {:else}
        <span class="btn btn-nav btn-disabled">Next →</span>
      {/if}
    </div>

    {#if data.stepIndex === data.totalSteps - 1}
      {#if data.chapterIndex < data.totalChapters - 1 && data.next}
        <a href={data.next} class="btn btn-next-chapter">Next Chapter →</a>
      {:else}
        <span class="btn btn-next-chapter btn-disabled">Congrats! You've finished it!</span>
      {/if}
    {/if}

    <button class="btn btn-edit" class:btn-edit-error={hasError} on:click={openEditor}>
      {#if hasError}⚠ Fix in VS Code{:else}✏ Edit in VS Code{/if}
    </button>
  </div>
</div>

<style>
  .chapter-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #1a1a2e;
    color: #e0e0e0;
  }

  .content {
    flex: 1;
    overflow-y: auto;
    padding: 2rem 1.75rem 1rem;
  }

  .step-label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #7c84a0;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.4em;
    flex-wrap: wrap;
  }

  .chapter-nav-wrapper {
    position: relative;
    display: inline-flex;
  }

  .chapter-title-btn {
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    font-size: inherit;
    font-weight: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    color: #a0aacc;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.3em;
    border-radius: 4px;
    transition: color 0.15s;
  }

  .chapter-title-btn:hover {
    color: #ffffff;
  }

  .caret {
    font-size: 0.85em;
    opacity: 0.85;
  }

  .chapter-dropdown {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    z-index: 200;
    background: #1e2140;
    border: 1px solid #3a3f6b;
    border-radius: 8px;
    min-width: 220px;
    padding: 0.3rem 0;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  }

  .chapter-option {
    display: flex;
    align-items: baseline;
    gap: 0.6em;
    padding: 0.5rem 0.9rem;
    color: #a0aacc;
    text-decoration: none;
    font-size: 0.8rem;
    letter-spacing: 0.04em;
    transition: background 0.1s, color 0.1s;
  }

  .chapter-option:hover {
    background: #2a2f55;
    color: #ffffff;
  }

  .chapter-option.active {
    color: #79c0ff;
  }

  .chapter-option.active::after {
    content: '✓';
    margin-left: auto;
    opacity: 0.6;
  }

  .chapter-num {
    opacity: 0.5;
    min-width: 2.5em;
  }

  .btn-next-chapter {
    background: #1a3a2a;
    color: #56d364;
    border: 1px solid #2ea043;
    font-size: 0.85rem;
    font-weight: 600;
    padding: 0.45rem 1.1rem;
    border-radius: 6px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    transition: background 0.15s;
  }

  .btn-next-chapter:hover {
    background: #2ea043;
    color: #ffffff;
  }

  .markdown :global(h1) {
    font-size: 1.6rem;
    font-weight: 700;
    margin: 0 0 1rem;
    color: #ffffff;
    line-height: 1.3;
  }

  .markdown :global(h2) {
    font-size: 1.2rem;
    font-weight: 600;
    margin: 1.75rem 0 0.6rem;
    color: #c9d1f5;
  }

  .markdown :global(h3) {
    font-size: 1rem;
    font-weight: 600;
    margin: 1.25rem 0 0.4rem;
    color: #a0aacc;
  }

  .markdown :global(p) {
    font-size: 0.95rem;
    line-height: 1.7;
    margin: 0 0 1rem;
    color: #c0c8e0;
  }

  .markdown :global(code) {
    font-family: 'Fira Code', 'Cascadia Code', monospace;
    font-size: 0.85em;
    background: #0d1117;
    color: #79c0ff;
    padding: 0.15em 0.4em;
    border-radius: 4px;
  }

  .markdown :global(pre) {
    background: #0d1117;
    border: 1px solid #30363d;
    border-radius: 8px;
    padding: 1rem 1.25rem;
    overflow-x: auto;
    margin: 1rem 0;
  }

  .markdown :global(pre code) {
    background: none;
    padding: 0;
    color: #e6edf3;
    font-size: 0.88rem;
    line-height: 1.6;
  }

  .markdown :global(ul),
  .markdown :global(ol) {
    padding-left: 1.5rem;
    margin: 0 0 1rem;
  }

  .markdown :global(li) {
    font-size: 0.95rem;
    line-height: 1.7;
    color: #c0c8e0;
    margin-bottom: 0.3rem;
  }

  .markdown :global(blockquote) {
    border-left: 3px solid #58a6ff;
    margin: 1rem 0;
    padding: 0.5rem 1rem;
    background: #161b22;
    border-radius: 0 6px 6px 0;
  }

  .markdown :global(blockquote p) {
    margin: 0;
    color: #8b949e;
  }

  .markdown :global(a) {
    color: #58a6ff;
    text-decoration: none;
  }

  .markdown :global(a:hover) {
    text-decoration: underline;
  }

  .footer {
    border-top: 1px solid #2a2d4a;
    padding: 0.875rem 1.75rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #16192e;
    flex-shrink: 0;
  }

  .nav {
    display: flex;
    gap: 0.5rem;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    padding: 0.45rem 1rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    border: none;
    text-decoration: none;
    transition: background 0.15s;
  }

  .btn-nav {
    background: #252844;
    color: #a0aacc;
  }

  .btn-nav:hover:not(.btn-disabled) {
    background: #2e3257;
    color: #ffffff;
  }

  .btn-primary {
    background: #3d5afe;
    color: #ffffff;
  }

  .btn-primary:hover {
    background: #536dfe;
  }

  .btn-disabled {
    opacity: 0.3;
    cursor: default;
  }

  .btn-edit {
    background: #1e3a2f;
    color: #56d364;
    border: 1px solid #238636;
    font-size: 0.85rem;
  }

  .btn-edit:hover {
    background: #238636;
    color: #ffffff;
  }

  .btn-edit-error {
    background: #3a1a1a;
    color: #ff5c5c;
    border-color: #8b2020;
  }

  .btn-edit-error:hover {
    background: #8b2020;
    color: #ffffff;
  }
</style>
