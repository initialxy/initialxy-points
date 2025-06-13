# USlideover Component

The USlideover component is a dialog that slides in from any side of the screen. It's part of the Nuxt UI library.

## Usage

Use a button or any component in the default slot to trigger the slideover. Use the `#content` slot for the main content, or use `#header`, `#body`, and `#footer` slots for more structured content.

```vue
<template>
  <USlideover>
    <UButton label="Open" color="neutral" variant="subtle" />
    <template #content>
      <Placeholder class="h-full m-4" />
    </template>
  </USlideover>
</template>
```

## Props

- `title`: Sets the title of the slideover's header
- `description`: Sets the description of the slideover's header
- `close`: Customizes or hides the close button
- `closeIcon`: Customizes the close button icon (defaults to `i-lucide-x`)
- `side`: Sets the side from which the slideover slides in (defaults to `right`)
- `overlay`: Controls whether the slideover has an overlay (defaults to `true`)
- `transition`: Controls whether the slideover is animated (defaults to `true`)
- `dismissible`: Prevents the slideover from being closed when clicking outside or pressing escape (defaults to `true`)

## Slots

- `default`: Contains the trigger element
- `content`: Main content of the slideover
- `header`, `body`, `footer`: Structured content sections
- `close`: Custom close button

## Examples

### Control Open State

```vue
<script setup lang="ts">
const open = ref(false)
defineShortcuts({ o: () => open.value = !open.value })
</script>
<template>
  <USlideover v-model:open="open">
    <UButton label="Open" color="neutral" variant="subtle" />
    <template #content>
      <Placeholder class="h-full m-4" />
    </template>
  </USlideover>
</template>
```

### Disable Dismissal

```vue
<template>
  <USlideover :dismissible="false" title="Slideover non-dismissible">
    <UButton label="Open" color="neutral" variant="subtle" />
    <template #body>
      <Placeholder class="h-full" />
    </template>
  </USlideover>
</template>
```

### Programmatic Usage

Create a slideover component to be opened programmatically:

```vue
<!-- SlideoverExample.vue -->
<script setup lang="ts">
defineProps<{ count: number }>()
const emit = defineEmits<{ close: [boolean] }>()
</script>
<template>
  <USlideover
    :close="{ onClick: () => emit('close', false) }"
    :description="`This slideover was opened programmatically ${count} times`"
  >
    <template #body>
      <Placeholder class="h-full" />
    </template>
    <template #footer>
      <div class="flex gap-2">
        <UButton color="neutral" label="Dismiss" @click="emit('close', false)" />
        <UButton label="Success" @click="emit('close', true)" />
      </div>
    </template>
  </USlideover>
</template>
```

Use it in your app:

```vue
<script setup lang="ts">
import { LazySlideoverExample } from '#components'
const count = ref(0)
const toast = useToast()
const overlay = useOverlay()
const slideover = overlay.create(LazySlideoverExample, { props: { count: count.value } })

async function open() {
  const instance = slideover.open()
  const shouldIncrement = await instance.result
  if (shouldIncrement) {
    count.value++
    toast.add({ title: `Success: ${shouldIncrement}`, color: 'success', id: 'slideover-success' })
    slideover.patch({ count: count.value })
    return
  }
  toast.add({ title: `Dismissed: ${shouldIncrement}`, color: 'error', id: 'slideover-dismiss' })
}
</script>
<template>
  <UButton label="Open" color="neutral" variant="subtle" @click="open" />
</template>
```

## Theme Customization

Customize the slideover theme in `app.config.ts` or `vite.config.ts`:

```js
// app.config.ts
export default defineAppConfig({
  ui: {
    slideover: {
      slots: {
        overlay: 'fixed inset-0 bg-elevated/75',
        content: 'fixed bg-default divide-y divide-default sm:ring ring-default sm:shadow-lg flex flex-col focus:outline-none',
        // ... other slots
      },
      variants: {
        side: {
          top: { content: 'inset-x-0 top-0 max-h-full' },
          right: { content: 'right-0 inset-y-0 w-full max-w-md' },
          bottom: { content: 'inset-x-0 bottom-0 max-h-full' },
          left: { content: 'left-0 inset-y-0 w-full max-w-md' }
        },
        transition: {
          true: {
            overlay: 'data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]'
          }
        }
      },
      compoundVariants: [
        { transition: true, side: 'top', class: { content: 'data-[state=open]:animate-[slide-in-from-top_200ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-top_200ms_ease-in-out]' } },
        // ... other variants
      ]
    }
  }
})
```