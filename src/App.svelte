<script lang="ts">
  import { onMount } from "svelte";
  import Dialog from "./lib/Blocks/Dialog.svelte";
  import AutoComplete from "simple-svelte-autocomplete";

  import { parseXDXF } from "./utility";
  import Search from "./lib/Blocks/Search.svelte";

  let enToSv: Object;
  let keymap_enToSv;
  let svToEn: Object;
  let keymap_svToEn;

  let lang;
  let keymap_lang;

  onMount(async () => {
    // usage:
    let folkets_en_sv_public = fetch("folkets_en_sv_public.xdxf")
      .then((res) => res.text())
      .then((text) => {
        enToSv = parseXDXF(text);
        keymap_enToSv = Object.keys(enToSv);
      });

    let folkets_sv_en_public = fetch("folkets_sv_en_public.xdxf")
      .then((res) => res.text())
      .then((text) => {
        svToEn = parseXDXF(text);
        keymap_svToEn = Object.keys(svToEn);
      });

    await folkets_en_sv_public;
    await folkets_sv_en_public;

    switchLang();
  });

  function switchLang() {
    searchTerm = "";
    if (!lang || lang == enToSv) {
      lang = svToEn;
      keymap_lang = keymap_svToEn;
    } else if (lang == svToEn) {
      lang = enToSv;
      keymap_lang = keymap_enToSv;
    }

    console.log("change", lang, keymap_lang);
  }

  let searchTerm = "";
</script>

<nav class="top right">
  <Dialog>
    <div slot="button">What is this?</div>
    <div slot="content">
      <h2>What is this?</h2>

      <h3>Its a</h3>

      <h3>I think this looks like shit</h3>
      <p>thats just like your opinion, man</p>
      <p>why dont you put in a pr?</p>
    </div>
  </Dialog>
</nav>

<main>
  {#if !keymap_lang}
    <h2>Loading...</h2>
  {:else}
    <div>
      <button on:click={switchLang}>
        {#if lang == enToSv}
          🇬🇧 => 🇸🇪
        {:else}
          🇸🇪 => 🇬🇧
        {/if}
      </button>
    </div>

    <Search items={keymap_lang} bind:value={searchTerm} />
    {#if searchTerm}
      {#each lang[searchTerm] as objs}
        {#each objs as obj}
          {#if Object.entries(obj).length > 0}
            <h3>{searchTerm} ➡ {obj.translations}</h3>
            <div class="flex vertical left baseline">
              {#if obj.translations}
                <div>
                  <strong>Translations:</strong>
                  {#if Array.isArray(obj.translations)}
                    {obj.translations.join(", ")}
                  {:else}
                    {obj.translations}
                  {/if}
                </div>
              {/if}

              {#if obj.definition}
                <div><strong>Definition:</strong> {obj.definition}</div>
              {/if}

              {#if obj.example_original || obj.example_translation}
                <div class="example">
                  {#if obj.example_original}<div>
                      <em>Original:</em>
                      {obj.example_original}
                    </div>{/if}
                  {#if obj.example_translation}<div>
                      <em>Translation:</em>
                      {obj.example_translation}
                    </div>{/if}
                </div>
              {/if}

              {#if obj.transcription}
                <div><strong>Pronunciation:</strong> {obj.transcription}</div>
              {/if}

              {#if obj.synonyms}
                <div>
                  <strong>Synonyms:</strong>
                  {#if Array.isArray(obj.synonyms)}
                    {obj.synonyms.join(", ")}
                  {:else}
                    {obj.synonyms}
                  {/if}
                </div>
              {/if}

              {#if obj.synonym_ref}
                <div>
                  <strong>Synonym References:</strong>
                  {#if Array.isArray(obj.synonym_ref)}
                    {obj.synonym_ref.join(", ")}
                  {:else}
                    {obj.synonym_ref}
                  {/if}
                </div>
              {/if}

              {#if obj.part_of_speech}
                <div>
                  <strong>Part of Speech:</strong>
                  {obj.part_of_speech}
                </div>
              {/if}

              {#if obj.audio}
                <div>
                  <strong>Audio:</strong>
                  <audio controls>
                    <source src={obj.audio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              {/if}
            </div>
          {/if}
        {/each}
      {/each}
    {/if}
  {/if}
</main>

<style>
  .baseline {
    align-items: baseline;
  }
</style>
