# UTable Component

## Overview
The UTable component is a responsive table element built on top of TanStack Table, providing a flexible and type-safe API for displaying data in rows and columns. It supports various features like column definitions, custom rendering, sorting, filtering, and more.

## Key Features
- Built on TanStack Table with useVueTable composable
- Supports column definitions with accessorKey, header, cell, and meta properties
- Custom rendering using Vue's h function
- Supports slots for header and data cell customization
- Various props for configuration (data, columns, loading, sticky header, etc.)
- Extensive theming options

## Basic Usage
```vue
<script setup lang="ts">
const data = ref([
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  // more data
]);

const columns = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
];
</script>

<template>
  <UTable :data="data" :columns="columns" />
</template>
```

## Props
- `data`: Array of objects to display in the table
- `columns`: Array of column definitions
- `loading`: Boolean to show loading state
- `sticky`: Boolean to make header sticky
- `meta`: Object for passing additional properties

## Slots
- `expanded`: For rendering expanded row content
- `empty`: For custom empty state
- `loading`: For custom loading state
- `caption`: For table caption