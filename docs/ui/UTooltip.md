# UTooltip

The UTooltip component is a popup that reveals information when hovering over an element. It's part of the Nuxt UI library and can be used with any component, typically a button.

## Usage

1. Wrap your app with the `App` component which uses the `TooltipProvider`.
2. Use the `text` prop to set the tooltip content.
3. Optionally use other props like `kbds`, `delay-duration`, `content`, `arrow`, and `disabled` to customize the tooltip.

## Props

- `text`: string - The text content of the tooltip.
- `kbds`: array - Keyboard keys to display in the tooltip.
- `delay-duration`: number - Delay before the tooltip appears.
- `content`: object - Controls how the tooltip content is rendered.
- `arrow`: boolean - Display an arrow on the tooltip.
- `disabled`: boolean - Disable the tooltip.

## Examples

### Basic Usage
```vue
<template>
  <UTooltip text="Open on GitHub">
    <UButton label="Open" color="neutral" variant="subtle" />
  </UTooltip>
</template>
```

### With Keyboard Shortcuts
```vue
<template>
  <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
    <UButton label="Open" color="neutral" variant="subtle" />
  </UTooltip>
</template>
```

### Custom Content
```vue
<template>
  <UTooltip
    :content="{ align: 'center', side: 'bottom', sideOffset: 8 }"
    text="Open on GitHub"
  >
    <UButton label="Open" color="neutral" variant="subtle" />
  </UTooltip>
</template>
```