<template>
  <UAlert
    v-if="visible"
    :variant="variant"
    icon="i-heroicons-information-circle"
    :timeout="duration"
    @close="close"
  >
    {{ message }}
  </UAlert>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'info',
    validator: (value: string) =>
      ['info', 'success', 'warning', 'error'].includes(value),
  },
  duration: {
    type: Number,
    default: 3000,
  },
})

const visible = ref(true)

const variant = ref<'solid' | 'outline' | 'soft' | 'subtle'>('subtle')

watch(
  () => props.type,
  (newType) => {
    switch (newType) {
      case 'info':
        variant.value = 'subtle'
        break
      case 'success':
        variant.value = 'solid'
        break
      case 'warning':
        variant.value = 'soft'
        break
      case 'error':
        variant.value = 'solid'
        break
    }
  },
  { immediate: true }
)

const close = () => {
  visible.value = false
}
</script>
