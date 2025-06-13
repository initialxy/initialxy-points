# UTextarea Component

The UTextarea component is a Vue.js component for multi-line text input. It supports various props for customization.

## Basic Usage

```vue
<script setup lang="ts">
const value = ref('')
</script>

<template>
  <UTextarea v-model="value" />
</template>
```

## Props

- `rows`: Number of rows (default: 3)
- `placeholder`: Placeholder text
- `autoresize`: Enable autoresizing height
- `maxrows`: Maximum rows when autoresizing (0 = unlimited)
- `color`: Ring color when focused
- `variant`: Variant style (outline, soft, subtle, ghost, none)
- `size`: Size (xs, sm, md, lg, xl)
- `icon`: Icon inside the textarea
- `leading`/`trailing`: Icon position
- `leading-icon`/`trailing-icon`: Different icons for each position
- `avatar`: Avatar inside the textarea
- `loading`: Show loading icon
- `loading-icon`: Custom loading icon
- `disabled`: Disable the textarea

## Slots

- `leading`
- `default`
- `trailing`