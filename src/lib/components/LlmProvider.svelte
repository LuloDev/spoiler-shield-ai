<script lang="ts">
  import * as Select from "$lib/components/ui/select";
  import type { Selected } from "bits-ui";
  import type { AiSetting } from "src/models/settings/aiSetting";

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
  let providers: AiSetting[] = [];
  async function loadSettings() {
    const { settings } = await chrome.storage.sync.get(["settings"]);
    providers = settings;
  }

  loadSettings();
</script>

<div class="flex gap-2 flex-col">
  <Select.Root onSelectedChange={setProvider} selected={selectedProvider}>
    <Select.Trigger class="w-[180px]">
      <Select.Value placeholder="AI Providers" />
    </Select.Trigger>
    <Select.Content>
      {#each providers as provider}
        <Select.Item value={provider.name}>{provider.name}</Select.Item>
      {/each}
    </Select.Content>
  </Select.Root>
</div>
