# UStepper Component

The UStepper component is a Vue component from Nuxt UI that displays a set of steps for a multi-step process. It provides various customization options through props and slots.

## Key Features

- **Items**: Define steps using the `items` prop, which accepts an array of objects with properties like `title`, `description`, `icon`, etc.
- **Color**: Change stepper color using the `color` prop.
- **Size**: Adjust stepper size with the `size` prop.
- **Orientation**: Set orientation to `horizontal` or `vertical` using the `orientation` prop.
- **Disabled**: Disable navigation with the `disabled` prop.
- **Controls**: Add custom navigation controls.
- **Active Item**: Control the active step using `default-value` or `v-model`.
- **Custom Slots**: Customize step content using slots like `#content` or custom named slots.

## Example Usage

```vue
<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui'
const items = ref<StepperItem[]>([
  { title: 'Address', description: 'Add your address here', icon: 'i-lucide-house' },
  { title: 'Shipping', description: 'Set your preferred shipping method', icon: 'i-lucide-truck' },
  { title: 'Checkout', description: 'Confirm your order' }
])
</script>

<template>
  <UStepper :items="items" class="w-full" />
</template>
```

## Props

- `items`: Array of step objects
- `color`: Stepper color (e.g., 'primary', 'neutral')
- `size`: Stepper size (e.g., 'md', 'xl')
- `orientation`: Orientation ('horizontal' or 'vertical')
- `disabled`: Boolean to disable navigation
- `defaultValue`: Initial active step value
- `modelValue`: For two-way binding of active step

## Slots

- `indicator`, `title`, `description`, `content`: Customize step elements
- Custom named slots for specific steps

## Exposed Methods

- `next()`: Move to next step
- `prev()`: Move to previous step
- `hasNext`: Boolean indicating if there's a next step
- `hasPrev`: Boolean indicating if there's a previous step
