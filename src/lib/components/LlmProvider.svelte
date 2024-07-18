<script lang="ts">
  import * as Select from "$lib/components/ui/select";
  import type { Selected } from "bits-ui";
  import OpenAi from "./providers/OpenAi.svelte";

  export let provider = "openai";
  export let setProvider = (selected: Selected<unknown> | undefined) => {
    if (!selected) return;
    provider = selected.value as string;
    chrome.storage.sync.set({ provider: selected.value });
  };
  $: selectedProvider = {
    label: provider,
    value: provider,
  };
</script>

<div class="flex gap-2 flex-col">
  <Select.Root onSelectedChange={setProvider} selected={selectedProvider}>
    <Select.Trigger class="w-[180px]">
      <Select.Value placeholder="AI Providers" />
    </Select.Trigger>
    <Select.Content>
      <Select.Item value="openai">OpenAI</Select.Item>
      <Select.Item value="ollama">Ollama</Select.Item>
      <Select.Item value="anthropic">Anthropic</Select.Item>
    </Select.Content>
  </Select.Root>

  {#if provider === "openai"}
    <OpenAi />
  {/if}
  {#if provider === "ollama"}
    <p>Ollama</p>
  {/if}
  {#if provider === "anthropic"}
    <p>Anthropic</p>
  {/if}
</div>
