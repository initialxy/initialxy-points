# USeparator Component

The USeparator component is used to separate content horizontally or vertically in a Vue.js application using Nuxt UI.

## Usage

```vue
<template>
  <USeparator />
</template>
```

## Props

- `orientation`: Changes the orientation (horizontal or vertical). Default is horizontal.
- `label`: Displays a label in the middle.
- `icon`: Displays an icon in the middle.
- `avatar`: Displays an avatar in the middle.
- `color`: Changes the color (primary, secondary, success, info, warning, error, neutral). Default is neutral.
- `type`: Changes the type (solid, dashed, dotted). Default is solid.
- `size`: Changes the size (xs, sm, md, lg, xl). Default is xs.
- `decorative`: Makes the component purely decorative, removing it from the accessibility tree.

## Example Usage

```vue
<template>
  <USeparator orientation="vertical" class="h-48" />
  <USeparator label="Hello World" />
  <USeparator icon="i-simple-icons-nuxtdotjs" />
  <USeparator :avatar="{ src: 'https://github.com/nuxt.png' }" />
  <USeparator color="primary" type="solid" />
  <USeparator type="dashed" />
  <USeparator size="lg" />
</template>
```