# UInputTags Component

The UInputTags component is an interactive tag input element for Vue.js applications. It allows users to enter and display tags with various customization options.

## Key Features

- **Value Control**: Use `v-model` for reactive value binding or `default-value` for static initial value.
- **Placeholder**: Set with the `placeholder` prop.
- **Color and Highlight**: Customize with `color` and `highlight` props.
- **Variants and Sizes**: Change appearance with `variant` and `size` props.
- **Icons and Avatar**: Add icons with `icon`, `leading`, `trailing`, or show an avatar with the `avatar` prop.
- **Delete Icon**: Customize with `delete-icon` prop.
- **Loading State**: Show loading with `loading` and customize icon with `loading-icon`.
- **Disabled State**: Prevent interaction with `disabled` prop.
- **Form Integration**: Use within UFormField for better form control.

## Props

- `v-model`: Reactive value binding
- `default-value`: Initial static value
- `placeholder`: Input placeholder text
- `color`: Ring color on focus
- `variant`: Visual style variant
- `size`: Component size
- `icon`, `leading`, `trailing`: Icon display options
- `avatar`: Display avatar
- `delete-icon`: Custom delete icon
- `loading`, `loading-icon`: Loading state and icon
- `disabled`: Disable interaction

## Slots

- `leading`, `default`, `trailing`: Positional content
- `item-text`, `item-delete`: Customize tag display and delete action

## Usage Example

```vue
<script setup lang="ts">
const value = ref(['Vue'])
</script>

<template>
  <UInputTags v-model="value" placeholder="Enter tags..." />
</template>
```