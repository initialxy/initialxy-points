# UPagination

The UPagination component provides pagination functionality with customizable appearance and behavior.

## Usage

Control the current page using the `default-page` prop or `v-model:page` directive.

```vue
<template>
  <UPagination v-model:page="page" :total="100" />
</template>
```

## Key Props

- `total`: Total number of items
- `items-per-page`: Number of items per page (default: 10)
- `sibling-count`: Number of sibling pages to show (default: 2)
- `show-edges`: Show first/last pages and ellipsis (default: false)
- `show-controls`: Show first/prev/next/last buttons (default: true)
- `color`, `variant`, `active-color`, `active-variant`: Styling props
- `size`: Size of controls (default: 'md')
- `disabled`: Disable pagination controls
- `to`: Function to transform buttons into links

## Slots

- `first`, `prev`, `next`, `last`, `ellipsis`, `item`: Custom content for pagination controls