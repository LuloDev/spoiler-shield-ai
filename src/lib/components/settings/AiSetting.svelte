<script lang="ts">
  import { writable } from "svelte/store";
  import Input from "../ui/input/input.svelte";
  import Button from "../ui/button/button.svelte";
  import * as Select from "$lib/components/ui/select";
  import {
    anthropicModels,
    ollamaModels,
    openAiModels,
  } from "../../../models/settings/aiSetting";

  let formData = writable({
    name: "",
    provider: "",
    model: "",
    baseUrl: "",
    apiKey: "",
  });
  let selectedProvider = writable("");
  function handleFormSubmit(event: Event) {
    event.preventDefault();
    console.log($formData);
  }
  function handleProviderChange(event: { value: string } | undefined) {
    if (!event) return;
    selectedProvider.set(event.value);
    formData.update((data) => {
      data.provider = event.value;
      return data;
    });
    if (event.value === "openai") {
      models = openAiModels;
    } else if (event.value === "ollama") {
      models = ollamaModels;
    } else if (event.value === "anthropic") {
      models = anthropicModels;
    }
  }
  let models: string[] = [];
</script>

<form on:submit={handleFormSubmit}>
  <div>
    <Input
      type="text"
      placeholder="Name"
      bind:value={$formData.name}
      class="w-full"
    />
  </div>
  <div>
    <Select.Root
      onSelectedChange={handleProviderChange}
      selected={{ value: $formData.provider, label: $formData.provider }}
    >
      <Select.Trigger class="w-[180px]">
        <Select.Value placeholder="AI Providers" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="openai">OpenAI</Select.Item>
        <Select.Item value="ollama">Ollama</Select.Item>
        <Select.Item value="anthropic">Anthropic</Select.Item>
      </Select.Content>
    </Select.Root>
  </div>
  <div>
    <Select.Root
      onSelectedChange={(event) => {
        if (!event) return;
        formData.update((data) => {
          data.model = event.value;
          return data;
        });
      }}
      selected={{ value: $formData.model, label: $formData.model }}
    >
      <Select.Trigger class="w-[180px]">
        <Select.Value placeholder="Models" />
      </Select.Trigger>
      <Select.Content>
        {#each models as model}
          <Select.Item value={model}>{model}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </div>
  {#if $formData.provider === "openai" || $formData.provider === "anthropic"}
    <div>
      <Input
        type="password"
        placeholder="Api Key"
        bind:value={$formData.apiKey}
        class="w-full"
      />
    </div>
  {/if}
  {#if $formData.provider === "ollama"}
    <div>
      <Input
        type="text"
        placeholder="Base Url"
        bind:value={$formData.baseUrl}
        class="w-full"
      />
    </div>
  {/if}
  <Button type="submit">Save</Button>
</form>
