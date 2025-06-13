# UContextMenu

The UContextMenu component in Nuxt UI is a Vue component that displays a context menu when right-clicking on an element. It allows for customizable menu items with various properties such as labels, icons, colors, and more.

## Key Features

- **Items**: Define menu items using the `items` prop, which accepts an array of objects with properties like `label`, `icon`, `color`, `children`, etc.
- **Size**: Adjust the size of the context menu using the `size` prop.
- **Disabled State**: Disable the context menu using the `disabled` prop.
- **Checkbox Items**: Create checkbox items using the `type="checkbox"` property.
- **Color Items**: Highlight items with specific colors using the `color` property.
- **Custom Slots**: Customize specific items using the `slot` property.
- **Shortcuts**: Extract and use keyboard shortcuts with the `kbds` property.

## Example Usage

```vue
<script setup lang="ts">
import type { ContextMenuItem } from '@nuxt/ui'
const items = ref<ContextMenuItem[][]>([
  [
    { label: 'Appearance', children: [
      { label: 'System', icon: 'i-lucide-monitor' },
      { label: 'Light', icon: 'i-lucide-sun' },
      { label: 'Dark', icon: 'i-lucide-moon' }
    ]}
  ],
  [
    { label: 'Show Sidebar', kbds: ['meta', 's'] },
    { label: 'Show Toolbar', kbds: ['shift', 'meta', 'd'] },
    { label: 'Collapse Pinned Tabs', disabled: true }
  ]
])
</script>

<template>
  <UContextMenu :items="items" :ui="{ content: 'w-48' }">
    <div class="flex items-center justify-center rounded-md border border-dashed border-accented text-sm aspect-video w-72">
      Right click here
    </div>
  </UContextMenu>
</template>
```

## Props

- `size`: Controls the size of the context menu (`'sm' | 'md' | 'xs' | 'lg' | 'xl'`).
- `items`: Array of menu items with properties like `label`, `icon`, `color`, `children`, etc.
- `disabled`: Boolean to disable the context menu.
- `checkedIcon`, `loadingIcon`, `externalIcon`: Icons for checked, loading, and external link states.
- `content`: Configuration for the menu content.
- `portal`: Render the menu in a portal.
- `labelKey`: Key used to get the label from the item.
- `modal`: Boolean to make the menu modal.
- `ui`: Object for customizing the UI classes.

## Slots

- `default`: Default slot for the menu content.
- `item`, `item-leading`, `item-label`, `item-trailing`: Slots for customizing individual items.
- `content-top`, `content-bottom`: Slots for custom content at the top and bottom of the menu.

## Emits

- `update:open`: Emits when the menu's open state changes.