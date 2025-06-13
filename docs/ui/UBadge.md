# UBadge Component

## Overview
The UBadge component is a short text element used to represent a status or category. It's highly customizable with various props for styling and positioning.

## Usage

### Label
Set the badge label using the default slot or the `label` prop:
```vue
<UBadge>Badge</UBadge>
<UBadge label="Badge" />
```

### Color
Change the badge color using the `color` prop:
```vue
<UBadge color="neutral">Badge</UBadge>
```

### Variant
Change the badge variant using the `variant` prop:
```vue
<UBadge color="neutral" variant="outline">Badge</UBadge>
```

### Size
Change the badge size using the `size` prop:
```vue
<UBadge size="xl">Badge</UBadge>
```

### Icon
Add an icon using the `icon`, `leading`, or `trailing` props:
```vue
<UBadge icon="i-lucide-rocket" size="md" color="primary" variant="solid">Badge</UBadge>
<UBadge trailing-icon="i-lucide-arrow-right" size="md">Badge</UBadge>
```

### Avatar
Add an avatar using the `avatar` prop:
```vue
<UBadge :avatar="{ src: 'https://github.com/nuxt.png' }" size="md" color="neutral" variant="outline">Badge</UBadge>
```

## Props
- `as`: Element or component to render as (default: 'span')
- `label`: Text content (string or number)
- `color`: Color variant (default: 'primary')
- `variant`: Style variant (default: 'solid')
- `size`: Size variant (default: 'md')
- `square`: Equal padding on all sides (boolean)
- `icon`, `leading`, `trailing`: Icon positioning
- `avatar`: Avatar properties

## Slots
- `leading`: Content before the label
- `default`: Main label content
- `trailing`: Content after the label

## Theme Customization
Customize the badge appearance in `app.config.ts` or `vite.config.ts` using the `ui.badge` configuration.
