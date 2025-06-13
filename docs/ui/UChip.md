# UChip Component

## Overview
The UChip component is a small indicator used to display numeric values or states. It can wrap any component and is highly customizable.

## Usage
```vue
<template>
  <UChip>
    <UButton icon="i-lucide-mail" color="neutral" variant="subtle" />
  </UChip>
</template>
```

## Props
- `as`: Specifies the element or component to render as (default: 'div')
- `text`: Sets the text inside the chip (string | number)
- `color`: Changes the chip's color (default: 'primary')
  - Options: 'error', 'primary', 'secondary', 'success', 'info', 'warning', 'neutral'
- `size`: Changes the chip's size (default: 'md')
  - Options: 'xs', 'sm', 'md', 'lg', 'xl', '3xs', '2xs', '2xl', '3xl'
- `position`: Sets the chip's position (default: 'top-right')
  - Options: 'top-right', 'bottom-right', 'top-left', 'bottom-left'
- `inset`: Keeps the chip inside the component for rounded elements (boolean, default: false)
- `standalone`: Renders the chip relatively to the parent (boolean, default: false)
- `show`: Controls the visibility of the chip (boolean, default: true)

## Slots
- `default`: Main content slot
- `content`: Additional content slot

## Examples
### Control Visibility
```vue
<script setup lang="ts">
const statuses = ['online', 'away', 'busy', 'offline']
const status = ref(statuses[0])
const color = computed(() => status.value ? { online: 'success', away: 'warning', busy: 'error', offline: 'neutral' }[status.value] as any : 'online')
const show = computed(() => status.value !== 'offline')
</script>

<template>
  <UChip :color="color" :show="show" inset>
    <UAvatar src="https://github.com/benjamincanac.png" />
  </UChip>
</template>
```
In this example, the chip changes color based on status and is hidden when the status is 'offline'.
