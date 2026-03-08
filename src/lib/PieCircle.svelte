<script>
  import PieSlice from './PieSlice.svelte';

  let {
    denominator = 4,
    filledCount = 0,
    showSlices = false,
    highlightIndex = -1,
    size = 120,
    animateSlices = false,
    staggerDelay = 80,
    label = '',
  } = $props();

  let cx = $derived(size / 2);
  let cy = $derived(size / 2);
  let r = $derived(size / 2 - 5);
</script>

<div class="pie-circle" style:width="{size}px">
  <svg viewBox="0 0 {size} {size}" width={size} height={size}>
    <circle {cx} {cy} {r}
      class="full-circle"
      class:filled={filledCount > 0}
      class:hidden={showSlices}
    />
    {#each Array(denominator) as _, i}
      <PieSlice
        index={i}
        total={denominator}
        {cx}
        {cy}
        {r}
        filled={i < filledCount}
        visible={showSlices && (highlightIndex === -1 || highlightIndex === i)}
        delay={animateSlices ? i * staggerDelay : 0}
        animateIn={animateSlices}
      />
    {/each}
  </svg>
  {#if label}
    <div class="label">{label}</div>
  {/if}
</div>

<style>
  .pie-circle {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  svg {
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.08));
  }

  .full-circle {
    fill: var(--slice-empty, #f0e6df);
    stroke: #fff;
    stroke-width: 1;
    transition: fill 0.5s ease, opacity 0.4s ease;
  }

  .full-circle.filled {
    fill: var(--slice-fill, #f4845f);
  }

  .full-circle.hidden {
    opacity: 0;
    pointer-events: none;
  }

  .label {
    font-family: 'Baloo 2', cursive;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-secondary, #7a6e65);
    text-align: center;
    transition: opacity 0.3s ease;
  }
</style>
