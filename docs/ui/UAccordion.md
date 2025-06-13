# UAccordion Component

## Overview
The UAccordion component is a stacked set of collapsible panels. It allows for single or multiple items to be active at the same time, with various customization options.

## Key Features
- **Items Prop**: Accepts an array of objects with properties like `label`, `icon`, `content`, etc.
- **Multiple Type**: Set `type="multiple"` to allow multiple active items.
- **Collapsible**: Control whether items can collapse when active.
- **Unmount on Hide**: Prevent content from being unmounted when collapsed.
- **Disabled State**: Disable the entire accordion or specific items.
- **Custom Icons**: Customize trailing icons for each item.
- **Control Active Items**: Use `default-value` or `v-model` to control active items.
- **Drag and Drop**: Enable drag and drop functionality using `useSortable`.
- **Custom Slots**: Customize body and content of items using slots.

## Example Usage
```vue
<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui'
const items = ref<AccordionItem[]>([
  { label: 'Icons', icon: 'i-lucide-smile', content: 'Automatic icon handling.' },
  { label: 'Colors', icon: 'i-lucide-swatch-book', content: 'Choose colors from Tailwind CSS theme.' },
  { label: 'Components', icon: 'i-lucide-box', content: 'Customize using class/ui props.' }
])
</script>

<template>
  <UAccordion :items="items" />
</template>
```

## Props
- `items`: Array of accordion items
- `type`: 'single' or 'multiple'
- `collapsible`: Boolean to control collapsibility
- `unmount-on-hide`: Boolean to control unmounting behavior
- `disabled`: Boolean to disable the accordion
- `trailing-icon`: Customize trailing icon

## Slots
- `leading`, `default`, `trailing`, `content`, `body`