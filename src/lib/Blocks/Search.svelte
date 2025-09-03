<script>
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import VirtualList from "svelte-virtual-list";

  export let items = []; // 100k+ strings
  export let value = ""; // bindable selected string
  export let placeholder = "Search...";

  let list;

  let query = "";
  let results = [];
  let worker;
  const dispatch = createEventDispatcher();

  onMount(() => {
    worker = new Worker(new URL("/search.worker.js", import.meta.url));
    worker.onmessage = (e) => {
      results = e.data;
    };
  });

  onDestroy(() => {
    if (worker) worker.terminate();
  });

  function handleInput(e) {
    query = e.target.value;
    worker.postMessage({ items, query });
  }

  function selectItem(item) {
    value = item;
    query = item;
    results = [];
    dispatch("select", item);
  }

  let inputEl;

  function clear() {
    query = "";
    results = [];
    inputEl.focus();
  }

  $: if (list) {
    console.log(list);
  }
</script>

<div style="width: 100%;">
  <input
    bind:this={inputEl}
    type="text"
    bind:value={query}
    on:input={handleInput}
    {placeholder}
    style="width: 100%; height: 40px; box-sizing: border-box;"
  />
  {#if query}
    <button on:click={clear}>×</button>
  {/if}
</div>

{#if results.length > 0}
  <VirtualList
    bind:this={list}
    items={results}
    itemHeight={30}
    let:item
    style=""
  >
    <button on:click={() => selectItem(item)}>{item}</button>
  </VirtualList>
{/if}

<style>
</style>
