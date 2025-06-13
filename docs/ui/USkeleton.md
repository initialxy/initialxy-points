# USkeleton

## Overview
The USkeleton component is a placeholder used to show while content is loading. It's a simple way to create loading skeletons in your UI.

## Usage
```vue
<template>
  <div class="flex items-center gap-4">
    <USkeleton class="h-12 w-12 rounded-full" />
    <div class="grid gap-2">
      <USkeleton class="h-4 w-[250px]" />
      <USkeleton class="h-4 w-[200px]" />
    </div>
  </div>
</template>
```

## API

### Props

| Prop  | Default | Type  | Description |
|-------|---------|-------|-------------|
| `as`  | `'div'` | `any` | The element or component this component should render as. |

### Slots

| Slot    | Type |
|---------|------|
| `default` | `{}` |