# UCard Component

## Overview
The UCard component is used to display content in a card format with optional header, body, and footer sections.

## Usage
```vue
<template>
  <UCard>
    <template #header>
      <Placeholder class="h-8" />
    </template>
    <Placeholder class="h-32" />
    <template #footer>
      <Placeholder class="h-8" />
    </template>
  </UCard>
</template>
```

## Variant
Use the `variant` prop to change the card's appearance.

```vue
<template>
  <UCard variant="subtle">
    <template #header>
      <Placeholder class="h-8" />
    </template>
    <Placeholder class="h-32" />
    <template #footer>
      <Placeholder class="h-8" />
    </template>
  </UCard>
</template>
```

## Props
- `as`: Specifies the element or component to render as (default: 'div')
- `variant`: Changes the card's variant (options: 'solid', 'outline', 'soft', 'subtle', default: 'outline')
- `ui`: Object for customizing class names for root, header, body, and footer

## Slots
- `header`: Content for the card header
- `default`: Main content of the card
- `footer`: Content for the card footer

## Theme Configuration
Configure the card's appearance in `app.config.ts` or `vite.config.ts` by customizing the slots and variants.

```typescript
// app.config.ts
export default defineAppConfig({
  ui: {
    card: {
      slots: {
        root: 'rounded-lg',
        header: 'p-4 sm:px-6',
        body: 'p-4 sm:p-6',
        footer: 'p-4 sm:px-6'
      },
      variants: {
        variant: {
          solid: { root: 'bg-inverted text-inverted' },
          outline: { root: 'bg-default ring ring-default divide-y divide-default' },
          soft: { root: 'bg-elevated/50 divide-y divide-default' },
          subtle: { root: 'bg-elevated/50 ring ring-default divide-y divide-default' }
        }
      },
      defaultVariants: { variant: 'outline' }
    }
  }
})
```