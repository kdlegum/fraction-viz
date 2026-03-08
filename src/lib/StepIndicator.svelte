<script>
  let { currentStep = 0, totalSteps = 6 } = $props();
</script>

<div class="step-indicator">
  {#each Array(totalSteps) as _, i}
    <div
      class="dot"
      class:active={i === currentStep}
      class:completed={i < currentStep}
    ></div>
  {/each}
</div>

<style>
  .step-indicator {
    display: flex;
    gap: 10px;
    justify-content: center;
    padding: 1rem 0;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--dot-inactive, #e0d5cc);
    transition: all 0.3s ease;
  }

  .dot.active {
    background: var(--accent, #f4845f);
    transform: scale(1.3);
    box-shadow: 0 0 0 3px rgba(244, 132, 95, 0.25);
  }

  .dot.completed {
    background: var(--teal, #6bb8a4);
  }
</style>
