# ULink Component

The ULink component is a wrapper around the `<NuxtLink>` component with additional props for enhanced functionality.

## Features

- `inactive-class`: Sets a class when the link is inactive
- `active-class`: Sets a class when the link is active
- `exact`: Styles with `active-class` when the route is exactly the same as the current route
- `exact-query` and `exact-hash`: Styles with `active-class` when the query or hash matches the current query or hash
- `raw`: Allows custom styles using `class`, `active-class`, and `inactive-class`

## Usage

### Basic Usage

```vue
<template>
  <ULink to="/components/link">Link</ULink>
</template>
```

### Custom Tag

```vue
<template>
  <ULink as="button">Link</ULink>
</template>
```

### Custom Styles

```vue
<template>
  <ULink raw to="/components/link" active-class="font-bold" inactive-class="text-muted">Link</ULink>
</template>
```

## Props

- `as`: Specifies the element or component to render when not a link
- `type`: Type of the button when not a link
- `disabled`: Disables the link
- `active`: Forces the link to be active
- `exact`: Activates only if the route is an exact match
- `exactQuery`: Controls how the query sets the link as active
- `exactHash`: Activates only if the hash is an exact match
- `inactiveClass`: Class to apply when the link is inactive
- `raw`: Applies only styles from `class`, `activeClass`, and `inactiveClass`
- `to`: Route location for navigation
- `href`: Alias for `to`
- `external`: Forces the link to be considered external
- `target`: Specifies where to display the linked URL
- `rel`: Rel attribute value for the link
- `noRel`: Disables the rel attribute
- `prefetchedClass`: Class for prefetched links
- `prefetch`: Enables prefetching
- `prefetchOn`: Controls when to prefetch links
- `noPrefetch`: Disables prefetch
- `activeClass`: Class for active links
- `exactActiveClass`: Class for exact active links
- `ariaCurrentValue`: Value for `aria-current` when the link is exact active
- `viewTransition`: Uses `document.startViewTransition()` if supported
- `replace`: Calls `router.replace` instead of `router.push`

## Slots

- `default`: Receives `{ active: boolean }`

## Related Components

- [Breadcrumb](/components/breadcrumb)
- [Button](/components/button)
- [ContextMenu](/components/context-menu)
- [DropdownMenu](/components/dropdown-menu)
- [NavigationMenu](/components/navigation-menu)
