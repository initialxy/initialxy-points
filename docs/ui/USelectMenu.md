# USelectMenu

The USelectMenu component is an advanced searchable select element in Nuxt UI. It extends the basic select functionality with search capabilities and multiple selection options.

## Key Features

- **Searchable**: Allows users to search through options
- **Multiple Selection**: Supports selecting multiple items
- **Customizable**: Offers various props for styling and behavior customization
- **Integrates with Reka UI's Combobox**: Provides enhanced functionality

## Basic Usage

```vue
<script setup lang="ts">
const items = ref(['Option 1', 'Option 2', 'Option 3'])
const value = ref('Option 1')
</script>

<template>
  <USelectMenu v-model="value" :items="items" class="w-48" />
</template>
```

## Props

- `items`: Array of strings, numbers, or objects to display as options
- `value-key`: Specifies which property to use as the value when items are objects
- `multiple`: Boolean to enable multiple selection
- `placeholder`: String for placeholder text
- `search-input`: Customizes or hides the search input
- `content`: Configures menu content alignment and positioning
- `arrow`: Boolean to display an arrow indicator
- `color`: Changes the ring color when focused
- `variant`: Changes the component's variant style
- `size`: Adjusts the component size
- `icon`: Displays an icon inside the select menu
- `trailing-icon`: Customizes the trailing icon
- `selected-icon`: Customizes the icon when an item is selected
- `avatar`: Displays an avatar inside the select menu
- `loading`: Shows a loading indicator
- `loading-icon`: Customizes the loading icon
- `disabled`: Disables the select menu

## Slots

- `leading`: Content before the main content
- `default`: Main content area
- `trailing`: Content after the main content
- `empty`: Content when no items match the search
- `item`: Customize individual items
- `item-leading`: Content before item label
- `item-label`: Customize item label display
- `item-trailing`: Content after item label
- `content-top`: Content at the top of the menu
- `content-bottom`: Content at the bottom of the menu
- `create-item-label`: Label for custom created items

## Events

- `blur`: Triggered when the component loses focus
- `change`: Triggered when the value changes
- `focus`: Triggered when the component gains focus
- `update:open`: Triggered when the open state changes
- `create`: Triggered when a new item is created
- `highlight`: Triggered when an item is highlighted
- `update:modelValue`: Triggered when the model value changes
- `update:searchTerm`: Triggered when the search term changes
