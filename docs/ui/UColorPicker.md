# UColorPicker

The UColorPicker component allows users to select colors in various formats.

## Usage

### Basic Usage
Use `v-model` to control the value:
```vue
<script setup lang="ts">
const value = ref('#00C16A')
</script>
<template>
  <UColorPicker v-model="value" />
</template>
```

Use `default-value` for initial value without state control:
```vue
<template>
  <UColorPicker default-value="#00BCD4" />
</template>
```

### Color Formats
Set color format using the `format` prop:
- RGB: `format="rgb"`
- HSL: `format="hsl"`
- CMYK: `format="cmyk"`
- CIELab: `format="lab"`

### Throttle
Control update frequency with `throttle` prop:
```vue
<template>
  <UColorPicker :throttle="100" v-model="value" />
</template>
```

### Size
Set component size with `size` prop:
```vue
<template>
  <UColorPicker size="xl" />
</template>
```

### Disabled State
Disable the picker with `disabled` prop:
```vue
<template>
  <UColorPicker disabled />
</template>
```

## Examples

### Color Chooser
Combine with Button and Popover for a color chooser:
```vue
<script setup lang="ts">
const color = ref('#00C16A')
const chip = computed(() => ({ backgroundColor: color.value }))
</script>
<template>
  <UPopover>
    <UButton label="Choose color" color="neutral" variant="outline">
      <template #leading>
        <span :style="chip" class="size-3 rounded-full" />
      </template>
    </UButton>
    <template #content>
      <UColorPicker v-model="color" class="p-2" />
    </template>
  </UPopover>
</template>
```

## API

### Props
- `as`: Element type (default: 'div')
- `throttle`: Update frequency in ms (default: 50)
- `disabled`: Boolean to disable picker
- `defaultValue`: Initial color (default: '#FFFFFF')
- `format`: Color format (default: 'hex')
- `size`: Component size (default: 'md')
- `modelValue`: Bound value
- `ui`: Object for custom styling

### Emits
- `update:modelValue`: Emits updated color value
