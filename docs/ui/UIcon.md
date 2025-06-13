# UIcon Component

The UIcon component in Nuxt UI allows you to display any icon from Iconify. It's a simple and flexible way to include icons in your application.

## Usage

Use the `name` prop to specify which icon to display:

```vue
<template>
  <UIcon name="i-lucide-lightbulb" class="size-5" />
</template>
```

## API

### Props

- `name` (string): The name of the icon to display.
- `mode` (string, optional): The rendering mode, either "svg" or "css".
- `size` (string | number, optional): The size of the icon.
- `customize` (function, optional): A function to customize the icon's content.
