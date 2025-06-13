# UTimeline Component

The UTimeline component displays a sequence of events with dates, titles, icons, or avatars. It offers customization through various props and slots.

## Key Features

- **Items**: Use the `items` prop as an array of objects with properties like `date`, `title`, `description`, `icon`, `avatar`, etc.
- **Color**: Change the color of active items using the `color` prop.
- **Size**: Adjust the size of the timeline with the `size` prop.
- **Orientation**: Set the orientation to `horizontal` or `vertical` using the `orientation` prop.
- **Reverse**: Reverse the direction of the timeline with the `reverse` prop.
- **Custom Slots**: Customize specific items using named slots.

## Example Usage

```vue
<script setup lang="ts">
import type { TimelineItem } from '@nuxt/ui'
const items = ref<TimelineItem[]>([
  { date: 'Mar 15, 2025', title: 'Project Kickoff', description: 'Kicked off the project...', icon: 'i-lucide-rocket' },
  // More items...
])
</script>

<template>
  <UTimeline :items="items" class="w-96" />
</template>
```

## Props

- `items`: Array of timeline items
- `color`: Color of active items (default: 'primary')
- `size`: Size of the timeline (default: 'md')
- `orientation`: Orientation ('horizontal' or 'vertical', default: 'vertical')
- `reverse`: Boolean to reverse the timeline direction
- `modelValue`: For controlling the active item

## Slots

- `indicator`, `date`, `title`, `description`: Customize specific parts of the timeline items