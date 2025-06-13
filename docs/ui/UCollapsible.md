# UCollapsible

A collapsible element to toggle visibility of its content.

## Usage

Use a button or any component in the default slot of the Collapsible. Use the `#content` slot to add content displayed when open.

```vue
<template>
  <UCollapsible class="flex flex-col gap-2 w-48">
    <UButton
      label="Open"
      color="neutral"
      variant="subtle"
      trailing-icon="i-lucide-chevron-down"
      block
    />
    <template #content>
      <Placeholder class="h-48" />
    </template>
  </UCollapsible>
</template>
```

## Props

- `unmount-on-hide`: Prevent content from being unmounted when collapsed (default: true)
- `disabled`: Disable the collapsible
- `defaultOpen`: Initial open state
- `open`: Controlled open state (can be bound with `v-model`)
- `as`: Element or component to render as
- `ui`: Customize root and content styles

## Slots

- `default`: Main content with `{ open: boolean }` context
- `content`: Content displayed when open

## Examples

### Control Open State

Control with `default-open` or `v-model:open`:

```vue
<script setup lang="ts">
const open = ref(true)
defineShortcuts({ o: () => open.value = !open.value })
</script>

<template>
  <UCollapsible v-model:open="open" class="flex flex-col gap-2 w-48">
    <UButton
      label="Open"
      color="neutral"
      variant="subtle"
      trailing-icon="i-lucide-chevron-down"
      block
    />
    <template #content>
      <Placeholder class="h-48" />
    </template>
  </UCollapsible>
</template>
```

### With Rotating Icon

```vue
<template>
  <UCollapsible class="flex flex-col gap-2 w-48">
    <UButton
      class="group"
      label="Open"
      color="neutral"
      variant="subtle"
      trailing-icon="i-lucide-chevron-down"
      :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
      block
    />
    <template #content>
      <Placeholder class="h-48" />
    </template>
  </UCollapsible>
</template>
```