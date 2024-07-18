<script lang="ts">
  import { writable } from "svelte/store";
  import { ModeWatcher } from "mode-watcher";
  import Button from "$lib/components/ui/button/button.svelte";
  import PowerIcon from "$lib/components/icons/power-icon.svelte";
  import LlmProvider from "$lib/components/LlmProvider.svelte";
  import "./app.css";

  let isActive = true;
  let provider = "openai";
  async function getConfig() {
    const config = await chrome.storage.sync.get(["isActive", "provider"]);
    console.log(config);
    isActive = config.isActive;
    provider = config.provider;
  }

  function toggleActive() {
    isActive = !isActive;
    chrome.storage.sync.set({ isActive });
  }
  getConfig();
</script>

<main>
  <ModeWatcher defaultMode="dark" />
  <h1 class="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
    Spoiler Shield AI
  </h1>
  <p class="scroll-m-20 text-lg text-center mb-10">
    Protect your eyes from spoilers with AI-powered
    <span class="text-lime-400">Spoiler Shield AI</span>.
  </p>

  <Button
    class="rounded-full {isActive
      ? 'bg-lime-400'
      : 'bg-slate-700 outline border-lime-400'}"
    on:click={toggleActive}
  >
    <PowerIcon />
  </Button>
  <p>{isActive ? "On" : "Off"}</p>

  <LlmProvider {provider} />
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    min-width: 20rem;
    min-height: 30rem;
    gap: 0 1;
  }
</style>
