# UApp Component

The UApp component is a wrapper for your Nuxt application that provides global configurations and utilities. It implements the Reka UI ConfigProvider for global settings like reading direction and body lock behavior. It also integrates ToastProvider and TooltipProvider for global toasts, tooltips, and programmatic modals/slideovers.

## Usage

Use UApp at the root of your application:

```vue
<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
```

## Props

- `tooltip`: Configures tooltip behavior (delay, hover, etc.)
- `toaster`: Configures toast notifications (position, duration, etc.)
- `locale`: Sets the application locale
- `portal`: Specifies where to render the portal
- `scrollBody`: Controls global scroll body behavior
- `nonce`: Sets a global nonce value

## Slots

- `default`: The default slot for app content

## Related

- [useToast](/composables/use-toast)
- [Accordion](/components/accordion)
