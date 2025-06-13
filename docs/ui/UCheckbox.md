# UCheckbox Component

## Overview
The UCheckbox component is a Vue.js input element that toggles between checked and unchecked states. It's part of the Nuxt UI library.

## Usage
### Basic Usage
Use `v-model` to control the checked state:
```vue
<script setup lang="ts">
const value = ref(true)
</script>
<template>
  <UCheckbox v-model="value" />
</template>
```

Use `default-value` for initial state without controlling it:
```vue
<template>
  <UCheckbox default-value />
</template>
```

### Indeterminate State
Set the checkbox to an indeterminate state using `v-model` or `default-value`:
```vue
<template>
  <UCheckbox default-value="indeterminate" />
</template>
```

Customize the indeterminate icon with `indeterminate-icon`:
```vue
<template>
  <UCheckbox default-value="indeterminate" indeterminate-icon="i-lucide-plus" />
</template>
```

### Label and Description
Add a label with the `label` prop:
```vue
<template>
  <UCheckbox label="Check me" />
</template>
```

Add a description with the `description` prop:
```vue
<template>
  <UCheckbox label="Check me" description="This is a checkbox." />
</template>
```

### Icon and Color
Customize the checked icon with the `icon` prop:
```vue
<template>
  <UCheckbox icon="i-lucide-heart" default-value label="Check me" />
</template>
```

Change the color with the `color` prop:
```vue
<template>
  <UCheckbox color="neutral" default-value label="Check me" />
</template>
```

### Variant and Size
Change the variant with the `variant` prop:
```vue
<template>
  <UCheckbox color="primary" variant="card" default-value label="Check me" />
</template>
```

Change the size with the `size` prop:
```vue
<template>
  <UCheckbox size="xl" variant="list" default-value label="Check me" />
</template>
```

### Indicator Position
Change the indicator position with the `indicator` prop:
```vue
<template>
  <UCheckbox indicator="end" variant="card" default-value label="Check me" />
</template>
```

### Disabled State
Disable the checkbox with the `disabled` prop:
```vue
<template>
  <UCheckbox disabled label="Check me" />
</template>
```

## Props
- `as`: Element or component to render as
- `label`: Label text
- `description`: Description text
- `color`: Color variant
- `variant`: Variant style
- `size`: Size variant
- `indicator`: Indicator position
- `icon`: Checked icon
- `indeterminateIcon`: Indeterminate icon
- `disabled`: Disable state
- `value`: Form submission value
- `name`: Form field name
- `required`: Required state
- `id`: Element ID
- `defaultValue`: Initial value
- `modelValue`: Controlled value

## Slots
- `label`: Label slot
- `description`: Description slot

## Emits
- `change`: Change event
- `update:modelValue`: Model value update
