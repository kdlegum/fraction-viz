<script>
  import FractionInput from './lib/FractionInput.svelte';
  import Visualiser from './lib/Visualiser.svelte';

  let numerator = $state(11);
  let denominator = $state(4);
  let started = $state(false);
  let step = $state(0);
  let inputFocused = $state(false);

  const TOTAL_STEPS = 6;

  function handleStart() {
    const num = Math.max(1, Math.floor(numerator));
    const den = Math.max(2, Math.floor(denominator));
    if (num <= den) {
      alert('Please enter an improper fraction (numerator > denominator)');
      return;
    }
    numerator = num;
    denominator = den;
    step = 0;
    started = true;
  }

  function handleReset() {
    started = false;
    step = 0;
  }

  function advanceStep() {
    if (step < TOTAL_STEPS - 1) {
      step++;
    }
  }

  function handleFocusIn(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      inputFocused = true;
    }
  }

  function handleFocusOut(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      inputFocused = false;
    }
  }
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.code === 'Space' && started && !inputFocused) {
      e.preventDefault();
      advanceStep();
    }
  }}
  onfocusin={handleFocusIn}
  onfocusout={handleFocusOut}
/>

<main>
  {#if !started}
    <FractionInput
      bind:numerator
      bind:denominator
      onStart={handleStart}
    />
  {:else}
    <Visualiser
      {numerator}
      {denominator}
      {step}
      onReset={handleReset}
    />
  {/if}

  {#if started && step < TOTAL_STEPS - 1}
    <button class="next-btn" onclick={advanceStep}>
      Next Step
    </button>
    <p class="spacebar-hint">or press <kbd>Space</kbd></p>
  {/if}
</main>

<style>
  :global(*) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :global(body) {
    background: #fdf6f0;
    min-height: 100vh;
    font-family: 'Baloo 2', cursive, system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;

    --text-primary: #4a3f35;
    --text-secondary: #7a6e65;
    --text-muted: #b0a49a;
    --accent: #f4845f;
    --teal: #6bb8a4;
    --slice-fill: #f4845f;
    --slice-empty: #f0e6df;
    --border: #e0d5cc;
    --dot-inactive: #e0d5cc;
  }

  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    justify-content: center;
  }

  .next-btn {
    font-family: 'Baloo 2', cursive;
    font-size: 1.2rem;
    font-weight: 700;
    color: white;
    background: var(--accent, #f4845f);
    border: none;
    border-radius: 14px;
    padding: 12px 36px;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s, background 0.2s;
    box-shadow: 0 4px 12px rgba(244, 132, 95, 0.3);
    margin-top: 1.5rem;
    -webkit-tap-highlight-color: transparent;
  }

  .next-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(244, 132, 95, 0.4);
    background: #f2734b;
  }

  .next-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(244, 132, 95, 0.3);
  }

  .spacebar-hint {
    font-family: 'Baloo 2', cursive;
    font-size: 0.85rem;
    color: var(--text-muted);
    text-align: center;
    margin-top: 0.5rem;
  }

  .spacebar-hint kbd {
    display: inline-block;
    padding: 2px 8px;
    font-family: inherit;
    font-size: 0.8rem;
    background: #f0e6df;
    border-radius: 6px;
    border: 1px solid #ddd3ca;
  }

  @media (max-width: 600px) {
    main {
      padding: 1rem 0.75rem;
    }

    .spacebar-hint {
      display: none;
    }
  }
</style>
