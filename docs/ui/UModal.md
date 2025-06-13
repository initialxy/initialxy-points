# UModal Component

The UModal component is a dialog window used to display messages or request user input. It supports various customization options through props and slots.

## Usage

Use a button or any component in the default slot to trigger the modal. Use the `#content` slot for the modal's content.

```vue
<template>
  <UModal>
    <UButton label="Open" color="neutral" variant="subtle" />
    <template #content>
      <Placeholder class="h-48 m-4" />
    </template>
  </UModal>
</template>
```

## Customization

### Title and Description

Use the `title` and `description` props to set the modal's header content.

```vue
<template>
  <UModal title="Modal with title" description="Description text">
    <UButton label="Open" color="neutral" variant="subtle" />
    <template #body>
      <Placeholder class="h-48" />
    </template>
  </UModal>
</template>
```

### Close Button

Customize or hide the close button using the `close` prop.

```vue
<template>
  <UModal title="Modal with close button" :close="{ color: 'primary', variant: 'outline', class: 'rounded-full' }">
    <UButton label="Open" color="neutral" variant="subtle" />
    <template #body>
      <Placeholder class="h-48" />
    </template>
  </UModal>
</template>
```

### Overlay and Transition

Control the overlay and transition effects with the `overlay` and `transition` props.

```vue
<template>
  <UModal :overlay="false" :transition="false" title="Modal without overlay/transition">
    <UButton label="Open" color="neutral" variant="subtle" />
    <template #body>
      <Placeholder class="h-48" />
    </template>
  </UModal>
</template>
```

### Fullscreen

Make the modal fullscreen using the `fullscreen` prop.

```vue
<template>
  <UModal fullscreen title="Fullscreen Modal">
    <UButton label="Open" color="neutral" variant="subtle" />
    <template #body>
      <Placeholder class="h-full" />
    </template>
  </UModal>
</template>
```

## Advanced Usage

### Control Open State

Control the open state with `v-model:open` or `default-open` prop.

```vue
<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <UModal v-model:open="open">
    <UButton label="Open" color="neutral" variant="subtle" />
    <template #content>
      <Placeholder class="h-48 m-4" />
    </template>
  </UModal>
</template>
```

### Disable Dismissal

Prevent modal dismissal with the `dismissible` prop.

```vue
<template>
  <UModal :dismissible="false" title="Non-dismissible Modal">
    <UButton label="Open" color="neutral" variant="subtle" />
    <template #body>
      <Placeholder class="h-48" />
    </template>
  </UModal>
</template>
```

### Programmatic Usage

Use the `useOverlay` composable to open modals programmatically.

```vue
<script setup lang="ts">
import { useOverlay } from '#components'
const overlay = useOverlay()
const modal = overlay.create(ModalComponent)
</script>

<template>
  <UButton label="Open" @click="modal.open()" />
</template>
```

### Nested Modals

Modals can be nested within each other.

```vue
<script setup lang="ts">
const first = ref(false)
const second = ref(false)
</script>

<template>
  <UModal v-model:open="first" title="First Modal">
    <UButton label="Open Second" @click="second = true" />
    <template #footer>
      <UModal v-model:open="second" title="Second Modal">
        <!-- Content here -->
      </UModal>
    </template>
  </UModal>
</template>
```

## Slots

- `default`: Trigger button
- `content`: Main content
- `header`, `body`, `footer`: Custom sections
- `title`, `description`, `close`: Header elements

## Props

- `title`: Modal title
- `description`: Modal description
- `overlay`: Show overlay (default: true)
- `transition`: Enable transition (default: true)
- `fullscreen`: Make modal fullscreen (default: false)
- `close`: Customize close button
- `dismissible`: Allow dismissal (default: true)
- `v-model:open`: Control open state

## Emits

- `update:open`: Open state change
- `close:prevent`: Prevent close
