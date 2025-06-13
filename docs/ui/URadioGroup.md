# URadioGroup

The URadioGroup component is a set of radio buttons used to select a single option from a list. It supports various customization options through props and slots.

## Usage

### Basic Usage
Use the `v-model` directive to control the value or `default-value` prop for initial value.

```ts
<script setup lang="ts">
import type { RadioGroupItem, RadioGroupValue } from '@nuxt/ui'
const items = ref<RadioGroupItem[]>(['System', 'Light', 'Dark'])
const value = ref<RadioGroupValue>('System')
</script>

<template>
  <URadioGroup v-model="value" :items="items" />
</template>
```

### Items as Objects
Pass an array of objects with properties like `label`, `description`, `value`, etc.

```ts
<script setup lang="ts">
import type { RadioGroupItem, RadioGroupValue } from '@nuxt/ui'
const items = ref<RadioGroupItem[]>([
  { label: 'System', description: 'This is the first option.', value: 'system' },
  { label: 'Light', description: 'This is the second option.', value: 'light' },
  { label: 'Dark', description: 'This is the third option.', value: 'dark' }
])
const value = ref<RadioGroupValue>('system')
</script>

<template>
  <URadioGroup v-model="value" :items="items" />
</template>
```

## Props

- `items`: Array of strings/numbers or objects with properties like `label`, `description`, etc.
- `valueKey`: Property to use as value (default: 'value')
- `legend`: Legend text for the group
- `color`: Color variant (e.g., 'primary', 'neutral')
- `variant`: Variant style (e.g., 'list', 'card', 'table')
- `size`: Size variant (e.g., 'xs', 'sm', 'md', 'lg', 'xl')
- `orientation`: Layout orientation ('horizontal' or 'vertical')
- `indicator`: Indicator position ('start', 'end', 'hidden')
- `disabled`: Disable the group

## Slots

- `legend`: Custom legend content
- `label`: Custom label content
- `description`: Custom description content

## Example

```ts
<script setup lang="ts">
import type { RadioGroupItem } from '@nuxt/ui'
const items = ref<RadioGroupItem[]>(['System', 'Light', 'Dark'])
</script>

<template>
  <URadioGroup legend="Theme" default-value="System" :items="items" />
</template>
```