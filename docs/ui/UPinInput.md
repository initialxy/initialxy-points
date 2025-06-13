# UPinInput

The UPinInput component is a Vue input element designed for entering PIN codes. It supports various features and customization options.

## Usage

### Basic Usage
Use `v-model` to control the value:
```vue
<script setup lang="ts">
const value = ref([])
</script>
<template>
  <UPinInput v-model="value" />
</template>
```

Use `default-value` for initial value without state control:
```vue
<template>
  <UPinInput :default-value="['1', '2', '3']" />
</template>
```

## Props

- `type`: Changes input type (default: 'text', options: 'number')
- `mask`: Treats input like a password
- `otp`: Enables One-Time Password functionality
- `length`: Sets number of input fields (default: 5)
- `placeholder`: Sets placeholder text
- `color`: Changes ring color on focus (default: 'primary')
- `variant`: Changes component variant (default: 'outline')
- `size`: Changes component size (default: 'md')
- `disabled`: Disables the input

## Events

- `blur`: Triggered on blur
- `change`: Triggered on change
- `update:modelValue`: Emits new value
- `complete`: Emits value when input is complete