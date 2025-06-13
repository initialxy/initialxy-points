# UTabs Component

## Overview
The UTabs component is a set of tab panels that are displayed one at a time. It's part of the Nuxt UI library.

## Key Props
- `items`: Array of objects defining tab properties (label, icon, content, etc.)
- `content`: Boolean to show/hide tab content (default: true)
- `unmount-on-hide`: Boolean to control unmounting of hidden tabs (default: true)
- `color`: String to set tab color theme
- `variant`: String to set tab variant style (pill, link)
- `size`: String to set tab size
- `orientation`: String to set tab orientation (horizontal, vertical)

## Usage Examples
### Basic Usage
```vue
<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
const items = ref<TabsItem[]>([
  { label: 'Account', icon: 'i-lucide-user', content: 'Account content' },
  { label: 'Password', icon: 'i-lucide-lock', content: 'Password content' }
])
</script>

<template>
  <UTabs :items="items" class="w-full" />
</template>
```

### Toggle-Only Tabs
```vue
<template>
  <UTabs :content="false" :items="items" class="w-full" />
</template>
```

### Vertical Tabs
```vue
<template>
  <UTabs orientation="vertical" variant="pill" :content="false" :items="items" class="w-full" />
</template>
```

## Slots
- `leading`, `default`, `trailing`, `content`, `list-leading`, `list-trailing`

## Events
- `update:modelValue`: Emitted when the active tab changes