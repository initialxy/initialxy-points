# UProgress Component

## Overview
The UProgress component is a Vue.js component from Nuxt UI that displays a progress bar to indicate the progress of a task.

## Usage
- Use `v-model` to control the progress value.
- Use `max` prop to set the maximum value.
- Use `status` prop to display the current value above the bar.
- Use `animation` prop to change the animation style.
- Use `orientation` prop to change the orientation (horizontal/vertical).
- Use `color` prop to change the color.
- Use `size` prop to change the size.
- Use `inverted` prop to visually invert the progress bar.

## Example
```vue
<script setup lang="ts">
const value = ref(50)
</script>

<template>
  <UProgress v-model="value" />
</template>
```

## Props
- `as`: Element or component to render as
- `max`: Maximum progress value (number or array of strings)
- `status`: Display current value above the bar (boolean)
- `inverted`: Visually invert the progress (boolean)
- `size`: Size of the progress bar
- `color`: Color of the progress bar
- `orientation`: Orientation of the progress bar (horizontal/vertical)
- `animation`: Animation style of the progress bar
- `modelValue`: Progress value (number)
- `getValueLabel`: Function to get accessible label text
- `getValueText`: Function to get accessible value text
- `ui`: Object for customizing styles

## Slots
- `status`: Slot for custom status display

## Emits
- `update:modelValue`: Emits when modelValue changes
- `update:max`: Emits when max changes
