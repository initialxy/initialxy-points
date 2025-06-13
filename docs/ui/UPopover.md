# UPopover

## Overview
The UPopover component is a non-modal dialog that floats around a trigger element. It's commonly used to display additional information or actions when a user interacts with a button or other component.

## Usage
Use a button or any other component in the default slot of the UPopover. Use the `#content` slot to add the content displayed when the popover is open.

```vue
<template>
  <UPopover>
    <UButton label="Open" color="neutral" variant="subtle" />
    <template #content>
      <Placeholder class="size-48 m-4 inline-flex" />
    </template>
  </UPopover>
</template>
```

## Modes
The `mode` prop can be set to either `click` (default) or `hover`. When using `hover` mode, the Reka UI `HoverCard` component is used instead of the `Popover`.

```vue
<template>
  <UPopover mode="hover">
    <UButton label="Open" color="neutral" variant="subtle" />
    <template #content>
      <Placeholder class="size-48 m-4 inline-flex" />
    </template>
  </UPopover>
</template>
```

## Delay
When using the `hover` mode, you can control the delay before the popover is opened or closed using the `open-delay` and `close-delay` props.

```vue
<template>
  <UPopover mode="hover" :open-delay="500" :close-delay="300">
    <UButton label="Open" color="neutral" variant="subtle" />
    <template #content>
      <Placeholder class="size-48 m-4 inline-flex" />
    </template>
  </UPopover>
</template>
```

## Content Customization
The `content` prop allows you to control how the popover content is rendered, including alignment and side positioning.

```vue
<template>
  <UPopover :content="{ align: 'center', side: 'bottom', sideOffset: 8 }">
    <UButton label="Open" color="neutral" variant="subtle" />
    <template #content>
      <Placeholder class="size-48 m-4 inline-flex" />
    </template>
  </UPopover>
</template>
```

## Arrow Display
The `arrow` prop can be used to display an arrow alongside the popover.

```vue
<template>
  <UPopover arrow>
    <UButton label="Open" color="neutral" variant="subtle" />
    <template #content>
      <Placeholder class="size-48 m-4 inline-flex" />
    </template>
  </UPopover>
</template>
```

## Examples
### Control Open State
You can control the open state using the `default-open` prop or the `v-model:open` directive.

```vue
<script setup lang="ts">
const open = ref(false)
defineShortcuts({ o: () => open.value = !open.value })
</script>

<template>
  <UPopover v-model:open="open">
    <UButton label="Open" color="neutral" variant="subtle" />
    <template #content>
      <Placeholder class="size-48 m-4 inline-flex" />
    </template>
  </UPopover>
</template>
```

### Disable Dismissal
Set the `dismissible` prop to `false` to prevent the popover from being closed when clicking outside of it or pressing escape.

```vue
<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <UPopover v-model:open="open" :dismissible="false" :ui="{ content: 'p-4' }">
    <UButton label="Open" color="neutral" variant="subtle" />
    <template #content>
      <div class="flex items-center gap-4 mb-4">
        <h2 class="text-highlighted font-semibold">Popover non-dismissible</h2>
        <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="open = false" />
      </div>
      <Placeholder class="size-full min-h-48" />
    </template>
  </UPopover>
</template>
```

### With Command Palette
You can use a `CommandPalette` component inside the popover's content.

```vue
<script setup lang="ts">
const items = ref([
  { label: 'bug', value: 'bug', chip: { color: 'error' as const } },
  { label: 'feature', value: 'feature', chip: { color: 'success' as const } },
  { label: 'enhancement', value: 'enhancement', chip: { color: 'info' as const } }
])
const label = ref([])
</script>

<template>
  <UPopover :content="{ side: 'right', align: 'start' }">
    <UButton icon="i-lucide-tag" label="Select labels" color="neutral" variant="subtle" />
    <template #content>
      <UCommandPalette
        v-model="label"
        multiple
        placeholder="Search labels..."
        :groups="[{ id: 'labels', items }]"
        :ui="{ input: '[&>input]:h-8 [&>input]:text-sm' }"
      />
    </template>
  </UPopover>
</template>
```

### With Anchor Slot
You can use the `#anchor` slot to position the popover against a custom element. This slot only works when `mode` is `click`.

```vue
<script lang="ts" setup>
const open = ref(false)
</script>

<template>
  <UPopover v-model:open="open" :dismissible="false" :ui="{ content: 'w-(--reka-popper-anchor-width) p-4' }">
    <template #anchor>
      <UInput placeholder="Focus to open" @focus="open = true" @blur="open = false" />
    </template>
    <template #content>
      <Placeholder class="w-full aspect-square" />
    </template>
  </UPopover>
</template>
```