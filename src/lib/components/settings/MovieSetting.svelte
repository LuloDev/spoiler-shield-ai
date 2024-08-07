<script lang="ts">
  import { onMount } from "svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { writable } from "svelte/store";
  import { TmbdApiService } from "../../../services/tmbdApiService";
  import type { ResultMovie } from "src/models/tmdb/tmdbSearch";
  import CardPoster from "../tvshow/CardPoster.svelte";

  let timeoutId: ReturnType<typeof setTimeout>;

  let result = writable<ResultMovie[]>([]);
  let movies = writable<ResultMovie[]>([]);
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
    tmdbApi.searchMovie(event.target.value).then((data) => {
      result.set(data.results);
    });
  }

  const debouncedHandleChange = debounce(handleChange, 1000);

  function addMovie(movie: ResultMovie) {
    chrome.storage.sync.get("movies", (data) => {
      const saved = data.movies || [];
      saved.push(movie);

      chrome.storage.sync.set({ movies: saved });
      movies.set(saved);
    });
  }

  function removeMovie(movie: ResultMovie) {
    chrome.storage.sync.get("movies", (data) => {
      const saved = data.movies || [];
      const newMovie = saved.filter((t: ResultMovie) => t.id !== movie.id);

      chrome.storage.sync.set({ movies: newMovie });
      movies.set(newMovie);
    });
  }

  onMount(() => {
    chrome.storage.sync.get("movies", (data) => {
      movies.set(data.movies || []);
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
    {#if $movies.length > 0}
      <section class="flex flex-row flex-wrap gap-7 mt-5">
        {#each $movies as movie}
          <CardPoster name={movie.title} posterPath={movie.poster_path}>
            <Button
              class="mt-2 w-5/6 ba"
              variant="destructive"
              on:click={() => removeMovie(movie)}>Remove</Button
            >
          </CardPoster>
        {/each}
      </section>
    {:else}
      <p>No movies added, search for add</p>
    {/if}
  {:else}
    <section class="flex flex-row flex-wrap gap-7 mt-5">
      {#if $result.length > 0}
        {#each $result as movie}
          <CardPoster name={movie.title} posterPath={movie.poster_path}>
            {#if $movies.find((t) => t.id === movie.id)}
              <p class="text-center text-sm">Already added</p>
            {:else}
              <Button class="mt-2 w-5/6" on:click={() => addMovie(movie)}
                >Add</Button
              >
            {/if}
          </CardPoster>
        {/each}
      {:else}
        <p>No results</p>
      {/if}
    </section>
  {/if}
</main>
