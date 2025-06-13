# UCommandPalette

The UCommandPalette component is a powerful Vue.js component that provides a command palette with full-text search capabilities powered by Fuse.js for efficient fuzzy matching.

## Key Features

- **Groups and Items**: Organize commands into groups with properties like `id`, `label`, `items`, etc. Each item can have properties like `label`, `icon`, `avatar`, `kbds`, etc.
- **Multiple Selection**: Use the `multiple` prop to allow multiple selections.
- **Customization**: Customize the placeholder, icon, loading state, and more using various props.
- **Dynamic Search**: Filters and ranks commands by relevance as users type.
- **Integration**: Can be used within other components like Popover, Modal, and Drawer.

## Usage

```vue
<script setup lang="ts">
const groups = ref([
  {
    id: 'apps',
    items: [
      { label: 'Calendar', icon: 'i-lucide-calendar' },
      { label: 'Music', icon: 'i-lucide-music' },
      { label: 'Maps', icon: 'i-lucide-map' }
    ]
  }
])
</script>

<template>
  <UCommandPalette :groups="groups" class="flex-1" />
</template>
```

## Props

- `groups`: Array of command groups
- `multiple`: Boolean to allow multiple selections
- `placeholder`: Custom placeholder text
- `icon`: Custom input icon
- `loading`: Show loading icon
- `disabled`: Disable the command palette

## Slots

- `item`: Customize individual items
- `group`: Customize groups
- `empty`: Customize empty state

## Events

- `update:modelValue`: Emitted when an item is selected
- `update:open`: Emitted when the close button is clicked

## Theme Customization

Customize the component globally in `app.config.ts` or `vite.config.ts` under the `ui.commandPalette` key.

For more detailed information, refer to the [official documentation](https://ui.nuxt.com/components/command-palette).
