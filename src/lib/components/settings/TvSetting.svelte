<script lang="ts">
  import { onMount } from "svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import * as Card from "$lib/components/ui/card";
  import Button from "$lib/components/ui/button/button.svelte";
  import { writable } from "svelte/store";
  import { TmbdApiService } from "../../../services/tmbdApiService";
  import type { ResultTv } from "src/models/tmdb/tmdbSearch";

  let timeoutId: ReturnType<typeof setTimeout>;

  let result = writable<ResultTv[]>([]);
  let tvShows = writable<ResultTv[]>([]);
  const tmdbApi = new TmbdApiService();

  function debounce(func: (event: InputEvent) => void, delay: number) {
    return function (event: InputEvent) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(event), delay);
    };
  }

  function handleChange(event: any) {
    if (!event.target) return;
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
  <section class="flex flex-row flex-wrap gap-7 mt-5">
    {#if $result.length > 0}
      {#each $result as tvShow}
        <Card.Root class="w-[250px]">
          <Card.Content class="p-1">
            {#if tvShow.poster_path}
              <img
                src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                alt={tvShow.name}
              />
            {:else}
              <div class="w-full h-[360px]">
                <p class="text-center">No poster found</p>
              </div>
            {/if}
          </Card.Content>
          <Card.Footer class="justify-center flex-col">
            <div class="w-full justify-center">
              <h3 class="text-center">{tvShow.name}</h3>
            </div>
            <div class="w-full flex justify-center">
              {#if $tvShows.find((t) => t.id === tvShow.id)}
                <p class="text-center text-sm">Already added</p>
              {:else}
                <Button class="mt-2 w-5/6" on:click={() => addTvShow(tvShow)}
                  >Add</Button
                >
              {/if}
            </div>
          </Card.Footer>
        </Card.Root>
      {/each}
    {:else}
      <p>No results</p>
    {/if}
  </section>
</main>
