# UButtonGroup

## Overview
The UButtonGroup component allows grouping multiple button-like elements together. It's useful for creating button groups with consistent styling and behavior.

## Usage
Wrap multiple UButton components within a UButtonGroup to group them together.

```vue
<template>
  <UButtonGroup>
    <UButton color="neutral" variant="subtle" label="Button" />
    <UButton color="neutral" variant="outline" icon="i-lucide-chevron-down" />
  </UButtonGroup>
</template>
```

## Props

### size
Use the `size` prop to change the size of all the buttons.

```vue
<template>
  <UButtonGroup size="xl">
    <UButton color="neutral" variant="subtle" label="Button" />
    <UButton color="neutral" variant="outline" icon="i-lucide-chevron-down" />
  </UButtonGroup>
</template>
```

### orientation
Use the `orientation` prop to change the orientation of the buttons. Defaults to `horizontal`.

```vue
<template>
  <UButtonGroup orientation="vertical">
    <UButton color="neutral" variant="subtle" label="Submit" />
    <UButton color="neutral" variant="outline" label="Cancel" />
  </UButtonGroup>
</template>
```

## Examples

### With Input
You can use components like UInput, UInputMenu, USelect, USelectMenu, etc. within a button group.

```vue
<template>
  <UButtonGroup>
    <UInput color="neutral" variant="outline" placeholder="Enter token" />
    <UButton color="neutral" variant="subtle" icon="i-lucide-clipboard" />
  </UButtonGroup>
</template>
```

### With Tooltip
You can use a UTooltip within a button group.

```vue
<template>
  <UButtonGroup>
    <UInput color="neutral" variant="outline" placeholder="Enter token" />
    <UTooltip text="Copy to clipboard">
      <UButton color="neutral" variant="subtle" icon="i-lucide-clipboard" />
    </UTooltip>
  </UButtonGroup>
</template>
```

### With Dropdown
You can use a UDropdownMenu within a button group.

```vue
<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
const items: DropdownMenuItem[] = [
  { label: 'Team', icon: 'i-lucide-users' },
  { label: 'Invite users', icon: 'i-lucide-user-plus', children: [
    { label: 'Invite by email', icon: 'i-lucide-send-horizontal' },
    { label: 'Invite by link', icon: 'i-lucide-link' }
  ]},
  { label: 'New team', icon: 'i-lucide-plus' }
]
</script>
<template>
  <UButtonGroup>
    <UButton color="neutral" variant="subtle" label="Settings" />
    <UDropdownMenu :items="items">
      <UButton color="neutral" variant="outline" icon="i-lucide-chevron-down" />
    </UDropdownMenu>
  </UButtonGroup>
</template>
```

### With Badge
You can use a UBadge within a button group.

```vue
<template>
  <UButtonGroup>
    <UBadge color="neutral" variant="outline" size="lg" label="https://" />
    <UInput color="neutral" variant="outline" placeholder="www.example.com" />
  </UButtonGroup>
</template>
```

## API

### Props

| Prop       | Default     | Type                                                                                     |
|------------|-------------|------------------------------------------------------------------------------------------|
| `as`       | `'div'`     | `any`                                                                                   |
| `size`     | `'md'`      | `"md" | "xs" | "sm" | "lg" | "xl"`                                                 |
| `orientation` | `'horizontal'` | `"horizontal" | "vertical"`                                             |
| `ui`       | `{}`        | `{}`                                                                                   |

### Slots

| Slot     | Type |
|----------|------|
| `default` | `{}` |