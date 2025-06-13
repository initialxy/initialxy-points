# UInputMenu

The UInputMenu component is an autocomplete input with real-time suggestions, built using Reka UI's Combobox component. It's similar to the SelectMenu but uses an Input instead of a Select.

## Usage

Use `v-model` to control the value or `default-value` for initial value without state control. The `items` prop can be an array of strings, numbers, booleans, or objects with properties like `label`, `type`, `icon`, `avatar`, etc.

```vue
<script setup lang="ts">
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const value = ref('Backlog')
</script>

<template>
  <UInputMenu v-model="value" :items="items" />
</template>
```

## Key Props

- `items`: Array of strings, numbers, booleans, or objects
- `value-key`: Specify a property to use as the value when items are objects
- `multiple`: Allow multiple selections (displayed as tags)
- `placeholder`: Set placeholder text
- `color`, `variant`, `size`: Customize appearance
- `icon`, `trailing-icon`, `selected-icon`: Customize icons
- `loading`: Show loading indicator
- `disabled`: Disable the input

## Slots

- `leading`, `trailing`: Custom content before/after input
- `item-*`: Customize item rendering
- `create-item-label`: Custom label for create item

## Events

- `create`: Triggered when a new item is created
- `update:modelValue`: Value changes
- `update:searchTerm`: Search term changes

## Example with Objects

```vue
<script setup lang="ts">
const items = ref([
  { label: 'Backlog', id: 'backlog' },
  { label: 'Todo', id: 'todo' },
  { label: 'In Progress', id: 'in_progress' },
  { label: 'Done', id: 'done' }
])
const value = ref('todo')
</script>

<template>
  <UInputMenu v-model="value" value-key="id" :items="items" />
</template>
```

## Example with Multiple Selection

```vue
<script setup lang="ts">
const items = ref(['Backlog', 'Todo', 'In Progress', 'Done'])
const value = ref(['Backlog', 'Todo'])
</script>

<template>
  <UInputMenu v-model="value" multiple :items="items" />
</template>
```