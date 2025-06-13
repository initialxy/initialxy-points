# UTree Component

The UTree component is a Vue tree view component for displaying and interacting with hierarchical data structures. It offers various customization options and props to control its behavior and appearance.

## Key Features

- **Items**: Uses the `items` prop as an array of objects with properties like `icon`, `label`, `children`, etc.
- **Multiple Selection**: The `multiple` prop allows multiple item selections.
- **Color and Size**: Customize the tree's color and size using the `color` and `size` props.
- **Icons**: Customize trailing, expanded, and collapsed icons with respective props.
- **Disabled State**: Prevent user interaction with the `disabled` prop.
- **Selection and Expansion Control**: Control selected and expanded items using `v-model` or default props.
- **Custom Slots**: Customize specific items using named slots.

## Props

- `items`: Array of tree items
- `multiple`: Boolean for multiple selection
- `color`: String for color theme
- `size`: String for size variant
- `disabled`: Boolean to disable interaction
- `trailingIcon`, `expandedIcon`, `collapsedIcon`: Strings for custom icons

## Slots

- `item`, `item-leading`, `item-label`, `item-trailing`: Customize tree item rendering

## Example Usage

```vue
<script setup lang="ts">
const items = ref([
  {
    label: 'app/',
    defaultExpanded: true,
    children: [
      {
        label: 'composables/',
        children: [
          { label: 'useAuth.ts', icon: 'i-vscode-icons-file-type-typescript' },
          { label: 'useUser.ts', icon: 'i-vscode-icons-file-type-typescript' }
        ]
      },
      {
        label: 'components/',
        defaultExpanded: true,
        children: [
          { label: 'Card.vue', icon: 'i-vscode-icons-file-type-vue' },
          { label: 'Button.vue', icon: 'i-vscode-icons-file-type-vue' }
        ]
      }
    ]
  },
  { label: 'app.vue', icon: 'i-vscode-icons-file-type-vue' },
  { label: 'nuxt.config.ts', icon: 'i-vscode-icons-file-type-nuxt' }
])
</script>

<template>
  <UTree :items="items" />
</template>
```