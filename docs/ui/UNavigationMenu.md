# UNavigationMenu

The UNavigationMenu component is a versatile Vue component from Nuxt UI that displays a list of links, which can be oriented horizontally or vertically. It supports nested items for creating submenus and offers extensive customization options.

## Key Features

- **Orientation**: Can be displayed horizontally or vertically.
- **Items**: Accepts an array of objects with properties like `label`, `icon`, `children`, etc.
- **Customization**: Highly customizable through props like `color`, `variant`, `highlight`, and more.
- **Interactivity**: Supports tooltips, popovers, and custom slots for enhanced interactivity.

## Basic Usage

```vue
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[]>([
  {
    label: 'Guide',
    icon: 'i-lucide-book-open',
    to: '/getting-started',
    children: [
      { label: 'Introduction', icon: 'i-lucide-house' },
      { label: 'Installation', icon: 'i-lucide-cloud-download' }
    ]
  }
])
</script>

<template>
  <UNavigationMenu :items="items" class="w-full justify-center" />
</template>
```

## Props

- **items**: Array of objects defining the menu items.
- **orientation**: 'horizontal' or 'vertical'.
- **color**: Color variant ('primary', 'secondary', etc.).
- **variant**: Style variant ('pill', 'link').
- **highlight**: Boolean to enable/disable highlight.
- **collapsed**: Boolean to collapse the menu (vertical only).

## Slots

- **item**: Customize individual menu items.
- **item-leading**, **item-label**, **item-trailing**: Customize specific parts of items.
- **item-content**: Customize the content of a specific item.

## Examples

### With Tooltip

```vue
<UNavigationMenu tooltip collapsed orientation="vertical" :items="items" />
```

### With Custom Slot

```vue
<UNavigationMenu :items="items" class="w-full justify-center">
  <template #components-trailing>
    <UBadge label="44" variant="subtle" size="sm" />
  </template>
</UNavigationMenu>
```

For more detailed information, refer to the [official documentation](https://ui.nuxt.com/components/navigation-menu).
