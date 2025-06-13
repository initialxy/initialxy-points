# USwitch Component

## Overview
The USwitch component is a control that toggles between two states. It's commonly used for boolean settings like enabling/disabling features.

## Usage
### Basic Usage
Use `v-model` to control the checked state:
```vue
<script setup lang="ts">
const value = ref(true)
</script>
<template>
  <USwitch v-model="value" />
</template>
```

Use `default-value` for initial state without controlling it:
```vue
<template>
  <USwitch default-value />
</template>
```

### Props
- `label`: Sets the label text
- `description`: Adds a description below the switch
- `checked-icon`/`unchecked-icon`: Custom icons for checked/unchecked states
- `loading`: Shows a loading indicator
- `loading-icon`: Customizes the loading icon
- `color`: Changes the switch color (e.g., 'primary', 'neutral')
- `size`: Adjusts the switch size (e.g., 'xs', 'sm', 'md', 'lg', 'xl')
- `disabled`: Disables the switch

### Example with Label and Description
```vue
<template>
  <USwitch label="Check me" description="This is a checkbox." />
</template>
```

### Loading State
```vue
<template>
  <USwitch loading default-value label="Check me" />
</template>
```

### Custom Icons
```vue
<template>
  <USwitch
    unchecked-icon="i-lucide-x"
    checked-icon="i-lucide-check"
    default-value
    label="Check me"
  />
</template>
```

## Theme Customization
Customize globally in `app.config.ts` or `vite.config.ts` under `ui.icons.loading` key.

## API Reference
### Props
- `as`: Element type (default: 'div')
- `color`: Color variant (default: 'primary')
- `size`: Size variant (default: 'md')
- `loading`: Boolean to show loading state
- `loadingIcon`: Custom loading icon
- `checkedIcon`: Icon when checked
- `uncheckedIcon`: Icon when unchecked
- `label`: Label text
- `description`: Description text
- `defaultValue`: Initial state
- `disabled`: Disable the switch
- `id`, `name`, `required`, `value`, `modelValue`: Form-related props

### Slots
- `label`: Custom label content
- `description`: Custom description content

### Emits
- `change`: Emitted on change
- `update:modelValue`: Emitted on model value update
