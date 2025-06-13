# UAvatarGroup

## Overview
The UAvatarGroup component allows stacking multiple avatars together. It's useful for displaying groups of user avatars in a compact format.

## Usage
Wrap multiple UAvatar components within an UAvatarGroup to stack them.

```vue
<template>
  <UAvatarGroup>
    <UAvatar src="https://github.com/benjamincanac.png" alt="Benjamin Canac" />
    <UAvatar src="https://github.com/romhml.png" alt="Romain Hamel" />
    <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
  </UAvatarGroup>
</template>
```

## Props
- `size`: Changes the size of all avatars (values: '3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl')
- `max`: Limits the number of avatars displayed, showing the rest as a "+X" avatar
- `ui`: Customize component styles

## Examples
### With Tooltip
Wrap each avatar with a UTooltip to display a tooltip on hover.

```vue
<template>
  <UAvatarGroup>
    <UTooltip text="benjamincanac">
      <UAvatar src="https://github.com/benjamincanac.png" alt="Benjamin Canac" />
    </UTooltip>
    <!-- More avatars with tooltips -->
  </UAvatarGroup>
</template>
```

### With Chip
Wrap each avatar with a UChip to display a chip around the avatar.

```vue
<template>
  <UAvatarGroup>
    <UChip inset color="success">
      <UAvatar src="https://github.com/benjamincanac.png" alt="Benjamin Canac" />
    </UChip>
    <!-- More avatars with chips -->
  </UAvatarGroup>
</template>
```

### With Link
Wrap each avatar with a ULink to make them clickable.

```vue
<template>
  <UAvatarGroup>
    <ULink to="https://github.com/benjamincanac" target="_blank" class="hover:ring-primary transition" raw>
      <UAvatar src="https://github.com/benjamincanac.png" alt="Benjamin Canac" />
    </ULink>
    <!-- More avatars with links -->
  </UAvatarGroup>
</template>
```