<script>
  import PieCircle from './PieCircle.svelte';
  import StepLabel from './StepLabel.svelte';
  import StepIndicator from './StepIndicator.svelte';
  import { ordinalWord, ordinalWordPlural, toMixedNumber, slicePath } from './utils.js';

  let { numerator = 11, denominator = 4, step = 0, onReset = () => {} } = $props();

  let mixed = $derived(toMixedNumber(numerator, denominator));

  let visiblePieces = $state(0);
  let pieceTimer = $state(null);

  $effect(() => {
    if (step === 3) {
      visiblePieces = 0;
      let count = 0;
      pieceTimer = setInterval(() => {
        count++;
        visiblePieces = count;
        if (count >= numerator) {
          clearInterval(pieceTimer);
        }
      }, 150);
    }
    return () => {
      if (pieceTimer) clearInterval(pieceTimer);
    };
  });

  $effect(() => {
    if (step === 4) {
      visiblePieces = numerator;
    }
  });

  let step4Phase = $state('settling');
  let step4MovedCount = $state(0);
  let step4Timer = $state(null);

  let step4Timing = $derived.by(() => {
    const total = numerator;
    if (total <= 12) return { perSlice: 300, groupPause: 800, duration: 1.2 };
    if (total <= 30) return { perSlice: 180, groupPause: 500, duration: 0.9 };
    if (total <= 80) return { perSlice: 80, groupPause: 300, duration: 0.6 };
    return { perSlice: 20, groupPause: 100, duration: 0.3 };
  });

  $effect(() => {
    if (step === 4) {
      step4Phase = 'settling';
      step4MovedCount = 0;

      const settleTime = 600;
      step4Timer = setTimeout(() => {
        step4Phase = 'moving';
        const { perSlice, groupPause } = step4Timing;
        let current = 0;

        function moveNext() {
          current++;
          step4MovedCount = current;
          if (current >= numerator) return;
          const pause = (current % denominator === 0) ? groupPause : 0;
          step4Timer = setTimeout(moveNext, perSlice + pause);
        }

        step4Timer = setTimeout(moveNext, perSlice);
      }, settleTime);
    }
    return () => {
      if (step4Timer) clearTimeout(step4Timer);
    };
  });

  let ordWord = $derived(ordinalWord(denominator));
  let ordWordPlural = $derived(ordinalWordPlural(denominator));

  let pieceSize = $derived(Math.min(80, Math.max(40, 300 / denominator)));
  let circleSize = 120;
  let gridGap = 8;
  let groupGap = 24;
  let circleRowGap = 16;

  let nGroups = $derived(mixed.remainderNumerator > 0 ? mixed.whole + 1 : mixed.whole);
  let circleCols = $derived(Math.max(1, Math.floor((containerWidth + groupGap) / (circleSize + groupGap))));
  let circleRows = $derived(Math.ceil(nGroups / circleCols));
  let circleAreaHeight = $derived(circleRows * circleSize + (circleRows - 1) * circleRowGap);

  let containerWidth = $state(500);

  function pieceVisible(i) {
    return i < visiblePieces || step === 4;
  }

  function gridPosition(i) {
    const cellSize = pieceSize + gridGap;
    const cols = Math.max(1, Math.floor((containerWidth + gridGap) / cellSize));
    const totalRows = Math.ceil(numerator / cols);
    const row = Math.floor(i / cols);
    const itemsInRow = row < totalRows - 1 ? cols : numerator - row * cols;
    const col = i % cols;
    const rowWidth = itemsInRow * cellSize - gridGap;
    const rowOffsetX = (containerWidth - rowWidth) / 2;
    return { x: rowOffsetX + col * cellSize, y: row * cellSize };
  }

  function circlePosition(i) {
    const gi = Math.floor(i / denominator);
    const row = Math.floor(gi / circleCols);
    const col = gi % circleCols;
    const itemsInRow = row < circleRows - 1 ? circleCols : nGroups - row * circleCols;
    const rowWidth = itemsInRow * circleSize + (itemsInRow - 1) * groupGap;
    const rowOffsetX = (containerWidth - rowWidth) / 2;
    const x = rowOffsetX + col * (circleSize + groupGap) + (circleSize - pieceSize) / 2;
    const y = row * (circleSize + circleRowGap) + (circleSize - pieceSize) / 2;
    return { x, y };
  }

  function belowCirclesGridPosition(i) {
    const cellSize = pieceSize + gridGap;
    const cols = Math.max(1, Math.floor((containerWidth + gridGap) / cellSize));
    const totalRows = Math.ceil(numerator / cols);
    const row = Math.floor(i / cols);
    const itemsInRow = row < totalRows - 1 ? cols : numerator - row * cols;
    const col = i % cols;
    const rowWidth = itemsInRow * cellSize - gridGap;
    const rowOffsetX = (containerWidth - rowWidth) / 2;
    const yOffset = circleAreaHeight + 24;
    return { x: rowOffsetX + col * cellSize, y: yOffset + row * cellSize };
  }

  function pieceTransform(i) {
    if (step === 4) {
      if (i < step4MovedCount) {
        const { x, y } = circlePosition(i);
        const sliceIndex = i % denominator;
        const rotation = sliceIndex * (360 / denominator);
        const s = circleSize / pieceSize;
        return `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${s})`;
      }
      const { x, y } = belowCirclesGridPosition(i);
      return `translate(${x}px, ${y}px) rotate(0deg) scale(1)`;
    }
    const { x, y } = gridPosition(i);
    const s = pieceVisible(i) ? 1 : 0;
    return `translate(${x}px, ${y}px) rotate(0deg) scale(${s})`;
  }

  function pieceDelay(_i) {
    return 0;
  }

  function pieceDuration(_i) {
    if (step === 4) {
      if (step4Phase === 'settling') return 0.5;
      return step4Timing.duration;
    }
    return 0.35;
  }

  let step4CompletedGroups = $derived(Math.floor(step4MovedCount / denominator));

  let containerHeight = $derived.by(() => {
    const cellSize = pieceSize + gridGap;
    const cols = Math.max(1, Math.floor((containerWidth + gridGap) / cellSize));
    if (step === 4) {
      // Fixed grid height based on total pieces (doesn't shrink as pieces leave)
      const gridRows = Math.ceil(numerator / cols);
      if (step4MovedCount >= numerator) return circleAreaHeight + 8;
      return circleAreaHeight + 24 + gridRows * cellSize + 8;
    }
    return Math.ceil(numerator / cols) * cellSize;
  });

  let totalGroups = $derived(nGroups);

  let circleFilledCount = $derived(step === 2 ? 1 : denominator);
  let circleShowSlices = $derived(step >= 1);
  let circleHighlightIndex = $derived(step === 2 ? 0 : -1);
  let circleAnimateSlices = $derived(step === 1);
  let circleLabel = $derived(
    step === 0 ? "1" :
    step === 1 ? `${denominator} ${ordWordPlural}` :
    `One ${ordWord} = 1/${denominator}`
  );

  let labelText = $derived(
    step === 0 ? "Meet the whole" :
    step === 1 ? "Cutting into pieces" :
    "One piece"
  );
  let labelSubtitle = $derived(
    step === 0 ? "This is one whole circle" :
    step === 1 ? `Dividing into ${denominator} equal parts` :
    `Each piece is one ${ordWord}`
  );
