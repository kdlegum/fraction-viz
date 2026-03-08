<script>
  let { text = '', subtitle = '', visible = true, delay = 0 } = $props();
</script>

{#if visible}
  <div class="step-label" style:animation-delay="{delay}ms">
    <h2 class="title">{text}</h2>
    {#if subtitle}
      <p class="subtitle">{subtitle}</p>
    {/if}
  </div>
{/if}

<style>
  .step-label {
    text-align: center;
    animation: labelFadeIn 0.5s ease-out both;
    margin-bottom: 1.5rem;
  }

  .title {
    font-family: 'Baloo 2', cursive;
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary, #4a3f35);
    margin: 0;
    line-height: 1.2;
  }

  .subtitle {
    font-family: 'Baloo 2', cursive;
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--text-secondary, #7a6e65);
    margin: 0.25rem 0 0;
  }

  @keyframes labelFadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 600px) {
    .step-label {
      margin-bottom: 1rem;
    }

    .title {
      font-size: 1.5rem;
    }

    .subtitle {
      font-size: 1rem;
    }
  }
</style>
