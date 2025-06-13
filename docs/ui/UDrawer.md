# UDrawer Component

The UDrawer component is a Vue component that provides a smoothly sliding drawer interface. It's part of the Nuxt UI library.

## Key Features

- Uses slots for content, header, body, and footer customization
- Supports various props for customization:
  - `title`: Sets the title of the drawer's header
  - `description`: Sets the description of the drawer's header
  - `direction`: Controls the direction of the drawer (default: bottom)
  - `inset`: Insets the drawer from the edges
  - `handle`: Controls whether the drawer has a handle (default: true)
  - `handle-only`: Allows the drawer to be dragged only by the handle
  - `overlay`: Controls whether the drawer has an overlay (default: true)
  - `should-scale-background`: Scales the background when the drawer is open
  - `dismissible`: Allows the drawer to be closed by clicking outside or pressing escape (default: true)
  - `modal`: Makes the drawer modal (default: true)
  - `direction`: Sets the direction of the drawer (top, right, bottom, left)

## Usage

```vue
<template>
  <UDrawer>
    <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up" />
    <template #content>
      <Placeholder class="h-48 m-4" />
    </template>
  </UDrawer>
</template>
```

## Examples

### Control Open State

```vue
<script setup lang="ts">
const open = ref(false)
defineShortcuts({
  o: () => (open.value = !open.value)
})
</script>

<template>
  <UDrawer v-model:open="open">
    <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up" />
    <template #content>
      <Placeholder class="h-48 m-4" />
    </template>
  </UDrawer>
</template>
```

### Disable Dismissal

```vue
<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <UDrawer v-model:open="open" :dismissible="false" :handle="false">
    <UButton label="Open" color="neutral" variant="subtle" trailing-icon="i-lucide-chevron-up" />
    <template #header>
      <h2 class="text-highlighted font-semibold">Drawer non-dismissible</h2>
      <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="open = false" />
    </template>
    <template #body>
      <Placeholder class="h-48" />
    </template>
  </UDrawer>
</template>
```

### Responsive Drawer

```vue
<script lang="ts" setup>
import { createReusableTemplate, useMediaQuery } from '@vueuse/core'
const [DefineFormTemplate, ReuseFormTemplate] = createReusableTemplate()
const isDesktop = useMediaQuery('(min-width: 768px)')
const open = ref(false)
const state = reactive({ email: undefined })
const title = 'Edit profile'
const description = "Make changes to your profile here. Click save when you're done."
</script>

<template>
  <DefineFormTemplate>
    <UForm :state="state" class="space-y-4">
      <UFormField label="Email" name="email" required>
        <UInput v-model="state.email" placeholder="shadcn@example.com" required />
      </UFormField>
      <UButton label="Save changes" type="submit" />
    </UForm>
  </DefineFormTemplate>
  <UModal v-if="isDesktop" v-model:open="open" :title="title" :description="description">
    <UButton label="Edit profile" color="neutral" variant="outline" />
    <template #body>
      <ReuseFormTemplate />
    </template>
  </UModal>
  <UDrawer v-else v-model:open="open" :title="title" :description="description">
    <UButton label="Edit profile" color="neutral" variant="outline" />
    <template #body>
      <ReuseFormTemplate />
    </template>
  </UDrawer>
</template>
```