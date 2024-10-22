<script lang="ts">
  import { onMount } from "svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { writable } from "svelte/store";
  import { TmbdApiService } from "../../../services/tmbdApiService";
  import type { ResultTv } from "src/models/tmdb/tmdbSearch";
  import CardTv from "../tvshow/CardPoster.svelte";

  let timeoutId: ReturnType<typeof setTimeout>;

  let result = writable<ResultTv[]>([]);
  let tvShows = writable<ResultTv[]>([]);
  let search = writable<string>("");
  const tmdbApi = new TmbdApiService();

  function debounce(func: (event: InputEvent) => void, delay: number) {
    return function (event: InputEvent) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(event), delay);
    };
  }

  function handleChange(event: any) {
    if (!event.target) return;
    search.set(event.target.value);
    tmdbApi.searchTvShow(event.target.value).then((data) => {
      result.set(data.results);
    });
  }

  const debouncedHandleChange = debounce(handleChange, 1000);

  function addTvShow(tv: ResultTv) {
    chrome.storage.sync.get("tvShows", (data) => {
      const tvShowsSaved = data.tvShows || [];
      tvShowsSaved.push(tv);

      chrome.storage.sync.set({ tvShows: tvShowsSaved });
      tvShows.set(tvShowsSaved);
    });
  }

  function removeTvShow(tv: ResultTv) {
    chrome.storage.sync.get("tvShows", (data) => {
      const tvShowsSaved = data.tvShows || [];
      const newTvShows = tvShowsSaved.filter((t: ResultTv) => t.id !== tv.id);

      chrome.storage.sync.set({ tvShows: newTvShows });
      tvShows.set(newTvShows);
    });
  }

  onMount(() => {
    chrome.storage.sync.get("tvShows", (data) => {
      tvShows.set(data.tvShows || []);
    });
    return () => {
      clearTimeout(timeoutId);
    };
  });
</script>

<main class="w-full">
  <div class="max-w-xl">
    <Input
      type="search"
      placeholder="search"
      on:input={debouncedHandleChange}
    />
  </div>
  {#if $search === ""}
    {#if $tvShows.length > 0}
      <section class="flex flex-row flex-wrap gap-7 mt-5">
        {#each $tvShows as tvShow}
          <CardTv name={tvShow.name} posterPath={tvShow.poster_path}>
            <Button
              class="mt-2 w-5/6 ba"
              variant="destructive"
              on:click={() => removeTvShow(tvShow)}>Remove</Button
            >
          </CardTv>
        {/each}
      </section>
    {:else}
      <p>No tv shows added, search for add</p>
    {/if}
  {:else}
    <section class="flex flex-row flex-wrap gap-7 mt-5">
      {#if $result.length > 0}
        {#each $result as tvShow}
          <CardTv name={tvShow.name} posterPath={tvShow.poster_path}>
            {#if $tvShows.find((t) => t.id === tvShow.id)}
              <p class="text-center text-sm">Already added</p>
            {:else}
              <Button class="mt-2 w-5/6" on:click={() => addTvShow(tvShow)}
                >Add</Button
              >
            {/if}
          </CardTv>
        {/each}
      {:else}
        <p>No results</p>
      {/if}
    </section>
  {/if}
</main>
