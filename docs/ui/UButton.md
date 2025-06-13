# UButton Component

The UButton component is a versatile button element that can act as a link or trigger an action. It supports various customization options through props and slots.

## Key Features

- **Label**: Set using the default slot or `label` prop.
- **Color**: Customize with the `color` prop (e.g., `neutral`, `primary`).
- **Variant**: Change appearance with the `variant` prop (e.g., `outline`, `solid`).
- **Size**: Adjust size using the `size` prop (e.g., `xl`, `md`).
- **Icon**: Add icons using `icon`, `leading`, `trailing`, `leading-icon`, or `trailing-icon` props.
- **Avatar**: Display an avatar inside the button using the `avatar` prop.
- **Link**: Use as a link by passing properties like `to`, `target`, etc.
- **Loading State**: Show a loading icon with the `loading` or `loading-auto` props.
- **Disabled State**: Disable the button with the `disabled` prop.
- **Styling**: Customize styles using the `class` or `ui` props.

## Props

- `as`: Specifies the element or component to render as.
- `label`: Text content of the button.
- `color`: Button color (e.g., `primary`, `neutral`).
- `variant`: Button variant (e.g., `solid`, `outline`).
- `size`: Button size (e.g., `md`, `xl`).
- `icon`, `leading`, `trailing`, `leadingIcon`, `trailingIcon`: Icon-related props.
- `avatar`: Avatar properties.
- `loading`, `loadingAuto`, `loadingIcon`: Loading state props.
- `to`, `target`, `type`: Link-related props.
- `disabled`, `active`: Button state props.
- `class`, `ui`: Custom styling props.

## Slots

- `leading`: Content before the label.
- `default`: Main label content.
- `trailing`: Content after the label.

## Theme Customization

Global styles can be configured in `app.config.ts` or `vite.config.ts` under the `ui.button` key.

## Examples

```vue
<template>
  <!-- Basic button -->
  <UButton>Button</UButton>

  <!-- With label prop -->
  <UButton label="Button" />

  <!-- With color and variant -->
  <UButton color="neutral" variant="outline">Button</UButton>

  <!-- With icon -->
  <UButton icon="i-lucide-rocket" size="md" color="primary" variant="solid">Button</UButton>

  <!-- As a link -->
  <UButton to="https://github.com/nuxt/ui" target="_blank">Button</UButton>

  <!-- Loading state -->
  <UButton loading>Button</UButton>
</template>
