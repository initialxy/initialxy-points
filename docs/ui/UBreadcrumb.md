# UBreadcrumb Component

## Overview
The UBreadcrumb component is a Vue component from Nuxt UI that creates a hierarchy of links for website navigation. It's useful for displaying the current page's location within a navigational hierarchy.

## Key Features
- Uses the `items` prop as an array of objects with properties like `label`, `icon`, `avatar`, `slot`, `class`, and `ui`.
- Renders a `span` instead of a link when the `to` property is not defined.
- Allows customization of the separator icon between items using the `separator-icon` prop.
- Supports custom slots for separators and individual items.

## Example Usage
```vue
<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui'
const items = ref<BreadcrumbItem[]>([
  { label: 'Home', icon: 'i-lucide-house' },
  { label: 'Components', icon: 'i-lucide-box', to: '/components' },
  { label: 'Breadcrumb', icon: 'i-lucide-link', to: '/components/breadcrumb' }
])
</script>

<template>
  <UBreadcrumb :items="items" />
</template>
```

## Customization
- Customize the separator icon globally in `app.config.ts` or `vite.config.ts` under `ui.icons.chevronRight`.
- Use the `#separator` slot to customize the separator between items.
- Use the `slot` property to customize a specific item.

## Props
- `items`: Array of objects defining the breadcrumb items.
- `separatorIcon`: Icon to use as a separator (defaults to `i-lucide-chevron-right`).
- `labelKey`: Key used to get the label from the item (defaults to `'label'`).
- `ui`: Object for customizing the component's appearance.

## Slots
- `item`: Customize all items.
- `item-leading`, `item-label`, `item-trailing`: Customize specific parts of items.
- `separator`: Customize the separator between items.

## Theme Customization
Customize the component's appearance in `app.config.ts` or `vite.config.ts` by modifying the `ui.breadcrumb` object.
