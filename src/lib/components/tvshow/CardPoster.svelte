<script lang="ts">
  import * as Card from "$lib/components/ui/card";

  export let posterPath: string;
  export let name: string;
</script>

<Card.Root class="w-[250px]">
  <Card.Content class="p-1">
    {#if posterPath}
      <img src={`https://image.tmdb.org/t/p/w500${posterPath}`} alt={name} />
    {:else}
      <div class="w-full h-[360px]">
        <p class="text-center">No poster found</p>
      </div>
    {/if}
  </Card.Content>
  <Card.Footer class="justify-center flex-col">
    <div class="w-full justify-center">
      <h3 class="text-center">{name}</h3>
    </div>
    <div class="w-full flex justify-center">
      <slot></slot>
    </div>
  </Card.Footer>
</Card.Root>
