<script lang="ts">
  import { Input } from "$lib/components/ui/input";
  import * as Select from "$lib/components/ui/select";
  import type { Selected } from "bits-ui";
  import { writable } from "svelte/store";

  export let model = writable("gpt-3.5-turbo");

  export let setModel = (selected: Selected<unknown> | undefined) => {
    if (selected) {
      model.set(selected.value as string);
    }
  };
</script>

<Input type="password" placeholder="Api Key" id="apikey" />

<Select.Root onSelectedChange={setModel}>
  <Select.Trigger class="w-[180px]" bind:value={$model}>
    <Select.Value placeholder="Models" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="gpt-3.5-turbo">gpt-3.5-turbo</Select.Item>
    <Select.Item value="gpt-4">gpt-4</Select.Item>
    <Select.Item value="gpt-4-turbo">gpt-4-turbo</Select.Item>
    <Select.Item value="gpt-4o">gpt-4o</Select.Item>
  </Select.Content>
</Select.Root>
