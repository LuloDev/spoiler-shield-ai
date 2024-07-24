<script lang="ts">
  import { writable } from "svelte/store";
  import { onMount } from "svelte";
  import Input from "../ui/input/input.svelte";
  import Button from "../ui/button/button.svelte";
  import * as Select from "$lib/components/ui/select";
  import * as Card from "$lib/components/ui/card";
  import Reload from "svelte-radix/Reload.svelte";
  import { Slider } from "$lib/components/ui/slider";
  import { Toaster } from "$lib/components/ui/sonner";
  import { toast } from "svelte-sonner";

  import {
    anthropicModels,
    ollamaModels,
    openAiModels,
  } from "../../../models/settings/aiSetting";
  import Label from "../ui/label/label.svelte";

  let formData = writable({
    provider: "",
    model: "",
    baseUrl: "",
    apiKey: "",
    umbral: 0.5,
  });
  let selectedProvider = writable("");
  let initialUmbral = 50;
  let models: string[] = [];
  let loading = false;
  async function handleFormSubmit(event: Event) {
    loading = true;
    event.preventDefault();
    chrome.storage.sync.set({
      settings: $formData,
    });
    setTimeout(() => {
      loading = false;
      toast("Settings saved successfully", {
        position: "top-right",
      });
    }, 1000);
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
    $formData.model = "";
    $formData.baseUrl = "";
    $formData.apiKey = "";
  }

  async function loadSettings() {
    const { settings } = await chrome.storage.sync.get(["settings"]);
    if (settings) {
      handleProviderChange({ value: settings.provider });
      initialUmbral = settings.umbral * 100;
      formData.update((data) => {
        data.provider = settings.provider;
        data.model = settings.model;
        data.baseUrl = settings.baseUrl;
        data.apiKey = settings.apiKey;
        data.umbral = settings.umbral;
        return data;
      });
    }
  }
  onMount(() => {
    loadSettings();
  });
</script>

<Toaster />

<Card.Root>
  <Card.Header>
    <Card.Title>Settings</Card.Title>
    <Card.Description>Configure your AI settings here.</Card.Description>
  </Card.Header>
  <Card.Content class="space-y-2">
    <form on:submit={handleFormSubmit}>
      <div class="grid w-full items-center gap-4">
        <div class="flex flex-row space-x-2 justify-between">
          <div class="flex flex-col space-y-1.5">
            <Select.Root
              onSelectedChange={handleProviderChange}
              selected={{
                value: $formData.provider,
                label: $formData.provider,
              }}
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
          <div class="flex flex-col space-y-1.5">
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
        </div>
        {#if $formData.provider === "openai" || $formData.provider === "anthropic"}
          <div class="flex flex-col space-y-1.5">
            <Input
              type="password"
              placeholder="Api Key"
              bind:value={$formData.apiKey}
              class="w-full"
            />
          </div>
        {/if}
        {#if $formData.provider === "ollama"}
          <div class="flex flex-col space-y-1.5">
            <Input
              type="text"
              placeholder="Base Url (optional) default: http://localhost:11434/api"
              bind:value={$formData.baseUrl}
              class="w-full"
            />
          </div>
        {/if}
        <div class="flex flex-col space-y-1.5">
          <Label for="umbral" class="text-sm font-medium text-gray-700">
            Spoiler Umbral: {($formData.umbral * 100).toFixed(0)}%
          </Label>
          <Slider
            id="umbral"
            max={100}
            step={1}
            value={[initialUmbral]}
            onValueChange={(event) => {
              $formData.umbral = event[0] / 100;
            }}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {#if loading}
            <Reload class="mr-2 h-4 w-4 animate-spin" />
          {/if}
          Save
        </Button>
      </div>
    </form>
  </Card.Content>
</Card.Root>
