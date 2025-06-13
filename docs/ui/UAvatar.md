# UAvatar Component

The UAvatar component is a Vue component that displays an image with fallback options. It uses the `<NuxtImg>` component when `@nuxt/image` is installed, otherwise it falls back to a standard `img` element.

## Props

- `src`: URL of the image
- `alt`: Alternative text for the image
- `icon`: Icon to display as fallback
- `text`: Text to display as fallback
- `size`: Size of the avatar (options: '3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl')
- `as`: Element or component to render as

## Usage

### Basic Usage
```vue
<template>
  <UAvatar src="https://example.com/avatar.png" alt="User Avatar" />
</template>
```

### With Icon Fallback
```vue
<template>
  <UAvatar icon="i-lucide-image" size="md" />
</template>
```

### With Text Fallback
```vue
<template>
  <UAvatar text="+1" size="md" />
</template>
```

### With Initials Fallback
```vue
<template>
  <UAvatar alt="Benjamin Canac" size="md" />
</template>
```

## Examples

### With Tooltip
```vue
<template>
  <UTooltip text="Benjamin Canac">
    <UAvatar src="https://example.com/avatar.png" alt="Benjamin Canac" />
  </UTooltip>
</template>
```

### With Chip
```vue
<template>
  <UChip inset>
    <UAvatar src="https://example.com/avatar.png" alt="Benjamin Canac" />
  </UChip>
</template>
```