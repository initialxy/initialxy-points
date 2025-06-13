# UAlert Component

The UAlert component is a callout used to draw the user's attention. It supports various customization options through props.

## Props

- `title`: Sets the title of the alert
- `description`: Sets the description of the alert
- `icon`: Displays an icon (e.g., `icon="i-lucide-terminal"`)
- `avatar`: Displays an avatar (e.g., `:avatar="{ src: 'https://example.com/image.png' }"`)
- `color`: Changes the color of the alert (e.g., `color="neutral"`)
- `variant`: Changes the variant of the alert (e.g., `variant="subtle"`)
- `close`: Displays a close button to dismiss the alert
- `closeIcon`: Customizes the close button icon (e.g., `close-icon="i-lucide-arrow-right"`)
- `actions`: Adds button actions to the alert (e.g., `:actions="[{ label: 'Action 1' }]"`)
- `orientation`: Changes the orientation of the alert (e.g., `orientation="horizontal"`)
- `class`: Overrides the base styles of the alert
- `ui`: Overrides the slots styles of the alert

## Usage Examples

### Basic Alert
```vue
<template>
  <UAlert title="Heads up!" />
</template>
```

### Alert with Description
```vue
<template>
  <UAlert title="Heads up!" description="You can change the primary color in your app config." />
</template>
```

### Alert with Icon
```vue
<template>
  <UAlert title="Heads up!" description="You can change the primary color in your app config." icon="i-lucide-terminal" />
</template>
```

### Alert with Avatar
```vue
<template>
  <UAlert title="Heads up!" description="You can change the primary color in your app config." :avatar="{ src: 'https://github.com/nuxt.png' }" />
</template>
```

### Alert with Custom Color and Variant
```vue
<template>
  <UAlert color="neutral" variant="subtle" title="Heads up!" description="You can change the primary color in your app config." icon="i-lucide-terminal" />
</template>
```

### Alert with Close Button
```vue
<template>
  <UAlert title="Heads up!" description="You can change the primary color in your app config." color="neutral" variant="outline" close />
</template>
```

### Alert with Actions
```vue
<template>
  <UAlert title="Heads up!" description="You can change the primary color in your app config." color="neutral" variant="outline" :actions="[{ label: 'Action 1' }, { label: 'Action 2', color: 'neutral', variant: 'subtle' }]" />
</template>
```