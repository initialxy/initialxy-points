# UInput Component

The UInput component is a versatile text input element for Nuxt UI. It supports various props and slots for customization.

## Basic Usage

Use `v-model` to bind the input value:

```vue
<script setup lang="ts">
const value = ref('')
</script>

<template>
  <UInput v-model="value" />
</template>
```

## Props

- `type`: Specify input type (default: 'text')
- `placeholder`: Set placeholder text
- `color`: Change ring color on focus
- `variant`: Change input variant (e.g., 'outline', 'subtle')
- `size`: Change input size (e.g., 'xs', 'sm', 'md', 'lg', 'xl')
- `icon`: Display an icon inside the input
- `avatar`: Display an avatar inside the input
- `loading`: Show loading icon
- `disabled`: Disable the input

## Slots

- `leading`: Content before the input
- `trailing`: Content after the input

## Examples

### With Clear Button

```vue
<script setup lang="ts">
const value = ref('Click to clear')
</script>

<template>
  <UInput v-model="value" placeholder="Type something..." :ui="{ trailing: 'pe-1' }">
    <template v-if="value?.length" #trailing>
      <UButton
        color="neutral"
        variant="link"
        size="sm"
        icon="i-lucide-circle-x"
        aria-label="Clear input"
        @click="value = ''"
      />
    </template>
  </UInput>
</template>
```

### With Password Toggle

```vue
<script setup lang="ts">
const show = ref(false)
const password = ref('')
</script>

<template>
  <UInput
    v-model="password"
    placeholder="Password"
    :type="show ? 'text' : 'password'"
    :ui="{ trailing: 'pe-1' }"
  >
    <template #trailing>
      <UButton
        color="neutral"
        variant="link"
        size="sm"
        :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
        :aria-label="show ? 'Hide password' : 'Show password'"
        @click="show = !show"
      />
    </template>
  </UInput>
</template>
```

## API Reference

### Props

- `as`: Component to render as
- `id`: Input ID
- `name`: Input name
- `type`: Input type
- `placeholder`: Placeholder text
- `color`: Ring color on focus
- `variant`: Input variant
- `size`: Input size
- `required`: Required attribute
- `autocomplete`: Autocomplete attribute
- `autofocus`: Autofocus attribute
- `autofocusDelay`: Autofocus delay
- `disabled`: Disabled attribute
- `highlight`: Highlight ring color
- `modelModifiers`: Model modifiers
- `icon`: Icon to display
- `avatar`: Avatar to display
- `leading`: Show leading icon
- `leadingIcon`: Leading icon
- `trailing`: Show trailing icon
- `trailingIcon`: Trailing icon
- `loading`: Show loading icon
- `loadingIcon`: Custom loading icon
- `modelValue`: Bound value
- `ui`: Custom UI classes

### Slots

- `leading`: Content before the input
- `default`: Default slot
- `trailing`: Content after the input

### Emits

- `update:modelValue`: Value update
- `blur`: Blur event
- `change`: Change event

### Expose

- `inputRef`: Reference to the input element
