# DropdownMenu Component

The DropdownMenu component in Nuxt UI is used to display actions when clicking on an element. It can be used with a Button or any other component in its default slot.

## Key Features

- **Items**: The `items` prop accepts an array of objects with properties like `label`, `icon`, `color`, `avatar`, `kbds`, `type`, `checked`, `disabled`, `slot`, `onSelect`, `onUpdateChecked`, `children`, `class`, and `ui`.
- **Content**: The `content` prop controls how the menu content is rendered (e.g., `align`, `side`, `sideOffset`).
- **Arrow**: The `arrow` prop displays an arrow on the DropdownMenu.
- **Size**: The `size` prop controls the size of the DropdownMenu.
- **Disabled**: The `disabled` prop disables the DropdownMenu.
- **Checkbox Items**: Use the `type` property with `checkbox` and control the checked state with `checked` / `onUpdateChecked`.
- **Color Items**: Use the `color` property to highlight items with a specific color.
- **Open State**: Control the open state with `default-open` prop or `v-model:open` directive.
- **Custom Slot**: Use the `slot` property to customize specific items.
- **Shortcuts**: Extract shortcuts using `extractShortcuts` utility for items with `kbds` property.

## Example Usage

```vue
<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
const items = ref<DropdownMenuItem[][]>([
  [
    { label: 'Profile', icon: 'i-lucide-user' },
    { label: 'Billing', icon: 'i-lucide-credit-card' },
    { label: 'Settings', icon: 'i-lucide-cog' }
  ]
])
</script>

<template>
  <UDropdownMenu :items="items" :ui="{ content: 'w-48' }">
    <UButton label="Open" icon="i-lucide-menu" color="neutral" variant="outline" />
  </UDropdownMenu>
</template>
```

## Props

- `size`: Controls the size of the DropdownMenu.
- `items`: Array of objects defining menu items.
- `content`: Controls menu content rendering.
- `arrow`: Displays an arrow.
- `disabled`: Disables the menu.
- `defaultOpen`: Controls initial open state.
- `open`: Controlled open state.
- `modal`: Modal behavior of the menu.
- `ui`: Custom UI classes.

## Slots

- `default`: Slot for the trigger element.
- `item`, `item-leading`, `item-label`, `item-trailing`: Customize menu items.
- `content-top`, `content-bottom`: Customize menu content sections.

## Emits

- `update:open`: Emits when the open state changes.
