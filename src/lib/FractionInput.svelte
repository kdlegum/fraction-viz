<script>
  let { numerator = $bindable(11), denominator = $bindable(4), onStart = () => {} } = $props();

  let inputFocused = $state(false);

  function handleKeydown(e) {
    if (e.key === 'Enter') {
      e.target.blur();
      onStart();
    }
  }
</script>

<div class="fraction-input">
  <h1 class="heading">Fraction Visualiser</h1>
  <p class="subheading">Enter an improper fraction and press Go!</p>

  <div class="input-row">
    <div class="fraction-display">
      <input
        type="number"
        bind:value={numerator}
        min="1"
        class="num-input"
        placeholder="11"
        onfocus={() => inputFocused = true}
        onblur={() => inputFocused = false}
        onkeydown={handleKeydown}
      />
      <div class="fraction-bar"></div>
      <input
        type="number"
        bind:value={denominator}
        min="2"
        class="num-input"
        placeholder="4"
        onfocus={() => inputFocused = true}
        onblur={() => inputFocused = false}
        onkeydown={handleKeydown}
      />
    </div>

    <button class="go-btn" onclick={onStart}>
      Go!
    </button>
  </div>

  <p class="hint">Tap <strong>Next Step</strong> to advance through steps</p>
</div>

<style>
  .fraction-input {
    text-align: center;
    padding: 2rem 1rem;
  }

  .heading {
    font-family: 'Baloo 2', cursive;
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--text-primary, #4a3f35);
    margin: 0 0 0.25rem;
  }

  .subheading {
    font-family: 'Baloo 2', cursive;
    font-size: 1.15rem;
    color: var(--text-secondary, #7a6e65);
    margin: 0 0 1.5rem;
  }

  .input-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
  }

  .fraction-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .num-input {
    font-family: 'Baloo 2', cursive;
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    width: 100px;
    border: 2px solid var(--border, #e0d5cc);
    border-radius: 12px;
    padding: 4px 8px;
    background: white;
    color: var(--text-primary, #4a3f35);
    outline: none;
    transition: border-color 0.2s;
    -moz-appearance: textfield;
  }

  .num-input::-webkit-outer-spin-button,
  .num-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .num-input:focus {
    border-color: var(--accent, #f4845f);
    box-shadow: 0 0 0 3px rgba(244, 132, 95, 0.15);
  }

  .fraction-bar {
    width: 90px;
    height: 4px;
    background: var(--text-primary, #4a3f35);
    border-radius: 2px;
  }

  .go-btn {
    font-family: 'Baloo 2', cursive;
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    background: var(--accent, #f4845f);
    border: none;
    border-radius: 16px;
    padding: 12px 32px;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s, background 0.2s;
    box-shadow: 0 4px 12px rgba(244, 132, 95, 0.3);
  }

  .go-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(244, 132, 95, 0.4);
    background: #f2734b;
  }

  .go-btn:active {
    transform: translateY(0);
  }

  .hint {
    font-family: 'Baloo 2', cursive;
    font-size: 0.95rem;
    color: var(--text-muted, #b0a49a);
    margin-top: 1.25rem;
  }

  kbd {
    display: inline-block;
    padding: 2px 8px;
    font-family: inherit;
    font-size: 0.85rem;
    background: #f0e6df;
    border-radius: 6px;
    border: 1px solid #ddd3ca;
  }

  @media (max-width: 600px) {
    .heading {
      font-size: 1.8rem;
    }

    .subheading {
      font-size: 1rem;
    }

    .num-input {
      font-size: 2rem;
      width: 80px;
    }

    .fraction-bar {
      width: 70px;
    }

    .go-btn {
      font-size: 1.3rem;
      padding: 10px 24px;
    }
  }
</style>