</script>

<div class="visualiser">
  <StepIndicator currentStep={step} totalSteps={6} />

  <div class="stage">
    {#if step <= 2}
      <div class="step-content">
        {#key step}
          <StepLabel text={labelText} subtitle={labelSubtitle} />
        {/key}
        <div class="center-area">
          <PieCircle
            {denominator}
            filledCount={circleFilledCount}
            showSlices={circleShowSlices}
            highlightIndex={circleHighlightIndex}
            animateSlices={circleAnimateSlices}
            size={160}
            label={circleLabel}
          />
        </div>
      </div>
    {/if}

    {#if step === 3 || step === 4}
      <div class="step-content" class:no-entry-anim={step === 4}>
        {#key step}
          <StepLabel
            text={step === 3 ? "Collecting pieces" : "Making wholes"}
            subtitle={step === 3 ? `We have ${numerator} ${ordWordPlural}!` : "Let's group them into whole circles!"}
          />
        {/key}
        <div
          class="pieces-container"
          bind:clientWidth={containerWidth}
          style:min-height="{containerHeight}px"
        >
          {#each Array(numerator) as _, i}
            <div
              class="piece-abs"
              style:transform={pieceTransform(i)}
              style:opacity={pieceVisible(i) ? 1 : 0}
              style:transition-delay="{pieceDelay(i)}ms, 0ms"
              style:transition-duration="{pieceDuration(i)}s, 0.3s"
              style:width="{pieceSize}px"
              style:height="{pieceSize}px"
              style:z-index={step === 4 && i < step4MovedCount ? 2 : 1}
            >
              <svg
                viewBox="0 0 {pieceSize} {pieceSize}"
                width={pieceSize}
                height={pieceSize}
              >
                <path
                  d={slicePath(0, denominator, pieceSize / 2, pieceSize / 2, pieceSize / 2 - 3, step === 4 ? 1.5 : 0)}
                  class="piece-slice"
                />
              </svg>
            </div>
          {/each}
        </div>

        {#if step === 3}
          <div class="equation-label">
            {visiblePieces} {ordWordPlural} = {visiblePieces}/{denominator}
          </div>
        {/if}

        {#if step === 4}
          <div class="group-labels" style:--group-gap="{groupGap}px" style:--circle-row-gap="{circleRowGap}px">
            {#each Array(totalGroups) as _, gi}
              {@const isRemainder = gi === mixed.whole && mixed.remainderNumerator > 0}
              {@const groupDone = isRemainder ? step4MovedCount >= numerator : gi < step4CompletedGroups}
              {#if groupDone}
                <div
                  class="group-label-item"
                  style:width="{circleSize}px"
                >
                  {#if isRemainder}
                    {mixed.remainderNumerator}/{denominator}
                  {:else}
                    1
                  {/if}
                </div>
              {:else}
                <div style:width="{circleSize}px"></div>
              {/if}
            {/each}
          </div>
        {/if}
      </div>
    {/if}

    {#if step === 5}
      <div class="step-content">
        <StepLabel
          text="The answer!"
        />

        <div class="step5-circles" style:--group-gap="{groupGap}px" style:--circle-row-gap="{circleRowGap}px">
          {#each Array(totalGroups) as _, gi}
            {@const isRemainder = gi === mixed.whole && mixed.remainderNumerator > 0}
            {@const filled = isRemainder ? mixed.remainderNumerator : denominator}
            <PieCircle
              {denominator}
              filledCount={filled}
              showSlices={true}
              size={circleSize}
              label={isRemainder ? `${mixed.remainderNumerator}/${denominator}` : '1'}
            />
          {/each}
        </div>

        <div class="answer-area">
          <div class="sum-line">
            {#each Array(mixed.whole) as _, i}
              <span class="sum-num">1</span>
              {#if i < mixed.whole - 1}
                <span class="sum-op">+</span>
              {/if}
            {/each}
            {#if mixed.remainderNumerator > 0}
              <span class="sum-op">+</span>
              <span class="sum-num">{mixed.remainderNumerator}/{denominator}</span>
            {/if}
            <span class="sum-op">=</span>
            <span class="sum-num whole-result">
              {mixed.whole}{#if mixed.remainderNumerator > 0}
                <span style="font-size:0.7em"> {mixed.remainderNumerator}/{denominator}</span>
              {/if}
            </span>
          </div>

          <div class="final-answer">
            <span class="big-whole">{mixed.whole}</span>
            {#if mixed.remainderNumerator > 0}
              <span class="big-fraction">
                <span class="big-num">{mixed.remainderNumerator}</span>
                <span class="big-bar"></span>
                <span class="big-den">{denominator}</span>
              </span>
            {/if}
          </div>

          <div class="original-equation">
            <span class="orig-frac">{numerator}/{denominator}</span>
            <span class="orig-eq">=</span>
            <span class="orig-mixed">
              {mixed.whole}
              {#if mixed.remainderNumerator > 0}
                {mixed.remainderNumerator}/{denominator}
              {/if}
            </span>
          </div>

          <button class="restart-btn" onclick={onReset}>
            Try another!
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .visualiser {
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
    padding: 1rem;
  }

  .stage {
    min-height: 350px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .step-content {
    width: 100%;
    animation: fadeInStep 0.4s ease-out;
  }

  .step-content.no-entry-anim {
    animation: none;
  }

  @keyframes fadeInStep {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .center-area {
    display: flex;
    justify-content: center;
    padding: 1.5rem 0;
  }

  .pieces-container {
    position: relative;
    width: 100%;
    transition: min-height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    margin: 1rem 0;
  }

  .piece-abs {
    position: absolute;
    top: 0;
    left: 0;
    transition-property: transform, opacity;
    transition-duration: 0.35s, 0.3s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1), ease-out;
    transform-origin: center center;
  }

  .piece-slice {
    fill: var(--slice-fill, #f4845f);
    filter: drop-shadow(0 1px 3px rgba(0,0,0,0.1));
  }

  .equation-label {
    text-align: center;
    font-family: 'Baloo 2', cursive;
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--teal, #6bb8a4);
    margin-top: 0.5rem;
    animation: fadeInStep 0.5s ease-out 0.3s both;
  }

  .group-labels {
    display: flex;
    justify-content: center;
    gap: var(--circle-row-gap, 8px) var(--group-gap, 24px);
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }

  .group-label-item {
    text-align: center;
    font-family: 'Baloo 2', cursive;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--teal, #6bb8a4);
    animation: fadeInStep 0.4s ease-out both;
  }

  .step5-circles {
    display: flex;
    justify-content: center;
    gap: var(--circle-row-gap, 16px) var(--group-gap, 24px);
    padding: 1rem 0 0.5rem;
    flex-wrap: wrap;
  }

  .answer-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    padding: 1rem 0;
  }

  .sum-line {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: 'Baloo 2', cursive;
    font-size: 1.5rem;
    color: var(--text-secondary, #7a6e65);
    animation: fadeInStep 0.4s ease-out;
  }

  .sum-num {
    font-weight: 700;
  }

  .whole-result {
    color: var(--teal, #6bb8a4);
    font-size: 1.8rem;
  }

  .sum-op {
    font-weight: 500;
  }

  .final-answer {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    animation: answerPop 0.6s ease-out 0.3s both;
  }

  @keyframes answerPop {
    from { opacity: 0; transform: scale(0.5); }
    60% { transform: scale(1.1); }
    to { opacity: 1; transform: scale(1); }
  }

  .big-whole {
    font-family: 'Baloo 2', cursive;
    font-size: 5rem;
    font-weight: 800;
    color: var(--text-primary, #4a3f35);
    line-height: 1;
  }

  .big-fraction {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    margin-left: 4px;
  }

  .big-num, .big-den {
    font-family: 'Baloo 2', cursive;
    font-size: 2.2rem;
    font-weight: 700;
    color: var(--accent, #f4845f);
    line-height: 1;
  }

  .big-bar {
    width: 100%;
    height: 3px;
    background: var(--text-primary, #4a3f35);
    border-radius: 2px;
    min-width: 30px;
  }

  .original-equation {
    font-family: 'Baloo 2', cursive;
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--text-secondary, #7a6e65);
    animation: fadeInStep 0.4s ease-out 0.6s both;
  }

  .orig-frac {
    color: var(--accent, #f4845f);
  }

  .orig-eq {
    margin: 0 0.5rem;
  }

  .orig-mixed {
    color: var(--teal, #6bb8a4);
  }

  .restart-btn {
    font-family: 'Baloo 2', cursive;
    font-size: 1.2rem;
    font-weight: 700;
    color: white;
    background: var(--teal, #6bb8a4);
    border: none;
    border-radius: 14px;
    padding: 10px 28px;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 12px rgba(107, 184, 164, 0.3);
    margin-top: 0.5rem;
    animation: fadeInStep 0.4s ease-out 0.8s both;
  }

  .restart-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(107, 184, 164, 0.4);
  }

  @media (max-width: 600px) {
    .visualiser {
      padding: 0.5rem;
    }

    .stage {
      min-height: 250px;
    }

    .sum-line {
      font-size: 1.1rem;
      gap: 0.3rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .whole-result {
      font-size: 1.4rem;
    }

    .big-whole {
      font-size: 3.5rem;
    }

    .big-num, .big-den {
      font-size: 1.6rem;
    }

    .original-equation {
      font-size: 1.1rem;
    }
  }
</style>
