<script>
  import { slicePath } from './utils.js';

  let {
    index = 0,
    total = 4,
    cx = 50,
    cy = 50,
    r = 45,
    gap = 1.5,
    filled = true,
    visible = true,
    delay = 0,
    animateIn = false,
  } = $props();

  let d = $derived(slicePath(index, total, cx, cy, r, gap));
</script>

<path
  {d}
  class="slice"
  class:filled
  class:hidden={!visible}
  class:animate-in={animateIn}
  style:animation-delay="{delay}ms"
  style:--delay="{delay}ms"
/>

<style>
  .slice {
    fill: var(--slice-empty, #f0e6df);
    stroke: #fff;
    stroke-width: 1;
    transition: opacity 0.4s ease, fill 0.3s ease, transform 0.5s ease;
    transform-origin: center;
  }

  .slice.filled {
    fill: var(--slice-fill, #f4845f);
  }

  .slice.hidden {
    opacity: 0;
    transform: scale(0.5);
    pointer-events: none;
  }

  .animate-in {
    animation: sliceAppear 0.4s ease-out both;
    animation-delay: var(--delay);
  }

  @keyframes sliceAppear {
    from {
      opacity: 0;
      transform: scale(0.3);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>
