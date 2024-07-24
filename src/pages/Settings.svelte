<script lang="ts">
  import { ModeWatcher } from "mode-watcher";
  import * as Tabs from "$lib/components/ui/tabs/index";
  import AiSetting from "$lib/components/settings/AiSetting.svelte";
  import "../app.css";
</script>

<main>
  <ModeWatcher defaultMode="dark" />
  <h1 class="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
    Spoiler Shield AI - Settings
  </h1>
  <Tabs.Root value="aisetting" class="w-[400px]">
    <Tabs.List class="grid w-full grid-cols-2">
      <Tabs.Trigger value="aisetting">Ai Settings</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="aisetting">
      <AiSetting />
    </Tabs.Content>
  </Tabs.Root>
</main>

<style>
  main {
    display: flex;
    align-items: center;
    flex-direction: column;
    min-width: 20rem;
    min-height: 30rem;
    gap: 0 1;
  }
</style>
